-- GIG HUB Database Schema (MySQL)
-- Created: October 2025

CREATE DATABASE IF NOT EXISTS `gig_hub`;
USE `gig_hub`;

-- Drop existing tables if they exist (in reverse order of dependencies)
DROP TABLE IF EXISTS `Reviews`;
DROP TABLE IF EXISTS `Order_deliveries`;
DROP TABLE IF EXISTS `Order_revisions`;
DROP TABLE IF EXISTS `Orders`;
DROP TABLE IF EXISTS `Gigs`;
DROP TABLE IF EXISTS `User_skills`;
DROP TABLE IF EXISTS `User_languages`;
DROP TABLE IF EXISTS `Chat_messages`;
DROP TABLE IF EXISTS `Conversation`;
DROP TABLE IF EXISTS `Categories`;
DROP TABLE IF EXISTS `Languages`;
DROP TABLE IF EXISTS `Users`;

-- Categories
CREATE TABLE `Categories` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `name` VARCHAR(100) NOT NULL UNIQUE,
    `description` TEXT,
    `icon` VARCHAR(100)
);

-- Languages
CREATE TABLE `Languages` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `name` VARCHAR(50) NOT NULL UNIQUE,
    `code` VARCHAR(5) NOT NULL UNIQUE
);

-- Users
CREATE TABLE `Users` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `name` VARCHAR(100) NOT NULL,
    `email` VARCHAR(255) NOT NULL UNIQUE,
    `password` VARCHAR(255) NOT NULL,
    `role` VARCHAR(20) DEFAULT 'user',
    `username` VARCHAR(50) UNIQUE,
    `profile_image` VARCHAR(500),
    `description` TEXT,
    `country` VARCHAR(100),
    `is_online` BOOLEAN DEFAULT FALSE,
    `total_orders_completed` INT DEFAULT 0,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- User skills
CREATE TABLE `User_skills` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `user_id` INT NOT NULL,
    `skill` VARCHAR(100) NOT NULL,
    `level` VARCHAR(20) DEFAULT 'beginner',
    FOREIGN KEY (`user_id`) REFERENCES `Users`(`id`) ON DELETE CASCADE
);

-- User languages (Many-to-Many relationship)
CREATE TABLE `User_languages` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `user_id` INT NOT NULL,
    `language_id` INT NOT NULL,
    `proficiency` VARCHAR(20) DEFAULT 'basic',
    UNIQUE(`user_id`, `language_id`),
    FOREIGN KEY (`user_id`) REFERENCES `Users`(`id`) ON DELETE CASCADE,
    FOREIGN KEY (`language_id`) REFERENCES `Languages`(`id`) ON DELETE CASCADE
);

-- Gigs
CREATE TABLE `Gigs` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `seller_id` INT NOT NULL,
    `title` VARCHAR(200) NOT NULL,
    `description` TEXT NOT NULL,
    `category_id` INT NOT NULL,
    `price` DECIMAL(10,2) NOT NULL,
    `delivery_time` INT NOT NULL,
    `revisions` INT DEFAULT 0,
    `status` VARCHAR(20) DEFAULT 'active',
    `image_url` VARCHAR(500),
    `orders_completed` INT DEFAULT 0,
    `average_rating` DECIMAL(3,2) DEFAULT 0.00,
    `total_reviews` INT DEFAULT 0,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (`seller_id`) REFERENCES `Users`(`id`) ON DELETE CASCADE,
    FOREIGN KEY (`category_id`) REFERENCES `Categories`(`id`)
);

CREATE TABLE `Gig_images` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `gig_id` INT NOT NULL,
    `image_url` VARCHAR(500) NOT NULL,
    FOREIGN KEY (`gig_id`) REFERENCES `Gigs`(`id`) ON DELETE CASCADE
);

-- Orders
CREATE TABLE `Orders` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `gig_id` INT NOT NULL,
    `seller_id` INT NOT NULL,
    `buyer_id` INT NOT NULL,
    `title` VARCHAR(200) NOT NULL,
    `description` TEXT,
    `price` DECIMAL(10,2) NOT NULL,
    `delivery_time` INT NOT NULL,
    `revisions_included` INT DEFAULT 0,
    `revisions_used` INT DEFAULT 0,
    `status` VARCHAR(20) DEFAULT 'pending',
    `delivery_date` TIMESTAMP NULL,
    `completed_at` TIMESTAMP NULL,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (`gig_id`) REFERENCES `Gigs`(`id`),
    FOREIGN KEY (`seller_id`) REFERENCES `Users`(`id`),
    FOREIGN KEY (`buyer_id`) REFERENCES `Users`(`id`)
);

-- Order revisions
CREATE TABLE `Order_revisions` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `order_id` INT NOT NULL,
    `requested_by` INT NOT NULL, -- buyer who requested revision
    `description` TEXT NOT NULL,
    `status` VARCHAR(20) DEFAULT 'pending',
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `delivered_at` TIMESTAMP NULL,
    FOREIGN KEY (`order_id`) REFERENCES `Orders`(`id`) ON DELETE CASCADE,
    FOREIGN KEY (`requested_by`) REFERENCES `Users`(`id`)
);

-- Order deliveries
CREATE TABLE `Order_deliveries` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `order_id` INT NOT NULL,
    `revision_id` INT,
    `message` TEXT,
    `files` JSON,
    `delivered_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (`order_id`) REFERENCES `Orders`(`id`) ON DELETE CASCADE,
    FOREIGN KEY (`revision_id`) REFERENCES `Order_revisions`(`id`)
);

-- Conversation (conversation containers between two users)
CREATE TABLE `Conversation` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `order_id` INT,
    `participant1_id` INT NOT NULL,
    `participant2_id` INT NOT NULL,
    `last_message_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(`participant1_id`, `participant2_id`, `order_id`),
    FOREIGN KEY (`order_id`) REFERENCES `Orders`(`id`),
    FOREIGN KEY (`participant1_id`) REFERENCES `Users`(`id`),
    FOREIGN KEY (`participant2_id`) REFERENCES `Users`(`id`)
);

-- Chat messages (individual messages within chat threads)
CREATE TABLE `Chat_messages` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `thread_id` INT NOT NULL,
    `sender_id` INT NOT NULL,
    `content` TEXT NOT NULL,
    `attachments` JSON,
    `is_read` BOOLEAN DEFAULT FALSE,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (`thread_id`) REFERENCES `Conversation`(`id`) ON DELETE CASCADE,
    FOREIGN KEY (`sender_id`) REFERENCES `Users`(`id`)
);

-- Reviews
CREATE TABLE `Reviews` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `order_id` INT NOT NULL,
    `gig_id` INT NOT NULL,
    `reviewer_id` INT NOT NULL,
    `reviewee_id` INT NOT NULL,
    `reviewer_role` VARCHAR(20) NOT NULL,
    `reviewee_role` VARCHAR(20) NOT NULL,
    `rating` INT NOT NULL,
    `title` VARCHAR(200),
    `content` TEXT NOT NULL,
    `communication_rating` INT,
    `service_quality_rating` INT,
    `delivery_time_rating` INT,
    `is_public` BOOLEAN DEFAULT TRUE,
    `seller_response` TEXT,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    UNIQUE(`order_id`, `reviewer_id`),
    FOREIGN KEY (`order_id`) REFERENCES `Orders`(`id`),
    FOREIGN KEY (`gig_id`) REFERENCES `Gigs`(`id`),
    FOREIGN KEY (`reviewer_id`) REFERENCES `Users`(`id`),
    FOREIGN KEY (`reviewee_id`) REFERENCES `Users`(`id`)
);


-- Mock data --

-- Insert Categories (30 records)
INSERT INTO `Categories` (`name`, `description`, `icon`) VALUES
('Graphic Design', 'Logo design, branding, and visual graphics', 'design-icon.png'),
('Web Development', 'Website creation and web application development', 'web-icon.png'),
('Content Writing', 'Blog posts, articles, and copywriting services', 'writing-icon.png'),
('Digital Marketing', 'SEO, social media marketing, and online advertising', 'marketing-icon.png'),
('Video Editing', 'Video production, editing, and post-production services', 'video-icon.png'),
('Mobile App Development', 'iOS and Android app development', 'mobile-icon.png'),
('Translation Services', 'Language translation and localization', 'translate-icon.png'),
('Voice Over', 'Professional voice recording and narration', 'voice-icon.png'),
('Data Entry', 'Data processing and administrative tasks', 'data-icon.png'),
('Photography', 'Product photography and photo editing', 'photo-icon.png'),
('UI/UX Design', 'User interface and experience design', 'ux-icon.png'),
('Social Media Management', 'Social media content and account management', 'social-icon.png'),
('SEO Services', 'Search engine optimization and ranking', 'seo-icon.png'),
('WordPress Development', 'WordPress themes and plugin development', 'wordpress-icon.png'),
('E-commerce Solutions', 'Online store setup and management', 'ecommerce-icon.png'),
('Illustration', 'Digital and traditional illustration services', 'illustration-icon.png'),
('Animation', '2D and 3D animation services', 'animation-icon.png'),
('Branding Services', 'Brand identity and corporate branding', 'brand-icon.png'),
('Email Marketing', 'Email campaigns and newsletter design', 'email-icon.png'),
('Database Design', 'Database architecture and optimization', 'database-icon.png'),
('API Development', 'REST API and web service development', 'api-icon.png'),
('Machine Learning', 'AI and machine learning solutions', 'ai-icon.png'),
('Cybersecurity', 'Security audits and protection services', 'security-icon.png'),
('Cloud Services', 'Cloud infrastructure and migration', 'cloud-icon.png'),
('Quality Assurance', 'Software testing and QA services', 'qa-icon.png'),
('Technical Writing', 'Documentation and technical content creation', 'tech-writing-icon.png'),
('Game Development', 'Video game design and development', 'game-icon.png'),
('Music Production', 'Audio production and sound design', 'music-icon.png'),
('Virtual Assistant', 'Administrative and personal assistance', 'assistant-icon.png'),
('Legal Services', 'Legal consultation and document preparation', 'legal-icon.png');

