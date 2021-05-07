# build environment
FROM node:13.12.0-alpine as build
WORKDIR /app

COPY . ./

RUN npm install
RUN npm run build

# production environment
FROM nginx

ENV CONFIG_URL=https://raw.githubusercontent.com/thorstenbaek/sandbox-environments/master
ENV IN_CONTAINER=1 

COPY config/nginx/default.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/public /usr/share/nginx/html
COPY --from=build /app/public/images /usr/share/nginx/html/images
COPY --from=build /app/public/template.html /usr/share/nginx/html/template.html

WORKDIR /etc/nginx
COPY substituteEnv.sh entrypoint.sh
RUN chmod +x ./entrypoint.sh

EXPOSE 80
ENTRYPOINT ["./entrypoint.sh", "/usr/share/nginx/html/template.html", "/usr/share/nginx/html/index.html"]
CMD ["nginx", "-g", "daemon off;"]


