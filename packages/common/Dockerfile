# Use an official Node.js runtime as the base image
FROM node:latest

# Set the working directory in the container
WORKDIR /app

# Copy the common directory into the container
COPY . /app/common

# Install dependencies for the common package
RUN cd /app/common && npm install
