-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Mar 10, 2024 at 02:33 PM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `emotion`
--

-- --------------------------------------------------------

--
-- Table structure for table `context_trigger`
--

CREATE TABLE `context_trigger` (
  `context_trigger_id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `context_trigger`
--

INSERT INTO `context_trigger` (`context_trigger_id`, `name`) VALUES
(1, 'work'),
(2, 'family'),
(3, 'weather'),
(4, 'financial'),
(5, 'health'),
(6, 'the news'),
(7, 'study');

-- --------------------------------------------------------

--
-- Table structure for table `emotion_snap`
--

CREATE TABLE `emotion_snap` (
  `emotion_snap_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `time_stamp` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `joy` int(11) NOT NULL,
  `surprise` int(11) NOT NULL,
  `anger` int(11) NOT NULL,
  `disgust` int(11) NOT NULL,
  `fear` int(11) NOT NULL,
  `sadness` int(11) NOT NULL,
  `contempt` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `emotion_snap`
--

INSERT INTO `emotion_snap` (`emotion_snap_id`, `user_id`, `time_stamp`, `joy`, `surprise`, `anger`, `disgust`, `fear`, `sadness`, `contempt`) VALUES
(76, 47, '2024-02-09 11:30:04', 5, 7, 2, 6, 2, 6, 4),
(77, 47, '2024-02-09 11:31:50', 9, 7, 9, 8, 9, 8, 7),
(78, 47, '2024-02-09 11:37:13', 9, 5, 8, 4, 7, 4, 5),
(79, 47, '2024-02-09 11:44:05', 6, 6, 7, 5, 7, 5, 7),
(82, 48, '2024-02-09 12:02:09', 1, 3, 7, 3, 8, 3, 6),
(84, 48, '2024-02-11 10:36:16', 1, 6, 6, 3, 7, 2, 5),
(87, 50, '2024-02-11 17:46:12', 8, 2, 1, 5, 3, 4, 1),
(89, 50, '2024-02-16 10:53:44', 8, 4, 5, 4, 5, 4, 2),
(90, 50, '2024-02-16 10:53:53', 10, 9, 8, 6, 9, 4, 7),
(91, 50, '2024-02-16 10:54:01', 8, 6, 7, 6, 8, 6, 8),
(92, 50, '2024-02-16 11:46:29', 7, 6, 6, 6, 7, 6, 7),
(93, 50, '2024-02-16 11:46:36', 1, 9, 10, 8, 9, 9, 8),
(94, 50, '2024-02-16 11:46:45', 3, 4, 9, 4, 9, 4, 7),
(95, 50, '2024-02-18 13:11:01', 5, 3, 5, 3, 6, 3, 7),
(96, 50, '2024-02-18 13:13:31', 9, 7, 9, 6, 8, 6, 8),
(97, 50, '2024-02-18 13:14:42', 1, 7, 8, 7, 9, 7, 6),
(98, 50, '2024-02-18 13:19:48', 9, 8, 9, 8, 9, 7, 9),
(99, 50, '2024-02-18 13:39:19', 8, 2, 1, 5, 3, 4, 1),
(101, 50, '2024-02-18 13:42:18', 9, 4, 8, 4, 1, 3, 5),
(102, 50, '2024-02-18 14:16:56', 8, 5, 8, 5, 9, 5, 7),
(104, 50, '2024-02-18 15:03:09', 8, 2, 4, 3, 5, 3, 4),
(105, 50, '2024-02-18 15:04:39', 4, 3, 3, 3, 1, 3, 6),
(106, 50, '2024-02-18 15:22:59', 6, 3, 7, 3, 9, 3, 6),
(107, 50, '2024-02-18 15:28:17', 5, 4, 9, 4, 7, 4, 5),
(108, 50, '2024-02-18 15:31:52', 4, 4, 5, 4, 6, 4, 5),
(109, 50, '2024-02-18 15:32:39', 8, 4, 5, 4, 7, 3, 6),
(110, 50, '2024-02-18 15:36:01', 4, 4, 5, 4, 6, 3, 4),
(111, 50, '2024-02-18 15:41:43', 1, 3, 1, 3, 1, 3, 1),
(112, 50, '2024-02-18 15:42:50', 8, 4, 5, 4, 7, 4, 6),
(115, 48, '2024-02-18 19:23:03', 7, 2, 7, 6, 8, 4, 5),
(117, 50, '2024-02-24 12:16:20', 7, 6, 7, 6, 8, 6, 8),
(118, 50, '2024-02-24 13:28:27', 7, 5, 5, 4, 6, 4, 6),
(119, 50, '2024-02-24 13:30:15', 4, 3, 6, 3, 7, 3, 6),
(120, 50, '2024-02-24 15:42:03', 7, 4, 6, 4, 8, 4, 6),
(121, 50, '2024-02-24 15:45:05', 4, 3, 4, 3, 5, 2, 4),
(122, 50, '2024-02-24 15:47:28', 6, 3, 5, 3, 7, 3, 9),
(123, 50, '2024-02-24 15:48:31', 4, 4, 5, 4, 6, 4, 6),
(124, 50, '2024-02-24 16:05:36', 4, 3, 6, 4, 8, 3, 8),
(125, 50, '2024-02-24 16:06:40', 6, 2, 8, 3, 9, 3, 8),
(126, 50, '2024-02-24 16:08:15', 4, 2, 6, 2, 7, 3, 6),
(127, 50, '2024-02-24 16:19:45', 6, 2, 5, 3, 7, 3, 5),
(128, 50, '2024-02-24 16:33:41', 3, 3, 3, 3, 4, 3, 4),
(129, 50, '2024-02-24 16:41:52', 4, 2, 3, 2, 6, 3, 5),
(130, 50, '2024-02-24 16:42:29', 6, 4, 6, 4, 5, 4, 5),
(131, 50, '2024-02-24 16:49:01', 5, 3, 5, 3, 8, 3, 6),
(132, 50, '2024-02-24 16:52:06', 4, 4, 4, 4, 4, 5, 5),
(133, 50, '2024-02-24 17:00:29', 8, 3, 7, 3, 8, 3, 8),
(134, 50, '2024-02-24 17:03:36', 10, 8, 10, 8, 9, 8, 9),
(135, 50, '2024-02-24 17:06:48', 1, 3, 4, 4, 7, 4, 5),
(136, 50, '2024-02-24 17:09:42', 2, 2, 3, 2, 4, 2, 2),
(137, 50, '2024-02-24 17:10:52', 5, 2, 7, 2, 8, 2, 6),
(138, 50, '2024-02-24 17:11:47', 3, 2, 4, 2, 6, 2, 6),
(139, 50, '2024-02-24 17:14:27', 3, 2, 5, 2, 7, 2, 5),
(140, 50, '2024-02-24 17:16:17', 5, 3, 9, 3, 10, 3, 7),
(141, 50, '2024-02-24 17:16:41', 6, 3, 8, 3, 9, 3, 6),
(142, 50, '2024-02-24 17:18:11', 3, 2, 3, 3, 4, 2, 4),
(143, 50, '2024-02-24 17:24:26', 5, 2, 5, 2, 6, 2, 7),
(144, 50, '2024-02-24 17:28:31', 8, 2, 9, 3, 10, 3, 4),
(145, 50, '2024-02-24 17:31:29', 5, 3, 8, 3, 9, 3, 7),
(146, 50, '2024-02-24 17:33:11', 9, 4, 9, 3, 10, 3, 4),
(147, 50, '2024-02-24 17:37:15', 4, 4, 6, 5, 8, 4, 6),
(148, 50, '2024-02-24 17:38:44', 4, 2, 5, 2, 8, 3, 5),
(149, 50, '2024-02-24 17:40:09', 5, 4, 2, 3, 6, 4, 7),
(150, 50, '2024-02-24 17:41:44', 9, 3, 9, 4, 9, 3, 5),
(151, 50, '2024-02-28 22:35:35', 8, 2, 1, 5, 3, 4, 1),
(152, 64, '2024-03-01 12:47:06', 10, 6, 1, 1, 1, 1, 6),
(153, 64, '2024-03-01 17:12:48', 8, 4, 4, 7, 4, 3, 4),
(154, 64, '2024-03-01 18:28:02', 7, 6, 6, 8, 8, 7, 8),
(155, 66, '2024-03-01 21:05:08', 7, 8, 1, 1, 1, 1, 1),
(156, 67, '2024-03-01 21:09:24', 4, 3, 7, 6, 1, 10, 9),
(157, 67, '2024-03-01 21:26:18', 2, 5, 10, 8, 9, 9, 8),
(158, 64, '2024-03-02 17:21:26', 5, 8, 8, 7, 10, 10, 4),
(159, 64, '2024-03-02 17:22:02', 4, 4, 9, 8, 9, 10, 6),
(160, 64, '2024-03-03 13:33:30', 5, 4, 8, 10, 8, 10, 8),
(165, 50, '2024-03-09 15:30:26', 8, 2, 1, 5, 3, 4, 1),
(166, 50, '2024-03-09 15:39:07', 8, 2, 1, 5, 3, 4, 1),
(167, 50, '2024-03-09 15:41:18', 8, 2, 1, 5, 3, 4, 1),
(168, 50, '2024-03-09 15:45:43', 8, 2, 1, 5, 3, 4, 1),
(169, 64, '2024-03-09 18:44:19', 8, 4, 6, 4, 9, 4, 8),
(170, 64, '2024-03-09 18:46:50', 6, 6, 6, 5, 7, 6, 1),
(171, 64, '2024-03-09 19:02:53', 5, 5, 5, 5, 6, 4, 5),
(172, 64, '2024-03-09 19:05:10', 7, 6, 7, 5, 7, 5, 6);

-- --------------------------------------------------------

--
-- Table structure for table `emotion_snap_context_trigger`
--

CREATE TABLE `emotion_snap_context_trigger` (
  `emotion_snap_context_trigger_id` int(11) NOT NULL,
  `emotion_snap_id` int(11) NOT NULL,
  `context_trigger_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `emotion_snap_context_trigger`
--

INSERT INTO `emotion_snap_context_trigger` (`emotion_snap_context_trigger_id`, `emotion_snap_id`, `context_trigger_id`) VALUES
(82, 77, 1),
(83, 78, 7),
(84, 78, 1),
(85, 78, 2),
(86, 79, 7),
(87, 79, 2),
(93, 84, 3),
(102, 89, 7),
(103, 89, 2),
(104, 90, 1),
(105, 90, 2),
(106, 91, 1),
(107, 91, 2),
(108, 92, 1),
(109, 94, 1),
(110, 94, 2),
(115, 95, 1),
(116, 95, 2),
(117, 96, 1),
(118, 96, 2),
(119, 97, 7),
(120, 98, 7),
(121, 98, 1),
(122, 99, 1),
(123, 99, 2),
(126, 101, 7),
(127, 102, 7),
(129, 104, 7),
(130, 104, 1),
(131, 104, 2),
(132, 108, 2),
(133, 111, 1),
(134, 111, 2),
(137, 115, 1),
(138, 115, 2),
(139, 115, 3),
(142, 87, 7),
(143, 87, 1),
(144, 87, 2),
(145, 87, 3),
(146, 117, 7),
(147, 117, 1),
(148, 118, 7),
(149, 118, 2),
(150, 118, 3),
(151, 121, 7),
(152, 121, 1),
(153, 123, 7),
(154, 123, 1),
(155, 124, 7),
(156, 124, 1),
(157, 126, 7),
(158, 126, 1),
(159, 127, 7),
(160, 127, 1),
(161, 129, 7),
(162, 129, 1),
(163, 149, 1),
(164, 151, 1),
(165, 151, 2),
(167, 153, 7),
(168, 153, 1),
(169, 154, 1),
(170, 154, 2),
(171, 154, 3),
(172, 155, 7),
(173, 155, 1),
(174, 155, 2),
(175, 155, 3),
(176, 156, 7),
(177, 156, 1),
(178, 156, 3),
(179, 156, 5),
(180, 156, 6),
(181, 157, 7),
(182, 158, 2),
(183, 158, 3),
(184, 159, 4),
(185, 159, 5),
(186, 160, 4),
(204, 165, 1),
(205, 165, 2),
(208, 166, 1),
(209, 166, 2),
(210, 167, 1),
(211, 167, 2),
(214, 168, 1),
(215, 168, 2),
(216, 76, 1),
(217, 76, 2),
(218, 170, 7),
(219, 170, 1),
(220, 172, 1),
(221, 152, 1),
(222, 152, 2);

-- --------------------------------------------------------

--
-- Table structure for table `user`
--

CREATE TABLE `user` (
  `user_id` int(11) NOT NULL,
  `first_name` varchar(255) NOT NULL,
  `last_name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password` varbinary(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `user`
--

INSERT INTO `user` (`user_id`, `first_name`, `last_name`, `email`, `password`) VALUES
(45, 'Jim', 'Murphy', 'jmurf@online.com', 0x243262243130245233584e2e424a50505833775a48357942426446714f4f306c4e587a34306f2e67773778324259426f476e707a4654672f6e506857),
(46, 'dan', 'murf', 'damurf@online.net', 0x24326224313024333759416d71465671574d57724b2e6e71454d64624f485776787155544a6e377568357862525a38626d475363366348664d2f6365),
(47, 'jim', 'm', 'jm.murf@online.net', 0x24326224313024696e33446b784364432e4d4f6b5559383261524663656a6b534852564b72584335473279466e7a517654524e574e7044513934304f),
(48, 'u', '2', 'bono@rock.u2', 0x24326224313024726a725873506856446930344c4d35542e484b49434f796165714d4e5074725062636a337a335a356765507a4d6e355852757a6647),
(49, 'Danielle', 'Murf', 'danm@stress.com', 0x2432622431302430786a4e4449696b744b544650612e6e444f4c4c46654659785a5a49546f3976336a49304b5073767436626d74623551654e59784f),
(50, 'Jim', 'Bob', 'jbob@online.com', 0x2432622431302468626e416e576b356b764f6e714e7354316f7838684f7048624f6434446f334f355a6231716d754b4b375054436678346e5a56684b),
(51, 'Dan', 'Walsh', 'dwalsh@online.com', 0x2432622431302439386a694a45696c49436b547950643747643634454f5a515076354363487950786b45624a704d4f686353764e4b6f46456176712e),
(52, 'Donna', 'Walsh', 'donnawalsh@online.com', 0x24326224313024684b755362766e4d7a426c6f51714736743573497775304e73766b744a694c446b564673717a477661465662746f687a5651395169),
(53, 'gerry', 'murphy', 'gmurf@orpen.com', 0x2432622431302472417832734b47494a79324d5852616f72632e35434f4c5a786549674272756c544b2e33437a76544d574141416a646d6e62424571),
(54, 'don', 'trump', 'thereal@orange.com', 0x243262243130246b6e62336f56304c35417a614f6863412f3130365165797730415578693754543641535a55396765704876356b7a73335172513169),
(55, 'Jef', 'Bob', 'jef@online.com', 0x2432622431302463543555705872364c6e594c437a4158595648557565794f2e52596b3431756f68732e534935583479494d6e704e7852676c6b354f),
(56, 'adam', 'scott', 'ascott@gold.com', 0x2432622431302459645a39446c596d315858776f6b447969743045382e614f496b4b4b34524865756d486c466755364e6e526172446e436f47634436),
(57, 'big', 'man', 'bigman@tall.com', 0x24326224313024746c3065475273332e4e674235675a54784e50324c75723465622f65657777697a6b58446835706930734775397852354f5177714f),
(58, 'friday', 'night', 'fri@night.com', 0x24326224313024375236776b743470734f774c37394a2f6e303432304f5a66784c744b765753565065623478762f6c52766e42656a2e537a77797061),
(59, 'tired', 'james', 'james@tired.com', 0x24326224313024424c42674c394e534c70446865316672452f7356774f6471355735616a523447362e35716241323831737347654e6268745449432e),
(60, 'Slim', 'Bob', 'slim@online.com', 0x243262243130244178387451636b5053754f39345636426c517149504f2f514456733342475434785561614530474a366b42506c696d744a335a6b4b),
(61, 'very', 'tired', 'real@tired.com', 0x24326224313024524b6f414c456e5a3859517939734742324c7162352e6258497776613661745978394a4e627571616a49686c58356536357a376553),
(62, 'late', 'code', 'late@code.com', 0x243262243130245264775158435537563962574165716b5042385a316561747730413871523973786a7371793551706764367338386c77625176562e),
(63, 'try', 'again', 'try@again.com', 0x243262243130244b50376d39364d6f4b5938794767612f4c6c6f61724f664b30635745786b4e6e695745534c655a544764706570716768334c456f32),
(64, 'Neil', 'Anderson', 'nanderson@online.com', 0x243262243130242f7276466371386b554f476472373132636c5471682e417953536a70306859336a6a585876422f4a7a716e332e4f43344965494453),
(65, 'james', 'murphy', 'jamesm@online.com', 0x2432622431302450477658505a31704e714b395232344a634e55446d7530785441705039384278312f6833365747465546467731556539646c535147),
(66, 'Adam', 'Murphy', 'adamlmurphy@pants.com', 0x2432622431302476514e624b356d627351744241566a4b49636956794f734639767850674153503478444450423374753776745879663557332e4457),
(67, 'Calan', 'Murphy', 'calanjamesmurphy@gmail.com', 0x2432622431302453394831526a78644f715837624e743873444c54382e67337449627264532f423170674d494850644e437a7a56736268616b496943),
(68, 'sunday', 'code', 'suncode@online.com', 0x243262243130246c714856335a682e4c4c4859426f624e56686f615a65454452354442554f487439454550384b6d3576795470332e7a325636505353),
(71, 'Leo', 'Galway', 'lgalway@online.com', 0x24326224313024543749415a574145613750492e45362e57474d47557532465a5a7a376153386f5078527a4d76696c546773446143766c466b375957),
(74, 'Matthew', 'Collins', 'mcollins@online.com', 0x243262243130244944554547454b5743364d316245794264472f4275654a34695730565964634d622f7a3648623444557278705057395259594e556d);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `context_trigger`
--
ALTER TABLE `context_trigger`
  ADD PRIMARY KEY (`context_trigger_id`);

--
-- Indexes for table `emotion_snap`
--
ALTER TABLE `emotion_snap`
  ADD PRIMARY KEY (`emotion_snap_id`),
  ADD KEY `FK_user_user_id` (`user_id`);

--
-- Indexes for table `emotion_snap_context_trigger`
--
ALTER TABLE `emotion_snap_context_trigger`
  ADD PRIMARY KEY (`emotion_snap_context_trigger_id`),
  ADD KEY `FK_emotional_snap_emotional_snap_id` (`emotion_snap_id`),
  ADD KEY `FK_context_trigger_context_trigger_id` (`context_trigger_id`);

--
-- Indexes for table `user`
--
ALTER TABLE `user`
  ADD PRIMARY KEY (`user_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `context_trigger`
--
ALTER TABLE `context_trigger`
  MODIFY `context_trigger_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT for table `emotion_snap`
--
ALTER TABLE `emotion_snap`
  MODIFY `emotion_snap_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=173;

--
-- AUTO_INCREMENT for table `emotion_snap_context_trigger`
--
ALTER TABLE `emotion_snap_context_trigger`
  MODIFY `emotion_snap_context_trigger_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=223;

--
-- AUTO_INCREMENT for table `user`
--
ALTER TABLE `user`
  MODIFY `user_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=75;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `emotion_snap`
--
ALTER TABLE `emotion_snap`
  ADD CONSTRAINT `FK_user_user_id` FOREIGN KEY (`user_id`) REFERENCES `user` (`user_id`);

--
-- Constraints for table `emotion_snap_context_trigger`
--
ALTER TABLE `emotion_snap_context_trigger`
  ADD CONSTRAINT `FK_context_trigger_context_trigger_id` FOREIGN KEY (`context_trigger_id`) REFERENCES `context_trigger` (`context_trigger_id`),
  ADD CONSTRAINT `FK_emotional_snap_emotional_snap_id` FOREIGN KEY (`emotion_snap_id`) REFERENCES `emotion_snap` (`emotion_snap_id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
