# Dockerfile
FROM nginx:latest

# Copy the configuration file
COPY nginx.conf /etc/nginx/conf.d/web.conf

# Copy the HTML file
COPY html /usr/share/nginx/html

# Expose port 80
EXPOSE 80
