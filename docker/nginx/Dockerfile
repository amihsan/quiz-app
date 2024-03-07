# The first stage
# Build React static files
FROM node:18.4.0-alpine as build

WORKDIR /app/frontend

COPY ./frontend/package.json ./

COPY ./frontend/package-lock.json ./

RUN npm install --silent

COPY ./frontend/ ./

RUN npm run build

# The second stage
# Copy React static files and start nginx
FROM nginx:alpine

COPY --from=build /app/frontend/build /usr/share/nginx/html

COPY ./docker/nginx/production/default.template.conf /etc/nginx/conf.d/default.template.conf
CMD ["sh", "-c", "envsubst '$${DOMAIN}' < /etc/nginx/conf.d/default.template.conf > /etc/nginx/conf.d/default.conf && nginx -g 'daemon off;'"]

# CMD ["nginx", "-g", "daemon off;"]