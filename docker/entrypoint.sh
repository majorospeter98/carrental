#!/bin/sh
set -e

data=/var/www/html/storage/data

# without an APP_KEY from outside, make one once and keep it with the data
if [ -z "$APP_KEY" ]; then
    [ -s "$data/app.key" ] || php -r 'echo "base64:".base64_encode(random_bytes(32));' > "$data/app.key"
    APP_KEY="$(cat "$data/app.key")"
    export APP_KEY
fi

# sample data goes into a new database only
if [ -f "$DB_DATABASE" ]; then
    php artisan migrate --force
else
    touch "$DB_DATABASE"
    php artisan migrate --seed --force
fi

php artisan optimize
chown -R www-data:www-data storage bootstrap/cache

exec "$@"
