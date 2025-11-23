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

# copy all project files FIRST
COPY . .

# install PHP dependencies
RUN composer install --no-interaction --prefer-dist --no-progress

# install Node + Vite build deps
RUN curl -fsSL https://deb.nodesource.com/setup_18.x | bash - \
    && apt-get install -y nodejs

# install JS deps
RUN npm ci --no-audit --no-fund

# build Vite assets
RUN npm run build

# ---------- runtime stage ----------
FROM php:8.3-cli

# install runtime deps
RUN apt-get update && apt-get install -y \
    unzip curl default-mysql-client libzip-dev zlib1g-dev pkg-config \
    && docker-php-ext-configure zip \
    && docker-php-ext-install bcmath pdo pdo_mysql zip

WORKDIR /var/www/html

# copy built application
COPY --from=builder /app /var/www/html

# Copy entrypoint
COPY entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh

EXPOSE 10000

CMD ["/entrypoint.sh"]
