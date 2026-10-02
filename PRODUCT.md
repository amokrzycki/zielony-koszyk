# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

- **Primary — individuals (B2C):** home shoppers in Rzeszów and the surrounding area buying fresh vegetables, fruit, olive oil, spices, and Greek groceries for delivery. Confirmed as the priority audience.
- **Secondary — businesses (B2B):** gastronomy, catering, and trade buyers ordering in bulk at wholesale pricing. The store supports `PERSON` / `COMPANY` customer types and `PRIVATE` / `COMPANY` orders, but B2B is served without shaping the primary path around it.

## Product Purpose

Zielony Koszyk is an online grocery for fresh vegetables and fruit, spices, olive oil, and Greek specialty products, delivered in Rzeszów and the surrounding area. It exists so people can buy fresh, locally sourced produce without leaving home, and so local farmers and checked suppliers get a direct storefront. Success means a shopper can browse, order, and track a delivery end to end.

## Positioning

Derived from the About page and homepage copy, not separately interviewed — confirm before using it as a public claim. The combination: local sourcing from farmers and checked suppliers, Rzeszów-area delivery, Greek specialty products and olive oil, and wholesale pricing on larger orders. A generic online grocery cannot truthfully copy that local + Greek + wholesale mix.

## Operating Context

- An academic engineering thesis (Informatyka, WSIiZ Rzeszów; author `amokrzycki`) intended to become a real store. No commercial launch yet; it also serves as a developer portfolio piece.
- Frontend is this React + TypeScript app. Backend is a separate NestJS + PostgreSQL service (`zielony-koszyk-backend`), reachable at `https://api.amokrzycki.ovh`, local dev at `http://localhost:3000`.
- Polish-language UI only. Prices in PLN (zł). A flat 10 zł delivery fee sits in the cart flow.
- An admin role manages products, orders, and users.

## Capabilities and Constraints

Implemented:

- Product catalogue with categories (`owoce`, `warzywa`, `inne`, `sezonowe`, `worki` bulk sacks), filters, search, and cart.
- Checkout: cart → delivery/payment selection → order summary → confirmation, with delivery and billing addresses.
- Accounts: registration, login with email-OTP / TOTP / WebAuthn MFA, profile, address book, order history and details, email change, password change, MFA settings.
- Admin panel: product, order, and user management.
- B2B fields: `PERSON` / `COMPANY`, `PRIVATE` / `COMPANY`, company name and NIP.

Constraints and absences to respect:

- **No payment-gateway integration.** "Payment" exists only as order statuses (e.g. `WAITING_FOR_PAYMENT`). The README's "secure online payments" and "notifications" claims are not implemented in the frontend — do not present them as working features.
- No stated accessibility standard; MUI/Tailwind defaults plus contrast fixes in `theme.ts`.
- Undecided: launch timing, wholesale price rules, and delivery-zone limits beyond "Rzeszów i okolice".

## Brand Commitments

- **Name:** Zielony Koszyk (logo lettering reads "ZIELONY"). Assets: `public/light_logo.png`, `public/dark_logo.png`.
- **Voice (confirmed):** Polish, informal — "Ty". Examples already in the product: "Twój koszyk", "Witaj", "Zmień hasło". The About page's formal "Państwo" is legacy drift to reconcile toward informal.

## Evidence on Hand

- Real brand photography in `public/images/`: `vegatables.jpeg`, `fruits.jpeg`, `others.jpeg`, `seasonal.jpeg`, `collective.jpeg`, `karuzela1–3.jpeg`; logos in `public/`.
- Factual copy on the About page (offer, quality of service, cooperation invitation) and the Footer.
- **Absent — do not fabricate:** customer testimonials, reviews, real pricing or benchmarks, press, certifications, delivery-time guarantees, and legal pages (the Footer's "Polityka prywatności", "Regulamin", and "Dostawa i płatność" all link to `#`).

## Product Principles

1. **Individuals first.** Optimize the browse → cart → checkout → track path for a home shopper; B2B support must never degrade it.
2. **Freshness and locality are the story.** Local farmers, Rzeszów-area delivery, daily delivery — reuse this to justify decisions.
3. **Ship only what is real.** Don't dress unimplemented capabilities (payments, notifications) as working; honest states over aspirational copy.
4. **Informal Polish throughout.** Warm, direct "Ty"; reconcile legacy formal copy toward it.
5. **Portfolio-grade thesis.** Craft, accessibility, and code readability matter as much as function.

## Accessibility & Inclusion

No project-specific standard was confirmed. Treat WCAG 2.1 AA as the working bar: body text ≥ 4.5:1 (light-mode secondary text was already darkened for this), visible keyboard focus, and semantic labels.
