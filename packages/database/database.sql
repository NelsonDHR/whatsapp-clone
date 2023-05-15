CREATE DATABASE whatsapp;

\c whatsapp;

CREATE TABLE users(
    id SERIAL PRIMARY KEY,
    username VARCHAR(28) NOT NULL UNIQUE,
    passhash VARCHAR NOT NULL
);

INSERT INTO
    users(username, passhash)
VALUES
    ('testUser', '$2a$12$hERtvxjEg/2R4ruFvVkzQOO/KM1V91zCpslwOOllagyGZnma1w3Zu');