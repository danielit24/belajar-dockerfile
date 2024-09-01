
# MySQL Docker Setup Guide

This guide will walk you through setting up a MySQL database using Docker, including creating users, databases, and tables.

#### 1. Create a Dockerfile
Create a file named Dockerfile with the following content:
```
# Dockerfile
FROM mysql:latest

ENV MYSQL_ROOT_PASSWORD=root_password
# Expose port 3306
EXPOSE 3306
```
This Dockerfile will use the latest MySQL image and set the root password to root_password.

#### 2. Build the Docker Image
To build the Docker image from the Dockerfile, run the following command:
```bash
docker build -t mysql-custom-image .
```
This command will create a Docker image named mysql-custom-image.

#### 3. Run the Docker Image
Run the following command to start a container from the image:

```bash
docker run --name mysql-container -d -p 3306:3306 -v ./data:/var/lib/mysql mysql-custom-image
```

This will run the container in detached mode and map port 3306 on the host to port 3306 on the container.

#### 4. Login to the Running Container
To access the MySQL command line inside the running container, use:

```bash
docker exec -it mysql-container mysql -uroot -proot_password
```

Replace root_password with the actual root password you set in the Dockerfile.

#### 5. Create Users
Once logged into the MySQL shell, run the following commands to create the Order_service_user and Payment_service_user:

```sql
CREATE USER 'Order_service_user'@'%' IDENTIFIED BY 'rahasia123';
CREATE USER 'Payment_service_user'@'%' IDENTIFIED BY 'rahasia123';
```
These commands will create two users with the specified passwords.

#### 6. Create Databases
Next, create the databases Database_1 and Database_2:

```sql
CREATE DATABASE Database_1;
CREATE DATABASE Database_2;
```
#### 7. Grant Access
Grant the necessary privileges to each user for their respective databases:

```sql
GRANT ALL PRIVILEGES ON Database_1.* TO 'Order_service_user'@'%';
GRANT ALL PRIVILEGES ON Database_2.* TO 'Payment_service_user'@'%';
```

#### 8. Test Login for Order_service_user
Exit the current MySQL session by typing `exit` and then test logging in with the Order_service_user:

```bash
docker exec -it mysql-container mysql -uOrder_service_user -prahasia123 Database_1
```
You should be logged in to Database_1 using the Order_service_user.

#### 9. Create Tables in Database_1
While logged in to Database_1, run the following SQL commands to create the tables:

```sql
USE Database_1;
CREATE TABLE Sales_orders (
    id INT AUTO_INCREMENT PRIMARY KEY,
    order_number VARCHAR(50),
    order_date DATE
);

CREATE TABLE Delivery_order (
    id INT AUTO_INCREMENT PRIMARY KEY,
    delivery_number VARCHAR(50),
    delivery_date DATE
);
```
#### 10. Create Tables in Database_2
Now, log out and log in as Payment_service_user:

```bash
docker exec -it mysql-container mysql -uPayment_service_user -prahasia123 Database_2
```
Create the tables in Database_2:
```sql
USE Database_2;
CREATE TABLE Payments (
    id INT AUTO_INCREMENT PRIMARY KEY,
    payment_date DATE,
    amount DECIMAL(10, 2)
);

CREATE TABLE payment_detail (
    id INT AUTO_INCREMENT PRIMARY KEY,
    payment_id INT,
    detail_description TEXT
);
```
This completes the setup and configuration of your MySQL databases using Docker.
