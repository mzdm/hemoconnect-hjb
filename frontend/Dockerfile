# Stage 1: Build the Vite app
FROM node:20-alpine as build-stage

WORKDIR /app
RUN echo "VITE_API_URL=https://api.hjb.mesh.sk/api" >> .env.local
COPY package*.json ./
RUN npm install

COPY . .

RUN npm run build

# Stage 2: Serve the app with Nginx
FROM nginx:alpine

# Copy the built files
COPY --from=build-stage /app/dist /usr/share/nginx/html

# Create custom Nginx config
RUN echo 'server { \
  listen 80; \
  root /usr/share/nginx/html; \
  index index.html; \
  location / { \
    try_files $uri $uri/ /index.html; \
  } \
}' > /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]