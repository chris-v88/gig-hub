-- GIG HUB Database Schema (MySQL)
-- Created: October 2025

DROP DATABASE IF EXISTS `gig_hub`;
CREATE DATABASE IF NOT EXISTS `gig_hub`;
USE `gig_hub`;

-- Drop existing tables if they exist (in reverse order of dependencies)
DROP TABLE IF EXISTS `Reviews`;
DROP TABLE IF EXISTS `Order_deliveries`;
DROP TABLE IF EXISTS `Orders`;
DROP TABLE IF EXISTS `Gigs`;
DROP TABLE IF EXISTS `User_certifications`;
DROP TABLE IF EXISTS `User_skills`;
DROP TABLE IF EXISTS `User_languages`;
DROP TABLE IF EXISTS `Chat_messages`;
DROP TABLE IF EXISTS `Chat`;
DROP TABLE IF EXISTS `Subcategories`;
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
    `phone` VARCHAR(20),
    `birthday` DATE,
    `gender` BOOLEAN,
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

-- Subcategories (for detailed gig categorization)
CREATE TABLE `Subcategories` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `category_id` INT NOT NULL,
    `name` VARCHAR(100) NOT NULL,
    `description` TEXT,
    FOREIGN KEY (`category_id`) REFERENCES `Categories`(`id`) ON DELETE CASCADE
);

-- User skills
CREATE TABLE `User_skills` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `user_id` INT NOT NULL,
    `skill` VARCHAR(100) NOT NULL,
    `level` VARCHAR(20) DEFAULT 'beginner',
    FOREIGN KEY (`user_id`) REFERENCES `Users`(`id`) ON DELETE CASCADE
);

-- User certifications
CREATE TABLE `User_certifications` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `user_id` INT NOT NULL,
    `certification` VARCHAR(200) NOT NULL,
    `issuer` VARCHAR(100),
    `issue_date` DATE,
    `expiry_date` DATE,
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
    `short_description` VARCHAR(500),
    `description` TEXT NOT NULL,
    `category_id` INT NOT NULL,
    `subcategory_id` INT,
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
    FOREIGN KEY (`category_id`) REFERENCES `Categories`(`id`),
    FOREIGN KEY (`subcategory_id`) REFERENCES `Subcategories`(`id`)
);

CREATE TABLE `Gig_images` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `gig_id` INT NOT NULL,
    `image_url` VARCHAR(500) NOT NULL,
    FOREIGN KEY (`gig_id`) REFERENCES `Gigs`(`id`) ON DELETE CASCADE
);

-- Orders (Hire Gig)
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
    `hire_date` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `delivery_date` TIMESTAMP NULL,
    `completed` BOOLEAN DEFAULT FALSE,
    `completed_at` TIMESTAMP NULL,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (`gig_id`) REFERENCES `Gigs`(`id`),
    FOREIGN KEY (`seller_id`) REFERENCES `Users`(`id`),
    FOREIGN KEY (`buyer_id`) REFERENCES `Users`(`id`)
);

