# The first stage
# Build React static files
FROM node:18.4.0-alpine as build

WORKDIR /app/frontend

COPY ./frontend/package.json /app/frontend/

COPY ./frontend/package-lock.json /app/frontend/
RUN npm install --silent

# update npm
RUN npm install -g npm@latest

# COPY ./frontend/ ./
COPY ./frontend/ /app/frontend/


RUN npm run build

# update Browserslist: caniuse-lite
RUN npx update-browserslist-db@latest

# The second stage
# Copy React static files and start nginx
FROM nginx:alpine

COPY --from=build /app/frontend/build /usr/share/nginx/html

CMD ["nginx", "-g", "daemon off;"]