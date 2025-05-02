CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  username VARCHAR(50) UNIQUE NOT NULL
);
-- init.sql
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
-- Другие SQL-команды инициализации