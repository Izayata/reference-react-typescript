# ImagineBar API — Endpoint Map (Frontend Reference)

A field-level reference for every backend endpoint: exact request body, exact response body, and
likely error statuses. For *why* the system is built this way (architecture, flows, security
model), see `docs/DESIGN.md` — this doc is the "what to send/receive" cheat sheet, not the design
rationale.

## Conventions

- **Base URL**: `http://localhost:8080` locally (or wherever `app.frontend.url`'s CORS partner is
  deployed).
- **Value-object wrapping**: most string/primitive fields are wrapped as `{"value": "..."}`
  instead of a bare value — e.g. an email is `{"value": "test@example.com"}`, not
  `"test@example.com"`. This is a backend modeling convention (see `docs/DESIGN.md` §2), not
  something to unwrap — send and expect the wrapped form exactly as shown below.
- **Session + CSRF**: the API uses cookie-based sessions (`JSESSIONID`) — send requests with
  credentials included. For any `POST`/`PUT`/`PATCH`/`DELETE` that isn't explicitly marked
  **CSRF-exempt** below, first `GET /csrf-token` and send the returned `csrfToken` back as header
  `X-CSRF-TOKEN` on the mutating request.
- **Auth badges**: **Public**, **Authenticated** (valid session required), **Admin**
  (`ROLE_ADMIN`).
- Full error-shape contract (exception → status → JSON shape) lives in `docs/DESIGN.md` §9 — the
  **Possible errors** line under each endpoint below just lists which statuses to expect and why.

---

## Auth

### `GET /auth-status` — Public
Session probe.
- Request body: none.
- Response body: none — **200** if authenticated, **401** if not. No JSON either way.

## Csrf

### `GET /csrf-token` — Public, CSRF-exempt
Issues the CSRF token for the current session; call this first, before any mutating request.
- Request body: none.
- Response body:
```json
{ "csrfToken": "a1b2c3d4-..." }
```
- Possible errors: **500** if no session/CSRF context is available (rare — shouldn't happen in
  normal browser flow).

---

## Registration

### `GET /v1/registration/username/{username}/exists` — Public, rate-limited (20/hr per value)
- Request body: none (path variable only).
- Response body:
```json
{ "exists": false }
```
- Possible errors: **429** if this specific username value has been checked more than 20×/hr.

### `GET /v1/registration/email/{email}/exists` — Public, rate-limited (20/hr per value)
- Request body: none (path variable only).
- Response body:
```json
{ "exists": false }
```
- Possible errors: **429** (same as above), **400** if the path segment isn't a valid email
  format.

### `POST /v1/registration/common-password` — Public, CSRF-exempt
Checks a candidate password against a common-password blocklist.
- Request body:
```json
{ "password": "testUser4!" }
```
Required: `password`.
- Response body:
```json
{ "isCommonPassword": false }
```
- Possible errors: **400** if `password` is blank.

### `POST /v1/registration` — Public, **CSRF required**
Registers a new account (`MyUser` + `Customer`).
- Request body:
```json
{
    "myUser": {
        "email": { "value": "test@example.com" },
        "myUsername": { "value": "test" },
        "newPasswordDetails": {
            "newPassword": { "value": "testUser4!" },
            "confirmNewPassword": { "value": "testUser4!" }
        }
    },
    "personalDetails": {
        "firstname": { "value": "Test" },
        "lastname": { "value": "User" },
        "phoneNumber": { "value": "+36204234442" }
    },
    "shippingAddress": {
        "zipCode": { "value": "4028" },
        "city": { "value": "Debrecen" },
        "street": { "value": "Egyetem sgt" },
        "streetNumber": { "value": "1" },
        "floorDoor": { "value": "fsz/1" }
    },
    "billingAddress": {
        "zipCode": { "value": "4028" },
        "city": { "value": "Debrecen" },
        "street": { "value": "Egyetem sgt" },
        "streetNumber": { "value": "1" },
        "floorDoor": { "value": "fsz/1" }
    }
}
```
Required: everything shown except `shippingAddress.floorDoor` / `billingAddress.floorDoor`, which
are optional.
- Response body (**201**):
```json
{
    "myUsername": { "value": "test" },
    "email": { "value": "test@example.com" },
    "customer": {
        "personalDetails": { "firstname": { "value": "Test" }, "lastname": { "value": "User" }, "phoneNumber": { "value": "+36204234442" } },
        "email": { "value": "test@example.com" },
        "shippingAddress": { "zipCode": { "value": "4028" }, "city": { "value": "Debrecen" }, "street": { "value": "Egyetem sgt" }, "streetNumber": { "value": "1" }, "floorDoor": { "value": "fsz/1" } },
        "billingAddress": { "zipCode": { "value": "4028" }, "city": { "value": "Debrecen" }, "street": { "value": "Egyetem sgt" }, "streetNumber": { "value": "1" }, "floorDoor": { "value": "fsz/1" } },
        "shippingAddresses": [ { "zipCode": { "value": "4028" }, "city": { "value": "Debrecen" }, "street": { "value": "Egyetem sgt" }, "streetNumber": { "value": "1" }, "floorDoor": { "value": "fsz/1" } } ]
    }
}
```
- Possible errors: **400** for field validation failures *or* `IllegalArgumentException` if the
  username/email is already taken (same 400 shape, message-only).

