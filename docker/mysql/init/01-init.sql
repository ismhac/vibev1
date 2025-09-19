-- Initialize FPT Software Website Database
-- This script runs when the MySQL container starts for the first time

-- Create database if it doesn't exist
CREATE DATABASE IF NOT EXISTS fpt_software_website CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Use the database
USE fpt_software_website;

-- Create users table
CREATE TABLE IF NOT EXISTS users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(255) NOT NULL,
    role ENUM('admin', 'editor', 'viewer') DEFAULT 'viewer',
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Create industries table
CREATE TABLE IF NOT EXISTS industries (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    image_url VARCHAR(500),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Create announcements table
CREATE TABLE IF NOT EXISTS announcements (
    id INT PRIMARY KEY AUTO_INCREMENT,
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    summary VARCHAR(500),
    author VARCHAR(255) NOT NULL,
    category VARCHAR(100) NOT NULL,
    priority ENUM('low', 'medium', 'high') DEFAULT 'medium',
    is_published BOOLEAN DEFAULT FALSE,
    published_at TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    tags JSON,
    image_url VARCHAR(500),
    read_time INT DEFAULT 5
);

-- Create subscriptions table
CREATE TABLE IF NOT EXISTS subscriptions (
    id INT PRIMARY KEY AUTO_INCREMENT,
    full_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    subscribed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Insert sample data
INSERT INTO industries (name, description, image_url) VALUES
('Technology', 'Cutting-edge technology solutions and digital transformation services', 'https://via.placeholder.com/300x200?text=Technology'),
('Healthcare', 'Innovative healthcare technology and medical solutions', 'https://via.placeholder.com/300x200?text=Healthcare'),
('Finance', 'Financial technology and banking solutions', 'https://via.placeholder.com/300x200?text=Finance'),
('Education', 'Educational technology and e-learning platforms', 'https://via.placeholder.com/300x200?text=Education');

INSERT INTO announcements (title, content, summary, author, category, priority, is_published, published_at, tags, image_url, read_time) VALUES
('FPT Software Announces New AI Solutions', 'FPT Software is proud to announce our new suite of AI-powered solutions designed to help businesses transform their operations...', 'FPT Software launches new AI solutions to help businesses transform their operations with cutting-edge artificial intelligence technology.', 'John Smith', 'Company News', 'high', TRUE, NOW(), '["AI", "Technology", "Innovation"]', 'https://via.placeholder.com/400x250?text=AI+Solutions', 5),
('Partnership with Leading Tech Company', 'We are excited to announce our strategic partnership with a leading technology company...', 'FPT Software forms strategic partnership to expand our technology offerings and market reach.', 'Jane Doe', 'Partnerships', 'medium', TRUE, NOW(), '["Partnership", "Technology", "Growth"]', 'https://via.placeholder.com/400x250?text=Partnership', 3),
('New Office Opening in Ho Chi Minh City', 'FPT Software is expanding with a new office in Ho Chi Minh City...', 'FPT Software opens new office in Ho Chi Minh City to better serve our clients in the southern region.', 'Mike Johnson', 'Company News', 'low', TRUE, NOW(), '["Expansion", "Office", "Ho Chi Minh City"]', 'https://via.placeholder.com/400x250?text=New+Office', 2);

-- Create indexes for better performance
CREATE INDEX idx_announcements_published ON announcements(is_published, published_at);
CREATE INDEX idx_announcements_category ON announcements(category);
CREATE INDEX idx_industries_active ON industries(is_active);
CREATE INDEX idx_subscriptions_email ON subscriptions(email);
CREATE INDEX idx_subscriptions_active ON subscriptions(is_active);

-- Grant permissions to the application user
GRANT ALL PRIVILEGES ON fpt_software_website.* TO 'fpt_software_user'@'%';
FLUSH PRIVILEGES;
