# syntax=docker/dockerfile:1

# Front end: Vite build into public/build
FROM node:22-alpine AS assets
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci
COPY vite.config.ts tsconfig.json ./
COPY resources ./resources
COPY public ./public
RUN npm run build

# PHP base shared by the dependency and runtime stages
# (composer.lock needs PHP 8.4.1 or newer)
FROM php:8.4-apache AS base
WORKDIR /var/www/html

# PHP packages, without the dev ones
FROM base AS vendor
RUN apt-get update && apt-get install -y --no-install-recommends unzip && rm -rf /var/lib/apt/lists/*
COPY --from=composer:2 /usr/bin/composer /usr/bin/composer
COPY . .
RUN composer install --no-dev --no-interaction --prefer-dist --optimize-autoloader

FROM base AS app
ENV APP_NAME="Autókölcsönző" \
    APP_ENV=production \
    APP_DEBUG=false \
    APP_URL=http://localhost:8000 \
    LOG_CHANNEL=stderr \
    DB_CONNECTION=sqlite \
    DB_DATABASE=/var/www/html/storage/data/database.sqlite \
    SESSION_DRIVER=database \
    CACHE_STORE=database \
    INERTIA_SSR_ENABLED=false

RUN mv "$PHP_INI_DIR/php.ini-production" "$PHP_INI_DIR/php.ini" \
    && a2enmod rewrite headers \
    # do not tell visitors which versions run
    && echo "expose_php = Off" > "$PHP_INI_DIR/conf.d/hide-version.ini" \
    && printf 'ServerTokens Prod\nServerSignature Off\n' > /etc/apache2/conf-enabled/zz-hide-version.conf \
    && sed -ri 's!/var/www/html!/var/www/html/public!g' /etc/apache2/sites-available/000-default.conf

COPY --from=vendor /var/www/html ./
COPY --from=assets /app/public/build ./public/build
COPY docker/entrypoint.sh /usr/local/bin/entrypoint
# a Windows checkout may have CRLF line endings
RUN sed -i 's/\r$//' /usr/local/bin/entrypoint \
    && chmod +x /usr/local/bin/entrypoint \
    && mkdir -p storage/data \
    && chown -R www-data:www-data storage bootstrap/cache

# the database and the generated app key
VOLUME /var/www/html/storage/data

EXPOSE 80
HEALTHCHECK --interval=30s --timeout=3s --start-period=20s CMD curl -fsS http://localhost/up || exit 1

ENTRYPOINT ["entrypoint"]
CMD ["apache2-foreground"]
