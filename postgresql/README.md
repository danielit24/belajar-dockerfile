# PostgreSQL Docker Setup Guide
This guide will walk you through setting up a PostgreSQL database using Docker, including creating users, databases, and tables.

#### 1. Create a Dockerfile
Create a file named Dockerfile with the following content:

```Dockerfile
# Dockerfile
FROM postgres:latest

ENV POSTGRES_PASSWORD=root_password
# Expose port 5432
EXPOSE 5432
```

This Dockerfile uses the latest PostgreSQL image and sets the root password to root_password.

#### 2. Build the Docker Image
To build the Docker image from the Dockerfile, run the following command:

```bash
docker build -t postgres-custom-image .
```
This command will create a Docker image named postgres-custom-image.
#### 3. Run the Docker Image
Run the following command to start a container from the image:

```bash
docker run --name postgres-container -d -p 5432:5432 -v ./data:/var/lib/postgresql/data postgres-custom-image
```
This will run the container in detached mode, map port 5432 on the host to port 5432 on the container, and mount the data directory.

#### 4. Login to the Running Container
To access the PostgreSQL command line inside the running container, use:

```bash
docker exec -it postgres-container psql -U postgres
```
The -U postgres option specifies that you're logging in as the default PostgreSQL superuser.

#### 5. Create Users
Once logged into the PostgreSQL shell, run the following commands to create order_service_user and payment_service_user:

```sql
CREATE USER order_service_user WITH PASSWORD 'rahasia123';
CREATE USER payment_service_user WITH PASSWORD 'rahasia123';
```
These commands will create two users with the specified passwords.

#### 6. Create Databases
Next, create the databases database_1 and database_2:

```sql
CREATE DATABASE database_1;
CREATE DATABASE database_2;
```
#### 7. Grant Access
Grant the necessary privileges to each user for their respective databases:

```sql
\c database_1
GRANT ALL PRIVILEGES ON DATABASE database_1 TO order_service_user;
-- Grant CREATE permission on the public schema to order_service_user
GRANT CREATE ON SCHEMA public TO order_service_user;
\c database_2
GRANT ALL PRIVILEGES ON DATABASE database_2 TO payment_service_user;
-- Grant CREATE permission on the public schema to payment_service_user
GRANT CREATE ON SCHEMA public TO payment_service_user;
```
#### 8. Test Login for order_service_user
Exit the current PostgreSQL session by typing `\q` and then test logging in with the order_service_user:

```bash
docker exec -it postgres-container psql -U order_service_user -d database_1
```
You should be logged in to database_1 using order_service_user.

#### 9. Create Tables in database_1
While logged in to database_1, run the following SQL commands to create the tables:

```sql
CREATE TABLE sales_orders (
    id SERIAL PRIMARY KEY,
    order_number VARCHAR(50),
    order_date DATE
);

CREATE TABLE delivery_order (
    id SERIAL PRIMARY KEY,
    delivery_number VARCHAR(50),
    delivery_date DATE
);
```
#### 10. Create Tables in database_2
Now, log out and log in as payment_service_user:

```bash
docker exec -it postgres-container psql -U payment_service_user -d database_2
```
Create the tables in database_2:

```sql
CREATE TABLE payments (
    id SERIAL PRIMARY KEY,
    payment_date DATE,
    amount NUMERIC(10, 2)
);

CREATE TABLE payment_detail (
    id SERIAL PRIMARY KEY,
    payment_id INT REFERENCES payments(id),
    detail_description TEXT
);
```
This completes the setup and configuration of your PostgreSQL databases using Docker.