-- Script de creación de tablas para Social App (MariaDB)

CREATE DATABASE IF NOT EXISTS social_app;
USE social_app;

-- Tabla de Usuarios
CREATE TABLE IF NOT EXISTS users (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    profilePic VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de Locales / Venues
CREATE TABLE IF NOT EXISTS venues (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    latitude DOUBLE NOT NULL,
    longitude DOUBLE NOT NULL,
    description TEXT,
    promotion TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de Publicaciones / Feed
CREATE TABLE IF NOT EXISTS posts (
    id VARCHAR(50) PRIMARY KEY,
    userId VARCHAR(50),
    userName VARCHAR(100),
    content TEXT,
    imageUrl VARCHAR(255),
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (userId) REFERENCES users(id)
);

-- Tabla de Recompensas / Vouchers
CREATE TABLE IF NOT EXISTS rewards (
    id VARCHAR(50) PRIMARY KEY,
    title VARCHAR(100) NOT NULL,
    description TEXT,
    code VARCHAR(50) NOT NULL,
    isRedeemed BOOLEAN DEFAULT FALSE,
    userId VARCHAR(50),
    FOREIGN KEY (userId) REFERENCES users(id)
);

-- Datos de ejemplo
INSERT INTO venues (id, name, latitude, longitude, description, promotion) VALUES
('v1', 'Club Cyber', 40.7128, -74.0060, 'Neon vibe', '2x1 Cocktails'),
('v2', 'Velvet Lounge', 40.7135, -74.0050, 'Jazz night', 'Free welcome drink');
