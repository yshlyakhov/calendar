FROM node:20.18.3-bookworm-slim AS build

WORKDIR /app

COPY . .

RUN npm install
RUN npm run build

FROM nginx:latest

COPY --from=build /app/dist/calendar/browser /usr/share/nginx/html
COPY --from=build /app/nginx/conf.d /etc/nginx/conf.d

EXPOSE 80
EXPOSE 443