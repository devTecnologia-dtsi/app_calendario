-- -------------------------------------------------------------
-- TablePlus 5.5.2(513)
--
-- https://tableplus.com/
--
-- Database: calendarios
-- Generation Time: 2024-09-27 08:26:20.9130
-- -------------------------------------------------------------


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;


DROP TABLE IF EXISTS `actividad`;
CREATE TABLE `actividad` (
  `id` int(255) NOT NULL AUTO_INCREMENT,
  `id_calendario` int(255) DEFAULT NULL,
  `nombre` text DEFAULT NULL,
  `estado` tinyint(1) DEFAULT NULL,
  `fechaCreacion` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `id_calendario` (`id_calendario`),
  CONSTRAINT `actividad_ibfk_1` FOREIGN KEY (`id_calendario`) REFERENCES `calendario` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;;

DROP TABLE IF EXISTS `calendario`;
CREATE TABLE `calendario` (
  `id` int(255) NOT NULL AUTO_INCREMENT,
  `id_usuario` int(255) DEFAULT NULL,
  `id_rectoria` int(255) DEFAULT NULL,
  `id_sede` int(255) DEFAULT NULL,
  `id_tipoCalendario` int(255) DEFAULT NULL,
  `estado` tinyint(1) DEFAULT NULL,
  `fechaCreacion` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `sede` tinyint(1) DEFAULT NULL,
  `inSede` tinyint(1) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `id_tipoCalendario` (`id_tipoCalendario`),
  KEY `id_sede` (`id_sede`),
  KEY `id_rectoria` (`id_rectoria`),
  KEY `id_usuario` (`id_usuario`),
  CONSTRAINT `calendario_ibfk_1` FOREIGN KEY (`id_tipoCalendario`) REFERENCES `tipoCalendario` (`id`),
  CONSTRAINT `calendario_ibfk_2` FOREIGN KEY (`id_tipoCalendario`) REFERENCES `tipoCalendario` (`id`),
  CONSTRAINT `calendario_ibfk_3` FOREIGN KEY (`id_sede`) REFERENCES `sede` (`id`),
  CONSTRAINT `calendario_ibfk_4` FOREIGN KEY (`id_rectoria`) REFERENCES `rectoria` (`id`),
  CONSTRAINT `calendario_ibfk_5` FOREIGN KEY (`id_usuario`) REFERENCES `usuario` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;;

DROP TABLE IF EXISTS `logs`;
CREATE TABLE `logs` (
  `id` int(255) NOT NULL AUTO_INCREMENT,
  `estado` text DEFAULT NULL,
  `fecha` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `descripcion` text DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;;

DROP TABLE IF EXISTS `rectoria`;
CREATE TABLE `rectoria` (
  `id` int(255) NOT NULL AUTO_INCREMENT,
  `codigo` text DEFAULT NULL,
  `nombre` text DEFAULT NULL,
  `estado` tinyint(1) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;;

DROP TABLE IF EXISTS `rol`;
CREATE TABLE `rol` (
  `id` int(255) NOT NULL AUTO_INCREMENT,
  `crear` tinyint(1) DEFAULT NULL,
  `leer` tinyint(1) DEFAULT NULL,
  `actualizar` tinyint(1) DEFAULT NULL,
  `borrar` tinyint(1) DEFAULT NULL,
  `actividad` tinyint(1) DEFAULT NULL,
  `subactividad` tinyint(1) DEFAULT NULL,
  `calendario` tinyint(1) DEFAULT NULL,
  `sistema` tinyint(1) DEFAULT NULL,
  `nombre` text DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4;;

DROP TABLE IF EXISTS `rolCalendario`;
CREATE TABLE `rolCalendario` (
  `id` int(255) NOT NULL AUTO_INCREMENT,
  `id_usuario` int(255) DEFAULT NULL,
  `id_tipoCalendario` int(255) DEFAULT NULL,
  `estado` tinyint(1) DEFAULT NULL,
  `fechaCreacion` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `id_usuario` (`id_usuario`),
  KEY `id_tipoCalendario` (`id_tipoCalendario`),
  CONSTRAINT `rolCalendario_ibfk_1` FOREIGN KEY (`id_usuario`) REFERENCES `usuario` (`id`),
  CONSTRAINT `rolCalendario_ibfk_2` FOREIGN KEY (`id_tipoCalendario`) REFERENCES `tipoCalendario` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;;

DROP TABLE IF EXISTS `sede`;
CREATE TABLE `sede` (
  `id` int(255) NOT NULL AUTO_INCREMENT,
  `codigo` text DEFAULT NULL,
  `nombre` text DEFAULT NULL,
  `id_rectoria` int(255) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `id_rectoria` (`id_rectoria`),
  CONSTRAINT `sede_ibfk_1` FOREIGN KEY (`id_rectoria`) REFERENCES `rectoria` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;;

DROP TABLE IF EXISTS `subActividad`;
CREATE TABLE `subActividad` (
  `id` int(255) NOT NULL AUTO_INCREMENT,
  `id_actividad` int(255) DEFAULT NULL,
  `nombre` text DEFAULT NULL,
  `estado` tinyint(1) DEFAULT NULL,
  `fechaInicio` date DEFAULT NULL,
  `fechaFin` date DEFAULT NULL,
  `fechaCreacion` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `id_usuario` int(255) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `id_usuario` (`id_usuario`),
  KEY `id_actividad` (`id_actividad`),
  CONSTRAINT `subActividad_ibfk_1` FOREIGN KEY (`id_usuario`) REFERENCES `usuario` (`id`),
  CONSTRAINT `subActividad_ibfk_2` FOREIGN KEY (`id_actividad`) REFERENCES `actividad` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;;

DROP TABLE IF EXISTS `tipoCalendario`;
CREATE TABLE `tipoCalendario` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `nombre` text DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;;

DROP TABLE IF EXISTS `usuario`;
CREATE TABLE `usuario` (
  `id` int(255) NOT NULL AUTO_INCREMENT,
  `correo` text DEFAULT NULL,
  `estado` tinyint(1) DEFAULT NULL,
  `id_rectoria` int(255) DEFAULT NULL,
  `id_sede` int(255) DEFAULT NULL,
  `fechaIngreso` date DEFAULT NULL,
  `fechaCreacion` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `id_rol` int(255) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `id_rol` (`id_rol`),
  KEY `id_sede` (`id_sede`),
  KEY `id_rectoria` (`id_rectoria`),
  CONSTRAINT `usuario_ibfk_1` FOREIGN KEY (`id_rol`) REFERENCES `rol` (`id`),
  CONSTRAINT `usuario_ibfk_2` FOREIGN KEY (`id_sede`) REFERENCES `sede` (`id`),
  CONSTRAINT `usuario_ibfk_3` FOREIGN KEY (`id_rectoria`) REFERENCES `rectoria` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;;



/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;