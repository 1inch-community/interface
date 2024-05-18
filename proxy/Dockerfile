FROM nginx

RUN apt-get update && apt-get install -y gettext-base

CMD envsubst '\$TOKEN' < /etc/nginx/templates/nginx.conf.template > /etc/nginx/nginx.conf && nginx -g 'daemon off;'
