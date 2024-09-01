# Redis Docker Setup Guide
#### 1. Create a Dockerfile
You don’t need to create a custom Dockerfile for this setup. You can use the official Redis image as-is. Your Dockerfile can be as simple as:

```Dockerfile
# Dockerfile
FROM redis:latest
```
#### 2. Build the Docker Image
Build the Docker image with the following command:

```bash
docker build -t redis-custom-image .
```
#### 3. Run the Redis Container with Password and Volume Mount
Run the Redis container with the following command, which sets the Redis password and mounts the volume:

```bash
docker run --name redis-container -d -p 6379:6379 -v ./data:/data redis-custom-image redis-server --requirepass docker_password --dir /data
```
## In this command:

**--name redis-container** names the container.

**-d** runs the container in detached mode.

**-p 6379:6379** maps port 6379 on the host to port 6379 on the container.

**-v ./data:/data** mounts the host directory ./data to /data in the container.

**redis-server --requirepass docker_password --dir /data** starts the Redis server with the requirepass option set to docker_password and specifies /data as the directory for persistent data.
#### 4. Accessing Redis with the Password
To connect to your Redis server and authenticate with the password, use the redis-cli command:

```bash
redis-cli -h localhost -p 6379
```
Once connected, authenticate with:

```plaintext
AUTH docker_password
```
#### Summary
Dockerfile: Use the official Redis image, no custom configuration needed.
Build Command: docker build -t redis-custom-image .
Run Command: Includes password configuration and volume mounting.
Volume Mount: -v ./data:/data mounts the ./data directory on the host to /data in the container, ensuring Redis data persists across container restarts.
Password: Set with --requirepass docker_password.
This setup ensures that Redis data is stored in the ./data directory on your host machine, and Redis is secured with a password.