-- Insert Languages (30 records)
INSERT INTO `Languages` (`name`, `code`) VALUES
('English', 'EN'),
('Spanish', 'ES'),
('French', 'FR'),
('German', 'DE'),
('Chinese', 'ZH'),
('Japanese', 'JA'),
('Korean', 'KO'),
('Portuguese', 'PT'),
('Italian', 'IT'),
('Russian', 'RU'),
('Arabic', 'AR'),
('Hindi', 'HI'),
('Dutch', 'NL'),
('Swedish', 'SV'),
('Norwegian', 'NO'),
('Danish', 'DA'),
('Finnish', 'FI'),
('Polish', 'PL'),
('Czech', 'CS'),
('Hungarian', 'HU'),
('Turkish', 'TR'),
('Greek', 'EL'),
('Hebrew', 'HE'),
('Thai', 'TH'),
('Vietnamese', 'VI'),
('Indonesian', 'ID'),
('Malay', 'MS'),
('Filipino', 'TL'),
('Ukrainian', 'UK'),
('Bulgarian', 'BG');

-- Insert Users (30 records) with timestamps from 2024-2025
INSERT INTO `Users` (`name`, `email`, `password`, `role`, `username`, `profile_image`, `description`, `country`, `is_online`, `total_orders_completed`, `created_at`, `updated_at`) VALUES
('Alex Johnson', 'alex.johnson@email.com', '$2b$10$encrypted_password_1', 'seller', 'alexdesigner', 'profile1.jpg', 'Professional graphic designer with 5 years experience', 'United States', TRUE, 23, '2024-01-15 10:30:00', '2025-10-01 14:20:00'),
('Maria Garcia', 'maria.garcia@email.com', '$2b$10$encrypted_password_2', 'user', 'mariawriter', 'profile2.jpg', 'Content writer specializing in tech and business', 'Spain', FALSE, 18, '2024-02-20 09:15:00', '2025-09-28 11:45:00'),
('David Chen', 'david.chen@email.com', '$2b$10$encrypted_password_3', 'seller', 'daviddev', 'profile3.jpg', 'Full-stack web developer and app creator', 'Canada', TRUE, 31, '2024-03-10 16:22:00', '2025-10-12 08:30:00'),
('Sophie Martin', 'sophie.martin@email.com', '$2b$10$encrypted_password_4', 'user', 'sophiemarketing', 'profile4.jpg', 'Digital marketing specialist with SEO expertise', 'France', TRUE, 12, '2024-04-05 13:45:00', '2025-10-10 16:15:00'),
('James Wilson', 'james.wilson@email.com', '$2b$10$encrypted_password_5', 'seller', 'jamesvideo', 'profile5.jpg', 'Video editor and motion graphics artist', 'United Kingdom', FALSE, 27, '2024-05-12 11:20:00', '2025-09-25 12:40:00'),
('Emma Brown', 'emma.brown@email.com', '$2b$10$encrypted_password_6', 'user', 'emmaphoto', 'profile6.jpg', 'Professional photographer and photo editor', 'Australia', TRUE, 19, '2024-06-08 14:55:00', '2025-10-08 09:25:00'),
('Luigi Rossi', 'luigi.rossi@email.com', '$2b$10$encrypted_password_7', 'seller', 'luigitranslate', 'profile7.jpg', 'Multilingual translator specializing in European languages', 'Italy', FALSE, 45, '2024-07-03 08:10:00', '2025-10-05 13:50:00'),
('Anna Schmidt', 'anna.schmidt@email.com', '$2b$10$encrypted_password_8', 'user', 'annavoice', 'profile8.jpg', 'Professional voice over artist with studio setup', 'Germany', TRUE, 22, '2024-08-14 15:35:00', '2025-10-03 10:15:00'),
('Ryan Lee', 'ryan.lee@email.com', '$2b$10$encrypted_password_9', 'seller', 'ryanux', 'profile9.jpg', 'UX/UI designer focused on mobile applications', 'South Korea', TRUE, 16, '2024-09-01 12:40:00', '2025-09-30 14:25:00'),
('Isabella Santos', 'isabella.santos@email.com', '$2b$10$encrypted_password_10', 'user', 'isabelladev', 'profile10.jpg', 'WordPress developer and theme creator', 'Brazil', FALSE, 33, '2024-10-22 09:25:00', '2025-10-11 11:20:00'),
('Michael Zhang', 'michael.zhang@email.com', '$2b$10$encrypted_password_11', 'seller', 'michaelai', 'profile11.jpg', 'Machine learning engineer and AI consultant', 'China', TRUE, 8, '2024-11-15 16:45:00', '2025-10-09 15:30:00'),
('Sarah Thompson', 'sarah.thompson@email.com', '$2b$10$encrypted_password_12', 'user', 'sarahdata', 'profile12.jpg', 'Data analyst and business intelligence specialist', 'United States', TRUE, 14, '2024-12-03 13:20:00', '2025-10-07 12:45:00'),
('Ahmed Hassan', 'ahmed.hassan@email.com', '$2b$10$encrypted_password_13', 'seller', 'ahmedcyber', 'profile13.jpg', 'Cybersecurity expert and penetration tester', 'Egypt', FALSE, 21, '2025-01-08 10:15:00', '2025-10-06 09:30:00'),
('Yuki Tanaka', 'yuki.tanaka@email.com', '$2b$10$encrypted_password_14', 'user', 'yukigame', 'profile14.jpg', 'Game developer specializing in indie games', 'Japan', TRUE, 11, '2025-02-14 14:50:00', '2025-10-04 16:20:00'),
('Elena Petrov', 'elena.petrov@email.com', '$2b$10$encrypted_password_15', 'seller', 'elenamusic', 'profile15.jpg', 'Music producer and sound designer', 'Russia', FALSE, 29, '2025-03-20 11:35:00', '2025-10-02 13:15:00'),
('Carlos Rodriguez', 'carlos.rodriguez@email.com', '$2b$10$encrypted_password_16', 'user', 'carlosva', 'profile16.jpg', 'Virtual assistant and project manager', 'Mexico', TRUE, 37, '2025-04-12 15:20:00', '2025-09-29 10:40:00'),
('Lisa Anderson', 'lisa.anderson@email.com', '$2b$10$encrypted_password_17', 'seller', 'lisalegal', 'profile17.jpg', 'Legal consultant specializing in contract law', 'Sweden', TRUE, 13, '2025-05-25 09:40:00', '2025-09-27 14:55:00'),
('Omar Ali', 'omar.ali@email.com', '$2b$10$encrypted_password_18', 'user', 'omarcloud', 'profile18.jpg', 'Cloud architect and DevOps engineer', 'United Arab Emirates', FALSE, 25, '2025-06-18 12:25:00', '2025-09-25 11:30:00'),
('Nina Kowalski', 'nina.kowalski@email.com', '$2b$10$encrypted_password_19', 'seller', 'ninaqa', 'profile19.jpg', 'Quality assurance engineer and test automation specialist', 'Poland', TRUE, 20, '2025-07-10 14:15:00', '2025-09-23 15:45:00'),
('Raj Patel', 'raj.patel@email.com', '$2b$10$encrypted_password_20', 'user', 'rajapi', 'profile20.jpg', 'API developer and backend architect', 'India', TRUE, 17, '2025-08-05 16:30:00', '2025-09-21 12:20:00'),
('Chloe Dubois', 'chloe.dubois@email.com', '$2b$10$encrypted_password_21', 'seller', 'chloeanim', 'profile21.jpg', '2D and 3D animation artist', 'France', FALSE, 24, '2024-01-28 11:45:00', '2025-09-19 13:35:00'),
('Tom Mitchell', 'tom.mitchell@email.com', '$2b$10$encrypted_password_22', 'user', 'tomtech', 'profile22.jpg', 'Technical writer and documentation specialist', 'Australia', TRUE, 15, '2024-03-15 13:10:00', '2025-09-17 10:25:00'),
('Fatima Al-Rashid', 'fatima.rashid@email.com', '$2b$10$encrypted_password_23', 'seller', 'fatimabrand', 'profile23.jpg', 'Brand strategist and corporate identity designer', 'Saudi Arabia', TRUE, 26, '2024-05-07 15:55:00', '2025-09-15 14:10:00'),
('Hans Mueller', 'hans.mueller@email.com', '$2b$10$encrypted_password_24', 'user', 'hansdb', 'profile24.jpg', 'Database administrator and SQL expert', 'Switzerland', FALSE, 32, '2024-07-22 08:40:00', '2025-09-13 11:55:00'),
('Priya Sharma', 'priya.sharma@email.com', '$2b$10$encrypted_password_25', 'seller', 'priyaemail', 'profile25.jpg', 'Email marketing specialist and campaign manager', 'India', TRUE, 19, '2024-09-14 12:20:00', '2025-09-11 15:40:00'),
('Erik Larsson', 'erik.larsson@email.com', '$2b$10$encrypted_password_26', 'user', 'erikiillus', 'profile26.jpg', 'Digital illustrator and concept artist', 'Norway', TRUE, 22, '2024-11-30 14:35:00', '2025-09-09 09:15:00'),
('Mei Wang', 'mei.wang@email.com', '$2b$10$encrypted_password_27', 'seller', 'meiecom', 'profile27.jpg', 'E-commerce specialist and online store developer', 'Singapore', FALSE, 28, '2025-01-25 10:50:00', '2025-09-07 12:50:00'),
('Diego Silva', 'diego.silva@email.com', '$2b$10$encrypted_password_28', 'user', 'diegosocial', 'profile28.jpg', 'Social media manager and content creator', 'Portugal', TRUE, 16, '2025-03-18 16:15:00', '2025-09-05 14:35:00'),
('Olga Ivanova', 'olga.ivanova@email.com', '$2b$10$encrypted_password_29', 'seller', 'olgaseo', 'profile29.jpg', 'SEO specialist and search marketing expert', 'Ukraine', TRUE, 21, '2025-05-12 09:30:00', '2025-09-03 16:25:00'),
('Jake Thompson', 'jake.thompson@email.com', '$2b$10$encrypted_password_30', 'user', 'jakemobile', 'profile30.jpg', 'Mobile app developer for iOS and Android', 'New Zealand', FALSE, 18, '2025-07-08 11:25:00', '2025-09-01 13:20:00');

