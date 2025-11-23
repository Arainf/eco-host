# ---------- builder stage ----------
FROM php:8.3-cli AS builder

# system deps
RUN apt-get update && apt-get install -y \
    git curl zip unzip libonig-dev libxml2-dev libzip-dev zlib1g-dev \
    && docker-php-ext-install bcmath pdo pdo_mysql zip

# install composer
COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

WORKDIR /app

# copy composer files first for caching
COPY composer.json composer.lock ./
RUN composer install --no-interaction --prefer-dist --no-progress

# copy full Laravel project
COPY . .

# ---------- runtime stage ----------
FROM php:8.3-cli

RUN apt-get update && apt-get install -y \
    unzip curl wait-for-it \
    && docker-php-ext-install bcmath pdo pdo_mysql zip

WORKDIR /var/www/html

# copy from builder
COPY --from=builder /app /var/www/html

# ENTRYPOINT SCRIPT (runs migration automatically)
RUN echo '#!/bin/bash\n\
set -e\n\
echo \"Waiting for database $DB_HOST:$DB_PORT...\"\n\
for i in {1..30}; do\n\
  if mysql -h$DB_HOST -P$DB_PORT -u$DB_USERNAME -p$DB_PASSWORD -e \"select 1\" >/dev/null 2>&1; then\n\
    echo \"Database is ready.\";\n\
    break;\n\
  else\n\
    echo \"DB not ready... retrying ($i of 30)\";\n\
    sleep 2;\n\
  fi;\n\
done\n\
echo \"Running migrations...\"\n\
php artisan migrate --force || true\n\
echo \"Optimizing Laravel...\"\n\
php artisan config:clear\n\
php artisan route:cache\n\
php artisan view:cache\n\
echo \"Starting Laravel server...\"\n\
exec php artisan serve --host 0.0.0.0 --port 10000\n' > /entrypoint.sh

RUN chmod +x /entrypoint.sh

EXPOSE 10000

CMD ["/entrypoint.sh"]
