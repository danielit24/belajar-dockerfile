# Kafka Cluster with Zookeeper and Topic Creation
## Overview
This project sets up a Kafka cluster with Zookeeper using Docker and Docker Compose. It includes:

- Zookeeper: A service to manage distributed coordination for Kafka.
- Kafka Broker: A Kafka server that will handle message passing.
- Topic Creation: Scripts to create three topics named sales_order, delivery_order, and payment.
## Directory Structure
Create a project directory that will contain the configuration files for Kafka and Zookeeper:

```lua
kafka-cluster/
├── docker-compose.yml
└── create-topics.sh
```
### 1. docker-compose.yml Configuration
Create a docker-compose.yml file inside the kafka-cluster directory with the following content:

```yaml
yaml
Copy code
version: '3'
services:
  zookeeper:
    image: confluentinc/cp-zookeeper:latest
    environment:
      ZOOKEEPER_CLIENT_PORT: 2181
      ZOOKEEPER_TICK_TIME: 2000
    ports:
      - "2181:2181"

  kafka:
    image: confluentinc/cp-kafka:latest
    depends_on:
      - zookeeper
    ports:
      - "9092:9092"
    environment:
      KAFKA_BROKER_ID: 1
      KAFKA_ZOOKEEPER_CONNECT: zookeeper:2181
      KAFKA_ADVERTISED_LISTENERS: PLAINTEXT://localhost:9092
      KAFKA_OFFSETS_TOPIC_REPLICATION_FACTOR: 1
      KAFKA_TRANSACTION_STATE_LOG_MIN_ISR: 1
      KAFKA_TRANSACTION_STATE_LOG_REPLICATION_FACTOR: 1
    command: "sh -c '(/etc/confluent/docker/run &); sleep 5; /scripts/create-topics.sh'"
    volumes:
      - ./create-topics.sh:/scripts/create-topics.sh
```
### 2. Script for Creating Topics
Create a file named create-topics.sh inside the kafka-cluster directory. This script will be used to create the necessary topics (sales_order, delivery_order, and payment):

```bash
#!/bin/bash

# Wait for Kafka to be ready
echo "Waiting for Kafka to be ready..."
cub kafka-ready -b kafka:9092 1 20

# Create topics
echo "Creating topics..."
kafka-topics --create --topic sales_order --bootstrap-server kafka:9092 --replication-factor 1 --partitions 1
kafka-topics --create --topic delivery_order --bootstrap-server kafka:9092 --replication-factor 1 --partitions 1
kafka-topics --create --topic payment --bootstrap-server kafka:9092 --replication-factor 1 --partitions 1

echo "Topics created successfully."
```
Make sure create-topics.sh has execution permissions. You can grant permission using the following command:

```bash
chmod +x create-topics.sh
```

### 3. Running the Kafka Cluster
Now, you can start the Kafka cluster with the following command:

```bash
docker-compose up -d
docker exec -it kafka-kafka-1 bash
cd /scripts
./create-topics.sh
```
This command will:

- Start Zookeeper on port 2181.
- Start Kafka on port 9092.
- Execute the create-topics.sh script to create the three required topics.

### 4. Verification
To verify that the topics have been successfully created, you can use the following command after the cluster is up and running:

```bash
docker exec -it kafka-kafka-1 bash -c "kafka-topics --list --bootstrap-server kafka:9092"
```
You should see the following output:
```
- sales_order
- delivery_order
- payment
```
## Conclusion
By following the steps above, you have successfully set up a Kafka cluster with Zookeeper using Docker and Docker Compose and created three topics (sales_order, delivery_order, and payment). You can now further develop by connecting applications to Kafka to produce and consume messages on these topics.