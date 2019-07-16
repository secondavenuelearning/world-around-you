-- phpMyAdmin SQL Dump
-- version 4.6.4
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Jul 16, 2019 at 06:32 PM
-- Server version: 5.7.14
-- PHP Version: 5.6.25

SET FOREIGN_KEY_CHECKS=0;
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

-- --------------------------------------------------------

--
-- Table structure for table `game`
--

CREATE TABLE `game` (
  `id` int(11) UNSIGNED NOT NULL,
  `name` varchar(256) DEFAULT NULL,
  `path` varchar(265) DEFAULT NULL,
  `datemodified` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `datecreated` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `gamedata`
--

CREATE TABLE `gamedata` (
  `id` int(11) UNSIGNED NOT NULL,
  `gameId` int(11) UNSIGNED NOT NULL DEFAULT '0',
  `storyId` int(11) UNSIGNED NOT NULL DEFAULT '0',
  `writtenlanguageId` int(11) UNSIGNED NOT NULL,
  `signlanguageId` int(11) UNSIGNED NOT NULL,
  `data` text,
  `datemodified` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `datecreated` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

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

-- --------------------------------------------------------

--
-- Table structure for table `signer`
--

CREATE TABLE `signer` (
  `id` int(11) UNSIGNED NOT NULL,
  `name` varchar(256) DEFAULT NULL,
  `writtenlanguageId` int(11) UNSIGNED NOT NULL DEFAULT '0',
  `storyId` int(11) UNSIGNED NOT NULL DEFAULT '0',
  `datemodified` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `datecreated` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

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

-- --------------------------------------------------------

--
-- Table structure for table `story`
--

CREATE TABLE `story` (
  `id` int(11) UNSIGNED NOT NULL,
  `author` varchar(256) DEFAULT NULL,
  `artist` varchar(256) CHARACTER SET latin1 COLLATE latin1_spanish_ci DEFAULT NULL,
  `coverimage` varchar(512) DEFAULT NULL,
  `visible` tinyint(1) UNSIGNED NOT NULL DEFAULT '0',
  `data` text CHARACTER SET utf8mb4 COLLATE utf8mb4_bin,
  `datemodified` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `datecreated` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

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

-- --------------------------------------------------------

--
-- Table structure for table `story_to_user`
--

CREATE TABLE `story_to_user` (
  `id` int(11) UNSIGNED NOT NULL,
  `storyId` int(11) UNSIGNED NOT NULL,
  `userId` int(11) UNSIGNED NOT NULL,
  `datemodified` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `datecreated` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

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

-- --------------------------------------------------------

--
-- Table structure for table `translator`
--

CREATE TABLE `translator` (
  `id` int(11) UNSIGNED NOT NULL,
  `name` varchar(256) DEFAULT NULL,
  `writtenlanguageId` int(11) UNSIGNED NOT NULL DEFAULT '0',
  `storyId` int(11) UNSIGNED NOT NULL DEFAULT '0',
  `datemodified` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `datecreated` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `user`
--

CREATE TABLE `user` (
  `id` int(11) UNSIGNED NOT NULL,
  `username` varchar(256) NOT NULL,
  `email` varchar(256) NOT NULL,
  `password` varchar(256) NOT NULL,
  `firstname` varchar(100) DEFAULT NULL,
  `lastname` varchar(100) DEFAULT NULL,
  `usertypeid` int(11) UNSIGNED DEFAULT NULL,
  `datemodified` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `datecreated` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

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
-- Indexes for table `game`
--
ALTER TABLE `game`
  ADD PRIMARY KEY (`id`),
  ADD KEY `name` (`name`),
  ADD KEY `filename` (`path`);

--
-- Indexes for table `gamedata`
--
ALTER TABLE `gamedata`
  ADD PRIMARY KEY (`id`),
  ADD KEY `gameId` (`gameId`),
  ADD KEY `storyId` (`storyId`),
  ADD KEY `writtenlanguageId` (`writtenlanguageId`),
  ADD KEY `signlanguageId` (`signlanguageId`);

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
-- Indexes for table `signer`
--
ALTER TABLE `signer`
  ADD PRIMARY KEY (`id`),
  ADD KEY `name` (`name`),
  ADD KEY `writtenlanguageId` (`writtenlanguageId`),
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
  ADD PRIMARY KEY (`id`),
  ADD KEY `signlanguageId` (`signlanguageId`),
  ADD KEY `storyId` (`storyId`);

--
-- Indexes for table `story_to_tag`
--
ALTER TABLE `story_to_tag`
  ADD PRIMARY KEY (`id`),
  ADD KEY `stroyId` (`storyId`),
  ADD KEY `tagId` (`tagId`);

--
-- Indexes for table `story_to_user`
--
ALTER TABLE `story_to_user`
  ADD PRIMARY KEY (`id`),
  ADD KEY `storyId` (`storyId`),
  ADD KEY `userId` (`userId`);

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
-- Indexes for table `translator`
--
ALTER TABLE `translator`
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
  ADD KEY `lastname` (`lastname`),
  ADD KEY `username` (`username`);

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
  MODIFY `id` int(11) UNSIGNED NOT NULL AUTO_INCREMENT;
--
-- AUTO_INCREMENT for table `game`
--
ALTER TABLE `game`
  MODIFY `id` int(11) UNSIGNED NOT NULL AUTO_INCREMENT;
--
-- AUTO_INCREMENT for table `gamedata`
--
ALTER TABLE `gamedata`
  MODIFY `id` int(11) UNSIGNED NOT NULL AUTO_INCREMENT;
--
-- AUTO_INCREMENT for table `genre`
--
ALTER TABLE `genre`
  MODIFY `id` int(11) UNSIGNED NOT NULL AUTO_INCREMENT;
--
-- AUTO_INCREMENT for table `liked`
--
ALTER TABLE `liked`
  MODIFY `id` int(11) UNSIGNED NOT NULL AUTO_INCREMENT;
--
-- AUTO_INCREMENT for table `signer`
--
ALTER TABLE `signer`
  MODIFY `id` int(11) UNSIGNED NOT NULL AUTO_INCREMENT;
--
-- AUTO_INCREMENT for table `signlanguage`
--
ALTER TABLE `signlanguage`
  MODIFY `id` int(11) UNSIGNED NOT NULL AUTO_INCREMENT;
--
-- AUTO_INCREMENT for table `story`
--
ALTER TABLE `story`
  MODIFY `id` int(11) UNSIGNED NOT NULL AUTO_INCREMENT;
--
-- AUTO_INCREMENT for table `story_to_genre`
--
ALTER TABLE `story_to_genre`
  MODIFY `id` int(11) UNSIGNED NOT NULL AUTO_INCREMENT;
--
-- AUTO_INCREMENT for table `story_to_signlanguage`
--
ALTER TABLE `story_to_signlanguage`
  MODIFY `id` int(11) UNSIGNED NOT NULL AUTO_INCREMENT;
--
-- AUTO_INCREMENT for table `story_to_tag`
--
ALTER TABLE `story_to_tag`
  MODIFY `id` int(11) UNSIGNED NOT NULL AUTO_INCREMENT;
--
-- AUTO_INCREMENT for table `story_to_user`
--
ALTER TABLE `story_to_user`
  MODIFY `id` int(11) UNSIGNED NOT NULL AUTO_INCREMENT;
--
-- AUTO_INCREMENT for table `story_to_writtenlanguage`
--
ALTER TABLE `story_to_writtenlanguage`
  MODIFY `id` int(11) UNSIGNED NOT NULL AUTO_INCREMENT;
--
-- AUTO_INCREMENT for table `tag`
--
ALTER TABLE `tag`
  MODIFY `id` int(11) UNSIGNED NOT NULL AUTO_INCREMENT;
--
-- AUTO_INCREMENT for table `title`
--
ALTER TABLE `title`
  MODIFY `id` int(11) UNSIGNED NOT NULL AUTO_INCREMENT;
--
-- AUTO_INCREMENT for table `translator`
--
ALTER TABLE `translator`
  MODIFY `id` int(11) UNSIGNED NOT NULL AUTO_INCREMENT;
--
-- AUTO_INCREMENT for table `user`
--
ALTER TABLE `user`
  MODIFY `id` int(11) UNSIGNED NOT NULL AUTO_INCREMENT;
--
-- AUTO_INCREMENT for table `usertype`
--
ALTER TABLE `usertype`
  MODIFY `id` int(11) UNSIGNED NOT NULL AUTO_INCREMENT;
--
-- AUTO_INCREMENT for table `view`
--
ALTER TABLE `view`
  MODIFY `id` int(11) UNSIGNED NOT NULL AUTO_INCREMENT;
--
-- AUTO_INCREMENT for table `writtenlanguage`
--
ALTER TABLE `writtenlanguage`
  MODIFY `id` int(11) UNSIGNED NOT NULL AUTO_INCREMENT;
--
-- Constraints for dumped tables
--

--
-- Constraints for table `description`
--
ALTER TABLE `description`
  ADD CONSTRAINT `description_ibfk_1` FOREIGN KEY (`storyId`) REFERENCES `story` (`id`),
  ADD CONSTRAINT `description_ibfk_2` FOREIGN KEY (`writtenlanguageId`) REFERENCES `writtenlanguage` (`id`);

--
-- Constraints for table `gamedata`
--
ALTER TABLE `gamedata`
  ADD CONSTRAINT `gamedata_ibfk_1` FOREIGN KEY (`gameId`) REFERENCES `game` (`id`),
  ADD CONSTRAINT `gamedata_ibfk_2` FOREIGN KEY (`storyId`) REFERENCES `story` (`id`),
  ADD CONSTRAINT `gamedata_ibfk_3` FOREIGN KEY (`writtenlanguageId`) REFERENCES `writtenlanguage` (`id`),
  ADD CONSTRAINT `gamedata_ibfk_4` FOREIGN KEY (`signlanguageId`) REFERENCES `signlanguage` (`id`);

--
-- Constraints for table `genre`
--
ALTER TABLE `genre`
  ADD CONSTRAINT `genre_ibfk_1` FOREIGN KEY (`writtenlanguageId`) REFERENCES `writtenlanguage` (`id`);

--
-- Constraints for table `liked`
--
ALTER TABLE `liked`
  ADD CONSTRAINT `liked_ibfk_1` FOREIGN KEY (`storyId`) REFERENCES `story` (`id`);

--
-- Constraints for table `story_to_genre`
--
ALTER TABLE `story_to_genre`
  ADD CONSTRAINT `story_to_genre_ibfk_1` FOREIGN KEY (`storyId`) REFERENCES `story` (`id`),
  ADD CONSTRAINT `story_to_genre_ibfk_2` FOREIGN KEY (`genreId`) REFERENCES `genre` (`id`);

--
-- Constraints for table `story_to_signlanguage`
--
ALTER TABLE `story_to_signlanguage`
  ADD CONSTRAINT `story_to_signlanguage_ibfk_1` FOREIGN KEY (`signlanguageId`) REFERENCES `signlanguage` (`id`),
  ADD CONSTRAINT `story_to_signlanguage_ibfk_2` FOREIGN KEY (`storyId`) REFERENCES `story` (`id`);

--
-- Constraints for table `story_to_tag`
--
ALTER TABLE `story_to_tag`
  ADD CONSTRAINT `story_to_tag_ibfk_1` FOREIGN KEY (`storyId`) REFERENCES `story` (`id`),
  ADD CONSTRAINT `story_to_tag_ibfk_2` FOREIGN KEY (`tagId`) REFERENCES `tag` (`id`);

--
-- Constraints for table `story_to_user`
--
ALTER TABLE `story_to_user`
  ADD CONSTRAINT `story_to_user_ibfk_1` FOREIGN KEY (`storyId`) REFERENCES `story` (`id`),
  ADD CONSTRAINT `story_to_user_ibfk_2` FOREIGN KEY (`userId`) REFERENCES `user` (`id`);

--
-- Constraints for table `story_to_writtenlanguage`
--
ALTER TABLE `story_to_writtenlanguage`
  ADD CONSTRAINT `story_to_writtenlanguage_ibfk_1` FOREIGN KEY (`storyId`) REFERENCES `story` (`id`),
  ADD CONSTRAINT `story_to_writtenlanguage_ibfk_2` FOREIGN KEY (`writtenlanguageId`) REFERENCES `writtenlanguage` (`id`);

--
-- Constraints for table `tag`
--
ALTER TABLE `tag`
  ADD CONSTRAINT `tag_ibfk_1` FOREIGN KEY (`writtenlanguageId`) REFERENCES `writtenlanguage` (`id`);

--
-- Constraints for table `title`
--
ALTER TABLE `title`
  ADD CONSTRAINT `title_ibfk_1` FOREIGN KEY (`storyId`) REFERENCES `story` (`id`),
  ADD CONSTRAINT `title_ibfk_2` FOREIGN KEY (`writtenlanguageId`) REFERENCES `writtenlanguage` (`id`);

--
-- Constraints for table `user`
--
ALTER TABLE `user`
  ADD CONSTRAINT `user_ibfk_1` FOREIGN KEY (`usertypeid`) REFERENCES `usertype` (`id`);

--
-- Constraints for table `view`
--
ALTER TABLE `view`
  ADD CONSTRAINT `view_ibfk_1` FOREIGN KEY (`storyId`) REFERENCES `story` (`id`);
SET FOREIGN_KEY_CHECKS=1;
COMMIT;
