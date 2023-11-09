FROM nginx:1.24.0
RUN apt update 
RUN apt install -y gcc make pkg-config libmagickwand-dev libpcre3-dev git curl tar gzip gnupg2 ca-certificates zlib1g zlib1g-dev libssl-dev lsb-release debian-archive-keyring > /dev/null 2>&1
RUN curl -sL https://nginx.org/download/nginx-1.24.0.tar.gz | tar xvz -C /tmp
RUN git clone https://github.com/cubicdaiya/ngx_small_light.git /tmp/ngx_small_light
WORKDIR "/tmp/ngx_small_light"
RUN ./setup
WORKDIR "/tmp/nginx-1.24.0"
RUN ./configure --add-dynamic-module=../ngx_small_light --with-compat
RUN make modules
RUN mkdir -p /etc/nginx/modules
RUN cp objs/ngx_http_small_light_module.so /etc/nginx/modules

COPY nginx.conf /etc/nginx/nginx.conf