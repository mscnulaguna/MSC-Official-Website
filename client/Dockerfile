
FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json ./

RUN npm ci

COPY . .
RUN npm run build

FROM nginx:alpine

RUN apk add --no-cache libcap \
    && setcap 'cap_net_bind_service=+ep' /usr/sbin/nginx \
    && apk del libcap

COPY --from=builder /app/dist /usr/share/nginx/html

EXPOSE 80

USER nginx
CMD ["nginx", "-g", "daemon off;"]