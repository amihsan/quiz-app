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

## For render deployment
# Install serve globally to serve static files
RUN npm install -g serve

# Expose port 3000
EXPOSE 3000

# Start serve to serve the built React app
CMD ["serve", "-s", "build", "-l", "3000"]

# For AWS (nginx)
# The second stage
# Copy React static files and start nginx
# FROM nginx:alpine

# COPY --from=build /app/frontend/build /usr/share/nginx/html
# COPY ./docker/nginx/templates /etc/nginx/templates

# CMD ["nginx", "-g", "daemon off;"]