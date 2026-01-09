-- Sample E-commerce Database Schema

CREATE TABLE Customers (
    customer_id INT PRIMARY KEY AUTO_INCREMENT,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    phone_number VARCHAR(20),
    address VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE Products (
    product_id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    price DECIMAL(10, 2) NOT NULL,
    stock_quantity INT NOT NULL DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE Orders (
    order_id INT PRIMARY KEY AUTO_INCREMENT,
    customer_id INT NOT NULL,
    order_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    total_amount DECIMAL(10, 2) NOT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'Pending',
    FOREIGN KEY (customer_id) REFERENCES Customers(customer_id)
);

CREATE TABLE Order_Items (
    order_item_id INT PRIMARY KEY AUTO_INCREMENT,
    order_id INT NOT NULL,
    product_id INT NOT NULL,
    quantity INT NOT NULL,
    price_at_order DECIMAL(10, 2) NOT NULL,
    FOREIGN KEY (order_id) REFERENCES Orders(order_id),
    FOREIGN KEY (product_id) REFERENCES Products(product_id)
);
-- Database Fixes and Optimizations

-- 1. Strategic Indexes
-- Indexes for frequently queried columns and foreign keys

-- Index for customer_id in Orders table (already a foreign key, but explicit index can be beneficial)
CREATE INDEX idx_orders_customer_id ON Orders (customer_id);

-- Index for product_id in Order_Items table (already a foreign key, but explicit index can be beneficial)
CREATE INDEX idx_order_items_product_id ON Order_Items (product_id);

-- Index for order_id in Order_Items table (already a foreign key, but explicit index can be beneficial)
CREATE INDEX idx_order_items_order_id ON Order_Items (order_id);

-- Index for email in Customers table for faster lookups
CREATE UNIQUE INDEX idx_customers_email ON Customers (email);

-- Index for product name for search functionality
CREATE INDEX idx_products_name ON Products (name);

-- 2. Data Validation Trigger Example
-- Prevent product stock from going below zero
DELIMITER //
CREATE TRIGGER trg_prevent_negative_stock
BEFORE UPDATE ON Products
FOR EACH ROW
BEGIN
    IF NEW.stock_quantity < 0 THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Stock quantity cannot be negative.';
    END IF;
END;//
DELIMITER ;

-- Note: Connection pooling, caching, backup automation, and query monitoring are typically handled at the application/infrastructure level.
-- Details for these will be provided in the deployment guide.
