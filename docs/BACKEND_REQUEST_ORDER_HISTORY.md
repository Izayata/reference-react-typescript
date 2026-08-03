# Backend request: order history endpoint

**Status: proposal — not yet implemented.** This is a request/spec doc for the backend team, not a
record of an existing endpoint. Unlike `API_ENDPOINTS.md` (which only documents endpoints that
already exist), everything below describes what needs to be *added*. Once built, the new endpoint
should be moved into `API_ENDPOINTS.md`'s `Order` section and this file can be deleted.

## Why

The frontend wants to let a logged-in customer view their previous orders and re-order one with a
click. Investigating the existing API surface found the backend already has half of this:

- `GET /v1/orders/{id}` (Authenticated) exists today and returns a single order's full `OrderDTO`,
  404ing if the order belongs to a different customer or is a guest order. This access-control
  behavior (customer-scoped, guest orders excluded) is exactly what a **list** endpoint should also
  do — it reads as though a list endpoint was always the intended companion to this one, just never
  built.
- There is currently **no way to enumerate a customer's past orders** — no `GET /v1/orders` or
  equivalent exists anywhere in the documented API.
- **Reorder itself needs no new endpoint.** The frontend's cart is just a `{ foodId: quantity }`
  map; an `OrderDTO`'s existing `orderItems[].food.id` + `.quantity` fields are already everything
  needed to repopulate it. This request is *only* about the list endpoint (plus one field addition
  below) — please don't build a separate "reorder"/"clone order" endpoint, it isn't needed.

## Requested change 1: `GET /v1/orders` — Authenticated

List orders belonging to the calling customer only — same scoping rule as the existing
`GET /v1/orders/{id}` (never returns another customer's orders, never returns guest orders, since
guest orders have no owning customer to scope by). Ordered most-recent-first.

- Request body: none.
- Response body (**200**): an array of `OrderDTO`, using the **exact same shape** already returned
  by `POST /v1/orders` / `GET /v1/orders/{id}` (see `API_ENDPOINTS.md`'s `Order` section) — no new
  DTO type needed:
```json
[
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
        "customerPhoneNumber": "+36204234442",
        "createdAt": "2026-07-14T18:32:00Z"
    }
]
```
  (`createdAt` is the new field from requested change 2 below, shown here since it's expected on
  every element.)
- Possible errors: **401** if the session isn't authenticated. No 403/404 cases — an authenticated
  customer with zero past orders should get **200** with an empty array `[]`, not an error.

**On pagination**: recommend shipping this **unpaginated** (a plain array, as above) for v1, given
per-customer order counts are likely modest for this app. If the backend team would rather build
pagination in from the start, a Spring-`Page`-style wrapper (`?page=`/`?size=` query params,
response shaped as `{ content: OrderDTO[], totalElements, totalPages, number, size }`) would also
be fine — either shape works for the frontend, this is a backend implementation preference, not a
hard requirement.

## Requested change 2: add `createdAt` to `OrderDTO`

`OrderDTO` currently has no timestamp field at all (confirmed against `API_ENDPOINTS.md`'s
`POST /v1/orders` response example). Without one, there's no way to show *when* an order was placed
or to sort/display a history list meaningfully — this is a required addition, not optional polish.

- Add `createdAt` (ISO-8601 datetime string, e.g. `"2026-07-14T18:32:00Z"`) to `OrderDTO`.
- Since it's the same DTO reused everywhere, this single field addition automatically applies to
  **all three** responses that already return `OrderDTO`: `POST /v1/orders`, `POST /v1/orders/guest`,
  `GET /v1/orders/{id}` — plus the new `GET /v1/orders` above.
- If the `Order` entity doesn't already persist a creation timestamp internally, it will need one
  added (e.g. `@CreationTimestamp` on the entity) — existing rows created before this change won't
  have a real value and can either backfill to their (unknown) creation time or a sentinel/null,
  whichever is simpler for the backend team; the frontend will treat a missing `createdAt` on old
  orders as "date unknown" rather than erroring.

## Explicitly out of scope

- No new "reorder" or "clone order" endpoint — see "Why" above.
- No changes to `POST /v1/orders` / `POST /v1/orders/guest` request shapes.
- No changes to guest-order behavior — guest orders remain unreachable via `GET /v1/orders/{id}`
  and should also **not** appear in `GET /v1/orders` (which is inherently customer-scoped, so this
  should fall out naturally rather than needing special-case filtering).
