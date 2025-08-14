FROM node:20-alpine AS build
WORKDIR /app
COPY apps/web/package.json ./
RUN npm i -g pnpm && pnpm i
COPY apps/web ./
RUN pnpm build

FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
