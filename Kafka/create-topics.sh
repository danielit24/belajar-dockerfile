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
