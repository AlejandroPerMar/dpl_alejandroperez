# Tarea Entregable 1 - Unidad 3
### Alejandro Pérez Martín

## Informe: Despliegue de aplicación web con ngx_small_light
El objetivo de esta tarea es desplegar una aplicación web que haga uso del módulo ngx_small_light de Nginx para el procesamiento de imágenes. Se realizará la instalación del módulo, configuración de Nginx, creación de un virtual host, y desarrollo de una aplicación web que permita el tratamiento de imágenes.

## Paso 1: Instalación del módulo ngx_small_light

### 1.1 Instalación de dependencias:

```bash
sudo apt install -y build-essential imagemagick libpcre3 libpcre3-dev libmagickwand-dev
```

### 1.2 Descargar el código fuente del módulo:

```bash
git clone https://github.com/cubicdaiya/ngx_small_light.git
```

### 1.3 Configurar el módulo:

```bash
cd ngx_small_light
./setup
```

## Paso 2: Configuración de Nginx

### 2.1 Editar el archivo de configuración de Nginx:

```bash
sudo nano /etc/nginx/nginx.conf
```

### 2.2 Agregar la carga dinámica del módulo en la sección `http`:

```nginx
load_module modules/ngx_http_small_light_module.so;
```

## Paso 3: Crear Virtual Host

### 3.2 Configuración del Virtual Host:

```nginx
server {
    listen 80;
    server_name  images.alejandroperez.me;

    location /img {
        small_light on;
	small_light_getparam_mode on;
    }

    location ~ small_light[^/]*/(.+)$ {
        set $file $1;
        rewrite ^ /$file;
    }
}

```

### 3.3 Habilitar el sitio y recargar Nginx:

Para eso tendremos que actualizar el archivo /etc/hosts para añadir la dirección a la ip designada.

```bash
sudo systemctl reload nginx
```

## Paso 4: Subir imágenes

### 4.1 Subir las imágenes al directorio especificado en la configuración.
Lo copiamos desde esta dirección ya que lo hemos estructurado primero en docker.

```bash
cp -r /dpl_alejandroperez/ut3/te1/dev/app/src/img /usr/share/nginx/html/images
```

## Paso 5: Desarrollo de la aplicación web

### 5.1 Crear una carpeta para la aplicación web:

```bash
mkdir /usr/share/nginx/html/images
cd /usr/share/nginx/html/images
```

### 5.2 Crear el archivo HTML/Javascript con el formulario y la lógica de generación de imágenes.

Este sería el archivo HTML:

```html
<html>
<head>
    <meta charset="UTF-8">
    <title>Images</title>
    <link rel="stylesheet" href="./css/index.css">
</head>

<body>
    <h1>Nginx + ngx_small_light</h1>
    <form id="data" action="" method="post" class="form">
        <div class="option">
            <label for="size">Size: </label>
            <input type="text" id="size" name="size" value="0" />
        </div>
        <div class="option">
            <label for="border-width">Border Width: </label>
            <input type="text" id="border-width" name="border-width" value="0" />
        </div>
        <div class="option">
            <label for="border-color:">Border Color: </label>
            <input type="color" id="border-color" name="border-color" value="0" />
        </div>
        <div class="option">
            <label for="image-focus">Sharpen Image: </label>
            <input type="text" id="image-focus" name="image-focus" value="0" />
        </div>
        <div class="option">
            <label for="image-blur">Blur Image: </label>
            <input type="text" id="image-blur" name="image-blur" value="0" />
        </div>
        <input class="generate" type="submit" value="Generate">
    </form>
    <ul id="imageList">
    </ul>
    </div>
    <script src="js/script.js"></script>
</body>

</html>
```

Y este el JavaScript:

```js
function handleFormSubmit(event) {
    event.preventDefault();

    const dh = dw = document.getElementById("size").value;

    if (dh > 1) {
        processImages(dh);
    } else {
        alert("The image size must be greater than 1px");
    }
}

function processImages(dh) {
    const table = document.getElementById('imageList');
    table.innerHTML = '';

    const bh = bw = document.getElementById("border-width").value;
    const bc = document.getElementById("border-color").value.slice(1, 7);
    const sharpen = document.getElementById("image-focus").value;
    const blur = document.getElementById("image-blur").value;

    console.log("Size: " + dh);
    console.log("Border Width: " + bw);
    console.log("Border Color: " + bc);
    console.log("Image Focus: " + sharpen);
    console.log("Image Blur: " + blur);

    const numImages = 20;
    const URL_base = "http://10.109.7.20:90/img/";

    for (let i = 1; i <= numImages; i++) {
        const numberWithZero = i.toString().padStart(2, '0');
        const imageURL = `${URL_base}image${numberWithZero}.jpg?dw=${dh}&dh=${dh}&bw=${bw}&bh=${bh}&bc=${bc}&sharpen=${sharpen}&blur=${blur}`;
        const listItem = document.createElement("li");
        const image = document.createElement("img");
        image.src = imageURL;
        listItem.appendChild(image);
        imageList.appendChild(listItem);
    }
}

document.getElementById("data").addEventListener("submit", handleFormSubmit);
```

## Paso 6: Configurar Nginx para utilizar en el virtual host y redirifir a un dominio.

```nginx
server {
	listen 90;	
	root /usr/share/nginx/html/images;
	server_name images.alejandroperez.me;
	index index.html;	
	
	location /img {
		small_light on;
		small_light_getparam_mode on;
	}
	
	location ~ small_light[^/]*/(.+)$ {
		set $file $1;
		rewrite ^ /$file;
	}
}
```

Al hacer todo esto realizariamos la recarga del servicio para poner todo en línea.

```bash
sudo systemctl reload nginx
```

## Dockerizar la aplicación.

Para este apartado lo único que haremos será añadir cuatro archivos para la aplicación.

### Docker_compose

```yaml
version: "3.3"

services:
  web:
    build: .
    container_name: docker_ngx_small_light
    volumes:
      - ./src:/etc/nginx/html 
      - ./default.conf:/etc/nginx/conf.d/default.conf
    ports:
      - 8080:80
      
      
```
### Dockerfile:
```docker
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
```

### Configuración de nginx:

```nginx

user  nginx;
worker_processes  auto;

error_log  /var/log/nginx/error.log notice;
pid        /var/run/nginx.pid;

load_module /etc/nginx/modules/ngx_http_fancyindex_module.so;
load_module /etc/nginx/modules/ngx_http_small_light_module.so;

events {
    worker_connections  1024;
}

http {
    include       /etc/nginx/mime.types;
    default_type  application/octet-stream;

    log_format  main  '$remote_addr - $remote_user [$time_local] "$request" '
                      '$status $body_bytes_sent "$http_referer" '
                      '"$http_user_agent" "$http_x_forwarded_for"';

    access_log  /var/log/nginx/access.log  main;

    sendfile        on;
    #tcp_nopush     on;

    keepalive_timeout  65;

    #gzip  on;

    include /etc/nginx/conf.d/*.conf;
}

```

### Default.conf:

```nginx
server {
    server_name  images.alejandroperez.me;

    location /img {
        small_light on;
	small_light_getparam_mode on;
    }

    location ~ small_light[^/]*/(.+)$ {
        set $file $1;
        rewrite ^ /$file;
    }
}
```