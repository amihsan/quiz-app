## The first stage
# Build the Vite project
FROM node:18.4.0-alpine as build

# Set working directory
WORKDIR /app/frontend

# Copy package files
COPY ./frontend/package.json /app/frontend/
COPY ./frontend/package-lock.json /app/frontend/

# Install dependencies
RUN npm install --silent

# Copy all frontend files
COPY ./frontend/ /app/frontend/

# Build the Vite project
RUN npm run build

# Update Browserslist: caniuse-lite
RUN npx update-browserslist-db@latest

## The second stage
# Copy build files and start nginx
FROM nginx:alpine

# Copy the built static files from the build stage to the nginx directory
# COPY --from=build /app/frontend/dist /usr/share/nginx/html

# Multiapp on same ec2 instance
COPY --from=build /app/frontend/dist /usr/share/nginx/quiz-frontend

# Copy the entrypoint script (if any)
COPY ./frontend/entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh

# Set the entrypoint
ENTRYPOINT ["/entrypoint.sh"]

# # Expose the default nginx port
# EXPOSE 80