---

## Account

### `GET /v1/account/me` — Authenticated
- Request body: none.
- Response body: same `MyUserDTO` shape as the registration response above.

### `PATCH /v1/account/password` — Authenticated
Changes the authenticated user's password (in-app, requires current password — not the
forgot-password flow).
- Request body:
```json
{
    "currentPassword": { "value": "testUser4!" },
    "newPasswordDetails": {
        "newPassword": { "value": "newTestUser4!" },
        "confirmNewPassword": { "value": "newTestUser4!" }
    }
}
```
Required: all fields.
- Response body: none — **204 No Content**.
- Possible errors: **400** if `currentPassword` doesn't match, if the new password equals the
  current one, or if `newPassword` != `confirmNewPassword`.

---

## Customer

### `GET /v1/customers` — Admin
- Request body: none.
- Response body: array of `CustomerDTO` (same shape as `customer` in the registration response
  above).
- Possible errors: **403** if the session isn't `ROLE_ADMIN`.

### `PUT /v1/customer/billing-address` — Authenticated
### `PUT /v1/customer/shipping-address` — Authenticated
Both take the same request shape and update a different address on the authenticated customer.
- Request body:
```json
{
    "zipCode": { "value": "4028" },
    "city": { "value": "Debrecen" },
    "street": { "value": "Egyetem sgt" },
    "streetNumber": { "value": "1" },
    "floorDoor": { "value": "fsz/1" }
}
```
Required: all except `floorDoor`.
- Response body: the updated `CustomerDTO` (**200**).
- Possible errors: **400** on field validation failure.

### `PATCH /v1/customer/personal-details` — Authenticated
- Request body:
```json
{
    "firstname": { "value": "Test" },
    "lastname": { "value": "User" },
    "phoneNumber": { "value": "+36204234442" }
}
```
Required: all fields.
- Response body: the updated `CustomerDTO` (**200**).
- Possible errors: **400** on field validation failure (e.g. invalid phone number format).

---

## Food

### `GET /v1/foods` — Public
- Request body: none.
- Response body: array of `MenuItemDTO`:
```json
[
    {
        "foodId": 1,
        "foodName": { "value": "Gulyásleves" },
        "price": { "amount": 1900, "currency": "HUF" },
        "category": "SOUPS",
        "allergens": [ { "id": 1, "name": { "value": "Gluten" } } ],
        "imageUrl": { "value": "https://example.com/image.jpg" }
    }
]
```

### `POST /v1/foods/cart` — Public, CSRF-exempt (read via POST, not a mutation)
Resolves cart line items (name/price/image) by food ID.
- Request body:
```json
{ "ids": [1, 2, 3] }
```
Required: `ids`, non-empty.
- Response body: array of `ShoppingCartItemDTO`:
```json
[
    {
        "foodId": 1,
        "foodName": { "value": "Gulyásleves" },
        "price": { "amount": 1900, "currency": "HUF" },
        "imageUrl": { "value": "https://example.com/image.jpg" }
    }
]
```
- Possible errors: **400** if `ids` is missing/empty.

