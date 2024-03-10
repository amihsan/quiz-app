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

# The second stage
# Copy React static files and start nginx
FROM nginx:alpine

COPY --from=build /app/frontend/build /usr/share/nginx/html

CMD ["nginx", "-g", "daemon off;"]