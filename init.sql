-- init.sql
CREATE DATABASE IF NOT EXISTS portfolio_db;
USE portfolio_db;

-- Table for contact messages
CREATE TABLE IF NOT EXISTS contacts (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(150) NOT NULL,
  email VARCHAR(150) NOT NULL,
  message TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table for portfolio projects
CREATE TABLE IF NOT EXISTS projects (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(200),
  description TEXT,
  image VARCHAR(255),
  link VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert seed rows (idempotent check)
INSERT INTO projects (title, description, image, link)
SELECT 'Cloud Infra Automation', 'Automated infra provisioning with Terraform and CI/CD.', 'images/cloud_infra.svg', '#'
WHERE NOT EXISTS (SELECT 1 FROM projects WHERE title = 'Cloud Infra Automation');

INSERT INTO projects (title, description, image, link)
SELECT 'Real-time Monitoring', 'Monitoring solution using Prometheus & Grafana.', 'images/monitoring.svg', '#'
WHERE NOT EXISTS (SELECT 1 FROM projects WHERE title = 'Real-time Monitoring');

INSERT INTO projects (title, description, image, link)
SELECT 'Serverless App', 'Serverless file processing app on AWS Lambda.','images/serverless.svg', '#'
WHERE NOT EXISTS (SELECT 1 FROM projects WHERE title = 'Serverless App');
