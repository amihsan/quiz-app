# # The first stage
# # Build React static files
# FROM node:18.4.0-alpine as build

# WORKDIR /app/frontend
# COPY ./frontend/package.json ./
# COPY ./frontend/package-lock.json ./
# RUN npm ci --silent
# COPY ./frontend/ ./
# RUN npm run build

# # The second stage
# # Copy React static files and start nginx
# FROM nginx:alpine
# COPY --from=build /app/frontend/build /usr/share/nginx/html
# CMD ["nginx", "-g", "daemon off;"]

# The first stage
# Build React static files
FROM node:18.4.0-alpine as build

WORKDIR /app/frontend
COPY ./frontend/package.json ./
COPY ./frontend/package-lock.json ./
RUN npm ci --silent
COPY ./frontend/ ./
RUN npm run build

# The second stage
# Copy React static files and start nginx
FROM nginx:alpine
COPY --from=build /app/frontend/build /usr/share/nginx/html

# Copy entrypoint script
COPY ./docker/nginx/docker-entrypoint.sh /docker-entrypoint.sh

# Grant execute permission to the script
RUN chmod +x /docker-entrypoint.sh

# Set the entrypoint script
ENTRYPOINT ["/docker-entrypoint.sh"]
