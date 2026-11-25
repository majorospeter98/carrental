# Autókölcsönző

A car rental demo: pick your dates, see which cars are available and what the trip costs, then book. Hungarian and English.

## Features

- Search by pick-up and return date; every car shows whether it is available and its total
- Booking form with live day count and price
- The server checks every booking, works out the price and refuses double bookings
- Admin area behind a session login: list of bookings, list of cars, add and edit cars

## Setup

Needs PHP 8.3 or newer with SQLite, Composer and Node.js 22. [Laravel Herd](https://herd.laravel.com) provides PHP and Composer.

```bash
git clone https://github.com/majorospeter98/udemx.git
cd udemx
composer setup
php artisan serve
```

Then open <http://localhost:8000>.

`composer setup` installs the packages, creates `.env` and the SQLite database, adds the admin user and three cars, and builds the front end.

While developing, run `npm run dev` next to `php artisan serve`.

| Command | What it does |
|---|---|
| `php artisan serve` | Run the app |
| `npm run dev` | Reload the front end as you edit |
| `npm run build` | Production build into `public/build/` |
| `php artisan migrate:fresh --seed` | Start over: deletes all data, then adds the admin and the cars |
| `php artisan test` | Run the server tests |
| `npm test` | Run the front-end tests |
| `npm run typecheck` | Type-check the front end (the build does not) |

## Admin

Open `/admin`.

- Username: `admin`
- Password: `admin12345`

These are demo credentials, published on purpose. Change them before storing real data.

## Layout

| Folder | Contents |
|---|---|
| `app/`, `routes/`, `database/` | Laravel: controllers, validation, models, migrations, seeder |
| `resources/js/` | Vue pages and components in TypeScript, rendered through Inertia |
| `resources/css/app.css` | Design tokens and shared styles (see `DESIGN.md`) |
| `tests/Feature/`, `tests/js/` | PHP and Vue tests |

## Hosting

The app needs a PHP host; a static host such as Netlify cannot run it.

## Stack

Laravel 13, Inertia 3, Vue 3, TypeScript, Tailwind CSS 4, SQLite, Vite, PHPUnit, Vitest.
