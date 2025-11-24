# -------------------------------------------------------
# Stage 1 — Build environment (PHP + Composer + Node)
# -------------------------------------------------------
FROM php:8.3-cli AS builder
ENV DEBIAN_FRONTEND=noninteractive

# Install system dependencies
RUN apt-get update && apt-get install -y \
    git curl unzip zip \
    libzip-dev libpng-dev libonig-dev libxml2-dev zlib1g-dev \
    build-essential \
    && docker-php-ext-install pdo pdo_mysql bcmath zip

# Install Composer
RUN curl -sS https://getcomposer.org/installer | php -- --install-dir=/usr/local/bin --filename=composer

# Install Node 20 (required for Vite)
RUN curl -fsSL https://deb.nodesource.com/setup_20.x | bash - \
    && apt-get update \
    && apt-get install -y nodejs

WORKDIR /app

# Copy everything BEFORE composer install
COPY . .

# Install PHP deps
RUN composer install --no-dev --optimize-autoloader --no-interaction

# Install JS deps and build frontend
RUN npm ci --no-audit --no-fund
RUN npm run build

# -------------------------------------------------------
# Stage 2 — Production Image
# -------------------------------------------------------
FROM php:8.3-fpm

ENV DEBIAN_FRONTEND=noninteractive

RUN apt-get update && apt-get install -y \
    nginx supervisor \
    libzip-dev libpng-dev \
    && docker-php-ext-install pdo pdo_mysql bcmath zip

WORKDIR /var/www/html

# Copy app from builder
COPY --from=builder /app /var/www/html

# Configs
COPY docker/nginx.conf /etc/nginx/nginx.conf
COPY docker/supervisord.conf /etc/supervisor/conf.d/supervisord.conf
COPY entrypoint.sh /usr/local/bin/entrypoint.sh

RUN chmod +x /usr/local/bin/entrypoint.sh

# Fix storage permissions
RUN chown -R www-data:www-data storage bootstrap/cache

EXPOSE 8080

ENTRYPOINT ["/usr/local/bin/entrypoint.sh"]
CMD ["/usr/bin/supervisord"]
