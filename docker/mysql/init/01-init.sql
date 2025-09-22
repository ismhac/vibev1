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
('FPT Software Announces New AI Solutions', 'FPT Software is proud to announce our new suite of AI-powered solutions designed to help businesses transform their operations. Our comprehensive AI platform includes machine learning models, natural language processing, and computer vision capabilities that can be integrated into existing business systems. This breakthrough technology will help companies automate processes, improve decision-making, and enhance customer experiences across various industries.', 'FPT Software launches new AI solutions to help businesses transform their operations with cutting-edge artificial intelligence technology.', 'John Smith', 'Company News', 'high', TRUE, NOW(), '["AI", "Technology", "Innovation"]', 'https://via.placeholder.com/400x250?text=AI+Solutions', 5),
('Partnership with Leading Tech Company', 'We are excited to announce our strategic partnership with a leading technology company that will significantly expand our market reach and technological capabilities. This collaboration will bring together our expertise in software development with their innovative hardware solutions, creating comprehensive technology offerings for our clients worldwide.', 'FPT Software forms strategic partnership to expand our technology offerings and market reach.', 'Jane Doe', 'Partnerships', 'medium', TRUE, NOW(), '["Partnership", "Technology", "Growth"]', 'https://via.placeholder.com/400x250?text=Partnership', 3),
('New Office Opening in Ho Chi Minh City', 'FPT Software is expanding with a new office in Ho Chi Minh City to better serve our growing client base in the southern region. The new facility will house over 200 employees and feature state-of-the-art development centers, meeting rooms, and client collaboration spaces. This expansion reflects our commitment to providing excellent service and support to our clients across Vietnam.', 'FPT Software opens new office in Ho Chi Minh City to better serve our clients in the southern region.', 'Mike Johnson', 'Company News', 'low', TRUE, NOW(), '["Expansion", "Office", "Ho Chi Minh City"]', 'https://via.placeholder.com/400x250?text=New+Office', 2),
('FPT Software Wins Digital Transformation Award', 'FPT Software has been recognized with the prestigious Digital Transformation Award for our outstanding contributions to helping businesses modernize their operations. The award acknowledges our innovative approach to digital solutions and our commitment to delivering measurable results for our clients across various industries.', 'FPT Software receives Digital Transformation Award for innovative digital solutions and client success.', 'Sarah Wilson', 'Awards', 'high', TRUE, NOW() - INTERVAL 2 DAY, '["Award", "Digital Transformation", "Recognition"]', 'https://via.placeholder.com/400x250?text=Digital+Award', 4),
('New Cloud Computing Services Launch', 'We are thrilled to announce the launch of our comprehensive cloud computing services, including infrastructure as a service (IaaS), platform as a service (PaaS), and software as a service (SaaS) solutions. These services are designed to help businesses scale their operations efficiently while reducing costs and improving security.', 'FPT Software launches comprehensive cloud computing services to help businesses scale efficiently.', 'David Chen', 'Product Launch', 'high', TRUE, NOW() - INTERVAL 1 DAY, '["Cloud Computing", "IaaS", "PaaS", "SaaS"]', 'https://via.placeholder.com/400x250?text=Cloud+Services', 6),
('Cybersecurity Solutions Update', 'FPT Software has enhanced our cybersecurity offerings with advanced threat detection, incident response, and compliance management solutions. Our updated security suite provides comprehensive protection against evolving cyber threats and helps organizations maintain regulatory compliance across different industries.', 'FPT Software enhances cybersecurity solutions with advanced threat detection and compliance management.', 'Lisa Park', 'Security', 'medium', TRUE, NOW() - INTERVAL 3 DAY, '["Cybersecurity", "Threat Detection", "Compliance"]', 'https://via.placeholder.com/400x250?text=Cybersecurity', 5),
('Mobile App Development Workshop', 'Join us for an exclusive workshop on mobile app development best practices, featuring hands-on sessions with our expert developers. The workshop will cover cross-platform development, user experience design, and performance optimization techniques that can help you build better mobile applications.', 'FPT Software hosts mobile app development workshop with expert developers and hands-on sessions.', 'Alex Rodriguez', 'Events', 'medium', TRUE, NOW() - INTERVAL 5 DAY, '["Workshop", "Mobile Development", "Training"]', 'https://via.placeholder.com/400x250?text=Mobile+Workshop', 3),
('Blockchain Technology Integration', 'FPT Software is now offering blockchain integration services to help businesses leverage distributed ledger technology for improved transparency, security, and efficiency. Our blockchain solutions can be customized for various use cases including supply chain management, digital identity, and smart contracts.', 'FPT Software introduces blockchain integration services for improved business transparency and security.', 'Maria Garcia', 'Technology', 'medium', TRUE, NOW() - INTERVAL 7 DAY, '["Blockchain", "Distributed Ledger", "Smart Contracts"]', 'https://via.placeholder.com/400x250?text=Blockchain', 7),
('Client Success Story: E-commerce Platform', 'We are proud to share the success story of our client who achieved 300% growth in online sales after implementing our custom e-commerce platform. The solution included advanced analytics, personalized recommendations, and seamless payment integration, resulting in significant business growth and customer satisfaction.', 'Client achieves 300% growth with FPT Software custom e-commerce platform solution.', 'Tom Anderson', 'Success Stories', 'low', TRUE, NOW() - INTERVAL 10 DAY, '["E-commerce", "Success Story", "Growth"]', 'https://via.placeholder.com/400x250?text=E-commerce+Success', 4),
('Data Analytics and Business Intelligence', 'FPT Software has launched new data analytics and business intelligence services to help organizations make data-driven decisions. Our solutions include real-time dashboards, predictive analytics, and machine learning models that can transform raw data into actionable business insights.', 'FPT Software launches data analytics services to help organizations make data-driven decisions.', 'Jennifer Lee', 'Analytics', 'medium', TRUE, NOW() - INTERVAL 12 DAY, '["Data Analytics", "Business Intelligence", "Machine Learning"]', 'https://via.placeholder.com/400x250?text=Data+Analytics', 6),
('Remote Work Solutions Update', 'In response to the changing work environment, FPT Software has updated our remote work solutions to provide better collaboration tools, secure communication platforms, and project management systems. These solutions help teams stay connected and productive regardless of their location.', 'FPT Software updates remote work solutions for better team collaboration and productivity.', 'Robert Kim', 'Remote Work', 'low', TRUE, NOW() - INTERVAL 15 DAY, '["Remote Work", "Collaboration", "Productivity"]', 'https://via.placeholder.com/400x250?text=Remote+Work', 4),
('Sustainability Initiative Launch', 'FPT Software is committed to environmental sustainability and has launched several green technology initiatives. Our sustainable software development practices, energy-efficient data centers, and carbon-neutral operations demonstrate our dedication to protecting the environment while delivering excellent technology solutions.', 'FPT Software launches sustainability initiatives for environmentally responsible technology solutions.', 'Emma Thompson', 'Sustainability', 'medium', TRUE, NOW() - INTERVAL 20 DAY, '["Sustainability", "Green Technology", "Environment"]', 'https://via.placeholder.com/400x250?text=Sustainability', 5);

-- Create indexes for better performance
CREATE INDEX idx_announcements_published ON announcements(is_published, published_at);
CREATE INDEX idx_announcements_category ON announcements(category);
CREATE INDEX idx_industries_active ON industries(is_active);
CREATE INDEX idx_subscriptions_email ON subscriptions(email);
CREATE INDEX idx_subscriptions_active ON subscriptions(is_active);

-- Grant permissions to the application user
GRANT ALL PRIVILEGES ON fpt_software_website.* TO 'fpt_software_user'@'%';
FLUSH PRIVILEGES;
