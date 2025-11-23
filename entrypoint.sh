#!/bin/sh
set -e

echo "Waiting for DB ${DB_HOST}:${DB_PORT} ..."

i=0
while [ "$i" -lt 30 ]; do
  i=$((i + 1))
  if mysql -h"$DB_HOST" -P"$DB_PORT" -u"$DB_USERNAME" -p"$DB_PASSWORD" -e "select 1" >/dev/null 2>&1; then
    echo "Database is ready."
    break
  fi
  echo "DB not ready... retrying ($i/30)"
  sleep 2
done

echo "Running migrations..."
php artisan migrate --force || true

echo "Optimizing Laravel..."
php artisan config:clear || true
php artisan route:cache || true
php artisan view:cache || true

echo "Starting Laravel..."
exec php artisan serve --host 0.0.0.0 --port 10000
