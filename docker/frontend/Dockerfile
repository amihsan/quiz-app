# The first stage
# Build React static files
FROM node:18.4.0-alpine as build

WORKDIR /app/frontend

COPY ./frontend/package.json /app/frontend/

COPY ./frontend/package-lock.json /app/frontend/
RUN npm install --silent

# COPY ./frontend/ ./
COPY ./frontend/ /app/frontend/


RUN npm run build

# update Browserslist: caniuse-lite
RUN npx update-browserslist-db@latest

# The second stage
# Copy React static files and start nginx
FROM nginx:alpine

COPY --from=build /app/frontend/build /usr/share/nginx/html

COPY ./nginx.conf /etc/nginx/nginx.conf

# Copy the entrypoint script
COPY ./frontend/entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh

# Set the entrypoint
ENTRYPOINT ["/entrypoint.sh"]

CMD ["nginx", "-g", "daemon off;"]