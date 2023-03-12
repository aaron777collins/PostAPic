FROM php:fpm-alpine

# RUN a2enmod rewrite

# RUN apt-get update && apt-get install -y \
#     libzip-dev \
#     zlib1g-dev \
#     libicu-dev \
#     libxml2-dev \
#     libpq-dev \
#     vim \
#     libpng-dev  \
#     # && docker-php-ext-install mysqli && docker-php-ext-enable mysqli \
#     # && apt-get update && apt-get upgrade -y
#     && docker-php-ext-install pdo pdo_mysql  zip intl xmlrpc soap opcache \
#     && docker-php-ext-install mysqli \
#     && docker-php-ext-configure pdo_mysql --with-pdo-mysql=mysqlnd --with-mysqli=mysqlnd

# RUN php -i && docker-php-ext-install pdo pdo_mysql  zip intl xmlrpc soap opcache \
#     && docker-php-ext-install mysqli \
#     && docker-php-ext-configure pdo_mysql --with-pdo-mysql=mysqlnd

RUN docker-php-ext-install mysqli pdo pdo_mysql && docker-php-ext-enable pdo_mysql

# RUN curl -sS https://getcomposer.org/installer | php -- --install-dir=/usr/local/bin --filename=composer
# COPY docker/php/https://php.ini /usr/local/etc/php
# COPY docker/apache/https://apache2.conf /etc/apache2/https://apache2.conf
# COPY docker/apache/https://vhost.conf /etc/apache2/sites-available/000-https://default.conf

ENV COMPOSER_ALLOW_SUPERUSER 1

# COPY . /var/www

RUN chown -R www-data:www-data /var/www/html


WORKDIR /var/www
