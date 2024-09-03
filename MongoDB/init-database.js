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
