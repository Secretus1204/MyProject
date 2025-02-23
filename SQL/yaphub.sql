-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Feb 23, 2025 at 09:52 AM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.0.30

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `yaphub`
--

-- --------------------------------------------------------

--
-- Table structure for table `admin`
--

CREATE TABLE `admin` (
  `adminId` int(11) NOT NULL,
  `adminName` varchar(50) NOT NULL,
  `adminEmail` varchar(50) NOT NULL,
  `adminPassword` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `admin`
--

INSERT INTO `admin` (`adminId`, `adminName`, `adminEmail`, `adminPassword`) VALUES
(1, 'DM Rashid Ferrer', 'dmrashidpferrer@gmail.com', 'dmrashid123'),
(2, 'Ryle Jade Tabay', 'rylejadetabay@gmail.com', 'ryle123');

-- --------------------------------------------------------

--
-- Table structure for table `chats`
--

CREATE TABLE `chats` (
  `chat_id` int(11) NOT NULL,
  `chat_name` varchar(100) DEFAULT NULL,
  `group_picture` varchar(255) DEFAULT 'images/group_img/default_group.jpg',
  `is_group` tinyint(1) DEFAULT 0,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `chats`
--

INSERT INTO `chats` (`chat_id`, `chat_name`, `group_picture`, `is_group`, `created_at`) VALUES
(1, 'What The Group', 'images/group_img/default_group.jpg', 1, '2025-02-21 21:55:28'),
(2, 'Ang Group', 'images/group_img/default_group.jpg', 1, '2025-02-22 20:59:51'),
(3, 'Another Group', 'images/group_img/default_group.jpg', 1, '2025-02-22 21:37:05');

-- --------------------------------------------------------

--
-- Table structure for table `chat_members`
--

CREATE TABLE `chat_members` (
  `chat_member_id` int(11) NOT NULL,
  `chat_id` int(11) DEFAULT NULL,
  `user_id` int(11) DEFAULT NULL,
  `joined_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `chat_members`
--

INSERT INTO `chat_members` (`chat_member_id`, `chat_id`, `user_id`, `joined_at`) VALUES
(1, 1, 5, '2025-02-21 21:55:28'),
(2, 1, 2, '2025-02-21 21:55:28'),
(3, 1, 4, '2025-02-21 21:55:28'),
(4, 2, 3, '2025-02-22 20:59:51'),
(5, 2, 1, '2025-02-22 20:59:51'),
(6, 3, 4, '2025-02-22 21:37:05'),
(7, 3, 1, '2025-02-22 21:37:05'),
(8, 3, 2, '2025-02-22 21:37:05');

-- --------------------------------------------------------

--
-- Table structure for table `friends`
--

CREATE TABLE `friends` (
  `friendship_id` int(11) NOT NULL,
  `user_id1` int(11) DEFAULT NULL,
  `user_id2` int(11) DEFAULT NULL,
  `status` enum('pending','accepted','blocked') DEFAULT 'pending',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `friends`
--

INSERT INTO `friends` (`friendship_id`, `user_id1`, `user_id2`, `status`, `created_at`) VALUES
(8, 5, 4, 'accepted', '2025-02-16 11:29:53'),
(11, 1, 3, 'accepted', '2025-02-18 21:32:45'),
(13, 2, 5, 'pending', '2025-02-19 21:47:34'),
(14, 2, 4, 'accepted', '2025-02-19 21:47:49'),
(15, 1, 2, 'accepted', '2025-02-22 20:58:23');

-- --------------------------------------------------------

--
-- Table structure for table `messages`
--

CREATE TABLE `messages` (
  `message_id` int(11) NOT NULL,
  `chat_id` int(11) DEFAULT NULL,
  `sender_id` int(11) DEFAULT NULL,
  `message_text` text DEFAULT NULL,
  `message_type` enum('text','image','file','video') DEFAULT 'text',
  `file_url` varchar(255) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `message_status`
--

CREATE TABLE `message_status` (
  `status_id` int(11) NOT NULL,
  `message_id` int(11) DEFAULT NULL,
  `user_id` int(11) DEFAULT NULL,
  `status` enum('sent','delivered','read') DEFAULT 'sent',
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `user_id` int(11) NOT NULL,
  `firstName` varchar(50) NOT NULL,
  `lastName` varchar(50) NOT NULL,
  `email` varchar(100) NOT NULL,
  `address` varchar(250) NOT NULL,
  `password` varchar(255) NOT NULL,
  `profile_picture` varchar(255) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `is_online` tinyint(1) DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`user_id`, `firstName`, `lastName`, `email`, `address`, `password`, `profile_picture`, `created_at`, `is_online`) VALUES
(1, 'Mark', 'Palma', 'markpalma@gmail.com', 'Arakan, Sa baybayin', '$2y$10$dxEbVszmuMUsq0Oo1tihlOZtpOeu8uzVmg1wMufqtRG.Pa12UuAj.', 'images/profile_img/profile_1_1740172571.jpg', '2025-02-13 19:29:28', 0),
(2, 'James', 'Oliver', 'jamesoliver@gmail.com', 'Davao City, Philippines', '$2y$10$/QV1xjgQmvuWDEGM1EYdyePZA8P4O4KeuCn9SaVgr3HcVqHPGfZ.6', 'images/profile_img/profile_2_1740172706.jpg', '2025-02-13 19:58:58', 1),
(3, 'John', 'Doe', 'john@gmail.com', 'Maranata, New Zealand', '$2y$10$8bsFxKHRsjyjy5wd8.KruOkddmWXDtGwB4K6frMCaW/4TCCwHTyu.', NULL, '2025-02-14 17:50:00', 0),
(4, 'Merk', 'Mundane', 'merk@gmail.com', 'Davao City, Philippines', '$2y$10$bB7sasukriI3kFTeRRHVwOrqCg0f7M0kwy1NDsJ/8gH0E.LCTAqDi', NULL, '2025-02-14 17:55:17', 0),
(5, 'Angelito', 'Lozano', 'angelo@gmail.com', 'Taga Bukid', '$2y$10$W0my8ofzagc1TzwRFoR3oOhhFJB0I/sm9n9nSX75eJORKh.As2cDy', NULL, '2025-02-16 11:29:40', 0);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `admin`
--
ALTER TABLE `admin`
  ADD PRIMARY KEY (`adminId`);

--
-- Indexes for table `chats`
--
ALTER TABLE `chats`
  ADD PRIMARY KEY (`chat_id`);

--
-- Indexes for table `chat_members`
--
ALTER TABLE `chat_members`
  ADD PRIMARY KEY (`chat_member_id`),
  ADD KEY `chat_id` (`chat_id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `friends`
--
ALTER TABLE `friends`
  ADD PRIMARY KEY (`friendship_id`),
  ADD KEY `user_id1` (`user_id1`),
  ADD KEY `user_id2` (`user_id2`);

--
-- Indexes for table `messages`
--
ALTER TABLE `messages`
  ADD PRIMARY KEY (`message_id`),
  ADD KEY `chat_id` (`chat_id`),
  ADD KEY `sender_id` (`sender_id`);

--
-- Indexes for table `message_status`
--
ALTER TABLE `message_status`
  ADD PRIMARY KEY (`status_id`),
  ADD KEY `message_id` (`message_id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`user_id`),
  ADD UNIQUE KEY `email` (`email`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `admin`
--
ALTER TABLE `admin`
  MODIFY `adminId` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `chats`
--
ALTER TABLE `chats`
  MODIFY `chat_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `chat_members`
--
ALTER TABLE `chat_members`
  MODIFY `chat_member_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT for table `friends`
--
ALTER TABLE `friends`
  MODIFY `friendship_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=16;

--
-- AUTO_INCREMENT for table `messages`
--
ALTER TABLE `messages`
  MODIFY `message_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `message_status`
--
ALTER TABLE `message_status`
  MODIFY `status_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `user_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `chat_members`
--
ALTER TABLE `chat_members`
  ADD CONSTRAINT `chat_members_ibfk_1` FOREIGN KEY (`chat_id`) REFERENCES `chats` (`chat_id`) ON DELETE CASCADE,
  ADD CONSTRAINT `chat_members_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE;

--
-- Constraints for table `friends`
--
ALTER TABLE `friends`
  ADD CONSTRAINT `friends_ibfk_1` FOREIGN KEY (`user_id1`) REFERENCES `users` (`user_id`) ON DELETE CASCADE,
  ADD CONSTRAINT `friends_ibfk_2` FOREIGN KEY (`user_id2`) REFERENCES `users` (`user_id`) ON DELETE CASCADE;

--
-- Constraints for table `messages`
--
ALTER TABLE `messages`
  ADD CONSTRAINT `messages_ibfk_1` FOREIGN KEY (`chat_id`) REFERENCES `chats` (`chat_id`) ON DELETE CASCADE,
  ADD CONSTRAINT `messages_ibfk_2` FOREIGN KEY (`sender_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE;

--
-- Constraints for table `message_status`
--
ALTER TABLE `message_status`
  ADD CONSTRAINT `message_status_ibfk_1` FOREIGN KEY (`message_id`) REFERENCES `messages` (`message_id`) ON DELETE CASCADE,
  ADD CONSTRAINT `message_status_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
