FROM node:22.13.1 AS deps
WORKDIR /app
COPY package.json package.json
RUN npm i --frozen-lockfile


FROM node:22.13.1 AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build


FROM nginx:1.27-perl AS prod
EXPOSE 80

COPY --from=builder /app/dist /usr/share/nginx/html

COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

ENTRYPOINT [ "nginx","-g","daemon off;" ]
