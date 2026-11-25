# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

This is a portfolio and job-task project. Its real audience is reviewers and employers who judge the work by trying it, usually from the live demo.

Inside the demo there are two roles:

- **Renter:** picks a date range, chooses an available car and books it with contact details.
- **Admin:** logs in, reviews bookings, and adds or edits cars.

## Product Purpose

A car rental app ("Autókölcsönző") that demonstrates the author's ability to build a working product. Success means a reviewer can complete both the booking flow and the admin flow without help and judges the work well made.

## Operating Context

- Renter flow: date search, list of available cars, choose a car, booking form showing day count and total price, confirmation.
- Admin flow: login, bookings list, car list, add or edit a car.
- The README publishes the demo admin credentials so reviewers can get in.

## Capabilities and Constraints

Current implementation:

- Laravel 13, Inertia 3, Vue 3 (Options API), Tailwind CSS 4, SQLite. The chosen dates and language are kept in the browser (localStorage).
- The server validates bookings, works out the price and refuses overlapping dates.
- Admin access is a session login with rate limiting. Public pages receive booked dates, never renters' details.
- Runs locally. Not deployed; the earlier front-end-only version is what Netlify served.
- PHP tests live in `tests/Feature/`, Vue tests in `tests/js/`.
- A car is unavailable when the requested dates overlap one of its bookings.
- Prices are per day in Hungarian forints (Ft).

Open decisions:

- Hosting, since a static host cannot run Laravel.
- Currency presentation in the English version.

## Brand Commitments

- Interface languages: Hungarian (default) and English, switched with HU/EN in the header.
- The name is "Autókölcsönző" in Hungarian and "Car Rental" in English. No logo or other brand identity is established, and the current visual system is described in DESIGN.md.

## Evidence on Hand

- Seed fleet in `database/seeders/DatabaseSeeder.php`: Volkswagen Golf (12 000 Ft/day), Toyota Corolla (11 000 Ft/day), BMW 3 Series (20 000 Ft/day). This is demo data.
- Car images: `public/images/golf.jpg`, `toyota.jpg`, `bmw.jpg` with WebP copies, from Wikimedia Commons under CC0 (no credit required): "2024 Volkswagen Golf R-Line TSI … Front" by Harvey Bold, "2022 Toyota Corolla Sport G-Z" by TTTNIS, "20 BMW 330i Base" by HJUdall (cropped). Cars without a photo show a line drawing.
- No real customers, testimonials, usage data or company details exist. Do not invent them.

## Product Principles

- A reviewer should understand what to do on first visit and reach the end of either flow.
- The work itself is the evidence: finished states, errors and empty states count as much as the main path.
- Be honest about being a demo; add no fabricated business claims.
- Treat both languages as first-class.
