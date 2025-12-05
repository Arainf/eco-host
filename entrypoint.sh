#!/bin/bash
set -e

# ---------------------------------------------
# Fix permissions (your original working logic)
# ---------------------------------------------
chown -R www-data:www-data /var/www/html/storage /var/www/html/bootstrap/cache || true
chmod -R 775 /var/www/html/storage /var/www/html/bootstrap/cache || true

# ---------------------------------------------
# Wait for Railway MySQL connection
# ---------------------------------------------
echo "Waiting for MySQL on Railway..."

until php -r "
try {
    new PDO(
        getenv('DB_CONNECTION') . ':host=' . getenv('DB_HOST') . ';dbname=' . getenv('DB_DATABASE'),
        getenv('DB_USERNAME'),
        getenv('DB_PASSWORD'),
        [PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION]
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
# Run Laravel migrations safely
# ---------------------------------------------
echo "Running migrations..."
php artisan migrate --force || echo "Migrations failed (ignored)."

# ---------------------------------------------
# Laravel caches for faster performance
# ---------------------------------------------
php artisan config:cache || true
php artisan route:cache || true
php artisan view:cache || true

# ---------------------------------------------
# Continue to supervisord (your original behavior)
# ---------------------------------------------
exec "$@"
