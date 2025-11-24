# ---------- builder stage ----------
FROM php:8.3-cli AS builder

# install system deps
RUN apt-get update && apt-get install -y \
    git curl zip unzip libzip-dev libonig-dev libxml2-dev zlib1g-dev pkg-config \
    nodejs npm \
    && docker-php-ext-configure zip \
    && docker-php-ext-install bcmath pdo pdo_mysql zip

# install composer
COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

WORKDIR /app

# copy all project files
COPY . .

# install php dependencies
RUN composer install --no-interaction --prefer-dist --no-progress

# install JS deps + build assets
RUN npm install
RUN npm run build

# ---------- runtime stage ----------
FROM php:8.3-cli

RUN apt-get update && apt-get install -y \
    unzip curl default-mysql-client libzip-dev zlib1g-dev pkg-config \
    && docker-php-ext-configure zip \
    && docker-php-ext-install bcmath pdo pdo_mysql zip

WORKDIR /var/www/html

# copy full app (except node_modules)
COPY --from=builder /app /var/www/html

# MAKE SURE build assets are copied
COPY --from=builder /app/public/build /var/www/html/public/build

# copy entrypoint
COPY entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh

EXPOSE 10000

CMD ["/entrypoint.sh"]
