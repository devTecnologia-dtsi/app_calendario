-- Creación de base de datos
DROP DATABASE IF EXISTS Calendarios;
CREATE DATABASE Calendarios;
USE Calendarios;

-- Creación de tablas
CREATE TABLE Sub_actividad (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre_sub_actividad VARCHAR(100),
    estado TINYINT (1) NOT NULL DEFAULT 1,
    fecha_inicio DATE,
    fecha_fin DATE
);

CREATE TABLE Actividad (
	id INT AUTO_INCREMENT PRIMARY KEY,
    nombre_actividad VARCHAR(100),
    estado TINYINT(1) NOT NULL DEFAULT 1,
    fecha_creacion DATETIME,
    id_sub_actividad INT,
    INDEX (id_sub_actividad),
    CONSTRAINT fk_sub_actividad
		FOREIGN KEY (id_sub_actividad)
        REFERENCES Sub_actividad(id)
        ON DELETE CASCADE
        ON UPDATE CASCADE
)ENGINE=InnoDB;

CREATE TABLE Calendario(
	id INT AUTO_INCREMENT PRIMARY KEY,
    nombre_calendario VARCHAR (50),
    estado TINYINT(1) NOT NULL DEFAULT 1,
    id_actividad INT,
    INDEX (id_actividad),
    CONSTRAINT fk_actividad
		FOREIGN KEY (id_actividad)
		REFERENCES actividad(id)
        ON DELETE CASCADE
        ON UPDATE CASCADE
)ENGINE=InnoDB;

CREATE TABLE Rectoria (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre_rectoria VARCHAR(100),
    estado TINYINT (1) NOT NULL DEFAULT 1,
    id_calendario INT,
    INDEX (id_calendario),
    CONSTRAINT fk_id_calendario
		FOREIGN KEY (id_calendario)
        REFERENCES Calendario(id)
        ON DELETE CASCADE
        ON UPDATE CASCADE
)ENGINE=InnoDB;

CREATE TABLE Rol (
	id INT AUTO_INCREMENT PRIMARY KEY,
	nombre_rol VARCHAR (50),
	crear TINYINT(1) NOT NULL DEFAULT 1,
	leer TINYINT(1) NOT NULL DEFAULT 1,
	actualizar TINYINT(1) NOT NULL DEFAULT 1,
	borrar TINYINT(1) NOT NULL DEFAULT 1,
	crud  TINYINT(1) NOT NULL DEFAULT 1
)ENGINE=InnoDB;

CREATE TABLE Usuario (
    id INT AUTO_INCREMENT PRIMARY KEY,
    correo VARCHAR(100) NOT NULL,
    nombres VARCHAR(100) NOT NULL,
    apellidos VARCHAR(100) NOT NULL,
    cargo VARCHAR(100),
    telefono VARCHAR(20),
    activo TINYINT(1) NOT NULL DEFAULT 1,
    id_rol INT,
    id_rectoria INT,
    INDEX (id_rol),
    CONSTRAINT fk_rol
        FOREIGN KEY (id_rol)
        REFERENCES Rol(id)
        ON DELETE CASCADE
        ON UPDATE CASCADE,
	INDEX (id_rectoria),
    CONSTRAINT fk_rectoria
		FOREIGN KEY (id_rectoria)
        REFERENCES Rectoria(id)
        ON DELETE CASCADE
        ON UPDATE CASCADE
) ENGINE=InnoDB;
