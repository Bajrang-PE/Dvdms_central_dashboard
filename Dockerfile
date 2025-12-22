# Stage 1: Build with Node (nodework)
FROM node:alpine3.16 AS builder
WORKDIR /fe-central-dashboard

COPY package.json ./
#ENV NODE_OPTIONS="--max-old-space-size=4096"
RUN npm install
COPY . .
RUN npm run build
# RUN ls -la /fe-central-dashboard

# Stage 2: Nginx deployment
FROM nginx:stable-alpine
COPY --from=builder /fe-central-dashboard/dist /usr/share/nginx/html
RUN rm /etc/nginx/conf.d/default.conf
# Add custom nginx config
COPY nginx.conf /etc/nginx/conf.d
# EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]

# WORKDIR /usr/share/nginx/html
# RUN rm -rf ./*
# COPY nginx-custom.conf /etc/nginx/conf.d/default.conf
# COPY dist .
# COPY --from=nodework /fe-central-dashboard/dist .
# ENTRYPOINT ["nginx", "-g", "daemon off;"]

