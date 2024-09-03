# Nginx Load Balancer dan Web Servers
## Overview
Proyek ini mencakup konfigurasi dan penggunaan tiga kontainer Docker:

- Load Balancer menggunakan Nginx untuk mendistribusikan lalu lintas ke dua webserver.
- Webserver 1 yang menjalankan Nginx dan menampilkan halaman web sederhana.
- Webserver 2 yang juga menjalankan Nginx dan menampilkan halaman web sederhana.

## Struktur Direktori
Berikut adalah struktur direktori proyek ini:

```
.
├── loadbalancer
│   ├── Dockerfile
│   └── nginx.conf
├── webserver1
│   ├── Dockerfile
│   ├── nginx.conf
│   └── html
│       └── index.html
└── webserver2
    ├── Dockerfile
    ├── nginx.conf
    └── html
        └── index.html
```
## 1. Load Balancer dengan Nginx
Dockerfile untuk Load Balancer:

```Dockerfile
# Dockerfile
FROM nginx:latest

# Copy the configuration file
COPY nginx.conf /etc/nginx/conf.d/web.conf

# Expose port 80
EXPOSE 80
```
Konfigurasi Nginx untuk Load Balancer (nginx.conf):

```nginx
upstream webservers {
    server nginx-container:80;
    server nginx2-container:80;
}

server {
    listen 80;

    location / {
        proxy_pass http://webservers;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

## 2. Webserver 1 dengan Nginx
Dockerfile untuk Webserver 1:

```Dockerfile
# Dockerfile
FROM nginx:latest

# Copy the configuration file
COPY nginx.conf /etc/nginx/conf.d/web.conf

# Copy the HTML file
COPY html /usr/share/nginx/html

# Expose port 80
EXPOSE 80
```
Konfigurasi Nginx untuk Webserver 1 (nginx.conf):

```nginx
server {
    listen 80;

    location / {
        root /usr/share/nginx/html;
        index index.html;
    }
}
```
File HTML untuk Webserver 1 (html/index.html):

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Webserver 1</title>
</head>
<body>
    <h1>Webserver 1</h1>
</body>
</html>
```
## 3. Webserver 2 dengan Nginx
Dockerfile untuk Webserver 2:

```Dockerfile
# Dockerfile
FROM nginx:latest

# Copy the configuration file
COPY nginx.conf /etc/nginx/conf.d/web.conf

# Copy the HTML file
COPY html /usr/share/nginx/html

# Expose port 80
EXPOSE 80
```
Konfigurasi Nginx untuk Webserver 2 (nginx.conf):

```nginx
server {
    listen 80;

    location / {
        root /usr/share/nginx/html;
        index index.html;
    }
}
```
File HTML untuk Webserver 2 (html/index.html):

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Webserver 2</title>
</head>
<body>
    <h1>Webserver 2</h1>
</body>
</html>
```
# Langkah-Langkah Menggunakan Docker
### 1. Clone repositori ini dan masuk ke direktori masing-masing service:

```bash
git clone <URL_REPOSITORY>
cd loadbalancer
```
### 2. Bangun Docker image untuk masing-masing service:

```bash
cd loadbalancer
docker build -t nginx-loadbalancer .

cd ../webserver1
docker build -t nginx-webserver1 .

cd ../webserver2
docker build -t nginx-webserver2 .
```
### 3. Jalankan kontainer untuk Webserver 1 dan Webserver 2:

```bash
docker run -d --name nginx-container nginx-webserver1
docker run -d --name nginx2-container nginx-webserver2
```
### 4. Jalankan kontainer untuk Load Balancer:

```bash
docker run -d --name nginx-loadbalancer --link nginx-container --link nginx2-container -p 80:80 nginx-loadbalancer
```

### 5. Uji Konfigurasi:

Buka browser dan arahkan ke http://ip-public-server. Anda akan melihat bahwa halaman akan berganti antara "Webserver 1" dan "Webserver 2" karena load balancer mendistribusikan lalu lintas ke dua server tersebut.

### Kesimpulan
Dengan mengikuti langkah-langkah di atas, Anda berhasil mengatur load balancer Nginx yang mendistribusikan lalu lintas ke dua web server menggunakan Docker. Anda dapat mengembangkan lebih lanjut dengan menambah lebih banyak web server atau mengubah aturan load balancing.