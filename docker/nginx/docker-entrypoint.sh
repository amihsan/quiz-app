#!/bin/bash

# Load variables from .env file
if [ -f .env ]; then
    export $(grep -v '^#' .env | xargs)
fi

# Replace ${DOMAIN} with the actual domain in the Nginx configuration file
sed -i "s/\${DOMAIN}/${DOMAIN}/g" /etc/nginx/conf.d/default.conf

# Start Nginx
nginx -g "daemon off;"
