# Backend spec: zip-code → city lookup endpoint

## 1. Purpose

The frontend (this repo) now auto-fills the `City` field from the postal code a user types, in the
registration wizard, checkout, and user-profile billing/shipping address forms — see
`src/main/components/input/customer/address/useZipCityAutofill.ts` and
`src/main/utils/customer/address/ZipCodeCityLookupUtils.ts`. That code calls a backend endpoint
that does not exist yet. This document specifies that endpoint's contract and implementation shape
for whoever builds it in the sibling `reference-spring-boot-api` repo. **No backend code has been
written as part of this change** — the frontend call fails silently (caught, ignored) until this
endpoint exists.

## 2. API contract (already assumed by the frontend — do not change without updating both sides)

```
GET /v1/zip-codes/{zipCode}
```

- `200 OK` — match found:
  ```json
  { "zipCode": "1011", "city": "Budapest" }
  ```
- `404 Not Found` — well-formed zip code, no mapping exists:
  ```json
  { "error": "No city found for zip code: 9999" }
  ```
- `400 Bad Request` — malformed path variable (not 4 digits):
  standard `ConstraintViolationException` validation-error body.
- Public endpoint, no authentication/CSRF required (GET, public reference data).

## 3. Implementation shape (mirrors this backend's existing conventions)

Read `reference-spring-boot-api`'s `AllergenController` → `AllergenService` →
`AllergenRepository` → `Allergen` entity chain first — it's the closest existing analog (a public,
DB-backed reference-data GET) and this feature should follow it exactly.

- **Entity** — new top-level package `bar.imagine.demo.data.address` (sibling to
  `data.customer`, `data.food`, etc.), `ZipCityMapping`:
  - `@Entity`, `@Table(name = "ZIP_CITY_MAPPINGS")`
  - Reuse the *existing* `ZipCode`/`City` `@Embeddable` value objects from
    `bar.imagine.demo.data.customer.address` via `@Embedded` + `@AttributeOverride` (same reuse
    pattern `Allergen` already uses for `AllergenName`) — this guarantees the reference table's
    format constraints never drift from the per-customer-address ones (4-digit zip, Hungarian-char
    city regex, defined in `util/customerUtils/addressUtils/ZipCodeUtils.java` /
    `CityUtils.java`).
  - `id` (`Long`, `@GeneratedValue(strategy = GenerationType.IDENTITY)`), `zipCode` unique.
- **Repository** — `ZipCityMappingRepository extends JpaRepository<ZipCityMapping, Long>` with
  `Optional<ZipCityMapping> findByZipCode_Value(String zipCodeValue)`.
- **DTO** — `bar.imagine.demo.dto.address.ZipCityLookupDTO` (`zipCode`, `city`), `@Value @Builder`
  shape like `AllergenDTO`.
- **Service** — `ZipCityMappingService.getCityByZipCode(String)`, `@Transactional(readOnly = true)`,
  throws `NoSuchElementException` on no match. This is already mapped to a `404 {"error": "..."}`
  by the existing `GlobalExceptionHandler` (`bar.imagine.demo.exception.GlobalExceptionHandler`) —
  no new exception class needed.
- **Controller** — `ZipCityMappingController`, `@RequestMapping("/v1/zip-codes")`,
  `@GetMapping("/{zipCode}")`, `@Validated` class + `@Pattern(regexp = ZIP_CODE_PATTERN)` on the
  `@PathVariable`, mirroring `RegistrationController`'s validated-path-variable style.
- **Security config** (`bar.imagine.demo.config.SecurityConfig`) — add `/v1/zip-codes/**` to the
  `authorizeHttpRequests(...).permitAll()` matcher list, same tier as `/v1/allergens`,
  `/v1/ingredients`. A CSRF-ignore-list entry is not functionally required (GET requests bypass
  Spring Security's CSRF filter by default) but would be consistent with how `/v1/allergens` and
  `/v1/ingredients` are also listed there redundantly — optional/stylistic, not blocking.
- **Rate limiting** — skip for v1. Unlike the username/email `/exists` checks (which rate-limit via
  Redis because they leak account-enumeration info), a zip→city lookup has no such sensitivity —
  it's public postal data. Revisit only if abuse/scraping is actually observed.

## 4. Seed data — explicitly unresolved, needs real sourcing

No zip↔city dataset exists anywhere in the backend today (`City`/`ZipCode` are per-address value
objects, not reference data). Populating this table needs the real ~3,200-row Hungarian postal
code list, sourced from an authoritative source such as Magyar Posta's published irányítószám list
or KSH's helységnévtár/postal cross-reference — **do not fabricate placeholder rows**.

- Convert the sourced CSV to SQL inserts and add them as a **new, dedicated**
  `src/main/resources/zip_city_mappings.sql` — don't append ~3,200 lines to the existing
  `data.sql` (already large with foods/ingredients/allergens seed data).
- Wire it into dev-only loading via `application-dev.yml`'s
  `spring.sql.init.data-locations: classpath:data.sql,classpath:zip_city_mappings.sql` (the base
  `application.yml` sets `sql.init.mode: never`, so this only runs in dev, matching the existing
  `data.sql` convention).
- **Production gap**: there's no Flyway/Liquibase, and prod uses `ddl-auto: validate` +
  `sql.init.mode: never`, so neither `data.sql` nor `zip_city_mappings.sql` ever runs there.
  Getting ~3,200 rows into production needs a separate manual step (an ops runbook item, a
  guarded one-off `CommandLineRunner`, or a manual `psql` import) outside normal deploy — this is a
  known limitation of the current no-migration-tool setup, not something this feature should try to
  solve on its own.

## 5. Test plan

Following this backend's existing conventions (see `AllergenRepositoryTest`,
`AllergenControllerTest`, `RegistrationControllerTest`):

- `ZipCityMappingRepositoryTest` — `@DataJpaTest` + `@ActiveProfiles("test")`: save + find by zip,
  assert unique constraint on `ZIP_CODE`.
- `ZipCityMappingServiceTest` — mocked repository: found → DTO, not found → `NoSuchElementException`.
- `ZipCityMappingControllerTest` — `@WebMvcTest(ZipCityMappingController.class)` +
  `@Import(SecurityConfig.class)` + `@ActiveProfiles("test")` + mocked service/dependencies +
  `MockMvc`: `200`/`404`/`400` cases, and confirm unauthenticated access succeeds (permitAll).

## 6. Frontend contract this must satisfy (already implemented, don't break)

- `src/main/utils/customer/address/ZipCodeCityLookupUtils.ts` — `lookupCityByZipCode(zipCode)`
  calls `GET /v1/zip-codes/{zipCode}`, treats `404` as "no match" (returns `null`, not an error),
  treats any other non-2xx as a thrown error (swallowed by the caller).
- `src/main/components/input/customer/address/useZipCityAutofill.ts` — debounces 500ms after a
  valid 4-digit zip stops changing, then calls the above and, on a match, synthesizes a `city`
  change event through `AddressInput`'s existing `onChange` prop. On no match or any error, the
  city field is left exactly as the user left it — this is a nice-to-have autofill, not a hard
  requirement, and must never block form submission or show a hard error.
