-- MySQL dump 10.13  Distrib 8.0.44, for Win64 (x86_64)
--
-- Host: localhost    Database: containermanagementdb
-- ------------------------------------------------------
-- Server version	8.0.44

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `approval_requests`
--

DROP TABLE IF EXISTS `approval_requests`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `approval_requests` (
  `id` int NOT NULL AUTO_INCREMENT,
  `container_id` int NOT NULL,
  `from_stage` int NOT NULL,
  `to_stage` int NOT NULL,
  `requested_action` varchar(100) NOT NULL,
  `required_role` varchar(20) NOT NULL,
  `comments` text,
  `status` enum('PENDING','APPROVED','REJECTED') DEFAULT 'PENDING',
  `requested_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `reviewed_at` timestamp NULL DEFAULT NULL,
  `requested_by_user_id` int NOT NULL,
  `reviewed_by_user_id` int DEFAULT NULL,
  `used_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_approval_requester` (`requested_by_user_id`),
  KEY `fk_approval_reviewer` (`reviewed_by_user_id`),
  KEY `idx_approval_container` (`container_id`),
  CONSTRAINT `fk_approval_container` FOREIGN KEY (`container_id`) REFERENCES `containers` (`id`),
  CONSTRAINT `fk_approval_requester` FOREIGN KEY (`requested_by_user_id`) REFERENCES `users` (`id`),
  CONSTRAINT `fk_approval_reviewer` FOREIGN KEY (`reviewed_by_user_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=33 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `approval_requests`
--

LOCK TABLES `approval_requests` WRITE;
/*!40000 ALTER TABLE `approval_requests` DISABLE KEYS */;
INSERT INTO `approval_requests` VALUES (28,1,2,3,'QAApproval','QA','Automatically approved by simulator.','APPROVED','2026-07-07 10:17:02','2026-07-07 10:17:02',4,1,NULL),(29,11,2,3,'QAApproval','QA','Automatically approved by simulator.','APPROVED','2026-07-07 10:17:05','2026-07-07 10:17:05',4,1,NULL),(30,14,2,3,'QAApproval','QA','Automatically approved by simulator.','APPROVED','2026-07-07 10:17:06','2026-07-07 10:17:06',4,1,NULL),(31,3,2,3,'QAApproval','QA','Automatically approved by simulator.','APPROVED','2026-07-07 10:17:07','2026-07-07 10:17:07',4,1,NULL),(32,18,2,3,'QAApproval','QA','Automatically approved by simulator.','APPROVED','2026-07-07 10:17:07','2026-07-07 10:17:07',4,1,NULL);
/*!40000 ALTER TABLE `approval_requests` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `approval_requests_backup`
--

DROP TABLE IF EXISTS `approval_requests_backup`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `approval_requests_backup` (
  `id` int NOT NULL DEFAULT '0',
  `container_id` int NOT NULL,
  `from_stage` int NOT NULL,
  `to_stage` int NOT NULL,
  `requested_action` varchar(100) NOT NULL,
  `required_role` varchar(20) NOT NULL,
  `comments` text,
  `status` enum('PENDING','APPROVED','REJECTED') DEFAULT 'PENDING',
  `requested_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `reviewed_at` timestamp NULL DEFAULT NULL,
  `requested_by_user_id` int NOT NULL,
  `reviewed_by_user_id` int DEFAULT NULL,
  `used_at` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `approval_requests_backup`
--

LOCK TABLES `approval_requests_backup` WRITE;
/*!40000 ALTER TABLE `approval_requests_backup` DISABLE KEYS */;
INSERT INTO `approval_requests_backup` VALUES (1,28,2,3,'QAApproval','QA','Automatically approved by simulator.','APPROVED','2026-07-05 12:51:34','2026-07-05 12:58:56',4,1,NULL),(2,37,2,3,'QAApproval','QA','Automatically approved by simulator.','APPROVED','2026-07-05 13:02:13','2026-07-05 13:02:14',4,1,NULL),(3,30,2,3,'QAApproval','QA','Automatically approved by simulator.','APPROVED','2026-07-05 13:02:21','2026-07-05 13:02:23',4,1,NULL),(4,29,2,3,'QAApproval','QA','Automatically approved by simulator.','APPROVED','2026-07-05 13:02:30','2026-07-05 13:02:31',4,1,NULL),(5,22,2,3,'QAApproval','QA','Automatically approved by simulator.','APPROVED','2026-07-05 13:02:43','2026-07-05 13:02:44',4,1,NULL),(6,27,2,3,'QAApproval','QA','Automatically approved by simulator.','APPROVED','2026-07-05 13:02:45','2026-07-05 13:02:55',4,1,NULL),(7,36,2,3,'QAApproval','QA','Automatically approved by simulator.','APPROVED','2026-07-05 13:02:57','2026-07-05 13:02:58',4,1,NULL),(8,20,2,3,'QAApproval','QA','Automatically approved by simulator.','APPROVED','2026-07-05 13:03:04','2026-07-05 13:03:05',4,1,NULL),(9,37,4,2,'SupervisorApproval','SUPERVISOR','Automatically approved by simulator.','APPROVED','2026-07-06 14:16:28','2026-07-06 14:24:57',4,2,NULL),(10,37,4,2,'SupervisorApproval','SUPERVISOR','Automatically approved by simulator.','APPROVED','2026-07-06 14:41:31','2026-07-06 14:44:11',4,2,NULL);
/*!40000 ALTER TABLE `approval_requests_backup` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `audit_log`
--

DROP TABLE IF EXISTS `audit_log`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `audit_log` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `entity_type` varchar(50) NOT NULL,
  `entity_id` int NOT NULL,
  `action` varchar(100) NOT NULL,
  `old_values` json DEFAULT NULL,
  `new_values` json DEFAULT NULL,
  `created_at` datetime NOT NULL,
  PRIMARY KEY (`id`),
  KEY `idx_audit_user` (`user_id`),
  CONSTRAINT `fk_audit_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `audit_log`
--

LOCK TABLES `audit_log` WRITE;
/*!40000 ALTER TABLE `audit_log` DISABLE KEYS */;
/*!40000 ALTER TABLE `audit_log` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `container_movements`
--

DROP TABLE IF EXISTS `container_movements`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `container_movements` (
  `id` int NOT NULL AUTO_INCREMENT,
  `container_id` int NOT NULL,
  `from_stage` int NOT NULL,
  `to_stage` int NOT NULL,
  `moved_at` datetime NOT NULL,
  `moved_by_user_id` int NOT NULL,
  `approved_by_user_id` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_movement_user` (`moved_by_user_id`),
  KEY `fk_movement_approver` (`approved_by_user_id`),
  KEY `idx_movement_container` (`container_id`),
  CONSTRAINT `fk_movement_approver` FOREIGN KEY (`approved_by_user_id`) REFERENCES `users` (`id`),
  CONSTRAINT `fk_movement_container` FOREIGN KEY (`container_id`) REFERENCES `containers` (`id`),
  CONSTRAINT `fk_movement_user` FOREIGN KEY (`moved_by_user_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=240 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `container_movements`
--

LOCK TABLES `container_movements` WRITE;
/*!40000 ALTER TABLE `container_movements` DISABLE KEYS */;
INSERT INTO `container_movements` VALUES (202,1,3,4,'2026-07-07 11:17:00',4,NULL),(203,17,3,4,'2026-07-07 11:17:00',4,NULL),(204,4,3,4,'2026-07-07 11:17:00',4,NULL),(205,15,3,4,'2026-07-07 11:17:00',4,NULL),(206,6,3,4,'2026-07-07 11:17:00',4,NULL),(207,2,3,4,'2026-07-07 11:17:00',4,NULL),(208,13,3,4,'2026-07-07 11:17:00',4,NULL),(209,20,3,4,'2026-07-07 11:17:00',4,NULL),(210,12,3,4,'2026-07-07 11:17:00',4,NULL),(211,19,3,4,'2026-07-07 11:17:00',4,NULL),(212,16,3,4,'2026-07-07 11:17:01',4,NULL),(213,14,3,4,'2026-07-07 11:17:01',4,NULL),(214,10,3,4,'2026-07-07 11:17:01',4,NULL),(215,7,3,4,'2026-07-07 11:17:01',4,NULL),(216,18,3,4,'2026-07-07 11:17:01',4,NULL),(217,8,3,4,'2026-07-07 11:17:01',4,NULL),(218,9,3,4,'2026-07-07 11:17:01',4,NULL),(219,5,3,4,'2026-07-07 11:17:01',4,NULL),(220,11,3,4,'2026-07-07 11:17:01',4,NULL),(221,3,3,4,'2026-07-07 11:17:01',4,NULL),(222,1,4,2,'2026-07-07 11:17:02',4,NULL),(223,1,2,3,'2026-07-07 11:17:02',4,1),(224,1,3,4,'2026-07-07 11:17:02',4,NULL),(225,1,4,2,'2026-07-07 11:17:04',4,NULL),(226,1,2,3,'2026-07-07 11:17:04',4,1),(227,1,3,4,'2026-07-07 11:17:04',4,NULL),(228,11,4,2,'2026-07-07 11:17:05',4,NULL),(229,11,2,3,'2026-07-07 11:17:05',4,1),(230,11,3,4,'2026-07-07 11:17:05',4,NULL),(231,14,4,2,'2026-07-07 11:17:06',4,NULL),(232,14,2,3,'2026-07-07 11:17:06',4,1),(233,14,3,4,'2026-07-07 11:17:06',4,NULL),(234,3,4,2,'2026-07-07 11:17:06',4,NULL),(235,3,2,3,'2026-07-07 11:17:07',4,1),(236,3,3,4,'2026-07-07 11:17:07',4,NULL),(237,18,4,2,'2026-07-07 11:17:07',4,NULL),(238,18,2,3,'2026-07-07 11:17:07',4,1),(239,18,3,4,'2026-07-07 11:17:07',4,NULL);
/*!40000 ALTER TABLE `container_movements` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `container_movements_backup`
--

DROP TABLE IF EXISTS `container_movements_backup`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `container_movements_backup` (
  `id` int NOT NULL DEFAULT '0',
  `container_id` int NOT NULL,
  `from_stage` int NOT NULL,
  `to_stage` int NOT NULL,
  `moved_at` datetime NOT NULL,
  `moved_by_user_id` int NOT NULL,
  `approved_by_user_id` int DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `container_movements_backup`
--

LOCK TABLES `container_movements_backup` WRITE;
/*!40000 ALTER TABLE `container_movements_backup` DISABLE KEYS */;
INSERT INTO `container_movements_backup` VALUES (1,25,3,4,'2026-07-05 13:28:24',4,NULL),(2,12,3,4,'2026-07-05 13:50:30',4,NULL),(3,10,3,4,'2026-07-05 13:51:33',4,NULL),(4,3,3,4,'2026-07-05 13:51:35',4,NULL),(5,6,3,4,'2026-07-05 13:51:36',4,NULL),(6,5,3,4,'2026-07-05 13:51:37',4,NULL),(7,34,3,4,'2026-07-05 14:01:16',4,NULL),(8,29,1,2,'2026-07-05 14:02:09',4,NULL),(9,9,3,4,'2026-07-05 14:02:20',4,NULL),(10,2,3,4,'2026-07-05 14:02:24',4,NULL),(11,1,3,4,'2026-07-05 14:02:25',4,NULL),(12,13,3,4,'2026-07-05 14:02:26',4,NULL),(13,37,2,3,'2026-07-05 14:02:28',4,1),(14,23,3,4,'2026-07-05 14:02:30',4,NULL),(15,37,3,4,'2026-07-05 14:02:38',4,NULL),(16,22,1,2,'2026-07-05 14:02:40',4,NULL),(17,29,2,3,'2026-07-05 14:02:41',4,1),(18,28,2,3,'2026-07-05 14:02:42',4,1),(19,29,3,4,'2026-07-05 14:02:43',4,NULL),(20,4,3,4,'2026-07-05 14:02:56',4,NULL),(21,20,1,2,'2026-07-05 14:02:57',4,NULL),(22,27,2,3,'2026-07-05 14:02:59',4,1),(23,27,3,4,'2026-07-05 14:02:59',4,NULL),(24,28,3,4,'2026-07-05 14:03:01',4,NULL),(25,36,2,3,'2026-07-05 14:03:02',4,1),(26,22,2,3,'2026-07-05 14:03:03',4,1),(27,20,2,3,'2026-07-06 11:44:36',4,1),(28,36,3,4,'2026-07-06 11:44:36',4,NULL),(29,20,3,4,'2026-07-06 11:44:36',4,NULL),(30,22,3,4,'2026-07-06 11:44:36',4,NULL),(31,30,2,3,'2026-07-06 11:44:36',4,1),(32,30,3,4,'2026-07-06 11:44:36',4,NULL),(33,37,2,3,'2026-07-06 15:24:57',2,2),(34,37,3,4,'2026-07-06 15:31:03',4,NULL),(35,37,4,2,'2026-07-06 15:41:31',4,NULL),(36,37,2,3,'2026-07-06 15:44:11',2,2);
/*!40000 ALTER TABLE `container_movements_backup` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `containers`
--

DROP TABLE IF EXISTS `containers`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `containers` (
  `id` int NOT NULL AUTO_INCREMENT,
  `container_code` varchar(50) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `current_status` int NOT NULL,
  `location_id` int NOT NULL,
  `is_damaged` tinyint(1) DEFAULT '0',
  `requires_qa_approval` tinyint(1) DEFAULT '0',
  `requires_swab` tinyint(1) DEFAULT '0',
  `last_cycle_start_at` datetime DEFAULT NULL,
  `initial_qa_approved_at` datetime DEFAULT NULL,
  `use_count` int NOT NULL DEFAULT '0',
  `requires_supervisor_reset` tinyint(1) DEFAULT '0',
  PRIMARY KEY (`id`),
  UNIQUE KEY `container_code` (`container_code`),
  KEY `fk_container_location` (`location_id`),
  KEY `idx_container_status` (`current_status`),
  CONSTRAINT `fk_container_location` FOREIGN KEY (`location_id`) REFERENCES `locations` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=38 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `containers`
--

LOCK TABLES `containers` WRITE;
/*!40000 ALTER TABLE `containers` DISABLE KEYS */;
INSERT INTO `containers` VALUES (1,'CNT022','2026-07-01 16:35:21',4,4,0,0,0,'2026-07-07 11:17:01','2026-07-07 11:17:03',7,0),(2,'CNT023','2026-07-01 18:36:27',4,4,0,1,0,'2026-07-07 11:17:01',NULL,2,0),(3,'CNT024','2026-07-02 09:46:12',4,4,0,0,0,'2026-07-07 11:17:02','2026-07-07 11:17:08',7,0),(4,'CNT025','2026-07-02 13:33:30',4,4,0,1,0,'2026-07-07 11:17:01',NULL,1,0),(5,'CNT026','2026-07-02 14:07:28',4,4,0,1,0,'2026-07-07 11:17:02',NULL,4,0),(6,'CNT027','2026-07-02 15:28:40',4,4,0,1,0,'2026-07-07 11:17:01',NULL,4,0),(7,'CNT028','2026-07-02 15:40:31',4,4,0,1,0,'2026-07-07 11:17:02',NULL,4,0),(8,'CNT029','2026-07-02 15:55:34',4,4,0,1,0,'2026-07-07 11:17:02',NULL,2,0),(9,'CNT030','2026-07-02 20:05:27',4,4,0,1,0,'2026-07-07 11:17:02',NULL,4,0),(10,'CNT031','2026-07-02 20:25:53',4,4,0,1,0,'2026-07-07 11:17:02',NULL,6,0),(11,'CNT032','2026-07-02 20:31:49',4,4,0,0,0,'2026-07-07 11:17:02','2026-07-07 11:17:06',7,0),(12,'CNT033','2026-07-03 11:24:32',4,4,0,1,0,'2026-07-07 11:17:01',NULL,4,0),(13,'CNT034','2026-07-03 12:39:14',4,4,0,1,0,'2026-07-07 11:17:01',NULL,2,0),(14,'CNT035','2026-07-03 12:51:00',4,4,0,0,0,'2026-07-07 11:17:02','2026-07-07 11:17:07',4,0),(15,'CNT036','2026-07-03 12:54:50',4,4,0,1,0,'2026-07-07 11:17:01',NULL,1,0),(16,'CNT037','2026-07-03 13:27:18',4,4,0,1,0,'2026-07-07 11:17:02',NULL,5,0),(17,'CNT038','2026-07-03 15:56:13',4,4,0,1,0,'2026-07-07 11:17:01',NULL,8,0),(18,'CNT039','2026-07-03 16:02:14',4,4,0,0,0,'2026-07-07 11:17:02','2026-07-07 11:17:08',5,0),(19,'CNT040','2026-07-03 16:05:51',4,4,0,1,0,'2026-07-07 11:17:01',NULL,3,0),(20,'CNT041','2026-07-03 16:34:19',4,4,0,1,0,'2026-07-07 11:17:01',NULL,4,0);
/*!40000 ALTER TABLE `containers` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `containers_backup`
--

DROP TABLE IF EXISTS `containers_backup`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `containers_backup` (
  `id` int NOT NULL DEFAULT '0',
  `container_code` varchar(50) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `current_status` int NOT NULL,
  `location_id` int NOT NULL,
  `is_damaged` tinyint(1) DEFAULT '0',
  `requires_qa_approval` tinyint(1) DEFAULT '0',
  `requires_swab` tinyint(1) DEFAULT '0',
  `last_cycle_start_at` datetime DEFAULT NULL,
  `initial_qa_approved_at` datetime DEFAULT NULL,
  `use_count` int NOT NULL DEFAULT '0',
  `requires_supervisor_reset` tinyint(1) DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `containers_backup`
--

LOCK TABLES `containers_backup` WRITE;
/*!40000 ALTER TABLE `containers_backup` DISABLE KEYS */;
INSERT INTO `containers_backup` VALUES (1,'CNT022','2026-07-01 16:35:21',4,4,0,1,0,'2026-07-05 14:02:26',NULL,14,0),(2,'CNT023','2026-07-01 18:36:27',4,4,0,0,0,'2026-07-05 14:02:24','2026-07-03 19:17:52',1,0),(3,'CNT024','2026-07-02 09:46:12',4,4,0,0,0,'2026-07-05 13:51:35','2026-07-02 11:00:54',2,0),(4,'CNT025','2026-07-02 13:33:30',4,4,0,1,0,'2026-07-05 14:02:56',NULL,1,0),(5,'CNT026','2026-07-02 14:07:28',4,4,0,0,0,'2026-07-05 13:51:37','2026-07-02 21:08:06',1,0),(6,'CNT027','2026-07-02 15:28:40',4,4,0,0,0,'2026-07-05 13:51:36','2026-07-02 16:30:12',1,0),(7,'CNT028','2026-07-02 15:40:31',4,4,0,1,0,'2026-07-02 16:47:12','2026-07-02 16:42:39',0,0),(8,'CNT029','2026-07-02 15:55:34',4,4,0,0,0,'2026-07-02 16:58:17','2026-07-02 16:58:17',0,0),(9,'CNT030','2026-07-02 20:05:27',4,4,0,1,0,'2026-07-05 14:02:20',NULL,1,0),(10,'CNT031','2026-07-02 20:25:53',4,4,0,1,0,'2026-07-05 13:51:34',NULL,1,0),(11,'CNT032','2026-07-02 20:31:49',4,4,0,0,0,'2026-07-02 22:12:03','2026-07-02 21:35:02',0,0),(12,'CNT033','2026-07-03 11:24:32',4,4,0,0,0,'2026-07-05 13:50:31','2026-07-03 12:33:19',1,0),(13,'CNT034','2026-07-03 12:39:14',4,4,0,0,0,'2026-07-05 14:02:27','2026-07-03 13:49:58',1,0),(14,'CNT035','2026-07-03 12:51:00',4,4,0,0,0,'2026-07-03 13:51:56','2026-07-03 13:51:56',2,0),(15,'CNT036','2026-07-03 12:54:50',4,4,0,0,0,'2026-07-03 13:55:39','2026-07-03 13:55:39',2,0),(16,'CNT037','2026-07-03 13:27:18',4,4,0,0,0,'2026-07-03 14:28:37','2026-07-03 14:28:37',2,0),(17,'CNT038','2026-07-03 15:56:13',4,4,0,1,0,'2026-07-03 16:59:50',NULL,1,0),(18,'CNT039','2026-07-03 16:02:14',4,4,0,1,0,'2026-07-03 17:03:46',NULL,1,0),(19,'CNT040','2026-07-03 16:05:51',4,4,0,0,0,'2026-07-03 17:31:02',NULL,2,0),(20,'CNT041','2026-07-03 16:34:19',4,4,0,0,0,'2026-07-06 11:44:37','2026-07-06 11:44:37',1,0),(21,'CNT042','2026-07-03 16:36:29',4,4,0,0,0,'2026-07-03 17:37:14',NULL,1,0),(22,'CNT043','2026-07-03 16:47:17',4,4,0,0,0,'2026-07-06 11:44:37','2026-07-05 14:03:03',1,0),(23,'CNT044','2026-07-03 16:57:12',4,4,0,0,0,'2026-07-05 14:02:30','2026-07-03 18:44:04',1,0),(24,'CNT045','2026-07-03 18:20:58',4,4,0,1,0,'2026-07-03 19:39:56',NULL,3,0),(25,'CNT046','2026-07-03 19:04:50',4,4,0,1,0,'2026-07-05 13:28:24',NULL,1,0),(26,'CNT047','2026-07-03 19:23:43',4,4,0,0,0,'2026-07-04 18:28:53','2026-07-04 17:53:24',1,0),(27,'CNT049','2026-07-04 15:34:21',4,4,0,0,0,'2026-07-05 14:03:00','2026-07-05 14:02:59',1,0),(28,'CNT050','2026-07-04 15:49:44',4,4,0,0,0,'2026-07-05 14:03:01','2026-07-05 14:02:43',1,0),(29,'CNT051','2026-07-04 15:50:24',4,4,0,0,0,'2026-07-05 14:02:43','2026-07-05 14:02:42',2,0),(30,'CNT052','2026-07-04 15:56:56',4,4,0,0,0,'2026-07-06 11:44:37','2026-07-06 11:44:37',1,0),(31,'CNT053','2026-07-04 19:09:56',4,4,0,0,0,'2026-07-04 20:18:21','2026-07-04 20:12:23',1,0),(32,'CNT054','2026-07-04 19:32:01',4,4,0,0,0,'2026-07-04 20:34:15','2026-07-04 20:34:11',2,0),(33,'CNT055','2026-07-04 19:51:52',4,4,0,0,0,'2026-07-04 21:03:05','2026-07-04 20:52:58',2,0),(34,'CNT056','2026-07-05 09:36:54',4,4,0,0,0,'2026-07-05 14:01:16','2026-07-05 10:39:53',2,0),(35,'CNT057','2026-07-05 10:24:26',4,4,0,0,0,'2026-07-05 11:54:23','2026-07-05 11:31:08',2,0),(36,'CNT058','2026-07-05 11:22:50',4,4,0,0,0,'2026-07-06 11:44:37','2026-07-05 14:03:03',1,0),(37,'CNT059','2026-07-05 11:34:07',3,3,0,0,0,NULL,'2026-07-05 14:02:29',0,0);
/*!40000 ALTER TABLE `containers_backup` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `locations`
--

DROP TABLE IF EXISTS `locations`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `locations` (
  `id` int NOT NULL AUTO_INCREMENT,
  `code` varchar(50) NOT NULL,
  `name` varchar(50) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `code` (`code`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `locations`
--

LOCK TABLES `locations` WRITE;
/*!40000 ALTER TABLE `locations` DISABLE KEYS */;
INSERT INTO `locations` VALUES (1,'STAGED','Staging Area'),(2,'CLEANING','Cleaning Area'),(3,'CLEAN_STORAGE','Clean Storage'),(4,'PRODUCTION','Production');
/*!40000 ALTER TABLE `locations` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `observations`
--

DROP TABLE IF EXISTS `observations`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `observations` (
  `id` int NOT NULL AUTO_INCREMENT,
  `container_id` int NOT NULL,
  `observed_by_user_id` int NOT NULL,
  `resolved_by_user_id` int DEFAULT NULL,
  `description` text NOT NULL,
  `is_breach` tinyint(1) DEFAULT '0',
  `status` enum('OPEN','RESOLVED') DEFAULT 'OPEN',
  `observed_at` datetime NOT NULL,
  `resolved_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_observation_creator` (`observed_by_user_id`),
  KEY `fk_observation_resolver` (`resolved_by_user_id`),
  KEY `idx_observation_container` (`container_id`),
  CONSTRAINT `fk_observation_container` FOREIGN KEY (`container_id`) REFERENCES `containers` (`id`),
  CONSTRAINT `fk_observation_creator` FOREIGN KEY (`observed_by_user_id`) REFERENCES `users` (`id`),
  CONSTRAINT `fk_observation_resolver` FOREIGN KEY (`resolved_by_user_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=119 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `observations`
--

LOCK TABLES `observations` WRITE;
/*!40000 ALTER TABLE `observations` DISABLE KEYS */;
INSERT INTO `observations` VALUES (92,1,4,NULL,'Residue',1,'OPEN','2026-07-07 11:17:02',NULL),(93,12,4,NULL,'Swab Required',0,'OPEN','2026-07-07 11:17:02',NULL),(94,17,4,NULL,'Swab Required',0,'OPEN','2026-07-07 11:17:02',NULL),(95,1,4,NULL,'Cosmetic',0,'OPEN','2026-07-07 11:17:02',NULL),(96,9,4,NULL,'Cosmetic',0,'OPEN','2026-07-07 11:17:03',NULL),(97,6,4,NULL,'Swab Required',0,'OPEN','2026-07-07 11:17:03',NULL),(98,6,4,NULL,'Swab Required',0,'OPEN','2026-07-07 11:17:03',NULL),(99,5,4,NULL,'Swab Required',0,'OPEN','2026-07-07 11:17:03',NULL),(100,20,4,NULL,'Swab Required',0,'OPEN','2026-07-07 11:17:04',NULL),(101,10,4,NULL,'Swab Required',0,'OPEN','2026-07-07 11:17:04',NULL),(102,9,4,NULL,'Cosmetic',0,'OPEN','2026-07-07 11:17:04',NULL),(103,1,4,NULL,'Residue',1,'OPEN','2026-07-07 11:17:04',NULL),(104,3,4,NULL,'Swab Required',0,'OPEN','2026-07-07 11:17:04',NULL),(105,20,4,NULL,'Swab Required',0,'OPEN','2026-07-07 11:17:04',NULL),(106,9,4,NULL,'Swab Required',0,'OPEN','2026-07-07 11:17:05',NULL),(107,5,4,NULL,'Swab Required',0,'OPEN','2026-07-07 11:17:05',NULL),(108,11,4,NULL,'Residue',1,'OPEN','2026-07-07 11:17:05',NULL),(109,14,4,NULL,'Residue',1,'OPEN','2026-07-07 11:17:06',NULL),(110,10,4,NULL,'Cosmetic',0,'OPEN','2026-07-07 11:17:06',NULL),(111,3,4,NULL,'Residue',1,'OPEN','2026-07-07 11:17:06',NULL),(112,18,4,NULL,'Damage',1,'OPEN','2026-07-07 11:17:07',NULL),(113,1,4,NULL,'Cosmetic',0,'OPEN','2026-07-07 11:17:08',NULL),(114,11,4,NULL,'Swab Required',0,'OPEN','2026-07-07 11:17:08',NULL),(115,17,4,NULL,'Cosmetic',0,'OPEN','2026-07-07 11:17:08',NULL),(116,6,4,NULL,'Swab Required',0,'OPEN','2026-07-07 11:17:08',NULL),(117,11,4,NULL,'Swab Required',0,'OPEN','2026-07-07 11:17:08',NULL),(118,16,4,NULL,'Swab Required',0,'OPEN','2026-07-07 11:17:08',NULL);
/*!40000 ALTER TABLE `observations` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `id` int NOT NULL AUTO_INCREMENT,
  `username` varchar(50) NOT NULL,
  `password_hash` varchar(255) NOT NULL,
  `role` enum('USER','SUPERVISOR','QA') NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `last_login` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `username` (`username`)
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1,'qa_user','$2b$10$1OSrmzNcYnArbomtiXAJ7OAsjsAGCTQgtk4kXmlZVZBGesjHK3NpS','QA','2026-06-24 19:36:57','2026-07-05 11:00:38'),(2,'supervisor1','$2b$10$1OSrmzNcYnArbomtiXAJ7OAsjsAGCTQgtk4kXmlZVZBGesjHK3NpS','SUPERVISOR','2026-06-24 19:37:05','2026-07-05 11:00:00'),(3,'supervisor2','$2b$10$1OSrmzNcYnArbomtiXAJ7OAsjsAGCTQgtk4kXmlZVZBGesjHK3NpS','SUPERVISOR','2026-06-24 19:37:05',NULL),(4,'operator1','$2b$10$1OSrmzNcYnArbomtiXAJ7OAsjsAGCTQgtk4kXmlZVZBGesjHK3NpS','USER','2026-06-24 19:37:14','2026-07-07 10:03:53'),(5,'operator2','$2b$10$1OSrmzNcYnArbomtiXAJ7OAsjsAGCTQgtk4kXmlZVZBGesjHK3NpS','USER','2026-06-24 19:37:14',NULL),(6,'operator3','$2b$10$1OSrmzNcYnArbomtiXAJ7OAsjsAGCTQgtk4kXmlZVZBGesjHK3NpS','USER','2026-06-24 19:37:14',NULL),(7,'operator4','$2b$10$1OSrmzNcYnArbomtiXAJ7OAsjsAGCTQgtk4kXmlZVZBGesjHK3NpS','USER','2026-06-24 19:37:14',NULL),(8,'operator5','$2b$10$1OSrmzNcYnArbomtiXAJ7OAsjsAGCTQgtk4kXmlZVZBGesjHK3NpS','USER','2026-06-24 19:37:14',NULL),(9,'operator6','$2b$10$1OSrmzNcYnArbomtiXAJ7OAsjsAGCTQgtk4kXmlZVZBGesjHK3NpS','USER','2026-06-24 19:37:14',NULL),(10,'operator7','$2b$10$1OSrmzNcYnArbomtiXAJ7OAsjsAGCTQgtk4kXmlZVZBGesjHK3NpS','USER','2026-06-24 19:37:14',NULL),(11,'operator8','$2b$10$1OSrmzNcYnArbomtiXAJ7OAsjsAGCTQgtk4kXmlZVZBGesjHK3NpS','USER','2026-06-24 19:37:14',NULL);
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-07-07 16:19:59
