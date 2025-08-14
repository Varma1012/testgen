FROM node:20-alpine
WORKDIR /app
COPY apps/api/package.json ./
RUN npm i -g pnpm && pnpm i
COPY apps/api ./
RUN pnpm build
EXPOSE 4000
CMD ["node", "dist/index.js"]