-- Insert User_skills (30 records)
INSERT INTO `User_skills` (`user_id`, `skill`, `level`) VALUES
(1, 'Adobe Photoshop', 'expert'),
(2, 'Content Writing', 'advanced'),
(3, 'React.js', 'expert'),
(4, 'Google Ads', 'intermediate'),
(5, 'Final Cut Pro', 'advanced'),
(6, 'Photography', 'expert'),
(7, 'Spanish Translation', 'expert'),
(8, 'Voice Acting', 'advanced'),
(9, 'Figma', 'expert'),
(10, 'WordPress', 'expert'),
(11, 'Python', 'advanced'),
(12, 'SQL', 'expert'),
(13, 'Penetration Testing', 'expert'),
(14, 'Unity 3D', 'advanced'),
(15, 'Logic Pro X', 'expert'),
(16, 'Project Management', 'advanced'),
(17, 'Contract Law', 'expert'),
(18, 'AWS', 'advanced'),
(19, 'Selenium', 'expert'),
(20, 'Node.js', 'advanced'),
(21, 'After Effects', 'expert'),
(22, 'Technical Documentation', 'advanced'),
(23, 'Brand Strategy', 'expert'),
(24, 'MySQL', 'expert'),
(25, 'Email Marketing', 'advanced'),
(26, 'Digital Illustration', 'expert'),
(27, 'Shopify', 'advanced'),
(28, 'Social Media Strategy', 'advanced'),
(29, 'SEO Optimization', 'expert'),
(30, 'Swift', 'advanced');

-- Insert User_languages (30 records)
INSERT INTO `User_languages` (`user_id`, `language_id`, `proficiency`) VALUES
(1, 1, 'fluent'),
(2, 2, 'native'),
(3, 1, 'fluent'),
(4, 3, 'native'),
(5, 1, 'fluent'),
(6, 1, 'native'),
(7, 9, 'native'),
(8, 4, 'native'),
(9, 7, 'native'),
(10, 8, 'native'),
(11, 5, 'native'),
(12, 1, 'fluent'),
(13, 11, 'native'),
(14, 6, 'native'),
(15, 10, 'native'),
(16, 2, 'native'),
(17, 15, 'native'),
(18, 11, 'fluent'),
(19, 18, 'native'),
(20, 12, 'fluent'),
(21, 3, 'fluent'),
(22, 1, 'native'),
(23, 11, 'fluent'),
(24, 4, 'fluent'),
(25, 12, 'native'),
(26, 16, 'native'),
(27, 5, 'fluent'),
(28, 8, 'native'),
(29, 29, 'native'),
(30, 1, 'fluent');

