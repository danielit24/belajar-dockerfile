# Setup RabbitMQ 

To set up RabbitMQ with the RabbitMQ Management plugin and create an admin user with a specified password, you can use Docker and Docker Compose. Below are the steps to configure and run RabbitMQ with the necessary settings:

## 1. Project Directory Structure
Create a project directory to contain the necessary configuration files:

```
rabbitmq-setup/
└── docker-compose.yml
```
## 2. docker-compose.yml Configuration
Create a docker-compose.yml file in the rabbitmq-setup directory with the following content. This configuration sets up RabbitMQ with the RabbitMQ Management plugin enabled and creates an admin user with the specified password:

```yaml
version: '3.8'
services:
  rabbitmq:
    image: rabbitmq:management
    container_name: rabbitmq
    environment:
      RABBITMQ_DEFAULT_USER: admin
      RABBITMQ_DEFAULT_PASS: docker_password
      RABBITMQ_DEFAULT_VHOST: /
    ports:
      - "5672:5672"   # RabbitMQ default port
      - "15672:15672" # RabbitMQ Management Plugin port
    volumes:
      - rabbitmq_data:/var/lib/rabbitmq

volumes:
  rabbitmq_data:
    driver: local
```
Explanation of Configuration
- Image: We are using the rabbitmq:management Docker image, which includes RabbitMQ with the Management plugin enabled. This plugin allows you to monitor and manage RabbitMQ using a web-based interface.

- Environment Variables:

    - RABBITMQ_DEFAULT_USER: Sets the default username for RabbitMQ. In this case, it's set to admin.
    - RABBITMQ_DEFAULT_PASS: Sets the default password for RabbitMQ. Here, it's set to docker_password.
    - RABBITMQ_DEFAULT_VHOST: Sets the default virtual host. In this configuration, it uses the default /.
    - Ports:
        - 5672:5672: Maps the RabbitMQ default AMQP port so that applications can connect to the RabbitMQ broker.
        - 15672:15672: Maps the RabbitMQ Management plugin port for accessing the management interface via a web browser.
    - Volumes: rabbitmq_data: A named volume to persist RabbitMQ data.
## 3. Running RabbitMQ with Docker Compose
Navigate to the rabbitmq-setup directory and run the following command to start RabbitMQ with Docker Compose:

```bash
docker-compose up -d
```
This command will start the RabbitMQ container with the specified configuration. The RabbitMQ server will be accessible on port 5672, and the management interface will be accessible on port 15672.

## 4. Accessing RabbitMQ Management Interface
Once the container is running, you can access the RabbitMQ Management interface in your web browser:

Open a web browser and go to http://ip-public-server:15672.

Log in using the credentials:
```
Username: admin
Password: docker_password
```
## Summary
By following these steps, you have set up a RabbitMQ server with the RabbitMQ Management plugin enabled using Docker and Docker Compose. An admin user with the username admin and the password docker_password has been created, allowing you to manage RabbitMQ through the web-based management interface.