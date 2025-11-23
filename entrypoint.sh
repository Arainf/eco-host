#!/bin/bash
set -e

# run composer install if vendor missing (safeguard)
if [ ! -d "vendor" ]; then
  composer install --no-dev --optimize-autoloader --no-interaction
fi

# generate app key if missing (only if APP_KEY is empty)
if [ -z "$APP_KEY" ]; then
  php artisan key:generate --force
fi

# run migrations (optional: comment out if you prefer manual migrations)
if [ "$RUN_MIGRATIONS" = "true" ]; then
  php artisan migrate --force
fi

# clear/cache config & routes for production
php artisan config:clear || true
php artisan route:cache || true
php artisan view:cache || true

# start the app (the CMD or default will be used)
exec "$@"