-- Insert Gigs (30 records) with timestamps from 2024-2025
INSERT INTO `Gigs` (`seller_id`, `title`, `description`, `category_id`, `price`, `delivery_time`, `revisions`, `status`, `image_url`, `orders_completed`, `average_rating`, `total_reviews`, `created_at`, `updated_at`) VALUES
(1, 'Professional Logo Design', 'I will create a unique and memorable logo for your business', 1, 75.00, 3, 3, 'active', 'logo_gig1.jpg', 15, 4.8, 12, '2024-02-01 09:00:00', '2025-09-15 10:30:00'),
(3, 'Custom WordPress Website', 'I will develop a responsive WordPress website from scratch', 2, 350.00, 7, 2, 'active', 'wordpress_gig1.jpg', 8, 4.9, 6, '2024-03-15 14:20:00', '2025-09-20 11:45:00'),
(2, 'SEO Blog Article Writing', 'I will write engaging SEO-optimized articles for your blog', 3, 25.00, 2, 1, 'active', 'writing_gig1.jpg', 45, 4.7, 38, '2024-04-10 11:15:00', '2025-10-01 15:20:00'),
(4, 'Facebook Ads Campaign Setup', 'I will create and optimize your Facebook advertising campaign', 4, 120.00, 5, 2, 'active', 'facebook_ads_gig1.jpg', 12, 4.6, 9, '2024-05-22 16:30:00', '2025-09-28 14:10:00'),
(5, 'Professional Video Editing', 'I will edit your video with transitions, effects, and color grading', 5, 95.00, 4, 2, 'active', 'video_edit_gig1.jpg', 22, 4.9, 18, '2024-06-08 13:45:00', '2025-10-05 12:25:00'),
(9, 'Mobile App UI/UX Design', 'I will design beautiful and intuitive mobile app interfaces', 11, 200.00, 6, 3, 'active', 'mobile_ui_gig1.jpg', 7, 4.8, 5, '2024-07-12 10:20:00', '2025-09-30 16:40:00'),
(7, 'Document Translation Service', 'I will translate your documents between English and Spanish', 7, 30.00, 2, 1, 'active', 'translation_gig1.jpg', 38, 4.9, 32, '2024-08-05 15:10:00', '2025-10-08 09:15:00'),
(8, 'Professional Voice Over Recording', 'I will provide high-quality voice over for your project', 8, 55.00, 3, 2, 'active', 'voiceover_gig1.jpg', 18, 4.7, 14, '2024-09-18 12:35:00', '2025-10-02 13:50:00'),
(11, 'Machine Learning Model Development', 'I will create custom ML models for your data science needs', 22, 500.00, 10, 1, 'active', 'ml_gig1.jpg', 3, 5.0, 2, '2024-10-25 14:00:00', '2025-09-25 11:30:00'),
(10, 'E-commerce Website on WordPress', 'I will build a complete online store with payment integration', 15, 450.00, 14, 3, 'active', 'ecommerce_gig1.jpg', 5, 4.8, 4, '2024-11-12 09:45:00', '2025-10-10 15:45:00'),
(6, 'Product Photography Session', 'I will photograph your products for e-commerce listings', 10, 85.00, 3, 2, 'active', 'product_photo_gig1.jpg', 25, 4.9, 21, '2024-12-08 11:20:00', '2025-10-12 10:20:00'),
(12, 'Business Data Analysis', 'I will analyze your business data and provide insights', 9, 175.00, 5, 2, 'active', 'data_analysis_gig1.jpg', 9, 4.7, 7, '2025-01-15 16:15:00', '2025-09-18 14:35:00'),
(13, 'Cybersecurity Audit', 'I will perform a comprehensive security assessment', 23, 300.00, 7, 1, 'active', 'security_audit_gig1.jpg', 6, 4.9, 5, '2025-02-20 10:30:00', '2025-10-06 12:15:00'),
(14, 'Indie Game Development', 'I will create a custom 2D indie game for mobile platforms', 27, 800.00, 21, 3, 'active', 'game_dev_gig1.jpg', 2, 4.8, 2, '2025-03-10 13:25:00', '2025-09-12 16:20:00'),
(15, 'Music Production and Mixing', 'I will produce and mix your music track professionally', 28, 180.00, 8, 2, 'active', 'music_production_gig1.jpg', 11, 4.8, 9, '2025-04-05 15:40:00', '2025-10-04 11:10:00'),
(16, 'Virtual Assistant Services', 'I will be your reliable virtual assistant for daily tasks', 29, 15.00, 1, 0, 'active', 'va_services_gig1.jpg', 62, 4.6, 48, '2025-05-18 08:50:00', '2025-10-11 14:25:00'),
(17, 'Legal Document Review', 'I will review and analyze your legal contracts and agreements', 30, 125.00, 3, 1, 'active', 'legal_review_gig1.jpg', 8, 4.9, 6, '2025-06-22 12:15:00', '2025-09-29 15:30:00'),
(18, 'AWS Cloud Migration', 'I will migrate your applications to AWS cloud infrastructure', 24, 600.00, 12, 2, 'active', 'aws_migration_gig1.jpg', 4, 4.9, 3, '2025-07-08 14:30:00', '2025-10-01 13:45:00'),
(19, 'Automated Testing Setup', 'I will implement automated testing for your web application', 25, 250.00, 6, 2, 'active', 'testing_gig1.jpg', 7, 4.7, 5, '2025-08-12 11:45:00', '2025-09-26 12:30:00'),
(20, 'REST API Development', 'I will create robust REST APIs for your application', 21, 275.00, 8, 2, 'active', 'api_dev_gig1.jpg', 9, 4.8, 7, '2025-09-01 16:00:00', '2025-10-09 14:15:00'),
(21, '2D Character Animation', 'I will create smooth 2D character animations for your project', 17, 150.00, 7, 3, 'active', 'animation_gig1.jpg', 6, 4.9, 5, '2024-01-20 10:25:00', '2025-09-22 11:40:00'),
(22, 'Technical Documentation Writing', 'I will write comprehensive technical documentation', 26, 80.00, 4, 2, 'active', 'tech_docs_gig1.jpg', 14, 4.7, 11, '2024-02-28 13:50:00', '2025-10-07 15:55:00'),
(23, 'Brand Identity Package', 'I will create a complete brand identity with logo and guidelines', 18, 325.00, 10, 3, 'active', 'branding_gig1.jpg', 8, 4.8, 6, '2024-04-15 09:30:00', '2025-09-24 10:45:00'),
(24, 'Database Optimization', 'I will optimize your database performance and structure', 20, 200.00, 5, 1, 'active', 'db_optimization_gig1.jpg', 11, 4.9, 9, '2024-06-03 15:20:00', '2025-10-03 12:35:00'),
(25, 'Email Marketing Campaign', 'I will design and set up your email marketing campaign', 19, 90.00, 4, 2, 'active', 'email_campaign_gig1.jpg', 16, 4.6, 13, '2024-07-25 11:40:00', '2025-09-27 14:50:00'),
(26, 'Digital Illustration Commission', 'I will create custom digital illustrations for your project', 16, 65.00, 5, 3, 'active', 'illustration_gig1.jpg', 19, 4.8, 15, '2024-09-10 14:15:00', '2025-10-05 16:10:00'),
(27, 'Shopify Store Setup', 'I will set up and customize your Shopify e-commerce store', 15, 280.00, 6, 2, 'active', 'shopify_gig1.jpg', 12, 4.7, 9, '2024-11-05 12:30:00', '2025-09-19 13:25:00'),
(28, 'Social Media Content Strategy', 'I will create a comprehensive social media content plan', 12, 110.00, 5, 2, 'active', 'social_strategy_gig1.jpg', 13, 4.8, 10, '2025-01-12 16:45:00', '2025-10-08 15:20:00'),
(29, 'Complete SEO Audit', 'I will perform a detailed SEO audit and provide recommendations', 13, 145.00, 6, 1, 'active', 'seo_audit_gig1.jpg', 15, 4.9, 12, '2025-03-28 10:15:00', '2025-09-21 11:55:00'),
(30, 'iOS App Development', 'I will develop a native iOS application from concept to store', 6, 750.00, 18, 3, 'active', 'ios_app_gig1.jpg', 3, 4.8, 2, '2025-05-15 13:20:00', '2025-10-11 09:40:00');

