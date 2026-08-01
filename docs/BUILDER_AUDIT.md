# Builder Layer Audit — `src/main/builder/`

## 1. Overview & Scope

This audits all 8 Builders under `src/main/builder/` and their paired `*.test.tsx` files, against
the contract described in `CLAUDE.md`'s domain-model pattern:

> **Builder** — one builder class per composite model, with chainable `setX()` methods and a
> `build()` that calls the model constructor (and thus triggers validation).

The intended division of labor is strict: the **Builder** only assembles pre-validated child
Models; the **Model** constructor is the sole place validation happens (`class-validator`'s
`validateSync`); the **Converter** is the sole place raw primitives (form data) become Models. A
Builder that validates, coerces, or wraps primitives itself is doing another layer's job.

**Verdict up front:** this is a small, low-complexity layer (24–49 lines per builder), every
`setX()` method has a real production call site (no dead code), and 6 of the 8 builders follow the
contract cleanly. The remaining 2 — plus one component's usage pattern — have drifted from it in
ways worth fixing. Nothing here is urgent; treat this as tightening a mostly-sound pattern rather
than remediating a broken one.

---

## 2. Per-builder inventory

| Builder | Lines | `setX()` fields | `build()` uses `!` | Guard/coercion logic in builder? |
|---|---|---|---|---|
| `AddressModelBuilder.tsx` | 49 | zipCode, city, street, streetNumber, floorDoor | 4 of 5 (`floorDoor` is `\| null`, no `!`) | None |
| `CustomerModelBuilder.tsx` | 41 | personalDetails, email, shippingAddress, billingAddress | All 4 | None |
| `MyUserModelBuilder.tsx` | 33 | myUsername, email, customer | All 3 | None |
| `MyUserRegistrationModelBuilder.tsx` | 33 | myUsername, newPasswordDetails, email | All 3 | None |
| `NewPasswordDetailsModelBuilder.tsx` | 24 | newPassword, confirmNewPassword | Both | **Wraps raw `string` in `new PasswordModel(...)` itself** (:9, :14) |
| `PasswordChangeModelBuilder.tsx` | 24 | currentPassword (string), newPasswordWrapper (Model) | Both | Same string-wrapping for `currentPassword` only (:10) |
| `PersonalDetailsModelBuilder.tsx` | 33 | firstname, lastname, phoneNumber | All 3 | None |
| `RegistrationModelBuilder.tsx` | 40 | myUser, personalDetails, shippingAddress, billingAddress | All 4 | None |

Every builder's `setX` is a one-line `this.field = value; return this`, and every `build()`
delegates entirely to the target Model's constructor for validation. `AddressModelBuilder` is the
only one with an optional/nullable field (`floorDoor: FloorDoorModel | null`) — no other builder
demonstrates that pattern.

---

## 3. Findings

### F1 (high) — Responsibility bleed in the password builders

`NewPasswordDetailsModelBuilder.setNewPassword`/`setConfirmNewPassword`
(`NewPasswordDetailsModelBuilder.tsx:8-16`) and `PasswordChangeModelBuilder.setCurrentPassword`
(`PasswordChangeModelBuilder.tsx:9-12`) accept a raw `string` and construct `new PasswordModel(...)`
internally. Every other builder in the layer requires the caller to already hold a validated child
Model — this is the only place a Builder does primitive → Model conversion, which is the
Converter's job per the layering in `CLAUDE.md`.

The consequence is visible in production: `converter/NewPasswordDetailsModel.ts:8-11`
(`convertRegistrationDataToNewPasswordDetailsModel`) needs to build a `NewPasswordDetailsModel`
from raw strings too, but since the builder's `setX` methods don't accept pre-built `PasswordModel`
instances, the converter bypasses `NewPasswordDetailsModelBuilder` entirely and constructs the
Model tree by hand:

```ts
return new NewPasswordDetailsModel(
  new PasswordModel(registrationData.password),
  new PasswordModel(registrationData.confirmPassword)
)
```

Meanwhile `NewPasswordDetailsModelBuilder` *is* used elsewhere, from
`components/page/UserProfile/LoginData/LoginData.tsx:71-78`, chained inside
`PasswordChangeModelBuilder`. So the same `NewPasswordDetailsModel` now has two divergent
construction paths in production — one that goes through the builder, one that doesn't — which is
exactly what this layered pattern exists to prevent (a validation rule change on `PasswordModel`
construction would need to be checked against both paths).

