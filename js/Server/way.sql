-- MySQL dump 10.16  Distrib 10.2.22-MariaDB, for Linux (x86_64)
--
-- Host: localhost    Database: way
-- ------------------------------------------------------
-- Server version	10.2.22-MariaDB

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `description`
--

DROP TABLE IF EXISTS `description`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `description` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(256) NOT NULL,
  `writtenlanguageId` int(11) unsigned NOT NULL DEFAULT 0,
  `storyId` int(11) unsigned NOT NULL DEFAULT 0,
  `datemodified` int(11) unsigned NOT NULL DEFAULT 0,
  `datecreated` int(11) unsigned NOT NULL DEFAULT 0,
  PRIMARY KEY (`id`),
  KEY `name` (`name`),
  KEY `writtenlanguageId` (`writtenlanguageId`),
  KEY `storyId` (`storyId`)
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `description`
--

LOCK TABLES `description` WRITE;
/*!40000 ALTER TABLE `description` DISABLE KEYS */;
INSERT INTO `description` VALUES (8,'action',5,39,0,1551883958),(9,'action',5,39,0,1551887219);
/*!40000 ALTER TABLE `description` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `genre`
--

DROP TABLE IF EXISTS `genre`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `genre` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(256) DEFAULT NULL,
  `writtenlanguageId` int(11) unsigned NOT NULL DEFAULT 0,
  `datemodified` int(11) unsigned NOT NULL DEFAULT 0,
  `datecreated` int(11) unsigned NOT NULL DEFAULT 0,
  PRIMARY KEY (`id`),
  KEY `name` (`name`),
  KEY `writtenlanguageId` (`writtenlanguageId`)
) ENGINE=InnoDB AUTO_INCREMENT=19 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `genre`
--

LOCK TABLES `genre` WRITE;
/*!40000 ALTER TABLE `genre` DISABLE KEYS */;
INSERT INTO `genre` VALUES (17,'horror',17,0,1551883925),(18,'horror',17,0,1551887212);
/*!40000 ALTER TABLE `genre` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `liked`
--

DROP TABLE IF EXISTS `liked`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `liked` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `storyId` int(11) unsigned NOT NULL DEFAULT 0,
  `datemodified` int(11) unsigned NOT NULL DEFAULT 0,
  `datecreated` int(11) unsigned NOT NULL DEFAULT 0,
  PRIMARY KEY (`id`),
  KEY `storyId` (`storyId`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `liked`
--

LOCK TABLES `liked` WRITE;
/*!40000 ALTER TABLE `liked` DISABLE KEYS */;
INSERT INTO `liked` VALUES (7,62,0,1551884018),(8,62,0,1551887225);
/*!40000 ALTER TABLE `liked` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `signlanguage`
--

DROP TABLE IF EXISTS `signlanguage`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `signlanguage` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(256) DEFAULT NULL,
  `datemodified` int(11) NOT NULL DEFAULT 0,
  `datecreated` int(11) NOT NULL DEFAULT 0,
  PRIMARY KEY (`id`),
  KEY `name` (`name`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `signlanguage`
--

LOCK TABLES `signlanguage` WRITE;
/*!40000 ALTER TABLE `signlanguage` DISABLE KEYS */;
INSERT INTO `signlanguage` VALUES (4,'french',0,1551884044);
/*!40000 ALTER TABLE `signlanguage` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `story`
--

DROP TABLE IF EXISTS `story`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `story` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `author` varchar(256) DEFAULT NULL,
  `descriptionId` int(11) unsigned NOT NULL DEFAULT 0,
  `coverimage` varchar(512) DEFAULT NULL,
  `visible` tinyint(2) unsigned NOT NULL DEFAULT 0,
  `data` blob DEFAULT NULL,
  `datemodified` int(11) unsigned NOT NULL DEFAULT 0,
  `datecreated` int(11) unsigned NOT NULL DEFAULT 0,
  PRIMARY KEY (`id`),
  KEY `author` (`author`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `story`
--

LOCK TABLES `story` WRITE;
/*!40000 ALTER TABLE `story` DISABLE KEYS */;
INSERT INTO `story` VALUES (5,'Rodger Kipling',15,'coverimage.img',1,'{json:yes}',0,1551884414);
/*!40000 ALTER TABLE `story` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `story_to_genre`
--

DROP TABLE IF EXISTS `story_to_genre`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `story_to_genre` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `storyId` int(11) unsigned NOT NULL DEFAULT 0,
  `genreId` int(11) unsigned NOT NULL DEFAULT 0,
  `datemodified` int(11) unsigned NOT NULL DEFAULT 0,
  `datecreated` int(11) unsigned NOT NULL DEFAULT 0,
  PRIMARY KEY (`id`),
  KEY `storyId` (`storyId`),
  KEY `genreId` (`genreId`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `story_to_genre`
--

LOCK TABLES `story_to_genre` WRITE;
/*!40000 ALTER TABLE `story_to_genre` DISABLE KEYS */;
INSERT INTO `story_to_genre` VALUES (4,75,32,0,1551884446);
/*!40000 ALTER TABLE `story_to_genre` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `story_to_signlanguage`
--

DROP TABLE IF EXISTS `story_to_signlanguage`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `story_to_signlanguage` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `storyId` int(11) unsigned NOT NULL DEFAULT 0,
  `signlanguageId` int(11) unsigned NOT NULL DEFAULT 0,
  `datemodified` int(11) unsigned NOT NULL DEFAULT 0,
  `datecreated` int(11) unsigned NOT NULL DEFAULT 0,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `story_to_signlanguage`
--

LOCK TABLES `story_to_signlanguage` WRITE;
/*!40000 ALTER TABLE `story_to_signlanguage` DISABLE KEYS */;
INSERT INTO `story_to_signlanguage` VALUES (4,71,37,0,1551884478);
/*!40000 ALTER TABLE `story_to_signlanguage` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `story_to_tag`
--

DROP TABLE IF EXISTS `story_to_tag`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `story_to_tag` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `storyId` int(11) unsigned NOT NULL DEFAULT 0,
  `tagId` int(11) unsigned NOT NULL DEFAULT 0,
  `datemodified` int(11) unsigned NOT NULL DEFAULT 0,
  `datecreated` int(11) unsigned NOT NULL DEFAULT 0,
  PRIMARY KEY (`id`),
  KEY `stroyId` (`storyId`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `story_to_tag`
--

LOCK TABLES `story_to_tag` WRITE;
/*!40000 ALTER TABLE `story_to_tag` DISABLE KEYS */;
INSERT INTO `story_to_tag` VALUES (4,43,89,0,1551884502);
/*!40000 ALTER TABLE `story_to_tag` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `story_to_writtenlanguage`
--

DROP TABLE IF EXISTS `story_to_writtenlanguage`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `story_to_writtenlanguage` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `storyId` int(11) unsigned NOT NULL DEFAULT 0,
  `writtenlanguageId` int(11) unsigned NOT NULL DEFAULT 0,
  `datemodified` int(11) unsigned NOT NULL DEFAULT 0,
  `datecreated` int(11) unsigned NOT NULL DEFAULT 0,
  PRIMARY KEY (`id`),
  KEY `storyId` (`storyId`),
  KEY `writtenlanguageId` (`writtenlanguageId`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `story_to_writtenlanguage`
--

LOCK TABLES `story_to_writtenlanguage` WRITE;
/*!40000 ALTER TABLE `story_to_writtenlanguage` DISABLE KEYS */;
INSERT INTO `story_to_writtenlanguage` VALUES (4,22,5,0,1551884521);
/*!40000 ALTER TABLE `story_to_writtenlanguage` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tag`
--

DROP TABLE IF EXISTS `tag`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `tag` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(256) DEFAULT NULL,
  `writtenlanguageId` int(11) unsigned NOT NULL DEFAULT 0,
  `datemodified` int(11) unsigned NOT NULL DEFAULT 0,
  `datecreated` int(11) unsigned NOT NULL DEFAULT 0,
  PRIMARY KEY (`id`),
  KEY `name` (`name`),
  KEY `writtenlanguageId` (`writtenlanguageId`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tag`
--

LOCK TABLES `tag` WRITE;
/*!40000 ALTER TABLE `tag` DISABLE KEYS */;
INSERT INTO `tag` VALUES (4,'tagalog',66,0,1551884540),(5,'tagalog',66,0,1551887231);
/*!40000 ALTER TABLE `tag` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `title`
--

DROP TABLE IF EXISTS `title`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `title` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(256) DEFAULT NULL,
  `writtenlanguageId` int(11) unsigned NOT NULL DEFAULT 0,
  `storyId` int(11) unsigned NOT NULL DEFAULT 0,
  `datemodified` int(11) unsigned NOT NULL DEFAULT 0,
  `datecreated` int(11) unsigned NOT NULL DEFAULT 0,
  PRIMARY KEY (`id`),
  KEY `name` (`name`),
  KEY `writtenlanguageId` (`writtenlanguageId`),
  KEY `storyId` (`storyId`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `title`
--

LOCK TABLES `title` WRITE;
/*!40000 ALTER TABLE `title` DISABLE KEYS */;
INSERT INTO `title` VALUES (4,'Jonah and the whale',666,777,0,1551884568),(5,'Jonah and the whale',666,777,0,1551887236);
/*!40000 ALTER TABLE `title` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user`
--

DROP TABLE IF EXISTS `user`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `user` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `email` varchar(256) DEFAULT NULL,
  `password` varchar(256) DEFAULT NULL,
  `firstname` varchar(100) DEFAULT NULL,
  `lastname` varchar(100) DEFAULT NULL,
  `usertypeid` int(11) unsigned NOT NULL DEFAULT 0,
  `datemodified` int(11) unsigned NOT NULL DEFAULT 0,
  `datecreated` int(11) unsigned NOT NULL DEFAULT 0,
  PRIMARY KEY (`id`),
  KEY `email` (`email`),
  KEY `password` (`password`),
  KEY `usertypeid` (`usertypeid`),
  KEY `firstname` (`firstname`),
  KEY `lastname` (`lastname`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user`
--

LOCK TABLES `user` WRITE;
/*!40000 ALTER TABLE `user` DISABLE KEYS */;
INSERT INTO `user` VALUES (8,'first_one@fir_stone.edu','secret','Alexandria','Squarepants',5,0,1551886736);
/*!40000 ALTER TABLE `user` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `usertype`
--

DROP TABLE IF EXISTS `usertype`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `usertype` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(100) DEFAULT NULL,
  `datemodified` int(11) unsigned NOT NULL DEFAULT 0,
  `datecreated` int(11) unsigned NOT NULL DEFAULT 0,
  PRIMARY KEY (`id`),
  KEY `name` (`name`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `usertype`
--

LOCK TABLES `usertype` WRITE;
/*!40000 ALTER TABLE `usertype` DISABLE KEYS */;
INSERT INTO `usertype` VALUES (4,'fraud',0,1551884613),(5,'admin',0,1551886254);
/*!40000 ALTER TABLE `usertype` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `view`
--

DROP TABLE IF EXISTS `view`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `view` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `storyId` int(11) unsigned NOT NULL DEFAULT 0,
  `datemodified` int(11) unsigned NOT NULL DEFAULT 0,
  `datecreated` int(11) unsigned NOT NULL DEFAULT 0,
  PRIMARY KEY (`id`),
  KEY `storyId` (`storyId`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `view`
--

LOCK TABLES `view` WRITE;
/*!40000 ALTER TABLE `view` DISABLE KEYS */;
INSERT INTO `view` VALUES (5,808,0,1551884630);
/*!40000 ALTER TABLE `view` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `writtenlanguage`
--

DROP TABLE IF EXISTS `writtenlanguage`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `writtenlanguage` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(256) DEFAULT NULL,
  `datemodified` int(11) unsigned NOT NULL DEFAULT 0,
  `datecreated` int(11) unsigned NOT NULL DEFAULT 0,
  PRIMARY KEY (`id`),
  KEY `name` (`name`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `writtenlanguage`
--

LOCK TABLES `writtenlanguage` WRITE;
/*!40000 ALTER TABLE `writtenlanguage` DISABLE KEYS */;
INSERT INTO `writtenlanguage` VALUES (4,'spanish',0,1551884655);
/*!40000 ALTER TABLE `writtenlanguage` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2019-03-06 10:51:15