-- Insert Gig_images (30 records) with real online images
INSERT INTO `Gig_images` (`gig_id`, `image_url`) VALUES
(1, 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=800&h=600&fit=crop'), -- Logo Design
(2, 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800&h=600&fit=crop'), -- WordPress Development
(3, 'https://images.unsplash.com/photo-1455390582262-044cdead277a?w=800&h=600&fit=crop'), -- Content Writing
(4, 'https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=800&h=600&fit=crop'), -- Facebook Ads
(5, 'https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?w=800&h=600&fit=crop'), -- Video Editing
(6, 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=800&h=600&fit=crop'), -- Mobile App UI/UX
(7, 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=800&h=600&fit=crop'), -- Translation Services
(8, 'https://images.unsplash.com/photo-1478737270239-2f02b77fc618?w=800&h=600&fit=crop'), -- Voice Over
(9, 'https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=800&h=600&fit=crop'), -- Machine Learning
(10, 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800&h=600&fit=crop'), -- E-commerce Website
(11, 'https://images.unsplash.com/photo-1606983340126-99ab4feaa64a?w=800&h=600&fit=crop'), -- Product Photography
(12, 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=600&fit=crop'), -- Data Analysis
(13, 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=800&h=600&fit=crop'), -- Cybersecurity
(14, 'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=800&h=600&fit=crop'), -- Game Development
(15, 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800&h=600&fit=crop'), -- Music Production
(16, 'https://images.unsplash.com/photo-1586717791821-3f44a563fa4c?w=800&h=600&fit=crop'), -- Virtual Assistant
(17, 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=800&h=600&fit=crop'), -- Legal Services
(18, 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&h=600&fit=crop'), -- AWS Cloud Migration
(19, 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&h=600&fit=crop'), -- Testing Framework
(20, 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800&h=600&fit=crop'), -- API Development
(21, 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit=crop'), -- 2D Animation
(22, 'https://images.unsplash.com/photo-1517180102446-f3ece451e9d8?w=800&h=600&fit=crop'), -- Technical Writing
(23, 'https://images.unsplash.com/photo-1558655146-d09347e92766?w=800&h=600&fit=crop'), -- Brand Identity
(24, 'https://images.unsplash.com/photo-1544383835-bda2bc66a55d?w=800&h=600&fit=crop'), -- Database Design
(25, 'https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=800&h=600&fit=crop'), -- Email Marketing
(26, 'https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=800&h=600&fit=crop'), -- Digital Illustration
(27, 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800&h=600&fit=crop'), -- Shopify Store
(28, 'https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=800&h=600&fit=crop'), -- Social Media Strategy
(29, 'https://images.unsplash.com/photo-1432888622747-4eb9a8efeb07?w=800&h=600&fit=crop'), -- SEO Services
(30, 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=800&h=600&fit=crop'); -- iOS App Development

-- Insert Orders (30 records) with various statuses and timestamps
INSERT INTO `Orders` (`gig_id`, `seller_id`, `buyer_id`, `title`, `description`, `price`, `delivery_time`, `revisions_included`, `revisions_used`, `status`, `delivery_date`, `completed_at`, `created_at`, `updated_at`) VALUES
(1, 1, 2, 'Logo Design for Tech Startup', 'Modern logo design for AI startup company', 75.00, 3, 3, 1, 'completed', '2024-02-05 15:30:00', '2024-02-06 09:15:00', '2024-02-02 10:00:00', '2024-02-06 09:15:00'),
(2, 3, 4, 'WordPress Website for Restaurant', 'Custom restaurant website with online menu', 350.00, 7, 2, 0, 'completed', '2024-03-22 14:45:00', '2024-03-23 11:20:00', '2024-03-15 16:30:00', '2024-03-23 11:20:00'),
(3, 2, 5, 'Blog Articles about Fitness', 'Series of 5 SEO articles about home fitness', 125.00, 5, 1, 0, 'completed', '2024-04-15 12:00:00', '2024-04-16 10:30:00', '2024-04-10 14:20:00', '2024-04-16 10:30:00'),
(4, 4, 6, 'Facebook Ads for E-commerce', 'Setup Facebook advertising campaign for online store', 120.00, 5, 2, 1, 'completed', '2024-05-27 16:20:00', '2024-05-28 13:45:00', '2024-05-22 18:00:00', '2024-05-28 13:45:00'),
(5, 5, 7, 'Wedding Video Editing', 'Professional editing of wedding ceremony footage', 95.00, 4, 2, 0, 'completed', '2024-06-12 11:30:00', '2024-06-13 09:00:00', '2024-06-08 15:45:00', '2024-06-13 09:00:00'),
(6, 9, 8, 'Food Delivery App UI Design', 'Complete UI/UX design for food delivery mobile app', 200.00, 6, 3, 2, 'completed', '2024-07-18 13:15:00', '2024-07-19 16:40:00', '2024-07-12 12:20:00', '2024-07-19 16:40:00'),
(7, 7, 9, 'Legal Document Translation', 'Translate contract from English to Spanish', 30.00, 2, 1, 0, 'completed', '2024-08-07 10:45:00', '2024-08-07 14:20:00', '2024-08-05 17:10:00', '2024-08-07 14:20:00'),
(8, 8, 10, 'Product Demo Voice Over', 'Professional narration for product demonstration video', 55.00, 3, 2, 1, 'completed', '2024-09-21 14:30:00', '2024-09-22 11:15:00', '2024-09-18 16:35:00', '2024-09-22 11:15:00'),
(9, 11, 12, 'Sales Prediction ML Model', 'Machine learning model to predict quarterly sales', 500.00, 10, 1, 0, 'completed', '2024-11-04 16:00:00', '2024-11-05 10:30:00', '2024-10-25 18:00:00', '2024-11-05 10:30:00'),
(10, 10, 13, 'Online Electronics Store', 'Complete e-commerce website for electronics retailer', 450.00, 14, 3, 1, 'completed', '2024-11-26 15:20:00', '2024-11-27 12:45:00', '2024-11-12 11:45:00', '2024-11-27 12:45:00'),
(11, 6, 14, 'Gaming Accessories Photography', 'Product photos for gaming peripheral catalog', 85.00, 3, 2, 0, 'completed', '2024-12-11 13:40:00', '2024-12-12 09:25:00', '2024-12-08 13:20:00', '2024-12-12 09:25:00'),
(12, 12, 15, 'Customer Behavior Analysis', 'Data analysis of customer purchasing patterns', 175.00, 5, 2, 1, 'completed', '2025-01-20 14:15:00', '2025-01-21 11:30:00', '2025-01-15 18:15:00', '2025-01-21 11:30:00'),
(13, 13, 16, 'Network Security Assessment', 'Comprehensive cybersecurity audit for small business', 300.00, 7, 1, 0, 'completed', '2025-02-27 12:30:00', '2025-02-28 15:45:00', '2025-02-20 12:30:00', '2025-02-28 15:45:00'),
(14, 14, 17, 'Puzzle Adventure Game', '2D puzzle game for mobile platforms', 800.00, 21, 3, 2, 'in_progress', NULL, NULL, '2025-03-10 15:25:00', '2025-09-15 14:20:00'),
(15, 15, 18, 'Podcast Intro Music', 'Custom music production for business podcast', 180.00, 8, 2, 0, 'completed', '2025-04-13 16:45:00', '2025-04-14 13:20:00', '2025-04-05 17:40:00', '2025-04-14 13:20:00'),
(16, 16, 19, 'Daily Administrative Tasks', 'Virtual assistant services for real estate agent', 150.00, 10, 0, 0, 'in_progress', NULL, NULL, '2025-05-18 10:50:00', '2025-10-01 16:25:00'),
(17, 17, 20, 'Partnership Agreement Review', 'Legal review of business partnership contract', 125.00, 3, 1, 0, 'completed', '2025-06-25 11:20:00', '2025-06-26 14:35:00', '2025-06-22 14:15:00', '2025-06-26 14:35:00'),
(18, 18, 21, 'E-commerce Platform Migration', 'Migrate online store from Shopify to AWS', 600.00, 12, 2, 1, 'in_progress', NULL, NULL, '2025-07-08 16:30:00', '2025-09-20 13:45:00'),
(19, 19, 22, 'API Testing Framework', 'Automated testing setup for REST API endpoints', 250.00, 6, 2, 0, 'delivered', '2025-08-18 13:25:00', NULL, '2025-08-12 13:45:00', '2025-08-18 13:25:00'),
(20, 20, 23, 'Inventory Management API', 'REST API for warehouse inventory system', 275.00, 8, 2, 1, 'in_progress', NULL, NULL, '2025-09-01 18:00:00', '2025-10-05 14:15:00'),
(21, 21, 24, 'Character Animation for Game', '2D character sprites and animations', 150.00, 7, 3, 1, 'delivered', '2025-01-27 15:30:00', NULL, '2025-01-20 12:25:00', '2025-01-27 15:30:00'),
(22, 22, 25, 'API Documentation', 'Comprehensive technical documentation for REST API', 80.00, 4, 2, 0, 'completed', '2025-03-04 12:45:00', '2025-03-05 10:20:00', '2025-02-28 15:50:00', '2025-03-05 10:20:00'),
(23, 23, 26, 'Fitness Brand Identity', 'Complete branding package for fitness coach', 325.00, 10, 3, 2, 'revision_requested', NULL, NULL, '2025-04-15 11:30:00', '2025-09-10 16:45:00'),
(24, 24, 27, 'Database Performance Tuning', 'Optimize MySQL database for better performance', 200.00, 5, 1, 0, 'completed', '2025-06-08 14:20:00', '2025-06-09 11:45:00', '2025-06-03 17:20:00', '2025-06-09 11:45:00'),
(25, 25, 28, 'Newsletter Campaign Setup', 'Email marketing campaign for product launch', 90.00, 4, 2, 1, 'delivered', '2025-07-29 16:10:00', NULL, '2025-07-25 13:40:00', '2025-07-29 16:10:00'),
(26, 26, 29, 'Book Cover Illustration', 'Fantasy novel cover art and design', 65.00, 5, 3, 0, 'completed', '2025-09-15 13:45:00', '2025-09-16 10:30:00', '2025-09-10 16:15:00', '2025-09-16 10:30:00'),
(27, 27, 30, 'Fashion Boutique Store', 'Shopify store setup for clothing boutique', 280.00, 6, 2, 1, 'in_progress', NULL, NULL, '2025-10-08 12:25:00', '2025-10-08 12:25:00'),,
(28, 28, 1, 'Instagram Content Calendar', 'Social media strategy and content planning', 110.00, 5, 2, 0, 'delivered', '2025-01-17 11:20:00', NULL, '2025-01-12 18:45:00', '2025-01-17 11:20:00'),
(29, 29, 2, 'Website SEO Optimization', 'Complete SEO audit and optimization recommendations', 145.00, 6, 1, 0, 'pending', NULL, NULL, '2025-03-28 12:15:00', '2025-09-21 13:55:00'),
(30, 30, 3, 'Fitness Tracking iOS App', 'Native iOS app for workout tracking', 750.00, 18, 3, 1, 'in_progress', NULL, NULL, '2025-05-15 15:20:00', '2025-10-08 11:40:00');

-- Insert Order_revisions (30 records) with timestamps
INSERT INTO `Order_revisions` (`order_id`, `requested_by`, `description`, `status`, `created_at`, `delivered_at`) VALUES
(1, 2, 'Please make the logo colors more vibrant and modern', 'completed', '2024-02-04 09:30:00', '2024-02-05 14:15:00'),
(2, 4, 'Add a reservation system to the website', 'completed', '2024-03-20 16:45:00', '2024-03-22 13:20:00'),
(3, 5, 'Include more nutrition tips in the articles', 'completed', '2024-04-13 11:20:00', '2024-04-15 10:30:00'),
(4, 6, 'Adjust the target audience demographics', 'completed', '2024-05-25 14:30:00', '2024-05-27 15:45:00'),
(5, 7, 'Add background music to the wedding video', 'completed', '2024-06-10 13:15:00', '2024-06-12 10:20:00'),
(6, 8, 'Modify the checkout flow design', 'completed', '2024-07-16 15:40:00', '2024-07-18 12:30:00'),
(7, 9, 'Clarify some technical terms in translation', 'completed', '2024-08-06 12:45:00', '2024-08-07 09:15:00'),
(8, 10, 'Add more enthusiasm to the voice over', 'completed', '2024-09-20 10:20:00', '2024-09-21 13:45:00'),
(9, 12, 'Include quarterly breakdown in the model', 'completed', '2024-11-02 17:30:00', '2024-11-04 14:45:00'),
(10, 13, 'Add mobile-responsive design elements', 'completed', '2024-11-24 14:20:00', '2024-11-26 13:30:00'),
(11, 14, 'Adjust lighting in product photographs', 'completed', '2024-12-10 11:15:00', '2024-12-11 12:20:00'),
(12, 15, 'Include customer segmentation analysis', 'completed', '2025-01-19 16:30:00', '2025-01-20 13:15:00'),
(13, 16, 'Add network infrastructure recommendations', 'completed', '2025-02-25 13:45:00', '2025-02-27 11:20:00'),
(14, 17, 'Change the game difficulty progression', 'pending', '2025-08-15 14:20:00', NULL),
(15, 18, 'Make the music more upbeat and energetic', 'completed', '2025-04-11 12:30:00', '2025-04-13 15:15:00'),
(16, 19, 'Expand the daily task management features', 'in_progress', '2025-09-20 10:45:00', NULL),
(17, 20, 'Include intellectual property clauses', 'completed', '2025-06-24 15:20:00', '2025-06-25 10:30:00'),
(18, 21, 'Optimize for better performance on AWS', 'in_progress', '2025-09-10 16:15:00', NULL),
(19, 22, 'Add error handling test cases', 'completed', '2025-08-16 11:40:00', '2025-08-18 12:10:00'),
(20, 23, 'Include real-time inventory updates', 'pending', '2025-09-25 14:30:00', NULL),
(21, 24, 'Add idle animations for characters', 'completed', '2025-01-25 13:20:00', '2025-01-27 14:45:00'),
(22, 25, 'Include code examples in documentation', 'completed', '2025-03-02 10:15:00', '2025-03-04 11:30:00'),
(23, 26, 'Adjust the color scheme to be more feminine', 'pending', '2025-09-05 12:40:00', NULL),
(24, 27, 'Add indexing for better query performance', 'completed', '2025-06-06 16:20:00', '2025-06-08 13:15:00'),
(25, 28, 'Include A/B testing recommendations', 'completed', '2025-07-27 14:50:00', '2025-07-29 15:30:00'),
(26, 29, 'Add more magical elements to the cover', 'completed', '2025-09-13 11:30:00', '2025-09-15 12:45:00'),
(27, 30, 'Integrate with Instagram shopping features', 'pending', '2025-10-03 15:20:00', NULL),
(28, 1, 'Focus more on video content strategy', 'completed', '2025-01-15 13:45:00', '2025-01-17 10:20:00'),
(29, 2, 'Include competitor analysis in SEO report', 'pending', '2025-09-18 16:30:00', NULL),
(30, 3, 'Add social sharing features to the app', 'in_progress', '2025-09-22 12:15:00', NULL);

-- Insert Order_deliveries (30 records) with JSON files and timestamps
INSERT INTO `Order_deliveries` (`order_id`, `revision_id`, `message`, `files`, `delivered_at`) VALUES
(1, 1, 'Here is your final logo design with the requested vibrant colors', '["logo_final.ai", "logo_final.png", "logo_variants.pdf"]', '2024-02-05 15:30:00'),
(2, 2, 'WordPress website completed with reservation system integrated', '["website_files.zip", "setup_instructions.pdf", "admin_credentials.txt"]', '2024-03-22 14:45:00'),
(3, 3, 'All 5 fitness articles completed with nutrition tips included', '["article1.docx", "article2.docx", "article3.docx", "article4.docx", "article5.docx"]', '2024-04-15 12:00:00'),
(4, 4, 'Facebook ads campaign setup complete with adjusted demographics', '["campaign_setup.pdf", "ad_creatives.zip", "targeting_report.xlsx"]', '2024-05-27 16:20:00'),
(5, 5, 'Wedding video editing completed with background music', '["wedding_final.mp4", "highlights_reel.mp4", "music_credits.txt"]', '2024-06-12 11:30:00'),
(6, 6, 'Mobile app UI design with improved checkout flow', '["ui_designs.figma", "user_flow.pdf", "design_system.sketch"]', '2024-07-18 13:15:00'),
(7, 7, 'Legal document translation completed with clarifications', '["contract_spanish.pdf", "translation_notes.docx", "glossary.xlsx"]', '2024-08-07 10:45:00'),
(8, 8, 'Product demo voice over with enhanced enthusiasm', '["demo_voiceover.wav", "script_final.pdf", "pronunciation_guide.txt"]', '2024-09-21 14:30:00'),
(9, 9, 'ML model for sales prediction with quarterly breakdown', '["sales_model.py", "model_weights.pkl", "analysis_report.pdf", "quarterly_data.csv"]', '2024-11-04 16:00:00'),
(10, 10, 'E-commerce website with mobile-responsive design', '["website_backup.zip", "theme_files.zip", "mobile_optimizations.pdf"]', '2024-11-26 15:20:00'),
(11, 11, 'Gaming accessories photography with adjusted lighting', '["product_photos.zip", "edited_images.zip", "lighting_setup.pdf"]', '2024-12-11 13:40:00'),
(12, 12, 'Customer behavior analysis with segmentation data', '["analysis_report.xlsx", "customer_segments.csv", "recommendations.pdf"]', '2025-01-20 14:15:00'),
(13, 13, 'Security audit with network infrastructure recommendations', '["security_report.pdf", "vulnerability_scan.xml", "recommendations.docx"]', '2025-02-27 12:30:00'),
(14, NULL, 'Initial game build with basic puzzle mechanics', '["game_build_v1.apk", "source_code.zip", "game_design_doc.pdf"]', '2025-07-20 16:45:00'),
(15, 15, 'Podcast intro music - upbeat and energetic version', '["intro_music.wav", "intro_music.mp3", "stems.zip", "usage_license.pdf"]', '2025-04-13 16:45:00'),
(16, NULL, 'Weekly administrative tasks completed', '["task_summary.pdf", "completed_items.xlsx", "next_week_schedule.docx"]', '2025-10-01 17:30:00'),
(17, 17, 'Partnership agreement review with IP clauses', '["reviewed_contract.pdf", "legal_notes.docx", "suggested_changes.xlsx"]', '2025-06-25 11:20:00'),
(18, NULL, 'Initial migration assessment and plan', '["migration_plan.pdf", "cost_analysis.xlsx", "timeline.docx"]', '2025-08-15 14:20:00'),
(19, 19, 'API testing framework with error handling', '["test_framework.zip", "test_results.html", "documentation.md"]', '2025-08-18 13:25:00'),
(20, NULL, 'API development progress - 70% complete', '["api_documentation.pdf", "endpoint_list.xlsx", "postman_collection.json"]', '2025-10-01 15:30:00'),
(21, 21, '2D character animations with idle states', '["character_sprites.zip", "animation_files.zip", "sprite_sheets.png"]', '2025-01-27 15:30:00'),
(22, 22, 'Technical documentation with code examples', '["api_docs.pdf", "code_examples.zip", "quick_start_guide.md"]', '2025-03-04 12:45:00'),
(23, NULL, 'Initial brand concepts and mood boards', '["brand_concepts.pdf", "mood_boards.zip", "color_palettes.ai"]', '2025-08-20 11:15:00'),
(24, 24, 'Database optimization with improved indexing', '["optimization_report.pdf", "query_performance.xlsx", "schema_changes.sql"]', '2025-06-08 14:20:00'),
(25, 25, 'Email campaign with A/B testing setup', '["campaign_templates.zip", "ab_test_setup.pdf", "analytics_tracking.xlsx"]', '2025-07-29 16:10:00'),
(26, 26, 'Fantasy book cover with enhanced magical elements', '["book_cover_final.pdf", "print_ready.ai", "ebook_version.jpg"]', '2025-09-15 13:45:00'),
(27, NULL, 'Shopify store initial setup completed', '["store_backup.zip", "theme_customizations.zip", "setup_guide.pdf"]', '2025-10-05 16:20:00'),
(28, 28, 'Social media calendar focused on video content', '["content_calendar.xlsx", "video_concepts.pdf", "posting_schedule.docx"]', '2025-01-17 11:20:00'),
(29, NULL, 'SEO audit initial findings and recommendations', '["seo_audit.pdf", "keyword_analysis.xlsx", "technical_issues.docx"]', '2025-09-15 14:30:00'),
(30, NULL, 'iOS app development milestone - core features implemented', '["app_build_v1.ipa", "source_code.zip", "progress_report.pdf"]', '2025-09-01 12:45:00');

-- Insert Conversation (30 records) with timestamps
INSERT INTO `Conversation` (`order_id`, `participant1_id`, `participant2_id`, `last_message_at`, `created_at`) VALUES
(1, 1, 2, '2024-02-06 10:30:00', '2024-02-02 10:15:00'),
(2, 3, 4, '2024-03-23 12:45:00', '2024-03-15 16:45:00'),
(3, 2, 5, '2024-04-16 11:20:00', '2024-04-10 14:35:00'),
(4, 4, 6, '2024-05-28 14:50:00', '2024-05-22 18:15:00'),
(5, 5, 7, '2024-06-13 10:15:00', '2024-06-08 16:00:00'),
(6, 9, 8, '2024-07-19 17:30:00', '2024-07-12 12:35:00'),
(7, 7, 9, '2024-08-07 15:40:00', '2024-08-05 17:25:00'),
(8, 8, 10, '2024-09-22 12:30:00', '2024-09-18 16:50:00'),
(9, 11, 12, '2024-11-05 11:45:00', '2024-10-25 18:15:00'),
(10, 10, 13, '2024-11-27 13:20:00', '2024-11-12 12:00:00'),
(11, 6, 14, '2024-12-12 10:40:00', '2024-12-08 13:35:00'),
(12, 12, 15, '2025-01-21 12:45:00', '2025-01-15 18:30:00'),
(13, 13, 16, '2025-02-28 16:20:00', '2025-02-20 12:45:00'),
(14, 14, 17, '2025-09-16 15:30:00', '2025-03-10 15:40:00'),
(15, 15, 18, '2025-04-14 14:35:00', '2025-04-05 17:55:00'),
(16, 16, 19, '2025-10-02 17:45:00', '2025-05-18 11:05:00'),
(17, 17, 20, '2025-06-26 15:50:00', '2025-06-22 14:30:00'),
(18, 18, 21, '2025-09-21 14:15:00', '2025-07-08 16:45:00'),
(19, 19, 22, '2025-08-18 14:40:00', '2025-08-12 14:00:00'),
(20, 20, 23, '2025-10-06 15:30:00', '2025-09-01 18:15:00'),
(21, 21, 24, '2025-01-28 16:45:00', '2025-01-20 12:40:00'),
(22, 22, 25, '2025-03-05 11:35:00', '2025-02-28 16:05:00'),
(23, 23, 26, '2025-09-11 17:20:00', '2025-04-15 11:45:00'),
(24, 24, 27, '2025-06-09 12:30:00', '2025-06-03 17:35:00'),
(25, 25, 28, '2025-07-30 17:25:00', '2025-07-25 13:55:00'),
(26, 26, 29, '2025-09-16 11:50:00', '2025-09-10 16:30:00'),
(27, 27, 30, '2025-11-05 14:45:00', '2025-10-09 13:40:00'),
(28, 28, 1, '2025-01-18 12:35:00', '2025-01-12 19:00:00'),
(29, 29, 2, '2025-09-22 14:25:00', '2025-03-28 12:30:00'),
(30, 30, 3, '2025-10-09 12:20:00', '2025-05-15 15:35:00');

-- Insert Chat_messages (30 records) with timestamps
INSERT INTO `Chat_messages` (`thread_id`, `sender_id`, `content`, `attachments`, `is_read`, `created_at`) VALUES
(1, 2, 'Hi! I love the initial logo concepts. Could you make the colors more vibrant?', NULL, TRUE, '2024-02-03 14:20:00'),
(2, 4, 'The website looks great! Can we add a reservation system for customers?', NULL, TRUE, '2024-03-18 16:30:00'),
(3, 5, 'These articles are excellent! Could you include more nutrition tips?', NULL, TRUE, '2024-04-12 10:15:00'),
(4, 6, 'Facebook ads are performing well. Let\'s adjust the target demographics slightly.', '["current_performance.pdf"]', TRUE, '2024-05-24 13:45:00'),
(5, 7, 'The video editing is fantastic! Could you add some background music?', NULL, TRUE, '2024-06-09 15:20:00'),
(6, 8, 'Love the UI design! The checkout flow needs a small modification though.', '["checkout_feedback.png"]', TRUE, '2024-07-15 11:30:00'),
(7, 9, 'Translation is perfect! Just need clarification on a few technical terms.', NULL, TRUE, '2024-08-06 09:40:00'),
(8, 10, 'Great voice over work! Could you add a bit more enthusiasm to it?', NULL, TRUE, '2024-09-19 16:25:00'),
(9, 12, 'The ML model looks promising. Can you include quarterly breakdown?', '["data_requirements.xlsx"]', TRUE, '2024-11-01 12:50:00'),
(10, 13, 'Website is coming along nicely. Need to ensure mobile responsiveness.', '["mobile_mockups.pdf"]', TRUE, '2024-11-23 10:35:00'),
(11, 14, 'Product photos look good. The lighting needs slight adjustment.', NULL, TRUE, '2024-12-09 14:45:00'),
(12, 15, 'Data analysis is comprehensive. Add customer segmentation please.', NULL, TRUE, '2025-01-18 11:20:00'),
(13, 16, 'Security audit is thorough. Include network infrastructure recommendations.', NULL, TRUE, '2025-02-24 15:30:00'),
(14, 17, 'Game mechanics are fun! Can we adjust the difficulty progression?', '["gameplay_feedback.mp4"]', FALSE, '2025-08-14 13:15:00'),
(15, 18, 'Music sounds great! Make it more upbeat and energetic please.', NULL, TRUE, '2025-04-10 16:40:00'),
(16, 19, 'Virtual assistant work is excellent. Expand the task management features.', '["task_list.docx"]', FALSE, '2025-09-19 14:20:00'),
(17, 20, 'Contract review is detailed. Add intellectual property clauses.', NULL, TRUE, '2025-06-23 12:15:00'),
(18, 21, 'Migration planning looks good. Optimize for AWS performance.', '["performance_requirements.pdf"]', FALSE, '2025-09-09 17:30:00'),
(19, 22, 'Testing framework is solid. Include error handling test cases.', NULL, TRUE, '2025-08-15 10:25:00'),
(20, 23, 'API development is progressing well. Add real-time inventory updates.', '["api_specs.json"]', FALSE, '2025-09-24 16:45:00'),
(21, 24, 'Character animations are smooth! Add some idle animations too.', NULL, TRUE, '2025-01-24 15:10:00'),
(22, 25, 'Documentation is clear and helpful. Include more code examples.', NULL, TRUE, '2025-03-01 13:40:00'),
(23, 26, 'Brand concepts look professional. Adjust colors to be more feminine.', '["color_preferences.pdf"]', FALSE, '2025-09-04 11:50:00'),
(24, 27, 'Database optimization shows great improvements. Add indexing for better performance.', NULL, TRUE, '2025-06-05 14:35:00'),
(25, 28, 'Email campaign setup is perfect. Include A/B testing recommendations.', NULL, TRUE, '2025-07-26 12:20:00'),
(26, 29, 'Book cover illustration is beautiful! Add more magical elements.', NULL, TRUE, '2025-09-12 16:15:00'),
(27, 30, 'Shopify store setup is great. Integrate with Instagram shopping features.', '["instagram_integration.pdf"]', FALSE, '2025-10-02 13:25:00'),
(28, 1, 'Social media calendar is comprehensive. Focus more on video content.', NULL, TRUE, '2025-01-14 17:50:00'),
(29, 2, 'SEO audit findings are valuable. Include competitor analysis too.', '["competitor_list.xlsx"]', FALSE, '2025-09-17 15:40:00'),
(30, 3, 'iOS app development is impressive! Add social sharing features.', NULL, FALSE, '2025-09-21 11:30:00');

-- Insert Reviews (30 records) with ratings and timestamps
INSERT INTO `Reviews` (`order_id`, `gig_id`, `reviewer_id`, `reviewee_id`, `reviewer_role`, `reviewee_role`, `rating`, `title`, `content`, `communication_rating`, `service_quality_rating`, `delivery_time_rating`, `is_public`, `seller_response`, `created_at`, `updated_at`) VALUES
(1, 1, 2, 1, 'buyer', 'seller', 5, 'Excellent Logo Design!', 'Alex created an amazing logo for our startup. Very professional and responsive to feedback. Highly recommended!', 5, 5, 5, TRUE, 'Thank you so much! It was a pleasure working with you and your team.', '2024-02-07 10:15:00', '2024-02-07 14:30:00'),
(2, 2, 4, 3, 'buyer', 'seller', 5, 'Outstanding WordPress Development', 'David delivered exactly what we needed. The website is fast, responsive, and the reservation system works perfectly.', 5, 5, 4, TRUE, 'I\'m glad the website meets all your requirements. Thanks for the great review!', '2024-03-24 11:20:00', '2024-03-24 16:45:00'),
(3, 3, 5, 2, 'buyer', 'seller', 4, 'Great Content Writing', 'Maria wrote excellent articles with good SEO optimization. Content was well-researched and engaging.', 4, 5, 4, TRUE, 'Thank you! I enjoyed writing about fitness topics. Best of luck with your blog!', '2024-04-17 13:30:00', '2024-04-17 15:20:00'),
(4, 4, 6, 4, 'buyer', 'seller', 4, 'Effective Facebook Ads Setup', 'Sophie set up our Facebook ads campaign professionally. Good targeting and creative suggestions.', 4, 4, 5, TRUE, 'Great working with you! Hope the campaign brings excellent results.', '2024-05-29 12:45:00', '2024-05-29 17:10:00'),
(5, 5, 7, 5, 'buyer', 'seller', 5, 'Perfect Wedding Video', 'James created a beautiful wedding video that captured all the special moments. We\'re thrilled with the result!', 5, 5, 5, TRUE, 'It was an honor to work on such a special project. Congratulations again!', '2024-06-14 14:20:00', '2024-06-14 18:35:00'),
(6, 6, 8, 9, 'buyer', 'seller', 5, 'Brilliant UI/UX Design', 'Ryan\'s mobile app design is intuitive and beautiful. The user flow is excellent and very user-friendly.', 5, 5, 4, TRUE, 'Thank you! User experience is my top priority. Glad you love the design!', '2024-07-20 15:30:00', '2024-07-20 19:45:00'),
(7, 7, 9, 7, 'buyer', 'seller', 5, 'Accurate Translation Service', 'Luigi provided excellent translation with attention to legal terminology. Very professional and timely.', 5, 5, 5, TRUE, 'Legal translations require precision. Happy to deliver quality work!', '2024-08-08 11:40:00', '2024-08-08 16:25:00'),
(8, 8, 10, 8, 'buyer', 'seller', 4, 'Professional Voice Over', 'Anna delivered high-quality voice over with great pronunciation and enthusiasm. Perfect for our demo.', 4, 5, 4, TRUE, 'Thank you! Your script was well-written which made the recording smooth.', '2024-09-23 13:15:00', '2024-09-23 17:40:00'),
(9, 9, 12, 11, 'buyer', 'seller', 5, 'Excellent ML Model', 'Michael created a sophisticated sales prediction model that exceeded our expectations. Great technical expertise!', 5, 5, 4, TRUE, 'Machine learning projects are complex but rewarding. Glad it helps your business!', '2024-11-06 12:30:00', '2024-11-06 16:15:00'),
(10, 10, 13, 10, 'buyer', 'seller', 5, 'Amazing E-commerce Website', 'Isabella built a fantastic online store. Everything works perfectly and looks professional.', 5, 5, 5, TRUE, 'E-commerce is my specialty. Thanks for trusting me with your project!', '2024-11-28 14:45:00', '2024-11-28 18:20:00'),
(11, 11, 14, 6, 'buyer', 'seller', 5, 'Stunning Product Photography', 'Emma took amazing photos of our gaming accessories. The lighting and composition are perfect!', 5, 5, 5, TRUE, 'Product photography is an art. Happy the photos showcase your products well!', '2024-12-13 10:25:00', '2024-12-13 14:50:00'),
(12, 12, 15, 12, 'buyer', 'seller', 4, 'Insightful Data Analysis', 'Sarah provided comprehensive analysis of our customer data with actionable insights.', 4, 5, 4, TRUE, 'Data tells stories. Glad I could help you understand your customers better!', '2025-01-22 15:20:00', '2025-01-22 19:35:00'),
(13, 13, 16, 13, 'buyer', 'seller', 5, 'Thorough Security Audit', 'Ahmed conducted an excellent cybersecurity assessment. Very detailed report with clear recommendations.', 5, 5, 4, TRUE, 'Security is crucial in today\'s digital world. Stay safe and secure!', '2025-03-01 13:40:00', '2025-03-01 17:25:00'),
(14, 14, 17, 14, 'buyer', 'seller', 4, 'Fun Game Development', 'Yuki is creating an engaging puzzle game. The gameplay mechanics are innovative and fun!', 4, 4, 3, TRUE, 'Game development takes time but it\'s worth it. Thanks for your patience!', '2025-08-20 16:15:00', '2025-08-20 20:30:00'),
(15, 15, 18, 15, 'buyer', 'seller', 5, 'Perfect Podcast Music', 'Elena created exactly the right intro music for our podcast. Professional quality and very catchy!', 5, 5, 5, TRUE, 'Music sets the mood for podcasts. Hope your show is a huge success!', '2025-04-15 17:30:00', '2025-04-15 21:45:00'),
(16, 16, 19, 16, 'buyer', 'seller', 4, 'Reliable Virtual Assistant', 'Carlos is handling our administrative tasks efficiently. Very organized and communicative.', 4, 4, 5, TRUE, 'Organization is key to productivity. Happy to support your business!', '2025-09-25 11:50:00', '2025-09-25 16:05:00'),
(17, 17, 20, 17, 'buyer', 'seller', 5, 'Expert Legal Review', 'Lisa provided thorough legal analysis of our partnership agreement. Very knowledgeable and detailed.', 5, 5, 5, TRUE, 'Legal clarity prevents future disputes. Glad I could help!', '2025-06-27 12:35:00', '2025-06-27 16:50:00'),
(18, 18, 21, 18, 'buyer', 'seller', 4, 'AWS Migration Expertise', 'Omar is handling our cloud migration professionally. Good planning and execution so far.', 4, 4, 4, TRUE, 'Cloud migration requires careful planning. We\'re on the right track!', '2025-09-15 14:20:00', '2025-09-15 18:35:00'),
(19, 19, 22, 19, 'buyer', 'seller', 4, 'Solid Testing Framework', 'Nina set up comprehensive automated testing for our API. Well-structured and thorough.', 4, 5, 4, TRUE, 'Quality testing ensures reliable software. Happy to help improve your product!', '2025-08-19 15:45:00', '2025-08-19 19:20:00'),
(20, 20, 23, 20, 'buyer', 'seller', 4, 'Professional API Development', 'Raj is building robust APIs for our system. Good coding practices and documentation.', 4, 4, 4, TRUE, 'Clean code and good documentation make APIs developer-friendly!', '2025-10-03 16:30:00', '2025-10-03 20:45:00'),
(21, 21, 24, 21, 'buyer', 'seller', 5, 'Beautiful Character Animation', 'Chloe created smooth and expressive character animations. Perfect for our game project!', 5, 5, 4, TRUE, 'Character animation brings stories to life. Glad you love the results!', '2025-01-29 13:15:00', '2025-01-29 17:30:00'),
(22, 22, 25, 22, 'buyer', 'seller', 4, 'Clear Technical Documentation', 'Tom wrote excellent technical documentation that\'s easy to understand and follow.', 4, 5, 5, TRUE, 'Good documentation saves time for everyone. Thanks for the feedback!', '2025-03-06 14:40:00', '2025-03-06 18:55:00'),
(23, 23, 26, 23, 'buyer', 'seller', 4, 'Creative Brand Identity', 'Fatima is developing a strong brand identity for our business. Creative and professional approach.', 4, 4, 3, TRUE, 'Brand identity reflects your values. Excited to complete your project!', '2025-09-08 12:25:00', '2025-09-08 16:40:00'),
(24, 24, 27, 24, 'buyer', 'seller', 5, 'Database Optimization Expert', 'Hans significantly improved our database performance. Very knowledgeable and efficient.', 5, 5, 5, TRUE, 'Optimized databases make applications faster. Glad to help improve performance!', '2025-06-10 15:50:00', '2025-06-10 19:25:00'),
(25, 25, 28, 25, 'buyer', 'seller', 4, 'Email Marketing Setup', 'Priya set up our email marketing campaign with good A/B testing strategies.', 4, 4, 4, TRUE, 'Email marketing drives engagement. Hope your campaigns are successful!', '2025-07-31 17:35:00', '2025-07-31 21:10:00'),
(26, 26, 29, 26, 'buyer', 'seller', 5, 'Magical Book Cover Art', 'Erik created a stunning fantasy book cover that perfectly captures the story\'s essence.', 5, 5, 5, TRUE, 'Fantasy art transports readers to magical worlds. Hope your book is a bestseller!', '2025-09-17 14:20:00', '2025-09-17 18:35:00'),
(27, 27, 30, 27, 'buyer', 'seller', 4, 'Shopify Store Development', 'Mei is setting up our Shopify store professionally. Good attention to detail and functionality.', 4, 4, 4, TRUE, 'E-commerce success requires good store setup. Thanks for trusting me!', '2025-10-07 16:45:00', '2025-10-07 20:20:00'),
(28, 28, 1, 28, 'buyer', 'seller', 4, 'Social Media Strategy', 'Diego created a comprehensive social media calendar with great video content ideas.', 4, 4, 5, TRUE, 'Social media builds communities. Hope your content engages your audience!', '2025-01-19 11:30:00', '2025-01-19 15:45:00'),
(29, 29, 2, 29, 'buyer', 'seller', 5, 'Comprehensive SEO Audit', 'Olga provided detailed SEO analysis with actionable recommendations for improvement.', 5, 5, 4, TRUE, 'SEO is essential for online visibility. Implement the recommendations for best results!', '2025-09-20 13:55:00', '2025-09-20 17:40:00'),
(30, 30, 3, 30, 'buyer', 'seller', 4, 'iOS App Development', 'Jake is developing our fitness app with great attention to user experience. Looking forward to completion!', 4, 4, 4, TRUE, 'iOS development requires precision. Thanks for your patience as we build something amazing!', '2025-09-25 15:40:00', '2025-09-25 19:25:00');
