CREATE DATABASE IF NOT EXISTS agenda;
USE agenda;

CREATE TABLE direcciones (
  id INT PRIMARY KEY AUTO_INCREMENT,
  calle VARCHAR(100) NOT NULL,
  numero VARCHAR(20),
  ciudad VARCHAR(100),
  codigo_postal VARCHAR(10),
  pais VARCHAR(100),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE personas (
  id INT PRIMARY KEY AUTO_INCREMENT,
  nombre VARCHAR(100) NOT NULL,
  apellido VARCHAR(100) NOT NULL,
  telefono VARCHAR(20),
  email VARCHAR(100),
  direccion_id INT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (direccion_id) REFERENCES direcciones(id)
);

