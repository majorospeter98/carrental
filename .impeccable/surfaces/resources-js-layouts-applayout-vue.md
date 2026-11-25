---
version: 1
slug: "resources-js-layouts-applayout-vue"
primary_target: "resources/js/Layouts/AppLayout.vue"
related_targets: []
---

# Car rental app redesign: "Night" (chosen by the user, 2026-11-25)

seed: 8012919ac29d1c12 (catalogue world `light-shadow-caustics-rain-night-cityscape`)

## Job and audience
Reviewers and employers trying the demo. A renter picks dates, sees a car and books it; an admin manages bookings and cars. Renter screens persuade; admin screens are for operating.

## Outcome
Both flows are understandable on the first visit and the work looks well made. Ultra-modern and simple.

## Selected direction
- City after dark: deep blue-black ground, amber for the primary action, price and selected days, cobalt as a second accent. No glows.
- Barlow Condensed uppercase for headings and large figures, Barlow for everything else.
- One car at a time, full width, with name and trip total over the photo.
- Below it: date fields, a switcher showing every car as free or booked, and a strip of days lit for the selected range with that car's booked days.
- One motion moment: the photo fades up from dark when the car on stage changes.

## Screens and states
Search, booking (photo beside form, live day count and total), confirmation, admin login, bookings by date, car list, add/edit car, 404. States: no free car, no bookings, field errors, double booking, wrong login.

## Constraints
- Vue + Laravel + Inertia + Tailwind. No Bootstrap.
- Hungarian and English; prices in Ft.
- Keep current features. Name is "Autókölcsönző" in Hungarian, "Car Rental" in English.
- Photos are CC0 and need no credit. Any new photo must also need none, because the app shows no credits.
- Demo data stays labelled as demo. No invented claims.

## Open decisions for the build
- Photography: daytime shots are darkened in CSS. Decide whether to source evening or studio photos.
- The day strip covers only 21 days from today; later dates are not shown in it.
- Cars added by the admin have no photo, so the stage is blank. Needs an upload or a designed fallback.
- The switcher is designed for a few cars; behaviour with many is undecided.
- Comparing prices takes one click per car.
- On phones the date fields sit below the photo. Check this against the "search first" requirement.
