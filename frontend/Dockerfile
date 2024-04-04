# Use a lightweight Node image as the base
FROM node:20.9.0-alpine as build

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json to install dependencies
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Build the React application
RUN npm run build

# Use a separate lightweight web server image for serving the static files
FROM nginx:alpine

## Remove default nginx index pagec
RUN rm -rf /usr/share/nginx/html/*

# Copy the built static files from the previous stage to the NGINX image
COPY --from=build /app/build /usr/share/nginx/html

# Expose port 80 (default port for HTTP)
EXPOSE 80

# Start NGINX to serve the static files
CMD ["nginx", "-g", "daemon off;"]






# FROM node:20.9.0-alpine as build

# WORKDIR /app

# COPY package*.json ./

# RUN npm install

# COPY . .

# RUN npm run build

# RUN npm install -g serve

# EXPOSE 80

# CMD ["serve", "-s", "build", "-l", "80"]
