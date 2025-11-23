# ---------- builder stage ----------
FROM php:8.3-cli AS builder

# install system deps
RUN apt-get update && apt-get install -y \
    git curl zip unzip libzip-dev libonig-dev libxml2-dev zlib1g-dev pkg-config \
    && docker-php-ext-configure zip \
    && docker-php-ext-install bcmath pdo pdo_mysql zip

# install composer
COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

WORKDIR /app

# copy all files first (Laravel must be present BEFORE composer)
COPY . .

# install dependencies
RUN composer install --no-interaction --prefer-dist --no-progress

# ---------- runtime stage ----------
FROM php:8.3-cli

# install runtime deps
RUN apt-get update && apt-get install -y \
    unzip curl default-mysql-client libzip-dev zlib1g-dev pkg-config \
    && docker-php-ext-configure zip \
    && docker-php-ext-install bcmath pdo pdo_mysql zip

WORKDIR /var/www/html

# copy app from builder
COPY --from=builder /app /var/www/html

# entrypoint (wait for DB + auto migrate + start server)
RUN echo '#!/bin/bash\n\
set -e\n\
echo \"Waiting for DB $DB_HOST:$DB_PORT...\"\n\
for i in {1..30}; do\n\
  if mysql -h$DB_HOST -P$DB_PORT -u$DB_USERNAME -p$DB_PASSWORD -e \"select 1\" >/dev/null 2>&1; then\n\
    echo \"DB ready\";\n\
    break;\n\
  else\n\
    echo \"DB not ready, retrying ($i/30)\";\n\
    sleep 2;\n\
  fi;\n\
done\n\
echo \"Running migrations...\"\n\
php artisan migrate --force || true\n\
echo \"Optimizing...\"\n\
php artisan config:clear\n\
php artisan route:cache\n\
php artisan view:cache\n\
echo \"Starting server...\"\n\
exec php artisan serve --host 0.0.0.0 --port 10000\n' > /entrypoint.sh

RUN chmod +x /entrypoint.sh

EXPOSE 10000

CMD ["/entrypoint.sh"]
