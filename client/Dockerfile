FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json ./

RUN npm ci

COPY . .

# Listens for the build argument and sets it as an environment variable for the build process
ARG VITE_API_BASE_URL
# sets the environment variable for the build process, making it available to the application during the build phase
ENV VITE_API_BASE_URL=$VITE_API_BASE_URL

RUN npm run build

# Switch to the standard, official NGINX image
FROM nginx:alpine

# Force the container to run as the root administrator
USER root

COPY --from=builder /app/dist /usr/share/nginx/html
# Remove the default NGINX configuration and replace it with our custom configuration
RUN rm -f /etc/nginx/conf.d/default.conf
COPY nginx.conf /etc/nginx/conf.d/app.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]