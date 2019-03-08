-- phpMyAdmin SQL Dump
-- version 4.8.3
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Mar 08, 2019 at 02:58 PM
-- Server version: 5.6.17
-- PHP Version: 7.1.9

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+00:00";

--
-- Database: `worldaroundyou`
--

-- --------------------------------------------------------

--
-- Table structure for table `description`
--

CREATE TABLE `description` (
  `id` int(11) UNSIGNED NOT NULL,
  `name` varchar(256) NOT NULL,
  `writtenlanguageId` int(11) UNSIGNED NOT NULL DEFAULT '0',
  `storyId` int(11) UNSIGNED NOT NULL DEFAULT '0',
  `datemodified` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `datecreated` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `description`
--

INSERT INTO `description` (`id`, `name`, `writtenlanguageId`, `storyId`, `datemodified`, `datecreated`) VALUES
(8, 'action', 5, 39, '0000-00-00 00:00:00', '0000-00-00 00:00:00'),
(9, 'action', 5, 39, '0000-00-00 00:00:00', '0000-00-00 00:00:00');

-- --------------------------------------------------------

--
-- Table structure for table `genre`
--

CREATE TABLE `genre` (
  `id` int(11) UNSIGNED NOT NULL,
  `name` varchar(256) DEFAULT NULL,
  `writtenlanguageId` int(11) UNSIGNED NOT NULL DEFAULT '0',
  `datemodified` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `datecreated` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `genre`
--

INSERT INTO `genre` (`id`, `name`, `writtenlanguageId`, `datemodified`, `datecreated`) VALUES
(17, 'horror', 17, '0000-00-00 00:00:00', '0000-00-00 00:00:00'),
(18, 'horror', 17, '0000-00-00 00:00:00', '0000-00-00 00:00:00');

-- --------------------------------------------------------

--
-- Table structure for table `liked`
--

CREATE TABLE `liked` (
  `id` int(11) UNSIGNED NOT NULL,
  `storyId` int(11) UNSIGNED NOT NULL DEFAULT '0',
  `datemodified` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `datecreated` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `liked`
--

INSERT INTO `liked` (`id`, `storyId`, `datemodified`, `datecreated`) VALUES
(7, 62, '0000-00-00 00:00:00', '0000-00-00 00:00:00'),
(8, 62, '0000-00-00 00:00:00', '0000-00-00 00:00:00');

-- --------------------------------------------------------

--
-- Table structure for table `signlanguage`
--

CREATE TABLE `signlanguage` (
  `id` int(11) UNSIGNED NOT NULL,
  `name` varchar(256) DEFAULT NULL,
  `datemodified` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `datecreated` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `signlanguage`
--

INSERT INTO `signlanguage` (`id`, `name`, `datemodified`, `datecreated`) VALUES
(4, 'french', '0000-00-00 00:00:00', '0000-00-00 00:00:00');

-- --------------------------------------------------------

--
-- Table structure for table `story`
--

CREATE TABLE `story` (
  `id` int(11) UNSIGNED NOT NULL,
  `author` varchar(256) DEFAULT NULL,
  `descriptionId` int(11) UNSIGNED NOT NULL DEFAULT '0',
  `coverimage` varchar(512) DEFAULT NULL,
  `visible` tinyint(2) UNSIGNED NOT NULL DEFAULT '0',
  `data` blob,
  `datemodified` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `datecreated` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `story`
--

INSERT INTO `story` (`id`, `author`, `descriptionId`, `coverimage`, `visible`, `data`, `datemodified`, `datecreated`) VALUES
(5, 'Rodger Kipling', 15, 'coverimage.img', 1, 0x7b6a736f6e3a7965737d, '0000-00-00 00:00:00', '0000-00-00 00:00:00');

-- --------------------------------------------------------

--
-- Table structure for table `story_to_genre`
--

CREATE TABLE `story_to_genre` (
  `id` int(11) UNSIGNED NOT NULL,
  `storyId` int(11) UNSIGNED NOT NULL DEFAULT '0',
  `genreId` int(11) UNSIGNED NOT NULL DEFAULT '0',
  `datemodified` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `datecreated` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `story_to_genre`
--

INSERT INTO `story_to_genre` (`id`, `storyId`, `genreId`, `datemodified`, `datecreated`) VALUES
(4, 75, 32, '0000-00-00 00:00:00', '0000-00-00 00:00:00');

-- --------------------------------------------------------

--
-- Table structure for table `story_to_signlanguage`
--

CREATE TABLE `story_to_signlanguage` (
  `id` int(11) UNSIGNED NOT NULL,
  `storyId` int(11) UNSIGNED NOT NULL DEFAULT '0',
  `signlanguageId` int(11) UNSIGNED NOT NULL DEFAULT '0',
  `datemodified` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `datecreated` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `story_to_signlanguage`
--

INSERT INTO `story_to_signlanguage` (`id`, `storyId`, `signlanguageId`, `datemodified`, `datecreated`) VALUES
(4, 71, 37, '0000-00-00 00:00:00', '0000-00-00 00:00:00');

-- --------------------------------------------------------

--
-- Table structure for table `story_to_tag`
--

CREATE TABLE `story_to_tag` (
  `id` int(11) UNSIGNED NOT NULL,
  `storyId` int(11) UNSIGNED NOT NULL DEFAULT '0',
  `tagId` int(11) UNSIGNED NOT NULL DEFAULT '0',
  `datemodified` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `datecreated` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `story_to_tag`
--

INSERT INTO `story_to_tag` (`id`, `storyId`, `tagId`, `datemodified`, `datecreated`) VALUES
(4, 43, 89, '0000-00-00 00:00:00', '0000-00-00 00:00:00');

-- --------------------------------------------------------

--
-- Table structure for table `story_to_writtenlanguage`
--

CREATE TABLE `story_to_writtenlanguage` (
  `id` int(11) UNSIGNED NOT NULL,
  `storyId` int(11) UNSIGNED NOT NULL DEFAULT '0',
  `writtenlanguageId` int(11) UNSIGNED NOT NULL DEFAULT '0',
  `datemodified` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `datecreated` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `story_to_writtenlanguage`
--

INSERT INTO `story_to_writtenlanguage` (`id`, `storyId`, `writtenlanguageId`, `datemodified`, `datecreated`) VALUES
(4, 22, 5, '0000-00-00 00:00:00', '0000-00-00 00:00:00');

-- --------------------------------------------------------

--
-- Table structure for table `tag`
--

CREATE TABLE `tag` (
  `id` int(11) UNSIGNED NOT NULL,
  `name` varchar(256) DEFAULT NULL,
  `writtenlanguageId` int(11) UNSIGNED NOT NULL DEFAULT '0',
  `datemodified` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `datecreated` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `tag`
--

INSERT INTO `tag` (`id`, `name`, `writtenlanguageId`, `datemodified`, `datecreated`) VALUES
(4, 'tagalog', 66, '0000-00-00 00:00:00', '0000-00-00 00:00:00'),
(5, 'tagalog', 66, '0000-00-00 00:00:00', '0000-00-00 00:00:00');

-- --------------------------------------------------------

--
-- Table structure for table `title`
--

CREATE TABLE `title` (
  `id` int(11) UNSIGNED NOT NULL,
  `name` varchar(256) DEFAULT NULL,
  `writtenlanguageId` int(11) UNSIGNED NOT NULL DEFAULT '0',
  `storyId` int(11) UNSIGNED NOT NULL DEFAULT '0',
  `datemodified` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `datecreated` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `title`
--

INSERT INTO `title` (`id`, `name`, `writtenlanguageId`, `storyId`, `datemodified`, `datecreated`) VALUES
(4, 'Jonah and the whale', 666, 777, '0000-00-00 00:00:00', '0000-00-00 00:00:00'),
(5, 'Jonah and the whale', 666, 777, '0000-00-00 00:00:00', '0000-00-00 00:00:00');

-- --------------------------------------------------------

--
-- Table structure for table `user`
--

CREATE TABLE `user` (
  `id` int(11) UNSIGNED NOT NULL,
  `email` varchar(256) DEFAULT NULL,
  `password` varchar(256) DEFAULT NULL,
  `firstname` varchar(100) DEFAULT NULL,
  `lastname` varchar(100) DEFAULT NULL,
  `usertypeid` int(11) UNSIGNED NOT NULL DEFAULT '0',
  `datemodified` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `datecreated` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `user`
--

INSERT INTO `user` (`id`, `email`, `password`, `firstname`, `lastname`, `usertypeid`, `datemodified`, `datecreated`) VALUES
(8, 'first_one@fir_stone.edu', 'secret', 'Alexandria', 'Squarepants', 5, '0000-00-00 00:00:00', '0000-00-00 00:00:00');

-- --------------------------------------------------------

--
-- Table structure for table `usertype`
--

CREATE TABLE `usertype` (
  `id` int(11) UNSIGNED NOT NULL,
  `name` varchar(100) DEFAULT NULL,
  `datemodified` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `datecreated` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `usertype`
--

INSERT INTO `usertype` (`id`, `name`, `datemodified`, `datecreated`) VALUES
(4, 'fraud', '0000-00-00 00:00:00', '0000-00-00 00:00:00'),
(5, 'admin', '0000-00-00 00:00:00', '0000-00-00 00:00:00');

-- --------------------------------------------------------

--
-- Table structure for table `view`
--

CREATE TABLE `view` (
  `id` int(11) UNSIGNED NOT NULL,
  `storyId` int(11) UNSIGNED NOT NULL DEFAULT '0',
  `datemodified` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `datecreated` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `view`
--

INSERT INTO `view` (`id`, `storyId`, `datemodified`, `datecreated`) VALUES
(5, 808, '0000-00-00 00:00:00', '0000-00-00 00:00:00');

-- --------------------------------------------------------

--
-- Table structure for table `writtenlanguage`
--

CREATE TABLE `writtenlanguage` (
  `id` int(11) UNSIGNED NOT NULL,
  `name` varchar(256) DEFAULT NULL,
  `datemodified` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `datecreated` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `writtenlanguage`
--

INSERT INTO `writtenlanguage` (`id`, `name`, `datemodified`, `datecreated`) VALUES
(4, 'spanish', '0000-00-00 00:00:00', '0000-00-00 00:00:00');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `description`
--
ALTER TABLE `description`
  ADD PRIMARY KEY (`id`),
  ADD KEY `name` (`name`),
  ADD KEY `writtenlanguageId` (`writtenlanguageId`),
  ADD KEY `storyId` (`storyId`);

--
-- Indexes for table `genre`
--
ALTER TABLE `genre`
  ADD PRIMARY KEY (`id`),
  ADD KEY `name` (`name`),
  ADD KEY `writtenlanguageId` (`writtenlanguageId`);

--
-- Indexes for table `liked`
--
ALTER TABLE `liked`
  ADD PRIMARY KEY (`id`),
  ADD KEY `storyId` (`storyId`);

--
-- Indexes for table `signlanguage`
--
ALTER TABLE `signlanguage`
  ADD PRIMARY KEY (`id`),
  ADD KEY `name` (`name`);

--
-- Indexes for table `story`
--
ALTER TABLE `story`
  ADD PRIMARY KEY (`id`),
  ADD KEY `author` (`author`);

--
-- Indexes for table `story_to_genre`
--
ALTER TABLE `story_to_genre`
  ADD PRIMARY KEY (`id`),
  ADD KEY `storyId` (`storyId`),
  ADD KEY `genreId` (`genreId`);

--
-- Indexes for table `story_to_signlanguage`
--
ALTER TABLE `story_to_signlanguage`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `story_to_tag`
--
ALTER TABLE `story_to_tag`
  ADD PRIMARY KEY (`id`),
  ADD KEY `stroyId` (`storyId`);

--
-- Indexes for table `story_to_writtenlanguage`
--
ALTER TABLE `story_to_writtenlanguage`
  ADD PRIMARY KEY (`id`),
  ADD KEY `storyId` (`storyId`),
  ADD KEY `writtenlanguageId` (`writtenlanguageId`);

--
-- Indexes for table `tag`
--
ALTER TABLE `tag`
  ADD PRIMARY KEY (`id`),
  ADD KEY `name` (`name`),
  ADD KEY `writtenlanguageId` (`writtenlanguageId`);

--
-- Indexes for table `title`
--
ALTER TABLE `title`
  ADD PRIMARY KEY (`id`),
  ADD KEY `name` (`name`),
  ADD KEY `writtenlanguageId` (`writtenlanguageId`),
  ADD KEY `storyId` (`storyId`);

--
-- Indexes for table `user`
--
ALTER TABLE `user`
  ADD PRIMARY KEY (`id`),
  ADD KEY `email` (`email`),
  ADD KEY `password` (`password`),
  ADD KEY `usertypeid` (`usertypeid`),
  ADD KEY `firstname` (`firstname`),
  ADD KEY `lastname` (`lastname`);

--
-- Indexes for table `usertype`
--
ALTER TABLE `usertype`
  ADD PRIMARY KEY (`id`),
  ADD KEY `name` (`name`);

--
-- Indexes for table `view`
--
ALTER TABLE `view`
  ADD PRIMARY KEY (`id`),
  ADD KEY `storyId` (`storyId`);

--
-- Indexes for table `writtenlanguage`
--
ALTER TABLE `writtenlanguage`
  ADD PRIMARY KEY (`id`),
  ADD KEY `name` (`name`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `description`
--
ALTER TABLE `description`
  MODIFY `id` int(11) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- AUTO_INCREMENT for table `genre`
--
ALTER TABLE `genre`
  MODIFY `id` int(11) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=19;

--
-- AUTO_INCREMENT for table `liked`
--
ALTER TABLE `liked`
  MODIFY `id` int(11) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT for table `signlanguage`
--
ALTER TABLE `signlanguage`
  MODIFY `id` int(11) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `story`
--
ALTER TABLE `story`
  MODIFY `id` int(11) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `story_to_genre`
--
ALTER TABLE `story_to_genre`
  MODIFY `id` int(11) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `story_to_signlanguage`
--
ALTER TABLE `story_to_signlanguage`
  MODIFY `id` int(11) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `story_to_tag`
--
ALTER TABLE `story_to_tag`
  MODIFY `id` int(11) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `story_to_writtenlanguage`
--
ALTER TABLE `story_to_writtenlanguage`
  MODIFY `id` int(11) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `tag`
--
ALTER TABLE `tag`
  MODIFY `id` int(11) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `title`
--
ALTER TABLE `title`
  MODIFY `id` int(11) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `user`
--
ALTER TABLE `user`
  MODIFY `id` int(11) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT for table `usertype`
--
ALTER TABLE `usertype`
  MODIFY `id` int(11) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `view`
--
ALTER TABLE `view`
  MODIFY `id` int(11) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `writtenlanguage`
--
ALTER TABLE `writtenlanguage`
  MODIFY `id` int(11) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;
COMMIT;
