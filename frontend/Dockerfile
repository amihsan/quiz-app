FROM node:22-alpine AS build
WORKDIR /app

# Copy only dependencies first
COPY package*.json ./
RUN npm install

# Copy rest of frontend
COPY . .
RUN npm run build

FROM nginx:alpine
# Copy build output to nginx folder
COPY --from=build /app/dist /usr/share/nginx/html

# Entrypoint script
COPY entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh
ENTRYPOINT ["/entrypoint.sh"]
