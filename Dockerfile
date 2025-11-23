# ---------- builder stage ----------
FROM php:8.3-cli AS builder

# system deps
RUN apt-get update && apt-get install -y \
    git curl zip unzip libonig-dev libxml2-dev libzip-dev zlib1g-dev \
    && docker-php-ext-install bcmath pdo pdo_mysql zip

# install composer
COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

WORKDIR /app

# copy composer files first for layer caching
COPY composer.json composer.lock ./

# install deps (no dev in final image, but builder installs all to be safe)
RUN composer install --no-interaction --prefer-dist --no-progress --no-scripts --no-plugins

# copy app files
COPY . .

# run any build steps (optional)
RUN composer run-script post-autoload-dump --no-interaction || true

# ---------- runtime stage ----------
FROM php:8.3-cli

# system deps for runtime
RUN apt-get update && apt-get install -y \
    unzip libonig-dev libxml2-dev libzip-dev zlib1g-dev \
    && docker-php-ext-install bcmath pdo pdo_mysql zip

# copy composer from builder
COPY --from=builder /usr/bin/composer /usr/bin/composer

WORKDIR /var/www/html

# copy app from builder
COPY --from=builder /app /var/www/html

# ensure storage and cache dirs exist and proper permissions
RUN mkdir -p /var/www/html/storage /var/www/html/bootstrap/cache \
    && chown -R www-data:www-data /var/www/html/storage /var/www/html/bootstrap/cache

# Copy entrypoint script
COPY entrypoint.sh /usr/local/bin/entrypoint.sh
RUN chmod +x /usr/local/bin/entrypoint.sh

# expose port Render will use
EXPOSE 10000

# runtime user
USER www-data

# default entrypoint
ENTRYPOINT ["/usr/local/bin/entrypoint.sh"]
# the CMD will be used by the entrypoint to start the app (artisan serve)
CMD ["php", "artisan", "serve", "--host", "0.0.0.0", "--port", "10000"]