### `GET /v1/foods/menu/{placeToBuy}` — Public
Path variable `placeToBuy` is `RESTAURANT` or `FANTASY_WORLD` (see Enum reference below).
- Response body: array of `MenuItemDTO`, same shape as `GET /v1/foods`.
- Possible errors: **400** if `placeToBuy` isn't a valid enum value.

### `GET /v1/foods/{id}` — Public
- Response body: `FoodDetailsDTO`:
```json
{
    "foodName": { "value": "Gulyásleves" },
    "price": { "amount": 1900, "currency": "HUF" },
    "description": { "value": "Hagyományos magyar gulyásleves." },
    "ingredientNames": [ { "value": "Marhahús" } ],
    "allergens": [ { "id": 1, "name": { "value": "Gluten" } } ],
    "imageUrl": { "value": "https://example.com/image.jpg" }
}
```
**Note**: this shape has no `id` field — the food's numeric ID isn't part of the response, only
the path variable you already had.
- Possible errors: **404** if no food exists with that ID.

### `POST /v1/foods` — Authenticated
Creates a menu item.
- Request body:
```json
{
    "foodName": { "value": "Mákos tészta" },
    "description": { "value": "Mákos tészta rövid leírása." },
    "price": { "amount": 1900, "currency": "HUF" },
    "placeToBuy": "RESTAURANT",
    "category": "DESSERTS",
    "allergens": [],
    "ingredients": [],
    "imageUrl": { "value": "https://example.com/image.jpg" }
}
```
Required: `foodName`, `price`, `placeToBuy`, `category`. Optional: `allergens`, `description`,
`ingredients`, `imageUrl`.
- Response body (**201**): `FoodDetailsDTO` — same shape and same "no `id`" caveat as
  `GET /v1/foods/{id}` above.
- Possible errors: **400** on field validation failure.

---

## Allergen

### `GET /v1/allergens` — Public
- Response body:
```json
[ { "id": 1, "name": { "value": "Gluten" } } ]
```

## Ingredient

### `GET /v1/ingredients` — Public
- Response body:
```json
[ { "id": 1, "name": { "value": "Marhahús" } } ]
```

---

## Order

### `POST /v1/orders` — Authenticated
### `POST /v1/orders/guest` — Public, CSRF-exempt
Same request/response shape; the guest variant doesn't attach the order to a `Customer`.
- Request body:
```json
{
    "customer": {
        "personalDetails": {
            "firstname": { "value": "Test" },
            "lastname": { "value": "User" },
            "phoneNumber": { "value": "+36204234442" }
        },
        "email": { "value": "test@example.com" },
        "shippingAddress": {
            "zipCode": { "value": "4028" },
            "city": { "value": "Debrecen" },
            "street": { "value": "Egyetem sgt" },
            "streetNumber": { "value": "1" },
            "floorDoor": { "value": "fsz/1" }
        },
        "billingAddress": {
            "zipCode": { "value": "4028" },
            "city": { "value": "Debrecen" },
            "street": { "value": "Egyetem sgt" },
            "streetNumber": { "value": "1" },
            "floorDoor": { "value": "fsz/1" }
        }
    },
    "orderItems": [
        { "foodId": 1, "quantity": 2 }
    ],
    "paymentType": "CASH"
}
```
Required: `customer` (with `personalDetails`, `email`, `shippingAddress`, `billingAddress` —
`floorDoor` optional within addresses), `orderItems` (non-empty; each item's `foodId` and
`quantity` required, `quantity` between 1 and 100), `paymentType`.
- Response body (**201**): `OrderDTO`:
```json
{
    "id": 1,
    "orderItems": [
        {
            "food": { "id": 1, "foodName": { "value": "Gulyásleves" } },
            "quantity": 2,
            "orderItemPrice": 3800
        }
    ],
    "totalCost": 3800,
    "totalCostCurrency": "HUF",
    "paymentType": "CASH",
    "customerFirstname": "Test",
    "customerLastname": "User",
    "customerEmail": "test@example.com",
    "customerAddress": {
        "zipCode": { "value": "4028" },
        "city": { "value": "Debrecen" },
        "street": { "value": "Egyetem sgt" },
        "streetNumber": { "value": "1" },
        "floorDoor": { "value": "fsz/1" }
    },
    "customerPhoneNumber": "+36204234442"
}
```
Note `OrderDTO` is flatter than the request — `customerFirstname`/`customerLastname`/etc. are
top-level strings, not a nested `personalDetails` object, and not value-object-wrapped.
- Possible errors: **400** on field validation failure, **404** if any `foodId` doesn't exist.

