#!/usr/bin/env bash
set -e

# Ensure proper ownership / perms for Laravel
chown -R www-data:www-data /var/www/html/storage /var/www/html/bootstrap/cache || true
chmod -R 775 /var/www/html/storage /var/www/html/bootstrap/cache || true

# Optional: warm caches (uncomment if you want)
# php artisan config:cache
# php artisan route:cache
# php artisan view:cache

# If you want migrations to run automatically on start, uncomment:
# php artisan migrate --force

# Start supervisord (supervisord is executed by CMD in Dockerfile)
exec "$@"
