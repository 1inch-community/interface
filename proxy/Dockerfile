FROM nginx

RUN apt-get update && apt-get install -y gettext-base

COPY nginx.conf /etc/nginx/templates/nginx.conf.template

CMD envsubst '\$TOKEN' < /etc/nginx/templates/nginx.conf.template > /etc/nginx/nginx.conf && nginx -g 'daemon off;'
