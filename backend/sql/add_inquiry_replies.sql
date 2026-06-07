CREATE TABLE IF NOT EXISTS inquiry_replies (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  inquiry_id BIGINT NOT NULL,
  body TEXT NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_inquiry_replies_inquiry FOREIGN KEY (inquiry_id) REFERENCES inquiries(id) ON DELETE CASCADE,
  INDEX idx_inquiry_replies_inquiry_created (inquiry_id, created_at)
);