-- Order deliveries
CREATE TABLE `Order_deliveries` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `order_id` INT NOT NULL,
    `revision_id` INT,
    `message` TEXT,
    `files` JSON,
    `delivered_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (`order_id`) REFERENCES `Orders`(`id`) ON DELETE CASCADE
);

-- Chat (conversation containers between two users)
CREATE TABLE `Chat` (
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
    FOREIGN KEY (`thread_id`) REFERENCES `Chat`(`id`) ON DELETE CASCADE,
    FOREIGN KEY (`sender_id`) REFERENCES `Users`(`id`)
);

-- Reviews (Comments)
CREATE TABLE `Reviews` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `order_id` INT NOT NULL,
    `gig_id` INT NOT NULL,
    `reviewer_id` INT NOT NULL,
    `reviewee_id` INT NOT NULL,
    `reviewer_role` VARCHAR(20) NOT NULL,
    `reviewee_role` VARCHAR(20) NOT NULL,
    `rating` INT NOT NULL CHECK (`rating` >= 1 AND `rating` <= 5),
    `title` VARCHAR(200),
    `content` TEXT NOT NULL,
    `communication_rating` INT CHECK (`communication_rating` >= 1 AND `communication_rating` <= 5),
    `service_quality_rating` INT CHECK (`service_quality_rating` >= 1 AND `service_quality_rating` <= 5),
    `delivery_time_rating` INT CHECK (`delivery_time_rating` >= 1 AND `delivery_time_rating` <= 5),
    `is_public` BOOLEAN DEFAULT TRUE,
    `seller_response` TEXT,
    `review_date` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    UNIQUE(`order_id`, `reviewer_id`),
    FOREIGN KEY (`order_id`) REFERENCES `Orders`(`id`),
    FOREIGN KEY (`gig_id`) REFERENCES `Gigs`(`id`),
    FOREIGN KEY (`reviewer_id`) REFERENCES `Users`(`id`),
    FOREIGN KEY (`reviewee_id`) REFERENCES `Users`(`id`)
);

-- =========================================================
-- INSERT REALISTIC DATA FOR GIG HUB
-- =========================================================

-- =========================================================
-- Categories
-- =========================================================
INSERT INTO `Categories` (`name`, `description`, `icon`)
VALUES
('Graphic Design', 'Logo design, branding, and visual identity projects', 'fa-palette'),
('Web Development', 'Website creation, maintenance, and web app development', 'fa-code'),
('Writing & Translation', 'Copywriting, editing, and translation services', 'fa-pen'),
('Digital Marketing', 'SEO, social media, and email marketing services', 'fa-bullhorn'),
('Video & Animation', 'Video editing, motion graphics, and animation', 'fa-video'),
('Music & Audio', 'Audio production, voiceovers, and sound design', 'fa-music'),
('Programming & Tech', 'Software development, mobile apps, and technical services', 'fa-laptop-code'),
('Business', 'Business consulting, financial planning, and strategy', 'fa-briefcase');

-- =========================================================
-- Subcategories
-- =========================================================
INSERT INTO `Subcategories` (`category_id`, `name`, `description`)
VALUES
(1, 'Logo Design', 'Custom logo creation and branding'),
(1, 'Brand Identity', 'Complete brand identity packages'),
(1, 'Print Design', 'Business cards, flyers, brochures'),
(1, 'Web Design', 'UI/UX design for websites and apps'),
(2, 'Frontend Development', 'React, Vue, Angular development'),
(2, 'Backend Development', 'Node.js, Python, PHP development'),
(2, 'Full Stack Development', 'Complete web application development'),
(2, 'WordPress Development', 'WordPress themes and plugins'),
(3, 'Content Writing', 'Blog posts, articles, copywriting'),
(3, 'Translation Services', 'Document and content translation'),
(3, 'Proofreading & Editing', 'Text editing and proofreading services'),
(4, 'SEO Services', 'Search engine optimization'),
(4, 'Social Media Marketing', 'Social media management and ads'),
(4, 'Google Ads', 'Google advertising campaigns'),
(5, 'Video Editing', 'Professional video editing and post-production'),
(5, '2D Animation', 'Animated graphics and motion design'),
(5, '3D Animation', '3D modeling and animation'),
(6, 'Voice Over', 'Professional voice recording services'),
(6, 'Music Production', 'Beat making and music composition'),
(6, 'Audio Editing', 'Podcast editing and audio enhancement'),
(7, 'Mobile App Development', 'iOS and Android app development'),
(7, 'Game Development', 'Indie game creation and design'),
(7, 'Database Administration', 'Database setup and management'),
(8, 'Business Plan Writing', 'Professional business plan creation'),
(8, 'Market Research', 'Industry analysis and market studies');

-- =========================================================
-- Languages
-- =========================================================
INSERT INTO `Languages` (`name`, `code`)
VALUES
('English', 'en'),
('Spanish', 'es'),
('French', 'fr'),
('German', 'de'),
('Japanese', 'ja'),
('Chinese', 'zh'),
('Portuguese', 'pt'),
('Italian', 'it'),
('Russian', 'ru'),
('Arabic', 'ar');

-- =========================================================
-- Users
-- =========================================================
INSERT INTO `Users` (`name`, `email`, `password`, `phone`, `birthday`, `gender`, `role`, `username`, `profile_image`, `description`, `country`, `is_online`, `total_orders_completed`)
VALUES
('Alice Johnson', 'alice@example.com', 'password1', '+1-555-0101', '1990-05-15', 0, 'seller', 'alice_designs', 'https://randomuser.me/api/portraits/women/45.jpg', 'Graphic designer specializing in logos and brand identity. 5+ years experience working with startups and SMEs.', 'United States', TRUE, 147),
('Mark Evans', 'mark@example.com', 'password2', '+44-20-7946-0958', '1985-03-22', 1, 'buyer', 'mark_evans', 'https://randomuser.me/api/portraits/men/32.jpg', 'Entrepreneur and startup founder looking for creative solutions to grow my business.', 'United Kingdom', FALSE, 23),
('Sophia Lee', 'sophia@example.com', 'password3', '+1-416-555-0199', '1992-11-08', 0, 'seller', 'sophia_webdev', 'https://randomuser.me/api/portraits/women/55.jpg', 'Full-stack web developer with 6 years of experience. Expert in React, Node.js, and cloud deployment.', 'Canada', TRUE, 89),
('Carlos García', 'carlos@example.com', 'password4', '+34-91-123-4567', '1988-07-30', 1, 'buyer', 'carlos_g', 'https://randomuser.me/api/portraits/men/75.jpg', 'Digital marketing manager for a tech startup based in Madrid. Always looking for creative content.', 'Spain', TRUE, 31),
('Emma Tanaka', 'emma@example.com', 'password5', '+81-3-1234-5678', '1995-12-10', 0, 'seller', 'emma_translations', 'https://randomuser.me/api/portraits/women/28.jpg', 'Professional translator (EN/JP/ES) with JLPT N1 certification. Specialized in business and technical content.', 'Japan', FALSE, 76),
('David Miller', 'david@example.com', 'password6', '+1-555-0202', '1987-09-18', 1, 'seller', 'david_video', 'https://randomuser.me/api/portraits/men/67.jpg', 'Video editor and motion graphics designer. Worked on commercials and social media content for 200+ brands.', 'United States', TRUE, 134),
('Maria Silva', 'maria@example.com', 'password7', '+55-11-9876-5432', '1993-02-14', 0, 'seller', 'maria_seo', 'https://randomuser.me/api/portraits/women/82.jpg', 'SEO specialist and digital marketing consultant. Helped 50+ businesses improve their online visibility.', 'Brazil', TRUE, 67),
('Ahmed Hassan', 'ahmed@example.com', 'password8', '+20-10-1234-5678', '1989-12-03', 1, 'seller', 'ahmed_dev', 'https://randomuser.me/api/portraits/men/91.jpg', 'Mobile app developer specializing in Flutter and React Native. Built 30+ apps with 1M+ downloads.', 'Egypt', FALSE, 45),
('Lisa Chen', 'lisa@example.com', 'password9', '+86-138-0013-8000', '1991-06-25', 0, 'buyer', 'lisa_chen', 'https://randomuser.me/api/portraits/women/73.jpg', 'Product manager at a fintech company. Looking for design and development services for our platform.', 'China', TRUE, 18),
('Jean Dubois', 'jean@example.com', 'password10', '+33-1-42-86-83-00', '1986-04-12', 1, 'seller', 'jean_writer', 'https://randomuser.me/api/portraits/men/54.jpg', 'Content writer and copywriter fluent in French and English. 8 years of experience in B2B marketing content.', 'France', TRUE, 92),
('Nina Rodriguez', 'nina@example.com', 'password11', '+52-55-1234-5678', '1994-08-17', 0, 'seller', 'nina_voice', 'https://randomuser.me/api/portraits/women/21.jpg', 'Professional voice over artist and audio producer. Fluent in English and Spanish with a warm, engaging voice perfect for commercials and e-learning.', 'Mexico', TRUE, 38),
('Ryan Thompson', 'ryan@example.com', 'password12', '+1-555-0303', '1991-01-29', 1, 'buyer', 'ryan_startup', 'https://randomuser.me/api/portraits/men/25.jpg', 'Tech entrepreneur and app developer. Currently building a SaaS platform and looking for design and marketing services.', 'United States', FALSE, 15),
('Priya Patel', 'priya@example.com', 'password13', '+91-98765-43210', '1989-11-05', 0, 'seller', 'priya_mobile', 'https://randomuser.me/api/portraits/women/67.jpg', 'Mobile UI/UX designer specializing in iOS and Android apps. Created award-winning designs for fintech and e-commerce applications.', 'India', TRUE, 56),
('Klaus Mueller', 'klaus@example.com', 'password14', '+49-30-12345678', '1983-06-18', 1, 'seller', 'klaus_data', 'https://randomuser.me/api/portraits/men/43.jpg', 'Data scientist and business intelligence consultant. Expert in Python, SQL, and machine learning with 10+ years in analytics.', 'Germany', FALSE, 41),
('Isabella Costa', 'isabella@example.com', 'password15', '+39-06-1234-5678', '1992-03-14', 0, 'buyer', 'isabella_fashion', 'https://randomuser.me/api/portraits/women/39.jpg', 'Fashion brand manager for luxury accessories. Seeking creative designers and social media experts for our upcoming campaigns.', 'Italy', TRUE, 27),
('Hiroshi Yamamoto', 'hiroshi@example.com', 'password16', '+81-90-1234-5678', '1987-09-22', 1, 'seller', 'hiroshi_3d', 'https://randomuser.me/api/portraits/men/78.jpg', '3D artist and game designer with expertise in Blender and Unity. Created assets for indie games and architectural visualizations.', 'Japan', TRUE, 29),
('Sarah Williams', 'sarah@example.com', 'password17', '+1-416-555-0404', '1990-12-08', 0, 'seller', 'sarah_social', 'https://randomuser.me/api/portraits/women/51.jpg', 'Social media strategist and influencer marketing expert. Helped 100+ brands grow their online presence and engagement rates.', 'Canada', TRUE, 73),
('Mohammed Al-Rashid', 'mohammed@example.com', 'password18', '+971-4-123-4567', '1985-04-25', 1, 'buyer', 'mohammed_real_estate', 'https://randomuser.me/api/portraits/men/62.jpg', 'Real estate developer in Dubai. Looking for architectural visualization, marketing materials, and website development services.', 'UAE', FALSE, 12),
('Elena Petrov', 'elena@example.com', 'password19', '+7-495-123-4567', '1993-07-11', 0, 'seller', 'elena_photo', 'https://randomuser.me/api/portraits/women/44.jpg', 'Professional photographer and photo editor. Specialized in product photography, portraits, and event coverage with advanced Photoshop skills.', 'Russia', TRUE, 64),
('Lucas Santos', 'lucas@example.com', 'password20', '+55-21-9876-5432', '1988-10-03', 1, 'seller', 'lucas_backend', 'https://randomuser.me/api/portraits/men/35.jpg', 'Backend developer specializing in microservices and cloud architecture. Expert in Java, Spring Boot, and AWS with enterprise experience.', 'Brazil', TRUE, 47);

-- =========================================================
-- User Skills
-- =========================================================
INSERT INTO `User_skills` (`user_id`, `skill`, `level`)
VALUES
(1, 'Adobe Illustrator', 'expert'),
(1, 'Adobe Photoshop', 'advanced'),
(1, 'Brand Strategy', 'advanced'),
(1, 'Logo Design', 'expert'),
(3, 'JavaScript', 'expert'),
(3, 'React.js', 'expert'),
(3, 'Node.js', 'advanced'),
(3, 'MongoDB', 'advanced'),
(3, 'AWS', 'intermediate'),
(5, 'English to Japanese Translation', 'expert'),
(5, 'Spanish Translation', 'advanced'),
(5, 'Technical Writing', 'advanced'),
(6, 'Adobe Premiere Pro', 'expert'),
(6, 'After Effects', 'advanced'),
(6, 'Final Cut Pro', 'intermediate'),
(7, 'SEO Optimization', 'expert'),
(7, 'Google Analytics', 'advanced'),
(7, 'Content Marketing', 'advanced'),
(8, 'Flutter', 'expert'),
(8, 'React Native', 'advanced'),
(8, 'Firebase', 'advanced'),
(10, 'Content Writing', 'expert'),
(10, 'Copywriting', 'advanced'),
(10, 'French Language', 'native'),
(11, 'Voice Over', 'expert'),
(11, 'Audio Production', 'advanced'),
(11, 'Spanish Language', 'native'),
(13, 'UI Design', 'expert'),
(13, 'UX Design', 'advanced'),
(13, 'Figma', 'expert'),
(14, 'Python', 'expert'),
(14, 'SQL', 'expert'),
(14, 'Machine Learning', 'advanced'),
(16, 'Blender', 'expert'),
(16, '3D Modeling', 'expert'),
(16, 'Unity', 'advanced'),
(17, 'Social Media Strategy', 'expert'),
(17, 'Instagram Marketing', 'advanced'),
(17, 'Content Planning', 'advanced'),
(19, 'Photography', 'expert'),
(19, 'Photo Editing', 'expert'),
(19, 'Adobe Lightroom', 'advanced'),
(20, 'Java', 'expert'),
(20, 'Spring Boot', 'advanced'),
(20, 'Microservices', 'advanced');

-- =========================================================
-- User Certifications
-- =========================================================
INSERT INTO `User_certifications` (`user_id`, `certification`, `issuer`, `issue_date`, `expiry_date`)
VALUES
(1, 'Adobe Certified Expert - Illustrator', 'Adobe Inc.', '2023-06-15', '2025-06-15'),
(1, 'Google UX Design Certificate', 'Google', '2022-11-20', NULL),
(3, 'AWS Certified Developer', 'Amazon Web Services', '2024-01-10', '2027-01-10'),
(3, 'React Developer Certification', 'Meta', '2023-09-05', NULL),
(5, 'JLPT N1 Certificate', 'Japan Foundation', '2021-07-12', NULL),
(5, 'Professional Translation Certification', 'ATA', '2022-03-15', '2025-03-15'),
(6, 'Adobe Certified Expert - Premiere Pro', 'Adobe Inc.', '2023-08-20', '2025-08-20'),
(7, 'Google Analytics Certified', 'Google', '2024-02-28', '2025-02-28'),
(7, 'HubSpot Content Marketing Certified', 'HubSpot', '2023-12-10', '2024-12-10'),
(8, 'Google Associate Android Developer', 'Google', '2023-04-18', NULL),
(10, 'HubSpot Content Marketing Certified', 'HubSpot', '2023-07-22', '2024-07-22'),
(13, 'Google UX Design Professional Certificate', 'Google', '2023-05-10', NULL),
(13, 'Adobe Certified Expert - XD', 'Adobe Inc.', '2024-03-15', '2026-03-15'),
(14, 'Microsoft Certified: Azure Data Scientist Associate', 'Microsoft', '2023-11-20', '2025-11-20'),
(16, 'Blender Certified Trainer', 'Blender Foundation', '2023-02-28', NULL),
(17, 'Facebook Social Media Marketing Professional Certificate', 'Meta', '2024-01-15', NULL),
(19, 'Adobe Certified Expert - Photoshop', 'Adobe Inc.', '2022-09-10', '2024-09-10'),
(20, 'Oracle Certified Professional Java SE 11 Developer', 'Oracle', '2023-06-30', NULL);

-- =========================================================
-- User Languages
-- =========================================================
INSERT INTO `User_languages` (`user_id`, `language_id`, `proficiency`)
VALUES
(1, 1, 'native'),
(2, 1, 'native'),
(3, 1, 'fluent'),
(3, 2, 'basic'),
(4, 2, 'native'),
(4, 1, 'fluent'),
(5, 1, 'fluent'),
(5, 5, 'native'),
(5, 2, 'advanced'),
(6, 1, 'native'),
(7, 1, 'advanced'),
(7, 2, 'native'),
(7, 7, 'native'),
(8, 1, 'fluent'),
(8, 10, 'native'),
(9, 6, 'native'),
(9, 1, 'advanced'),
(10, 3, 'native'),
(10, 1, 'fluent'),
(11, 2, 'native'),
(11, 1, 'advanced'),
(12, 1, 'native'),
(13, 1, 'advanced'),
(14, 4, 'native'),
(14, 1, 'fluent'),
(15, 8, 'native'),
(15, 1, 'advanced'),
(16, 5, 'native'),
(16, 1, 'fluent'),
(17, 1, 'native'),
(18, 10, 'native'),
(18, 1, 'fluent'),
(19, 9, 'native'),
(19, 1, 'advanced'),
(20, 7, 'native'),
(20, 1, 'fluent');

-- =========================================================
-- Gigs
-- =========================================================
INSERT INTO `Gigs` (`seller_id`, `title`, `short_description`, `description`, `category_id`, `subcategory_id`, `price`, `delivery_time`, `revisions`, `status`, `image_url`, `orders_completed`, `average_rating`, `total_reviews`)
VALUES
(1, 'I will design a professional logo for your brand', 'Custom logo design with unlimited revisions until satisfaction', 'High-quality custom logo design with unlimited revisions until satisfaction. I specialize in modern, clean designs that represent your brand perfectly. You will receive: Vector files (AI, EPS), High-res PNG/JPG files, Brand guidelines PDF, and full commercial rights.', 1, 1, 75.00, 3, -1, 'active', 'https://images.unsplash.com/photo-1581291518857-4e27b48ff24e', 89, 4.9, 67),
(1, 'I will create a complete brand identity package', 'Logo + business cards + letterhead + brand guidelines', 'Complete branding solution for your business including logo design, business card design, letterhead, email signature, and comprehensive brand guidelines. Perfect for startups and small businesses looking to establish a professional brand presence.', 1, 2, 299.00, 7, 3, 'active', 'https://images.unsplash.com/photo-1498050108023-c5249f4df085', 23, 4.8, 19),
(3, 'I will build a responsive React website', 'Modern React websites with Node.js backend', 'Professional, fast, and SEO-friendly websites built with React and Node.js. Includes responsive design, clean code, deployment setup, and 30 days of free support. Perfect for businesses, portfolios, and e-commerce sites.', 2, 5, 450.00, 10, 2, 'active', 'https://images.unsplash.com/photo-1517430816045-df4b7de11d1d', 35, 4.9, 28),
(3, 'I will create a custom WordPress website', 'Professional WordPress site with custom theme', 'Custom WordPress website with responsive design, SEO optimization, contact forms, and admin training. Includes premium theme customization, plugin setup, and security configuration.', 2, 8, 280.00, 7, 2, 'active', 'https://images.unsplash.com/photo-1547658719-da2b51169166', 41, 4.7, 33),
(5, 'I will translate English or Spanish text into Japanese', 'Professional EN/ES to Japanese translation by native speaker', 'Accurate, context-aware translations for business, web, or creative content. Native Japanese speaker with JLPT N1 certification and 5+ years of professional translation experience. Specialized in technical, business, and marketing content.', 3, 10, 0.08, 3, 1, 'active', 'https://images.unsplash.com/photo-1507842217343-583bb7270b66', 45, 4.8, 38),
(5, 'I will write engaging blog content in English', 'SEO-optimized blog posts and articles', 'Professional content writing service for blogs, websites, and marketing materials. SEO-optimized, well-researched articles that engage your audience and drive traffic. Includes keyword research and meta descriptions.', 3, 9, 25.00, 2, 2, 'active', 'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d', 67, 4.6, 52),
(6, 'I will edit your promotional video professionally', 'High-quality video editing with motion graphics', 'Professional video editing service including color correction, audio enhancement, motion graphics, and custom animations. Perfect for promotional videos, social media content, and YouTube channels.', 5, 15, 120.00, 5, 3, 'active', 'https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d', 78, 4.9, 61),
(6, 'I will create a 2D animated explainer video', 'Custom 2D animation for business explanation', 'Professional 2D animated explainer video to showcase your product or service. Includes script writing, voiceover coordination, custom illustrations, and background music. Perfect for marketing and educational content.', 5, 16, 350.00, 10, 2, 'active', 'https://images.unsplash.com/photo-1626544804353-c4e9e3a90fc7', 22, 4.8, 18),
(7, 'I will optimize your website for search engines', 'Complete SEO audit and optimization service', 'Comprehensive SEO service including technical audit, keyword research, on-page optimization, content recommendations, and monthly progress reports. Proven track record of improving search rankings for 50+ websites.', 4, 12, 180.00, 14, 1, 'active', 'https://images.unsplash.com/photo-1432888498266-38ffec3eaf0a', 34, 4.7, 29),
(7, 'I will manage your social media accounts', 'Professional social media management and content creation', 'Complete social media management including content creation, posting schedule, engagement monitoring, and monthly analytics reports. Covers Facebook, Instagram, Twitter, and LinkedIn.', 4, 13, 250.00, 30, 2, 'active', 'https://images.unsplash.com/photo-1611224923853-80b023f02d71', 28, 4.6, 23),
(8, 'I will develop a cross-platform mobile app', 'Flutter/React Native app development', 'Professional mobile app development using Flutter or React Native. Includes UI/UX design, backend integration, testing, and app store deployment. Perfect for startups and businesses looking to reach mobile users.', 7, 21, 800.00, 21, 2, 'active', 'https://images.unsplash.com/photo-1551650975-87deedd944c3', 18, 4.9, 15),
(8, 'I will create a simple mobile game', 'Indie mobile game development', 'Custom mobile game development for iOS and Android. Includes game design, programming, graphics integration, and basic monetization setup. Perfect for simple puzzle, arcade, or educational games.', 7, 22, 600.00, 28, 3, 'active', 'https://images.unsplash.com/photo-1550745165-9bc0b252726f', 12, 4.5, 10),
(10, 'I will write compelling copy for your website', 'Professional copywriting for landing pages and websites', 'Persuasive copywriting that converts visitors into customers. Includes homepage copy, about page, service descriptions, and call-to-action optimization. Specialized in B2B and SaaS companies.', 3, 9, 150.00, 5, 2, 'active', 'https://images.unsplash.com/photo-1455390582262-044cdead277a', 43, 4.7, 35),
(10, 'I will create a comprehensive business plan', 'Professional business plan writing service', 'Detailed business plan including executive summary, market analysis, financial projections, and investor-ready presentation. Perfect for startups seeking funding or established businesses planning expansion.', 8, 24, 400.00, 10, 2, 'active', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d', 15, 4.8, 12),
(11, 'I will record professional voice over in English and Spanish', 'Bilingual voice over for commercials and e-learning', 'High-quality voice over recording in both English and Spanish. Perfect for commercials, e-learning courses, audiobooks, and corporate presentations. Includes script review and multiple takes.', 6, 18, 80.00, 3, 2, 'active', 'https://images.unsplash.com/photo-1590602847861-f357a9332bbc', 24, 4.7, 18),
(13, 'I will design a modern mobile app UI/UX', 'Complete mobile app design with prototypes', 'Professional mobile app UI/UX design including wireframes, high-fidelity mockups, and interactive prototypes. Specialized in iOS and Android design guidelines with focus on user experience.', 1, 4, 320.00, 8, 3, 'active', 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c', 31, 4.9, 25),
(13, 'I will create stunning product mockups and presentations', 'Professional product visualization and branding', 'Eye-catching product mockups for apps, websites, and physical products. Includes multiple angles, realistic lighting, and brand integration. Perfect for marketing materials and app store listings.', 1, 4, 45.00, 2, 2, 'active', 'https://images.unsplash.com/photo-1586717791821-3f44a563fa4c', 67, 4.6, 52),
(14, 'I will analyze your data and create insightful reports', 'Data analysis and business intelligence service', 'Comprehensive data analysis using Python, SQL, and machine learning techniques. Includes data visualization, trend analysis, and actionable business insights with detailed reports.', 7, 23, 200.00, 7, 1, 'active', 'https://images.unsplash.com/photo-1551288049-bebda4e38f71', 28, 4.8, 22),
(16, 'I will create stunning 3D models and animations', '3D modeling and animation for games and marketing', 'Professional 3D modeling and animation services using Blender. Perfect for game assets, architectural visualization, product renders, and marketing animations. High-quality output guaranteed.', 5, 17, 150.00, 6, 2, 'active', 'https://images.unsplash.com/photo-1633356122544-f134324a6cee', 19, 4.7, 15),
(16, 'I will design your indie game characters and environments', 'Complete game art package for indie developers', 'Custom character design and environment art for indie games. Includes concept art, 3D models, textures, and animations. Experienced in various art styles from cartoon to realistic.', 7, 22, 250.00, 12, 3, 'active', 'https://images.unsplash.com/photo-1552820728-8b83bb6b773f', 12, 4.9, 10),
(17, 'I will manage and grow your Instagram account', 'Complete Instagram growth and management service', 'Professional Instagram management including content creation, hashtag strategy, story templates, and engagement optimization. Proven track record of growing accounts by 300%+ in 90 days.', 4, 13, 180.00, 30, 1, 'active', 'https://images.unsplash.com/photo-1611162617474-5b21e879e113', 45, 4.8, 38),
(17, 'I will create viral TikTok content strategy', 'TikTok content planning and trend analysis', 'Custom TikTok content strategy including trend analysis, viral content ideas, optimal posting times, and hashtag research. Helps brands go viral and increase engagement rates.', 4, 13, 120.00, 5, 2, 'active', 'https://images.unsplash.com/photo-1611605698335-8b1569810432', 33, 4.6, 27),
(19, 'I will do professional product photography and editing', 'High-quality product photos for e-commerce', 'Professional product photography with advanced editing and retouching. Perfect for Amazon listings, websites, and marketing materials. Includes multiple angles and lifestyle shots.', 1, 3, 90.00, 4, 3, 'active', 'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa', 58, 4.9, 46),
(19, 'I will edit and retouch your portrait photos', 'Professional portrait editing and enhancement', 'Expert photo editing and retouching for portraits, headshots, and personal photos. Includes skin retouching, color correction, background removal, and artistic enhancement.', 1, 3, 35.00, 2, 2, 'active', 'https://images.unsplash.com/photo-1609081219090-a6d81d3085bf', 89, 4.7, 71),
(20, 'I will build scalable backend APIs and microservices', 'Enterprise-grade backend development', 'Professional backend development using Java, Spring Boot, and cloud technologies. Includes API design, database optimization, security implementation, and microservices architecture.', 2, 6, 500.00, 14, 2, 'active', 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31', 23, 4.9, 18),
(20, 'I will optimize your database performance', 'Database tuning and optimization service', 'Expert database optimization for MySQL, PostgreSQL, and MongoDB. Includes query optimization, index tuning, performance monitoring setup, and scalability recommendations.', 7, 23, 180.00, 5, 1, 'active', 'https://images.unsplash.com/photo-1544383835-bda2bc66a55d', 35, 4.8, 28);

-- =========================================================
-- Gig Images
-- =========================================================
INSERT INTO `Gig_images` (`gig_id`, `image_url`)
VALUES
(1, 'https://images.unsplash.com/photo-1626785774625-0b68b01cabd3'),
(1, 'https://images.unsplash.com/photo-1572044162444-ad60f128bdea'),
(2, 'https://images.unsplash.com/photo-1561070791-2526d30994b5'),
(3, 'https://images.unsplash.com/photo-1460925895917-afdab827c52f'),
(3, 'https://images.unsplash.com/photo-1498050108023-c5249f4df085'),
(4, 'https://images.unsplash.com/photo-1432888498266-38ffec3eaf0a'),
(5, 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173'),
(6, 'https://images.unsplash.com/photo-1455390582262-044cdead277a'),
(7, 'https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d'),
(8, 'https://images.unsplash.com/photo-1626544804353-c4e9e3a90fc7'),
(9, 'https://images.unsplash.com/photo-1432888498266-38ffec3eaf0a'),
(10, 'https://images.unsplash.com/photo-1611224923853-80b023f02d71'),
(11, 'https://images.unsplash.com/photo-1551650975-87deedd944c3'),
(12, 'https://images.unsplash.com/photo-1550745165-9bc0b252726f'),
(13, 'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d'),
(14, 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d'),
(15, 'https://images.unsplash.com/photo-1590602847861-f357a9332bbc'),
(16, 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c'),
(17, 'https://images.unsplash.com/photo-1586717791821-3f44a563fa4c'),
(18, 'https://images.unsplash.com/photo-1551288049-bebda4e38f71'),
(19, 'https://images.unsplash.com/photo-1633356122544-f134324a6cee'),
(20, 'https://images.unsplash.com/photo-1552820728-8b83bb6b773f'),
(21, 'https://images.unsplash.com/photo-1611162617474-5b21e879e113'),
(22, 'https://images.unsplash.com/photo-1611605698335-8b1569810432'),
(23, 'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa'),
(24, 'https://images.unsplash.com/photo-1609081219090-a6d81d3085bf'),
(25, 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31'),
(26, 'https://images.unsplash.com/photo-1544383835-bda2bc66a55d');

-- =========================================================
-- Orders
-- =========================================================
INSERT INTO `Orders` (`gig_id`, `seller_id`, `buyer_id`, `title`, `description`, `price`, `delivery_time`, `revisions_included`, `status`, `hire_date`, `delivery_date`, `completed`, `completed_at`)
VALUES
(1, 1, 2, 'Logo design for FitLife Gym', 'Need a modern, energetic logo for my new fitness brand. Should convey strength and motivation.', 75.00, 3, -1, 'completed', '2025-10-20', '2025-10-23', TRUE, '2025-10-23'),
(3, 3, 4, 'React website for TravelMate Agency', 'Looking for a clean and responsive design for our travel booking website with user authentication.', 450.00, 10, 2, 'completed', '2025-10-10', '2025-10-20', TRUE, '2025-10-20'),
(5, 5, 2, 'Translate fitness app content to Japanese', 'Need to translate our mobile app interface and help documentation (approximately 2000 words).', 160.00, 3, 1, 'completed', '2025-10-15', '2025-10-18', TRUE, '2025-10-18'),
(2, 1, 9, 'Brand identity for FinTech startup', 'Complete branding package for our new payment processing platform targeting SMEs.', 299.00, 7, 3, 'in_progress', '2025-10-25', NULL, FALSE, NULL),
(7, 6, 4, 'Promotional video for travel packages', 'Create a 60-second promotional video showcasing our European tour packages for social media.', 120.00, 5, 3, 'in_progress', '2025-10-24', NULL, FALSE, NULL),
(9, 7, 9, 'SEO optimization for fintech website', 'Complete SEO audit and optimization for our payment platform to improve search visibility.', 180.00, 14, 1, 'pending', '2025-10-26', NULL, FALSE, NULL),
(6, 5, 4, 'Blog content for travel website', 'Write 5 SEO-optimized blog posts about European destinations (1000 words each).', 125.00, 2, 2, 'completed', '2025-10-12', '2025-10-14', TRUE, '2025-10-14'),
(11, 8, 2, 'Fitness tracking mobile app', 'Develop a cross-platform app for tracking workouts and nutrition with social features.', 800.00, 21, 2, 'active', '2025-10-05', NULL, FALSE, NULL),
(13, 10, 4, 'Website copy for travel agency', 'Compelling copy for homepage, about page, and service descriptions that converts visitors.', 150.00, 5, 2, 'completed', '2025-10-18', '2025-10-23', TRUE, '2025-10-23'),
(4, 3, 9, 'WordPress site for financial blog', 'Custom WordPress website for publishing financial advice and market analysis articles.', 280.00, 7, 2, 'delivered', '2025-10-15', '2025-10-22', FALSE, NULL),
(15, 11, 12, 'Voice over for mobile app tutorial', 'Need professional English voice over for our app onboarding tutorial videos. Should be clear and engaging for tech-savvy users.', 80.00, 3, 2, 'completed', '2025-10-20', '2025-10-23', TRUE, '2025-10-23'),
(16, 13, 15, 'Mobile app UI for fashion brand', 'Design a luxury fashion app interface with elegant UI/UX. Should reflect our premium brand positioning and appeal to high-end customers.', 320.00, 8, 3, 'in_progress', '2025-10-22', NULL, FALSE, NULL),
(18, 14, 18, 'Real estate market analysis', 'Comprehensive data analysis of Dubai real estate market trends, pricing patterns, and investment opportunities for Q4 2025.', 200.00, 7, 1, 'pending', '2025-10-28', NULL, FALSE, NULL),
(21, 17, 2, 'Instagram growth for fitness brand', 'Grow our FitLife Gym Instagram account with engaging content, stories, and strategic hashtag use to reach fitness enthusiasts.', 180.00, 30, 1, 'active', '2025-10-15', NULL, FALSE, NULL),
(23, 19, 4, 'Product photos for travel accessories', 'Professional product photography for our new line of travel bags and accessories for our e-commerce website and Amazon store.', 90.00, 4, 3, 'completed', '2025-10-18', '2025-10-22', TRUE, '2025-10-22'),
(25, 20, 9, 'Backend API for fintech platform', 'Develop secure and scalable backend APIs for our payment processing platform with microservices architecture and database optimization.', 500.00, 14, 2, 'active', '2025-10-10', NULL, FALSE, NULL),
(19, 16, 12, '3D character for mobile game', 'Create a unique 3D character model and animations for our indie puzzle game. Should be cartoon-style and family-friendly.', 150.00, 6, 2, 'completed', '2025-10-16', '2025-10-22', TRUE, '2025-10-22'),
(17, 13, 2, 'Product mockups for fitness app', 'Create professional app store screenshots and marketing mockups for our new fitness tracking application launch.', 45.00, 2, 2, 'completed', '2025-10-25', '2025-10-27', TRUE, '2025-10-27'),
(24, 19, 15, 'Fashion brand portrait editing', 'Professional portrait retouching for our luxury fashion brand campaign photos. Need high-end fashion magazine quality editing.', 35.00, 2, 2, 'completed', '2025-10-26', '2025-10-28', TRUE, '2025-10-28');

-- =========================================================
-- Order Deliveries
-- =========================================================
INSERT INTO `Order_deliveries` (`order_id`, `revision_id`, `message`, `files`)
VALUES
(1, NULL, 'Here is your final FitLife Gym logo package. Includes vector files, PNG exports, and brand guidelines. The design captures the energy and strength you requested!', JSON_ARRAY('fitlife_logo_final.ai', 'fitlife_logo.png', 'fitlife_brand_guidelines.pdf', 'fitlife_logo_variations.zip')),
(2, NULL, 'Your TravelMate website is complete! The responsive React application includes user authentication, booking system, and admin panel. Deployed and ready for testing.', JSON_ARRAY('travelmate_website.zip', 'deployment_guide.pdf', 'admin_credentials.txt')),
(3, NULL, 'All fitness app content has been translated to Japanese. Maintained consistency with fitness terminology and cultural appropriateness for Japanese users.', JSON_ARRAY('japanese_translations.docx', 'terminology_glossary.xlsx', 'cultural_notes.pdf')),
(7, NULL, 'Completed all 5 blog posts about European destinations. Each post is SEO-optimized with target keywords and includes meta descriptions.', JSON_ARRAY('europe_blog_posts.zip', 'seo_keywords_used.xlsx', 'meta_descriptions.txt')),
(9, NULL, 'Website copy is ready! Created compelling, conversion-focused content that highlights your unique value proposition and builds trust with potential customers.', JSON_ARRAY('website_copy_final.docx', 'headlines_alternatives.txt', 'cta_suggestions.pdf')),
(10, 1, 'First version of your WordPress financial blog is ready for review. Includes custom theme, responsive design, and basic SEO setup.', JSON_ARRAY('wordpress_site_v1.zip', 'setup_instructions.pdf', 'admin_login.txt')),
(11, NULL, 'Here is your professional voice over for the mobile app tutorial! Clear, engaging narration that will help users understand your app features perfectly.', JSON_ARRAY('app_tutorial_voiceover.mp3', 'script_with_timing.pdf', 'alternative_takes.zip')),
(14, NULL, 'Professional product photos are ready! Includes 15 high-resolution images with different angles, lighting setups, and edited versions for e-commerce use.', JSON_ARRAY('travel_accessories_photos.zip', 'edited_versions/', 'usage_guidelines.pdf')),
(16, NULL, 'Your 3D character model is complete! Family-friendly cartoon style with walk, jump, and idle animations. Ready for Unity integration.', JSON_ARRAY('character_model.fbx', 'textures/', 'animations.zip', 'unity_import_guide.pdf')),
(17, NULL, 'App store mockups and marketing materials are finished! Professional presentation showcasing your fitness app features with compelling visuals.', JSON_ARRAY('app_mockups_final.zip', 'app_store_screenshots/', 'marketing_materials.pdf')),
(18, NULL, 'Fashion portrait editing complete! High-end retouching with magazine-quality finish while maintaining natural beauty and brand aesthetics.', JSON_ARRAY('retouched_portraits.zip', 'before_after_comparison.pdf', 'high_res_finals/'));

-- =========================================================
-- Chat
-- =========================================================
INSERT INTO `Chat` (`order_id`, `participant1_id`, `participant2_id`, `last_message_at`)
VALUES
(1, 2, 1, '2025-10-23 14:30:00'),
(2, 4, 3, '2025-10-21 09:15:00'),
(3, 2, 5, '2025-10-18 16:45:00'),
(4, 9, 1, '2025-10-26 11:20:00'),
(5, 4, 6, '2025-10-25 13:10:00'),
(7, 4, 5, '2025-10-14 10:30:00'),
(8, 2, 8, '2025-10-27 15:25:00'),
(9, 4, 10, '2025-10-23 12:45:00'),
(10, 9, 3, '2025-10-22 17:20:00'),
(11, 12, 11, '2025-10-23 14:20:00'),
(12, 15, 13, '2025-10-24 16:30:00'),
(14, 4, 19, '2025-10-22 12:15:00'),
(16, 2, 13, '2025-10-27 10:45:00'),
(18, 15, 19, '2025-10-28 09:30:00');

-- =========================================================
-- Chat Messages
-- =========================================================
INSERT INTO `Chat_messages` (`thread_id`, `sender_id`, `content`, `is_read`)
VALUES
(1, 2, 'Hi Alice! I love the logo concepts you shared. The second one really captures the energy I was looking for.', TRUE),
(1, 1, 'Thank you Mark! I\'m glad you like it. I\'ll refine that concept and prepare the final files for you.', TRUE),
(1, 2, 'Perfect! Can you also include a horizontal version for letterheads?', TRUE),
(1, 1, 'Absolutely! I\'ll include horizontal and stacked versions in the final package.', TRUE),
(2, 4, 'The website looks great! Just one request - can we make the booking form more prominent?', TRUE),
(2, 3, 'Sure Carlos! I\'ll move the booking form to the hero section and make it more visually appealing.', TRUE),
(3, 2, 'The Japanese translations look perfect. Your cultural notes were very helpful too!', TRUE),
(3, 5, 'Thank you! I made sure to use appropriate fitness terminology that Japanese users would understand.', TRUE),
(4, 9, 'Looking forward to seeing the first concepts for our fintech brand!', FALSE),
(4, 1, 'I\'ll have the initial mood board and logo concepts ready by tomorrow. Excited to work on this!', FALSE),
(11, 12, 'Hi Nina! The voice over sounds fantastic. Your tone is perfect for our tutorial videos.', TRUE),
(11, 11, 'Thank you Ryan! I\'m glad you like it. The script was well-written and easy to work with.', TRUE),
(12, 15, 'The app mockups look stunning! Could we adjust the color scheme to match our brand better?', FALSE),
(12, 13, 'Absolutely Isabella! I\'ll update the mockups with your brand colors and send the revision today.', FALSE),
(14, 4, 'The product photos are amazing! The lighting and angles really showcase our travel bags beautifully.', TRUE),
(14, 19, 'Thank you Carlos! I made sure to capture the quality and craftsmanship of your products.', TRUE),
(16, 2, 'Love the app store screenshots! They really make our fitness app look professional and appealing.', TRUE),
(16, 13, 'Thanks Mark! I focused on highlighting the key features that would attract fitness enthusiasts.', TRUE);

-- =========================================================
-- Reviews
-- =========================================================
INSERT INTO `Reviews` (`order_id`, `gig_id`, `reviewer_id`, `reviewee_id`, `reviewer_role`, `reviewee_role`, `rating`, `title`, `content`, `communication_rating`, `service_quality_rating`, `delivery_time_rating`, `review_date`)
VALUES
(1, 1, 2, 1, 'buyer', 'seller', 5, 'Outstanding logo design!', 'Alice delivered exactly what I envisioned for my fitness brand. The logo is modern, energetic, and perfect for our target audience. She was responsive, professional, and provided excellent revisions. Highly recommend!', 5, 5, 5, '2025-10-23 15:30:00'),
(2, 3, 4, 3, 'buyer', 'seller', 5, 'Exceptional web development work', 'Sophia built an amazing React website for our travel agency. The code is clean, the design is responsive, and she delivered exactly on time. The booking system works flawlessly. Will definitely work with her again!', 5, 5, 5, '2025-10-20 18:45:00'),
(3, 5, 2, 5, 'buyer', 'seller', 5, 'Perfect Japanese translation', 'Emma provided excellent translations for our fitness app. As someone who lived in Japan, I can confirm the translations are accurate and culturally appropriate. Fast delivery and great communication throughout.', 5, 5, 5, '2025-10-18 20:15:00'),
(7, 6, 4, 5, 'buyer', 'seller', 4, 'Great content, minor delays', 'The blog posts Emma wrote are well-researched and SEO-optimized. The content quality is excellent and perfectly captures our brand voice. Delivery was slightly delayed but the quality made up for it.', 5, 5, 3, '2025-10-15 11:20:00'),
(9, 13, 4, 10, 'buyer', 'seller', 5, 'Compelling website copy', 'Jean created fantastic copy for our travel website. The headlines are catchy, the descriptions are engaging, and the call-to-actions are very effective. Our conversion rate has already improved!', 5, 5, 5, '2025-10-23 16:10:00'),
(1, 1, 1, 2, 'seller', 'buyer', 5, 'Great client to work with', 'Mark was a fantastic client! He provided clear requirements, was responsive to questions, and gave constructive feedback. The project ran smoothly from start to finish. Hope to work together again!', 5, 5, 5, '2025-10-23 15:45:00'),
(2, 3, 3, 4, 'seller', 'buyer', 5, 'Professional and organized client', 'Carlos was very professional throughout the project. He had a clear vision, provided all necessary materials promptly, and was flexible with timeline adjustments. Excellent communication skills!', 5, 5, 5, '2025-10-20 19:00:00'),
(3, 5, 5, 2, 'seller', 'buyer', 5, 'Smooth collaboration', 'Working with Mark was a pleasure. He understood the importance of cultural nuances in translation and trusted my expertise. Quick to respond and provided helpful context for the content.', 5, 5, 5, '2025-10-18 20:30:00'),
(11, 15, 12, 11, 'buyer', 'seller', 5, 'Perfect voice over work!', 'Nina delivered exactly what we needed for our app tutorial. Her voice is clear, professional, and engaging. The delivery was on time and the quality exceeded our expectations!', 5, 5, 5, '2025-10-23 16:00:00'),
(14, 23, 4, 19, 'buyer', 'seller', 5, 'Outstanding product photography', 'Elena did an amazing job with our travel accessory photos. The lighting, composition, and editing are all professional grade. Our products look absolutely stunning!', 5, 5, 5, '2025-10-22 14:30:00'),
(16, 19, 12, 16, 'buyer', 'seller', 5, 'Incredible 3D character work', 'Hiroshi created the perfect character for our mobile game. The modeling is detailed, animations are smooth, and it fits our game style perfectly. Highly recommended!', 5, 5, 5, '2025-10-22 18:45:00'),
(17, 17, 2, 13, 'buyer', 'seller', 5, 'Professional app mockups', 'Priya created beautiful mockups for our fitness app. The designs are modern, user-friendly, and really showcase our features effectively. Great attention to detail!', 5, 5, 5, '2025-10-27 11:20:00'),
(18, 24, 15, 19, 'buyer', 'seller', 4, 'High quality retouching', 'Elena did excellent work on our fashion campaign photos. The retouching is subtle yet effective, maintaining the natural beauty while achieving that magazine look we wanted.', 4, 5, 4, '2025-10-28 12:15:00'),
-- Seller reviews for buyers
(11, 15, 11, 12, 'seller', 'buyer', 5, 'Great client with clear vision', 'Ryan was professional and provided clear instructions for the voice over work. He knew exactly what he wanted and was easy to communicate with throughout the project.', 5, 5, 5, '2025-10-23 16:15:00'),
(14, 23, 19, 4, 'seller', 'buyer', 5, 'Excellent collaboration', 'Carlos was fantastic to work with! He provided detailed briefs, quick feedback, and really understood the importance of quality product photography for his brand.', 5, 5, 5, '2025-10-22 14:45:00'),
(16, 19, 16, 12, 'seller', 'buyer', 5, 'Creative and supportive client', 'Working with Ryan on the 3D character was a pleasure. He gave creative freedom while providing helpful feedback. Very understanding of the creative process!', 5, 5, 5, '2025-10-22 19:00:00'),
(17, 17, 13, 2, 'seller', 'buyer', 5, 'Professional and organized', 'Mark is a dream client! Well-organized, clear communication, and really appreciates good design work. The project ran smoothly from start to finish.', 5, 5, 5, '2025-10-27 11:35:00'),
-- Additional reviews from older orders
(4, 4, 9, 3, 'buyer', 'seller', 4, 'Good WordPress development', 'Sophia built a solid WordPress site for our financial blog. The design is clean and functional, though delivery was slightly delayed. Overall satisfied with the work.', 4, 5, 3, '2025-10-22 20:00:00'),
(8, 11, 2, 8, 'buyer', 'seller', 5, 'Amazing mobile app development', 'Ahmed is building an incredible fitness tracking app for us. His technical expertise and attention to user experience is outstanding. Very excited about the final result!', 5, 5, 5, '2025-10-15 10:30:00'),
(6, 9, 9, 7, 'buyer', 'seller', 4, 'Professional SEO service', 'Maria provided comprehensive SEO analysis and recommendations. The technical audit was thorough and the optimization suggestions are actionable. Good value for money.', 4, 5, 4, '2025-10-28 14:20:00'),
-- More seller reviews
(8, 11, 8, 2, 'seller', 'buyer', 5, 'Visionary client with great ideas', 'Mark has excellent ideas for his fitness app and provides constructive feedback. He understands the development process and is patient with technical challenges.', 5, 5, 5, '2025-10-15 10:45:00'),
(4, 4, 3, 9, 'seller', 'buyer', 4, 'Knowledgeable client', 'Lisa knows what she wants for her fintech platform. Provided good reference materials and was flexible with timeline adjustments. Professional throughout.', 4, 5, 4, '2025-10-22 20:15:00');
