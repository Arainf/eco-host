# -------------------------------------------------------
# Stage 1: Builder - PHP + Composer + Node
# -------------------------------------------------------
    FROM php:8.3-cli AS builder
    ENV DEBIAN_FRONTEND=noninteractive
    
    # Install system dependencies + GD deps
    RUN apt-get update && apt-get install -y \
        git curl unzip zip \
        libzip-dev libpng-dev libjpeg62-turbo-dev libfreetype6-dev \
        build-essential \
        libonig-dev libxml2-dev zlib1g-dev \
        && docker-php-ext-configure gd --with-freetype --with-jpeg \
        && docker-php-ext-install gd pdo pdo_mysql bcmath zip
    
    # Install Composer
    RUN curl -sS https://getcomposer.org/installer | php -- \
        --install-dir=/usr/local/bin --filename=composer
    
    # Install Node.js 20 for Vite build
    RUN curl -fsSL https://deb.nodesource.com/setup_20.x | bash - && \
        apt-get install -y nodejs
    
    WORKDIR /app
    
    # Copy all project files
    COPY . .
    
    # Install PHP dependencies
    RUN composer install --no-dev --optimize-autoloader --no-interaction
    
    # Install JS dependencies + Vite build
    RUN npm ci --no-audit --no-fund && npm run build
    
    # Cache Laravel configuration
    RUN php artisan config:clear && php artisan config:cache \
        && php artisan route:cache \
        && php artisan view:cache
    
    # -------------------------------------------------------
    # Stage 2: Production Image - PHP-FPM + Nginx + Supervisor
    # -------------------------------------------------------
    FROM php:8.3-fpm
    
    ENV DEBIAN_FRONTEND=noninteractive
    
    # Install dependencies + GD
    RUN apt-get update && apt-get install -y \
        nginx supervisor \
        libpng-dev libjpeg62-turbo-dev libfreetype6-dev libzip-dev \
        && docker-php-ext-configure gd --with-freetype --with-jpeg \
        && docker-php-ext-install gd pdo pdo_mysql bcmath zip
    
    WORKDIR /var/www/html
    
    # Copy compiled Laravel app from builder
    COPY --from=builder /app /var/www/html
    
    # Copy configs
    COPY docker/nginx.conf /etc/nginx/nginx.conf
    COPY docker/supervisord.conf /etc/supervisor/conf.d/supervisord.conf
    COPY entrypoint.sh /usr/local/bin/entrypoint.sh
    
    RUN chmod +x /usr/local/bin/entrypoint.sh
    
    # Fix permissions
    RUN chown -R www-data:www-data storage bootstrap/cache
    
    EXPOSE 8080
    
    ENTRYPOINT ["/usr/local/bin/entrypoint.sh"]
    CMD ["/usr/bin/supervisord"]
    