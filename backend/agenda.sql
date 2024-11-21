CREATE DATABASE IF NOT EXISTS agenda;
USE agenda;

DROP TABLE IF EXISTS personas_colecciones;
DROP TABLE IF EXISTS personas;
DROP TABLE IF EXISTS direcciones;
DROP TABLE IF EXISTS colecciones;


CREATE TABLE direcciones (
  id INT PRIMARY KEY AUTO_INCREMENT,
  calle VARCHAR(100) NOT NULL,
  numero VARCHAR(20),
  ciudad VARCHAR(100),
  codigo_postal VARCHAR(10),
  pais VARCHAR(100),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
CREATE TABLE colecciones (
    id INT PRIMARY KEY AUTO_INCREMENT,
    nombre VARCHAR(100) NOT NULL,
    descripcion TEXT,
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
        ON DELETE SET NULL
        ON UPDATE CASCADE
);

CREATE TABLE personas_colecciones (
    persona_id INT,
    coleccion_id INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (persona_id, coleccion_id),
    FOREIGN KEY (persona_id) REFERENCES personas(id)
        ON DELETE CASCADE,
    FOREIGN KEY (coleccion_id) REFERENCES colecciones(id)
        ON DELETE CASCADE
);

INSERT INTO direcciones (calle, numero, ciudad, codigo_postal, pais) 
VALUES 
('Calle Principal', '123', 'Madrid', '28001', 'España'),
('Avenida Central', '456', 'Barcelona', '08001', 'España');

-- Insertar colecciones
INSERT INTO colecciones (nombre, descripcion) 
VALUES 
('Familia', 'Contactos familiares'),
('Trabajo', 'Contactos de trabajo');

-- Insertar personas
INSERT INTO personas (nombre, apellido, telefono, email, direccion_id) 
VALUES 
('Juan', 'Pérez', '123456789', 'juan@email.com', 1),
('María', 'López', '987654321', 'maria@email.com', 2);

-- Relacionar personas con colecciones
INSERT INTO personas_colecciones (persona_id, coleccion_id) 
VALUES 
(1, 1), -- Juan en Familia
(1, 2), -- Juan en Trabajo
(2, 1); -- María en Familia


SELECT p.*, d.*
FROM personas p
LEFT JOIN direcciones d ON p.direccion_id = d.id;

-- Consultar personas y sus colecciones
SELECT p.nombre, p.apellido, c.nombre as coleccion
FROM personas p
JOIN personas_colecciones pc ON p.id = pc.persona_id
JOIN colecciones c ON pc.coleccion_id = c.id;