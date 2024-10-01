-- MySQL dump 10.13  Distrib 8.0.38, for Win64 (x86_64)
--
-- Host: localhost    Database: crowdfunding_db
-- ------------------------------------------------------
-- Server version	9.0.1

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `category`
--

DROP TABLE IF EXISTS `category`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `category` (
  `CATEGORY_ID` int NOT NULL AUTO_INCREMENT,
  `NAME` varchar(255) NOT NULL,
  PRIMARY KEY (`CATEGORY_ID`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `category`
--

LOCK TABLES `category` WRITE;
/*!40000 ALTER TABLE `category` DISABLE KEYS */;
INSERT INTO `category` VALUES (1,'Health'),(2,'Education'),(3,'Environment'),(4,'Social Causes'),(5,'Technology');
/*!40000 ALTER TABLE `category` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `donation`
--

DROP TABLE IF EXISTS `donation`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `donation` (
  `DONATION_ID` int NOT NULL AUTO_INCREMENT,
  `DATE` datetime NOT NULL,
  `AMOUNT` decimal(10,2) NOT NULL,
  `GIVER` varchar(255) NOT NULL,
  `FUNDRAISER_ID` int DEFAULT NULL,
  PRIMARY KEY (`DONATION_ID`),
  KEY `FUNDRAISER_ID` (`FUNDRAISER_ID`),
  CONSTRAINT `donation_ibfk_1` FOREIGN KEY (`FUNDRAISER_ID`) REFERENCES `fundraiser` (`FUNDRAISER_ID`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `donation`
--

LOCK TABLES `donation` WRITE;
/*!40000 ALTER TABLE `donation` DISABLE KEYS */;
INSERT INTO `donation` VALUES (1,'2024-09-01 10:00:00',50.00,'John Doe',1),(2,'2024-09-02 12:30:00',75.00,'Jane Smith',2),(3,'2024-09-03 14:45:00',100.00,'Alice Johnson',1),(4,'2024-09-04 11:20:00',150.00,'Bob Brown',3),(5,'2024-09-05 09:15:00',200.00,'Charlie Black',4),(6,'2024-09-06 08:00:00',80.00,'David White',5),(7,'2024-09-07 10:10:00',95.00,'Eve Green',1),(8,'2024-09-08 11:55:00',120.00,'Frank Yellow',2),(9,'2024-09-09 16:40:00',130.00,'Grace Red',3),(10,'2024-09-10 17:25:00',110.00,'Henry Blue',4);
/*!40000 ALTER TABLE `donation` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `fundraiser`
--

DROP TABLE IF EXISTS `fundraiser`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `fundraiser` (
  `FUNDRAISER_ID` int NOT NULL AUTO_INCREMENT,
  `ORGANIZER` varchar(255) NOT NULL,
  `CAPTION` varchar(255) DEFAULT NULL,
  `TARGET_FUNDING` decimal(10,2) DEFAULT NULL,
  `CURRENT_FUNDING` decimal(10,2) DEFAULT NULL,
  `CITY` varchar(100) DEFAULT NULL,
  `ACTIVE` tinyint(1) DEFAULT '1',
  `CATEGORY_ID` int DEFAULT NULL,
  PRIMARY KEY (`FUNDRAISER_ID`),
  KEY `CATEGORY_ID` (`CATEGORY_ID`),
  CONSTRAINT `fundraiser_ibfk_1` FOREIGN KEY (`CATEGORY_ID`) REFERENCES `category` (`CATEGORY_ID`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `fundraiser`
--

LOCK TABLES `fundraiser` WRITE;
/*!40000 ALTER TABLE `fundraiser` DISABLE KEYS */;
INSERT INTO `fundraiser` VALUES (1,'Food Bank Initiative','Provide food assistance to families in need',5000.00,3000.00,'Brisbane',1,1),(2,'Disaster Relief Fund','Aid for disaster-stricken areas',20000.00,15000.00,'Sydney',1,2),(3,'Animal Shelter Support','Support for local animal shelters',8000.00,4000.00,'Melbourne',1,3),(4,'Youth Sports Program','Promote sports for underprivileged youth',12000.00,6000.00,'Perth',1,2),(5,'Clean Water Project','Provide clean drinking water to communities',30000.00,8000.00,'Adelaide',1,3),(6,'Alice Health Org','Support health initiatives',10000.00,2500.00,'Sydney',1,1),(7,'Education First','Fund education for underprivileged kids',15000.00,5000.00,'Melbourne',1,2),(8,'Clean Up Oceans','Help clean up the oceans',20000.00,12000.00,'Brisbane',1,3),(9,'Save the Forests','Plant more trees in deforested areas',25000.00,18000.00,'Perth',1,3),(10,'Cancer Research','Support cancer research',30000.00,10000.00,'Adelaide',1,1);
/*!40000 ALTER TABLE `fundraiser` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2024-10-01 13:14:09