**Recommendation:** change both builders' password setters to accept a pre-built `PasswordModel`
(matching every other builder), move the `string → PasswordModel` wrapping into the callers
(`LoginData.tsx` and `converter/NewPasswordDetailsModel.ts`), and have the converter start routing
through `NewPasswordDetailsModelBuilder` like the rest of the codebase does for form-data → Model
conversion.

**Resolved:** both setters now take a pre-built `PasswordModel`; `LoginData.tsx` and
`converter/NewPasswordDetailsModel.ts` wrap the raw strings before calling the builders, and the
converter now routes through `NewPasswordDetailsModelBuilder` instead of bypassing it.

### F2 (medium) — Naming drift in `PasswordChangeModelBuilder`

`PasswordChangeModel` declares its property as `newPasswordDetails`
(`model/PasswordChangeModel.tsx:15`), but `PasswordChangeModelBuilder` names the corresponding
field and setter `newPasswordWrapper` / `setNewPasswordWrapper`
(`PasswordChangeModelBuilder.tsx:7,14`). Every other builder in the layer mirrors its Model's
property name exactly (e.g. `zipCode → zipCode`, `shippingAddress → shippingAddress`,
`newPasswordDetails → newPasswordDetails` in `MyUserRegistrationModelBuilder.tsx:8,16-19`, which
gets this right for the *same* model type). This one mismatch reads as a small papercut on its own,
but it's a symptom of the same file having drifted from the pattern the rest of the layer follows
(see F1) — misleading anyone extending it as a naming template.

**Recommendation:** rename `newPasswordWrapper` / `setNewPasswordWrapper` to `newPasswordDetails` /
`setNewPasswordDetails`, updating the one call site in `LoginData.tsx:74`.

**Resolved:** renamed as recommended; `LoginData.tsx` and the builder's test file updated
accordingly.

### F3 (medium) — Undocumented, untested stateful builder in `Register.tsx`

Every builder except one is constructed fresh and `build()`-ed synchronously within a single
function call — see `Checkout.tsx` (`CustomerModelBuilder`/`AddressModelBuilder`/
`PersonalDetailsModelBuilder`), `UserProfile.tsx` (`MyUserModelBuilder`), `LoginData.tsx`
(`PasswordChangeModelBuilder`/`NewPasswordDetailsModelBuilder`), and all Converters.

`RegistrationModelBuilder` breaks this pattern: it's held in a `useRef`
(`components/page/Register/Register.tsx:48`) and mutated across three separate event handlers over
the lifetime of a multi-step registration wizard —
`.setMyUser(...)` at `Register.tsx:93`, `.setPersonalDetails(...)` at `Register.tsx:109`, and
`.setBillingAddress`/`.setShippingAddress` at `Register.tsx:125-131` — with `.build()` finally
called at `Register.tsx:60`.

This long-lived, accumulating usage is a materially different contract than every other builder in
the codebase demonstrates, and nothing marks it as intentional:

- No builder anywhere in the layer has a `reset()`/`clear()` method (confirmed — none exist), so
  there's no way to discard a partially-filled builder and start over.
- No test exercises the "partially built, then a field is set again / step is revisited" scenario
  that this usage pattern implies is possible.

**Recommendation:** either (a) make this an explicit, documented, tested contract — a comment on
`RegistrationModelBuilder` noting it supports incremental accumulation, plus a test asserting a
second `setX` call on an already-set field overwrites cleanly — or (b) refactor `Register.tsx` to
accumulate wizard-step state in local component state and only touch the builder once, at final
submit, matching every other call site in the app.

**Resolved:** went with option (a) — added a comment on `RegistrationModelBuilder` documenting the
intentional cross-render accumulation contract, plus a test proving a repeated `setPersonalDetails`
call overwrites cleanly.

### F4 (low) — Builder tests re-verify the Model, not the Builder

All 8 builder test files follow the same shape: a set of `ERR_*` invalid-field thunks fed into
`expectErrorMessages`, plus one or two valid-case `.not.toThrow()` assertions. Every one of these
is re-proving the target Model's `class-validator` decorators *through* the builder — none assert
on builder-specific mechanics: that `setX` returns the same instance for chaining, that calling
`setX` twice overwrites the first value, or that a builder can be safely reused/rebuilt.

That gap is exactly where the F3 risk lives unguarded — nothing in the test suite would catch a
regression in `RegistrationModelBuilder`'s incremental-accumulation usage.

