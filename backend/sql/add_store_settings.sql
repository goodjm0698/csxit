CREATE TABLE IF NOT EXISTS store_settings (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  store_name VARCHAR(120) NOT NULL,
  website_url VARCHAR(255) NOT NULL,
  channels JSON NOT NULL,
  response_style ENUM('friendly', 'formal', 'professional') NOT NULL,
  store_policy TEXT NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_store_settings_created_at (created_at)
);
