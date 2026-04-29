CREATE TABLE IF NOT EXISTS customers (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(120) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS tickets (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  customer_id BIGINT NOT NULL,
  title VARCHAR(120) NOT NULL,
  description TEXT NOT NULL,
  status ENUM('open', 'in_progress', 'closed') NOT NULL DEFAULT 'open',
  priority ENUM('low', 'medium', 'high', 'urgent') NOT NULL DEFAULT 'medium',
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_tickets_customer FOREIGN KEY (customer_id) REFERENCES customers(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS inquiries (
  id BIGINT PRIMARY KEY,
  channel ENUM('naver', 'coupang', 'kakao') NOT NULL,
  customer_name VARCHAR(120) NOT NULL,
  title VARCHAR(255) NOT NULL,
  status ENUM('new', 'progress', 'waiting', 'complete') NOT NULL,
  elapsed_time VARCHAR(50) NOT NULL,
  category VARCHAR(100) NOT NULL,
  product_name VARCHAR(255) NOT NULL,
  order_number VARCHAR(80) NOT NULL,
  ticket_number VARCHAR(80) NOT NULL,
  wait_time VARCHAR(80) NOT NULL,
  customer_initial VARCHAR(10) NOT NULL,
  customer_tier VARCHAR(30) NOT NULL,
  member_id VARCHAR(80) NOT NULL,
  phone VARCHAR(40) NOT NULL,
  email VARCHAR(255) NOT NULL,
  joined_at VARCHAR(30) NOT NULL,
  total_spent VARCHAR(40) NOT NULL,
  total_orders INT NOT NULL,
  purchase_history JSON NOT NULL,
  consult_history JSON NOT NULL,
  conversation JSON NOT NULL,
  ai_draft TEXT NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS store_settings (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  store_name VARCHAR(120) NOT NULL,
  website_url VARCHAR(255) NOT NULL,
  channels JSON NOT NULL,
  response_style ENUM('friendly', 'formal', 'professional') NOT NULL,
  store_policy TEXT NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE INDEX idx_tickets_status ON tickets(status);
CREATE INDEX idx_tickets_priority ON tickets(priority);
CREATE INDEX idx_tickets_customer_id ON tickets(customer_id);
CREATE INDEX idx_inquiries_status ON inquiries(status);
CREATE INDEX idx_store_settings_created_at ON store_settings(created_at);
