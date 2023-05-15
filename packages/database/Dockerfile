# Use the official Postgres image as the base image
FROM postgres:latest

# Copy the SQL script for initializing the database
COPY database.sql /docker-entrypoint-initdb.d/

# Expose the Postgres port
EXPOSE 5432