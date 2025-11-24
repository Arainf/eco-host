# -------------------------------
# Stage 1: Build Vite Assets + Composer
# -------------------------------
FROM node:18 AS frontend-builder
WORKDIR /app
COPY package*.json vite.config.js ./
COPY resources ./resources
COPY public ./public
RUN npm install
RUN npm run build

FROM composer:2 AS php-builder
WORKDIR /app
COPY composer.json composer.lock ./
RUN composer install --ignore-platform-reqs --no-scripts --no-plugins

# -------------------------------
# Stage 2: Final Image (PHP-FPM + NGINX)
# -------------------------------
FROM php:8.3-fpm

# Install system deps
RUN apt-get update && apt-get install -y \
    nginx zip unzip libzip-dev libpng-dev supervisor \
    && docker-php-ext-install pdo pdo_mysql bcmath zip

# Copy Laravel app
COPY . /var/www/html

# Copy built assets
COPY --from=frontend-builder /app/public/build /var/www/html/public/build

# Install PHP dependencies
COPY --from=php-builder /app/vendor /var/www/html/vendor

# Permissions
RUN chown -R www-data:www-data /var/www/html/storage /var/www/html/bootstrap/cache

# Copy Nginx config
COPY ./docker/nginx.conf /etc/nginx/nginx.conf

# Copy Supervisor config
COPY ./docker/supervisord.conf /etc/supervisor/conf.d/supervisord.conf

EXPOSE 8080

CMD ["/usr/bin/supervisord"]
