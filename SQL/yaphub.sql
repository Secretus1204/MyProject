-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Mar 03, 2025 at 02:01 PM
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
(1, NULL, 'images/group_img/default_group.jpg', 0, '2025-02-28 09:44:39'),
(2, NULL, 'images/group_img/default_group.jpg', 0, '2025-02-28 09:45:01'),
(3, 'James and Friends', 'images/group_img/default_group.jpg', 1, '2025-02-28 09:45:26');

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
(1, 1, 1, '2025-02-28 09:44:39'),
(2, 1, 2, '2025-02-28 09:44:39'),
(3, 2, 2, '2025-02-28 09:45:01'),
(4, 2, 3, '2025-02-28 09:45:01'),
(5, 3, 1, '2025-02-28 09:45:26'),
(6, 3, 3, '2025-02-28 09:45:26'),
(7, 3, 2, '2025-02-28 09:45:26');

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
(2, 2, 1, 'accepted', '2025-02-28 09:44:49'),
(4, 2, 3, 'accepted', '2025-03-01 02:31:58');

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

--
-- Dumping data for table `messages`
--

INSERT INTO `messages` (`message_id`, `chat_id`, `sender_id`, `message_text`, `message_type`, `file_url`, `created_at`) VALUES
(1, 2, 3, 'hello', 'text', NULL, '2025-03-01 06:02:43'),
(2, 2, 3, 'hello po kuya', 'text', NULL, '2025-03-01 06:11:20'),
(3, 2, 3, 'bakit ang hirap ng websocket', 'text', NULL, '2025-03-01 06:11:25'),
(4, 2, 3, 'zzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzz', 'text', NULL, '2025-03-01 06:12:28'),
(5, 2, 2, 'hello', 'text', NULL, '2025-03-01 06:17:05'),
(6, 2, 2, 'nganong lisod man kaayo btaw', 'text', NULL, '2025-03-01 06:17:17'),
(7, 3, 3, 'hi group mates', 'text', NULL, '2025-03-01 06:17:34'),
(8, 2, 2, 'awrgrawhrwa', 'text', NULL, '2025-03-01 13:08:14'),
(9, 2, 2, 'abrkabr', 'text', NULL, '2025-03-01 13:08:15'),
(10, 2, 2, 'awbrbhra', 'text', NULL, '2025-03-01 13:08:15'),
(11, 2, 2, 'awhrbjarhbhraw', 'text', NULL, '2025-03-01 13:08:16'),
(12, 2, 2, 'awhrawhjrg', 'text', NULL, '2025-03-01 13:08:17'),
(13, 2, 3, 'ang herap nga', 'text', NULL, '2025-03-01 13:08:40'),
(14, 2, 3, 'soper', 'text', NULL, '2025-03-01 13:08:44'),
(15, 2, 3, 'sample', 'text', NULL, '2025-03-01 13:08:50'),
(16, 2, 3, 'pa 20', 'text', NULL, '2025-03-01 13:08:51'),
(17, 2, 3, 'hello', 'text', NULL, '2025-03-01 13:08:59'),
(18, 2, 2, 'maker', 'text', NULL, '2025-03-01 13:10:03'),
(19, 2, 2, 'aksf', 'text', NULL, '2025-03-01 13:10:04'),
(20, 2, 2, 'aawhr', 'text', NULL, '2025-03-01 13:10:05'),
(21, 2, 2, 'awlrawhasmf', 'text', NULL, '2025-03-01 13:10:05'),
(22, 2, 2, 'awfjawbwar', 'text', NULL, '2025-03-01 13:10:06'),
(23, 2, 2, 'arlawkrnbalbra', 'text', NULL, '2025-03-01 13:10:07'),
(24, 2, 2, 'awrlakwbr', 'text', NULL, '2025-03-01 13:10:07'),
(25, 2, 2, 'arwawrjlbraw', 'text', NULL, '2025-03-01 13:10:08'),
(26, 2, 2, 'sfawjbaw', 'text', NULL, '2025-03-01 13:10:09'),
(27, 2, 2, 'ra', 'text', NULL, '2025-03-01 13:10:10'),
(28, 2, 3, 'awrkawrvbrawr', 'text', NULL, '2025-03-01 13:10:14'),
(29, 2, 3, 'awawkrjbarwjkbarw', 'text', NULL, '2025-03-01 13:10:14'),
(30, 2, 3, 'awrlbawrjlabwr', 'text', NULL, '2025-03-01 13:10:15'),
(31, 2, 3, 'awawjburawjra', 'text', NULL, '2025-03-01 13:10:16'),
(32, 2, 3, 'wrawubrawugawr', 'text', NULL, '2025-03-01 13:10:16'),
(33, 2, 3, 'asfalskfbajbrw', 'text', NULL, '2025-03-01 13:10:17'),
(34, 2, 3, 'awaujbrwaj', 'text', NULL, '2025-03-01 13:10:18'),
(35, 2, 3, 'afajbfwjabr', 'text', NULL, '2025-03-01 13:10:18'),
(36, 2, 3, 'wqqrwbrwkqjbrqw', 'text', NULL, '2025-03-01 13:10:19'),
(37, 2, 3, 'hello', 'text', NULL, '2025-03-01 13:19:37'),
(38, 2, 2, 'hi', 'text', NULL, '2025-03-01 13:19:41'),
(39, 2, 3, 'natapos na rin ang chat', 'text', NULL, '2025-03-01 14:34:54'),
(40, 2, 2, 'hello', 'text', NULL, '2025-03-01 14:35:25'),
(41, 2, 2, 'hello', 'text', NULL, '2025-03-01 14:36:13'),
(42, 2, 2, 'ayo', 'text', NULL, '2025-03-01 14:37:07'),
(43, 2, 2, 'hello', 'text', NULL, '2025-03-01 14:38:12'),
(44, 2, 3, 'hi', 'text', NULL, '2025-03-01 14:38:23'),
(45, 2, 2, 'baka', 'text', NULL, '2025-03-01 14:38:29'),
(46, 2, 3, 'kabaw', 'text', NULL, '2025-03-01 14:38:34'),
(47, 3, 2, 'kung ang hipon ay pasayan', 'text', NULL, '2025-03-01 14:47:16'),
(48, 3, 2, 'nganong lisod man kaayo ning websocket', 'text', NULL, '2025-03-01 14:47:22'),
(49, 3, 3, 'mao jud frfr', 'text', NULL, '2025-03-01 14:47:28'),
(50, 3, 3, 'HAHAHAHAH', 'text', NULL, '2025-03-01 14:47:35'),
(51, 3, 1, 'kasturya ang sarili o', 'text', NULL, '2025-03-01 14:47:58'),
(52, 1, 1, 'hi oleber', 'text', NULL, '2025-03-01 14:57:24'),
(53, 1, 2, 'hello', 'text', NULL, '2025-03-03 09:24:33'),
(54, 1, 1, 'wat', 'text', NULL, '2025-03-03 09:24:45'),
(55, 1, 1, 'anong problima', 'text', NULL, '2025-03-03 09:24:53'),
(56, 1, 2, 'gumagana naba ang webscoket', 'text', NULL, '2025-03-03 09:28:07'),
(57, 1, 1, 'yesser', 'text', NULL, '2025-03-03 09:28:10'),
(58, 1, 1, 'helo', 'text', NULL, '2025-03-03 09:50:13'),
(60, 2, 3, 'hey', 'text', NULL, '2025-03-03 10:50:00'),
(61, 2, 3, 'hell', 'text', NULL, '2025-03-03 10:50:17'),
(62, 2, 2, 'hello', 'text', NULL, '2025-03-03 10:50:56'),
(63, 2, 3, 'mellow', 'text', NULL, '2025-03-03 10:53:25'),
(64, 2, 3, 'is this working?', 'text', NULL, '2025-03-03 11:10:25'),
(65, 2, 3, 'hello', 'text', NULL, '2025-03-03 11:12:35'),
(66, 2, 3, 'hi', 'text', NULL, '2025-03-03 11:12:44'),
(67, 2, 2, 'wrokier', 'text', NULL, '2025-03-03 11:14:00'),
(68, 2, 3, 'hey', 'text', NULL, '2025-03-03 11:15:39'),
(79, 2, 3, 'hello', 'text', NULL, '2025-03-03 11:24:13'),
(80, 2, 3, 'wow', 'text', NULL, '2025-03-03 11:24:15'),
(81, 2, 2, 'nigana na', 'text', NULL, '2025-03-03 11:24:20'),
(90, 3, 3, NULL, 'image', 'fileUpload/file_67c59a0bc6d476.98155706.jpg', '2025-03-03 12:01:15'),
(92, 2, 3, NULL, 'image', 'fileUpload/file_67c59a128d86a7.32546984.jpg', '2025-03-03 12:01:22'),
(94, 2, 3, 'hello FINALLY ITS WORKING', 'text', NULL, '2025-03-03 12:01:30'),
(96, 2, 3, NULL, 'image', 'fileUpload/file_67c59ba48f43c5.46814966.png', '2025-03-03 12:08:04'),
(97, 2, 3, 'hello', 'text', NULL, '2025-03-03 12:11:11'),
(98, 2, 2, 'wow wat the roblox', 'text', NULL, '2025-03-03 12:11:20'),
(100, 2, 3, NULL, 'image', 'fileUpload/file_67c5a1b5897ad4.56492759.png', '2025-03-03 12:33:57'),
(101, 2, 3, NULL, 'image', 'fileUpload/file_67c5a23ef3d719.68846234.png', '2025-03-03 12:36:15'),
(102, 2, 3, 'aw', 'text', NULL, '2025-03-03 12:37:03'),
(103, 2, 3, 'hala', 'text', NULL, '2025-03-03 12:37:09'),
(104, 2, 3, NULL, 'image', 'fileUpload/file_67c5a392509e23.34965727.png', '2025-03-03 12:41:54'),
(105, 2, 3, 'hello', 'text', NULL, '2025-03-03 12:43:59'),
(106, 2, 2, 'hello', 'text', NULL, '2025-03-03 12:46:12'),
(107, 2, 3, 'he', 'text', NULL, '2025-03-03 12:48:20'),
(108, 2, 3, 'hello', 'text', NULL, '2025-03-03 12:48:27'),
(109, 2, 2, 'again', 'text', NULL, '2025-03-03 12:49:16'),
(110, 2, 3, 'hello', 'text', NULL, '2025-03-03 12:50:30'),
(111, 2, 2, 'sige', 'text', NULL, '2025-03-03 12:51:36'),
(112, 2, 2, 'yo', 'text', NULL, '2025-03-03 12:56:22'),
(113, 2, 3, 'what the yow', 'text', NULL, '2025-03-03 12:56:34'),
(114, 2, 3, NULL, 'image', 'fileUpload/file_67c5a707060d66.44210080.png', '2025-03-03 12:56:39');

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
(1, 'Mark', 'Palma', 'mark@gmail.com', 'Panabo, Davao', '$2y$10$rysaOgQ2MeoUNLIGbVB.Ae3naOo4wGsSMIJjW4zIaCIeicqvmTijO', NULL, '2025-02-26 09:49:46', 0),
(2, 'James', 'Oliver', 'jamesoliver@gmail.com', 'Water District, Lanang', '$2y$10$6nLWxJ.KTlvIFJOtXv2r8.NcM0dBC76HRbU6fgkJLucfbMHIuLXYi', 'images/profile_img/profile_2_1740563965.jpg', '2025-02-26 09:57:25', 1),
(3, 'Jayrald', 'Dionaldo', 'jayrald@gmail.com', 'Abreeza, Davao City', '$2y$10$ZUxA/aIaQc5V/.0QlAXKQeu3/DbHo0O.BR1COL2AG9uA6tAld1yxe', 'images/profile_img/profile_3_1740796380.jpg', '2025-02-26 09:57:46', 1);

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
  MODIFY `chat_member_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT for table `friends`
--
ALTER TABLE `friends`
  MODIFY `friendship_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `messages`
--
ALTER TABLE `messages`
  MODIFY `message_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=117;

--
-- AUTO_INCREMENT for table `message_status`
--
ALTER TABLE `message_status`
  MODIFY `status_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `user_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

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