**Recommendation:** add one small test per builder (or a shared helper) asserting the mechanical
contract — instance identity across chained calls, overwrite-on-second-call — independent of the
Model-validation tests that already exist.

**Resolved:** added a shared `expectSetterReturnsSameInstance` helper
(`src/main/utils/test/ExpectSetterChaining.ts`) plus one chaining test and one overwrite test per
builder, using one representative field each.

### F5 (low) — Mechanical / copy-paste drift

Three small inconsistencies, bundled since none are individually urgent:

- **Field/constructor-argument order mismatch.** `MyUserModel`'s constructor takes
  `(email, myUsername, customer)` (`model/MyUserModel.tsx:24-27`), but `MyUserModelBuilder`
  declares its fields and setters in the order `myUsername, email, customer`
  (`MyUserModelBuilder.tsx:7-24`). Same pattern in `MyUserRegistrationModelBuilder.tsx:7-24`
  against `MyUserRegistrationModel.tsx:24-27`. Harmless today (named-property assembly, not
  positional), but it's copy-paste drift that makes the builder harder to visually diff against
  the Model it constructs.
- **Inconsistent `undefined` representation between sibling test files.**
  `MyUserModelBuilder.test.tsx` represents "field never set" by *omitting* the setter call (e.g.
  `MyUserModelBuilder.test.tsx:41-44`), while `MyUserRegistrationModelBuilder.test.tsx` represents
  the same concept by *explicitly* passing `undefined as any`
  (`MyUserRegistrationModelBuilder.test.tsx:22-26`). Both reach the same validation path; the two
  sibling files just express "missing" differently.
- **`RegistrationModelBuilder.test.tsx` bypasses sibling builders for its own fixtures.** It builds
  nested valid fixtures via raw `new MyUserRegistrationModel(...)`, `new PersonalDetailsModel(...)`,
  `new AddressModel(...)` calls (`RegistrationModelBuilder.test.tsx:23-44`), whereas
  `CustomerModelBuilder.test.tsx:18-38` and `MyUserModelBuilder.test.tsx:22-38` build their
  equivalent nested fixtures through the corresponding sibling Builders
  (`PersonalDetailsModelBuilder`, `AddressModelBuilder`).

**Recommendation:** no urgent action. Worth normalizing opportunistically, and a shared
`testRequiredField(setterName, errMsg)`-style test helper would prevent this class of drift from
recurring as new builders are added — most of these files were clearly written by copying an
existing one, which is how the naming/order drift above crept in undetected.

**Resolved:** `MyUserModelBuilder`/`MyUserRegistrationModelBuilder` field/setter order now matches
their Models' constructor order; `MyUserRegistrationModelBuilder.test.tsx` and
`RegistrationModelBuilder.test.tsx` now use the omission style for "never set" cases (matching the
other 6 test files); `RegistrationModelBuilder.test.tsx`'s fixtures now build nested Models via
sibling builders instead of raw `new XModel(...)` calls.

### Notes (no action needed)

- **No dead setters.** Every `setX` across all 8 builders has at least one real production call
  site (`Checkout.tsx`, `Register.tsx`, `UserProfile.tsx`, `LoginData.tsx`) in addition to its
  test.
- **No nested-array/collection builder fields exist** in this layer — every composite field is a
  single nested Model. Out of scope for this audit, but flagged as "no established pattern yet" if
  a future field needs one (e.g. multiple addresses).

---

## 4. Best-practice summary

For anyone adding a new Builder to this codebase:

1. **Mirror the target Model's property names exactly** — field, setter name, and constructor
   argument order should all match the Model 1:1. Deviating (as in F2/F5) makes the builder harder
   to trust as a template and easier to accidentally break.
2. **Accept only pre-built child Models, never raw primitives** — primitive → Model conversion
   belongs in the Converter layer, not the Builder. If a Builder ever needs to wrap a primitive
   itself, that's a sign that a Converter and Builder have merged responsibilities and should be
   split (F1).
3. **Keep Builders stateless and fresh-per-call by default** — construct, chain `setX()` calls,
   `build()`, discard, all within one function. If a usage genuinely needs a long-lived,
   incrementally-filled builder (as `Register.tsx` does), make that an explicit and tested contract
   rather than an implicit side effect of how one component happens to use it (F3).
4. **Let the Model constructor own all validation.** Builders in this codebase correctly contain
   zero `if`/guard logic — keep it that way; a validation rule always belongs on the Model via
   `class-validator` decorators, never duplicated into a Builder.
