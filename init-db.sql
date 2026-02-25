-- Initialize databases for each microservice
CREATE DATABASE product_db;
CREATE DATABASE order_db;
CREATE DATABASE user_db;

-- Grant privileges to ecommerce_user
GRANT ALL PRIVILEGES ON DATABASE product_db TO ecommerce_user;
GRANT ALL PRIVILEGES ON DATABASE order_db TO ecommerce_user;
GRANT ALL PRIVILEGES ON DATABASE user_db TO ecommerce_user;
