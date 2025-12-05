#!/bin/bash
set -e

# ---------------------------------------------
# Fix permissions
# ---------------------------------------------
chown -R www-data:www-data /var/www/html/storage /var/www/html/bootstrap/cache || true
chmod -R 775 /var/www/html/storage /var/www/html/bootstrap/cache || true

# ---------------------------------------------
# CLEAR CONFIG CACHE BEFORE ANYTHING
# ---------------------------------------------
php artisan config:clear || true
php artisan cache:clear || true

# ---------------------------------------------
# Wait for Railway DB
# ---------------------------------------------
echo "Waiting for MySQL on Railway..."

until php -r "
try {
    new PDO(
        'mysql:host=' . getenv('DB_HOST') .
        ';port=' . getenv('DB_PORT') .
        ';dbname=' . getenv('DB_DATABASE'),
        getenv('DB_USERNAME'),
        getenv('DB_PASSWORD')
    );
    exit(0);
} catch (Exception \$e) {
    exit(1);
}
"; do
    echo "Database not ready... retrying in 2 seconds"
    sleep 2
done

echo "Database connected!"

# ---------------------------------------------
# RUN MIGRATIONS USING LIVE MYSQL
# ---------------------------------------------
echo "Running migrations with MySQL..."
php artisan migrate --force

# ---------------------------------------------
# CACHE EVERYTHING FOR SPEED
# ---------------------------------------------
php artisan config:cache
php artisan route:cache
php artisan view:cache

# ---------------------------------------------
# Start Supervisor
# ---------------------------------------------
exec "$@"
