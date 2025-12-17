-- Database: jobmatch (change as needed)
CREATE TABLE IF NOT EXISTS leads (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(191) NOT NULL,
  school VARCHAR(191) NOT NULL,
  phone VARCHAR(50) DEFAULT NULL,
  email VARCHAR(191) DEFAULT NULL,
  consent TINYINT(1) NOT NULL DEFAULT 0,
  consent_text TEXT NOT NULL,
  consented_at DATETIME NOT NULL,
  created_at DATETIME NOT NULL,
  user_agent TEXT DEFAULT NULL,
  ip_address VARCHAR(100) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS lead_answers (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  lead_id INT UNSIGNED NOT NULL,
  question_id VARCHAR(191) NOT NULL,
  answer_value TEXT NOT NULL,
  created_at DATETIME NOT NULL,
  CONSTRAINT fk_lead_answers_lead FOREIGN KEY (lead_id) REFERENCES leads(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE INDEX idx_lead_answers_lead_id ON lead_answers (lead_id);
