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
    `icon` VARCHAR(100),
);

-- Languages
CREATE TABLE `Languages` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `name` VARCHAR(50) NOT NULL UNIQUE,
    `code` VARCHAR(5) NOT NULL UNIQUE,
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
