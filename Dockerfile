# -------------------------------
# Stage 0: base tools (shared)
# -------------------------------
FROM php:8.3-cli AS base
ENV DEBIAN_FRONTEND=noninteractive

# System packages we need for composer / building PHP extensions and Node
RUN apt-get update \
  && apt-get install -y --no-install-recommends \
    ca-certificates \
    curl \
    gnupg \
    git \
    unzip \
    build-essential \
    libzip-dev \
    libpng-dev \
    libonig-dev \
    libxml2-dev \
    zlib1g-dev \
  && rm -rf /var/lib/apt/lists/*

# Install PHP extensions commonly required by Laravel packages
RUN docker-php-ext-install pdo pdo_mysql zip bcmath

# -------------------------------
# Stage 1: builder (PHP + Node)
# -------------------------------
FROM base AS builder

WORKDIR /app

# Install Node 20.x (required by Vite)
RUN curl -fsSL https://deb.nodesource.com/setup_20.x | bash - \
  && apt-get update \
  && apt-get install -y --no-install-recommends nodejs \
  && npm install -g npm@11.6.3 \
  && rm -rf /var/lib/apt/lists/*

# Install composer
RUN curl -sS https://getcomposer.org/installer | php -- --install-dir=/usr/local/bin --filename=composer

# Copy only dependency manifests first for better caching
COPY composer.json composer.lock ./
COPY package.json package-lock.json* ./

# Install PHP deps (composer) and Node deps
RUN composer install --no-dev --optimize-autoloader --no-interaction --prefer-dist --no-suggest \
  && npm ci --no-audit --no-fund

# Copy rest of application
COPY . .

# Ensure storage & cache dirs exist and writable for the build (if artisan needs them)
RUN mkdir -p storage bootstrap/cache \
  && chown -R www-data:www-data storage bootstrap/cache

# Build front-end assets (this will run php artisan where needed)
ENV NODE_ENV=production
RUN npm run build

# At this point public/build should exist with manifest.json

# -------------------------------
# Stage 2: composer-only (to build vendor optimized)
# -------------------------------
FROM base AS php-vendor
WORKDIR /app
COPY --from=builder /app /app
# Re-run composer install just in case (already run in builder but safe)
RUN composer install --no-dev --optimize-autoloader --no-interaction --prefer-dist --no-suggest

# -------------------------------
# Stage 3: Final image (PHP-FPM + NGINX via supervisord)
# -------------------------------
FROM php:8.3-fpm AS final

ENV DEBIAN_FRONTEND=noninteractive

# Install runtime packages (nginx, supervisor)
RUN apt-get update \
  && apt-get install -y --no-install-recommends nginx supervisor zip unzip libzip-dev libpng-dev \
  && docker-php-ext-install pdo pdo_mysql bcmath zip \
  && rm -rf /var/lib/apt/lists/*

WORKDIR /var/www/html

# Copy application files
COPY --from=builder /app /var/www/html

# Copy vendor from the php-vendor stage (already optimized)
COPY --from=php-vendor /app/vendor /var/www/html/vendor

# Copy built frontend assets (public/build)
COPY --from=builder /app/public/build /var/www/html/public/build

# Copy nginx and supervisord config (expected in /docker)
# (Overwrite these paths if your files live elsewhere)
COPY docker/nginx.conf /etc/nginx/nginx.conf
COPY docker/supervisord.conf /etc/supervisor/conf.d/supervisord.conf

# Entrypoint script (below) - make sure executable
COPY entrypoint.sh /usr/local/bin/entrypoint.sh
RUN chmod +x /usr/local/bin/entrypoint.sh

# Fix permissions for runtime
RUN chown -R www-data:www-data /var/www/html/storage /var/www/html/bootstrap/cache

EXPOSE 8080

ENTRYPOINT ["/usr/local/bin/entrypoint.sh"]
CMD ["/usr/bin/supervisord", "-n"]
