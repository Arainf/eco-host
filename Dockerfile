# ---------- builder stage ----------
FROM php:8.3-cli AS builder

# install system deps + node properly
RUN apt-get update && apt-get install -y \
    git curl zip unzip libzip-dev libonig-dev libxml2-dev zlib1g-dev pkg-config ca-certificates \
    && curl -fsSL https://deb.nodesource.com/setup_18.x | bash - \
    && apt-get install -y nodejs \
    && docker-php-ext-configure zip \
    && docker-php-ext-install pdo pdo_mysql bcmath zip

# install composer
COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

WORKDIR /app

# copy all files
COPY . .

# PHP deps
RUN composer install --no-interaction --prefer-dist --no-progress

# JS deps
RUN npm install

# build frontend
RUN npm run build

# ---------- runtime stage ----------
FROM php:8.3-cli

RUN apt-get update && apt-get install -y \
    unzip curl default-mysql-client libzip-dev zlib1g-dev pkg-config \
    && docker-php-ext-configure zip \
    && docker-php-ext-install pdo pdo_mysql bcmath zip

WORKDIR /var/www/html

# copy full app
COPY --from=builder /app /var/www/html

# copy Vite build output explicitly
COPY --from=builder /app/public/build /var/www/html/public/build

# copy entrypoint
COPY entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh

EXPOSE 10000

CMD ["/entrypoint.sh"]
