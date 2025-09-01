# Build stage
FROM node:22-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Nginx stage
FROM nginx:alpine

# Create app directory inside nginx
RUN mkdir -p /usr/share/nginx/quiz-frontend
COPY --from=build /app/dist /usr/share/nginx/quiz-frontend

# Entrypoint (optional)
COPY entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh

ENTRYPOINT ["/entrypoint.sh"]
