# -------------------------------
# Stage 1: Build Vite Assets + Composer
# -------------------------------
FROM node:20 AS frontend-builder
WORKDIR /app

# Copy full Laravel project
COPY . .

# Install PHP because Wayfinder needs php artisan
RUN apt-get update && apt-get install -y php php-cli

# Install node deps
RUN npm install

# Build Vite production assets
RUN npm run build

# -------------------------------
# Stage 2: Composer Dependencies
# -------------------------------
FROM composer:2 AS php-builder
WORKDIR /app
COPY . .
RUN composer install --no-dev --optimize-autoloader --no-interaction

# -------------------------------
# Stage 3: Final Image (PHP-FPM + NGINX)
# -------------------------------
FROM php:8.3-fpm

# System deps
RUN apt-get update && apt-get install -y \
    nginx supervisor zip unzip libzip-dev libpng-dev \
    && docker-php-ext-install pdo pdo_mysql bcmath zip

WORKDIR /var/www/html

# Copy full Laravel source
COPY . .

# Copy vendor from builder
COPY --from=php-builder /app/vendor /var/www/html/vendor

# Copy built frontend assets
COPY --from=frontend-builder /app/public/build /var/www/html/public/build

# Permissions
RUN chown -R www-data:www-data storage bootstrap/cache

# Nginx config
COPY docker/nginx.conf /etc/nginx/nginx.conf

# Supervisor config
COPY docker/supervisord.conf /etc/supervisor/conf.d/supervisord.conf

EXPOSE 8080

CMD ["/usr/bin/supervisord"]
