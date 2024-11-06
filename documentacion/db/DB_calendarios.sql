-- Creación de base de datos
DROP DATABASE IF EXISTS Calendarios;
CREATE DATABASE Calendarios;
USE Calendarios;

-- Creación de tablas
CREATE TABLE Logs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    log VARCHAR(200)
);

CREATE TABLE Rectoria (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre_rectoria VARCHAR(100),
    estado TINYINT(1) NOT NULL DEFAULT 1,
    codigo VARCHAR(45)
);

CREATE TABLE Tipo_calendario (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100)
);

CREATE TABLE Sede (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(45) NOT NULL,
    estado TINYINT(1) DEFAULT 1,
    codigo VARCHAR(45),
    id_rectoria INT,
    INDEX(id_rectoria),
    CONSTRAINT fk_rectoria
        FOREIGN KEY(id_rectoria)
        REFERENCES Rectoria(id)
        ON DELETE SET NULL  -- Si se elimina la rectoría, se pone NULL en id_rectoria
        ON UPDATE CASCADE
) ENGINE = InnoDB;

CREATE TABLE Rol (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(50),
    crear_calendario TINYINT(1),
    leer_calendario TINYINT(1),
    actualizar_calendario TINYINT(1),
    borrar_calendario TINYINT(1),
    crear_actividad TINYINT(1),
    leer_actividad TINYINT(1),
    actualizar_actividad TINYINT(1),
    borrar_actividad TINYINT(1),
    crear_subactividad TINYINT(1),
    leer_subactividad TINYINT(1),
    actualizar_subactividad TINYINT(1),
    borrar_subactividad TINYINT(1),
    control_sede TINYINT(1)
);

CREATE TABLE Usuario (
    id INT AUTO_INCREMENT PRIMARY KEY,
    correo VARCHAR(100) NOT NULL,
    estado TINYINT(1) DEFAULT 1,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fecha_ingreso TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    id_sede INT,
    id_rol INT,
    INDEX(id_sede),
    CONSTRAINT fk_sede
        FOREIGN KEY(id_sede)
        REFERENCES Sede(id)
        ON DELETE SET NULL  -- Si se elimina la sede, el usuario sigue existiendo, pero sin sede
        ON UPDATE CASCADE,
    INDEX(id_rol),
    CONSTRAINT fk_rol
        FOREIGN KEY(id_rol)
        REFERENCES Rol(id)
        ON DELETE SET NULL  -- Si se elimina el rol, el usuario sigue existiendo, pero sin rol
        ON UPDATE CASCADE
) ENGINE = InnoDB;

CREATE TABLE Rol_calendario (
    id INT AUTO_INCREMENT PRIMARY KEY,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    estado TINYINT(1) DEFAULT 1,
    id_usuario INT,
    id_tipo_calendario INT,
    INDEX (id_usuario),
    CONSTRAINT fk_usuario FOREIGN KEY (id_usuario)
        REFERENCES Usuario (id)
        ON DELETE CASCADE ON UPDATE CASCADE,
    INDEX (id_tipo_calendario),
    CONSTRAINT fk_tipo_calendario FOREIGN KEY (id_tipo_calendario)
        REFERENCES Tipo_calendario (id)
        ON DELETE RESTRICT ON UPDATE CASCADE
);

CREATE TABLE Calendario (
    id INT AUTO_INCREMENT PRIMARY KEY,
    estado TINYINT(1) NOT NULL DEFAULT 1,
    id_tipo_calendario INT,
    id_rectoria INT,
    id_usuario INT,
    id_sede INT,
    INDEX idx_calendario_tipo_calendario (id_tipo_calendario),  -- Nombre único para el índice
    CONSTRAINT fk_calendario_tipo_calendario
        FOREIGN KEY (id_tipo_calendario)
        REFERENCES Tipo_calendario(id)
        ON DELETE RESTRICT  -- No se puede eliminar si está asociado a calendarios
        ON UPDATE CASCADE,
    INDEX idx_calendario_rectoria (id_rectoria),  -- Nombre único para el índice
    CONSTRAINT fk_calendario_rectoria
        FOREIGN KEY (id_rectoria)
        REFERENCES Rectoria(id)
        ON DELETE SET NULL  -- Si se elimina la rectoría, se deja en NULL
        ON UPDATE CASCADE,
    INDEX idx_calendario_usuario (id_usuario),  -- Nombre único para el índice
    CONSTRAINT fk_calendario_usuario
        FOREIGN KEY (id_usuario)
        REFERENCES Usuario(id)
        ON DELETE SET NULL  -- Si se elimina el usuario, el calendario sigue existiendo sin responsable
        ON UPDATE CASCADE,
    INDEX idx_calendario_sede (id_sede),  -- Nombre único para el índice
    CONSTRAINT fk_calendario_sede
        FOREIGN KEY (id_sede)
        REFERENCES Sede(id)
        ON DELETE SET NULL  -- Si se elimina la sede, el calendario sigue sin sede
        ON UPDATE CASCADE
) ENGINE = InnoDB;


CREATE TABLE Actividad (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre_actividad VARCHAR(100),
    estado TINYINT(1) NOT NULL DEFAULT 1,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    id_calendario INT,
    INDEX(id_calendario),
    CONSTRAINT fk_calendario
        FOREIGN KEY(id_calendario)
        REFERENCES Calendario(id)
        ON DELETE CASCADE  -- Si se elimina el calendario, las actividades relacionadas se eliminan
        ON UPDATE CASCADE
) ENGINE = InnoDB;

CREATE TABLE Sub_actividad (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100),
    estado TINYINT(1) NOT NULL DEFAULT 1,
    fecha_inicio DATE,
    fecha_fin DATE,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    id_actividad INT,
    INDEX(id_actividad),
    CONSTRAINT fk_actividad
        FOREIGN KEY(id_actividad)
        REFERENCES Actividad(id)
        ON DELETE CASCADE  -- Si se elimina la actividad, las sub-actividades también se eliminan
        ON UPDATE CASCADE
) ENGINE = InnoDB;