### `GET /v1/orders/{id}` — Authenticated
- Response body: `OrderDTO`, same shape as above.
- Possible errors: **404** if the order doesn't exist, belongs to a different customer, or is a
  guest order (guest orders have no owning customer and are unreachable through this endpoint).

---

## PasswordReset

### `POST /v1/password-reset/request-password-reset-link` — Public, CSRF-exempt
- Request body:
```json
{
    "email": { "value": "test@example.com" },
    "myUsername": { "value": "test" }
}
```
Required: both fields.
- Response body: **raw text** (`Content-Type: text/plain`), **not JSON** — a fixed message like
  `"If the email address is registered, a password reset link has been sent to it!"`, returned
  identically whether or not the email/username actually matched an account (anti-enumeration —
  don't treat this message as confirmation the email exists).
- Possible errors: **429** if this email has requested a reset more than 3×/hr.

### `GET /v1/password-reset/validate?token={token}` — Public, CSRF-exempt
Call this when the user opens the link from the reset email, before showing the "set new
password" form.
- Response body:
```json
{ "valid": true, "expired": false, "used": false, "message": "The reset link is valid!" }
```
- Possible errors: **400** if the token doesn't exist, **410 Gone** if it's expired or already
  used (check `expired`/`used` on the body too, but a `400`/`410` status means the request itself
  failed rather than returning a validation result).

### `POST /v1/password-reset/set-new-password` — Public, CSRF-exempt
- Request body:
```json
{
    "token": "REPLACE_WITH_TOKEN_FROM_EMAIL",
    "newPasswordDetails": {
        "newPassword": { "value": "newTestUser4!" },
        "confirmNewPassword": { "value": "newTestUser4!" }
    }
}
```
Required: both fields.
- Response body: **raw text**, not JSON (e.g. `"Password has been successfully reset!"`).
- Possible errors: **400** if the token is invalid or the new password matches the current one,
  **410 Gone** if the token is expired or already used.

---

## Login / Logout

These aren't `@RestController` endpoints — they're Spring Security's form-login DSL, configured in
`SecurityConfig`. **`POST /login` is the one endpoint in this entire API that is not JSON.**

### `POST /login` — Public, CSRF-exempt
- Request body: `application/x-www-form-urlencoded`, **not JSON**:
```
username=test&password=testUser4!
```
- Response body on success (**200**):
```json
{ "redirectUrl": "http://<app.frontend.url>/" }
```
- Response body on failure: **401**, no body.
- Possible errors: **429** if this username has attempted login more than 10×/hr (before
  credentials are even checked).

### `POST /logout` — Authenticated, **CSRF required**
Not on `SecurityConfig`'s CSRF-exemption list, so send `X-CSRF-TOKEN` here too, same as any other
mutating authenticated request.
- Request body: none.
- Response body (**200**):
```json
{ "message": "Logout successful" }
```

---

## Enum reference

| Enum | Values | Used in |
|---|---|---|
| `PlaceToBuyEnum` | `RESTAURANT`, `FANTASY_WORLD` | `GET /v1/foods/menu/{placeToBuy}`, `FoodDTO.placeToBuy`, `MenuItemDTO` (indirectly) |
| `CategoryEnum` | `SOUPS`, `MAIN_DISHES`, `DRINKS`, `DESSERTS` | `FoodDTO.category`, `MenuItemDTO.category` |
| `CurrencyEnum` | `HUF`, `EUR`, `USD` | `PriceDTO.currency` (note: `Order.totalCost` is always `HUF` regardless of item currency — see `docs/DESIGN.md` §12) |
| `PaymentType` | `CASH`, `CARD` | `CreateOrderRequestData.paymentType`, `OrderDTO.paymentType` |

`Role` (`USER`/`ADMIN`) exists on the backend but is never serialized into any request or response
DTO — admin status isn't something the frontend can read from the API, only infer from a `403` on
`GET /v1/customers`.
