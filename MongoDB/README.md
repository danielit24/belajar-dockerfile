# Setup Mongodb Replica Set
To handle the MongoDB replica set initialization and the subsequent setup of databases, collections, and users in separate steps due to the uncertainty of which node will be the primary, you can follow this approach:

## 1. Create the docker-compose.yml File
```yaml
version: '3.8'
services:
  mongo1:
    image: mongo:latest
    container_name: mongo1
    ports:
      - 27017:27017
    networks:
      - mongo-cluster
    volumes:
      - ./init-replica.js:/docker-entrypoint-initdb.d/init-replica.js:ro
    command: ["mongod", "--replSet", "rs0"]

  mongo2:
    image: mongo:latest
    container_name: mongo2
    ports:
      - 27018:27017
    networks:
      - mongo-cluster
    volumes:
      - ./init-replica.js:/docker-entrypoint-initdb.d/init-replica.js:ro
    command: ["mongod", "--replSet", "rs0"]

  mongo3:
    image: mongo:latest
    container_name: mongo3
    ports:
      - 27019:27017
    networks:
      - mongo-cluster
    volumes:
      - ./init-replica.js:/docker-entrypoint-initdb.d/init-replica.js:ro
    command: ["mongod", "--replSet", "rs0"]

  mongo-setup:
    image: mongo:latest
    depends_on:
      - mongo1
      - mongo2
      - mongo3
    networks:
      - mongo-cluster
    volumes:
      - ./init-databases.js:/docker-entrypoint-initdb.d/init-databases.js:ro
    entrypoint: [
      "sh", "-c",
      "sleep 20 && mongosh --host mongo1:27017 /docker-entrypoint-initdb.d/init-databases.js"
    ]

networks:
  mongo-cluster:
    driver: bridge
```
## 2. Create the Replica Set Initialization Script
Create a file named init-replica.js in the same directory as your docker-compose.yml:

```javascript
// Initialize the replica set
rs.initiate({
  _id: "rs0",
  members: [
    { _id: 0, host: "mongo1:27017" },
    { _id: 1, host: "mongo2:27017" },
    { _id: 2, host: "mongo3:27017" },
  ],
});
```
## 3. Create the Database and User Initialization Script
Create a file named init-databases.js in the same directory:

```javascript
// Create databases
var db1 = db.getSiblingDB("database_1");
var db2 = db.getSiblingDB("database_2");

// Create collections in database_1
db1.createCollection("sales_orders");
db1.createCollection("delivery_orders");

// Create collections in database_2
db2.createCollection("payments");
db2.createCollection("payment_detail");

// Create user for order service with access only to database_1
db1.createUser({
  user: "order_service_user",
  pwd: "password123",
  roles: [{ role: "readWrite", db: "database_1" }],
});

// Create user for payment service with access only to database_2
db2.createUser({
  user: "payment_service_user",
  pwd: "password123",
  roles: [{ role: "readWrite", db: "database_2" }],
});

print("Initialization complete.");
```
## 4. Start the Docker Containers
Navigate to the directory containing your docker-compose.yml file and run:

```bash
docker-compose up -d
```
## 5. Verify the Replica Set Initialization
Connect to one of the MongoDB instances and check the status:

```bash
docker exec -it mongo1 mongosh
```
Run:

```javascript
rs.status();
```
## 6. Verify Database and User Creation
After ensuring that the replica set is properly initialized and a primary has been elected, you can verify the databases and users:

```bash
docker exec -it mongo1 mongosh
```
Then run:

```javascript
// Check the databases
show dbs;

// Check collections in database_1
use database_1;
show collections;

// Check collections in database_2
use database_2;
show collections;

// Check users in database_1
use database_1;
db.getUsers();

// Check users in database_2
use database_2;
db.getUsers();
```

This approach separates the replica set initialization from the setup of databases, collections, and users, ensuring that the latter operations only occur once the replica set is fully operational.