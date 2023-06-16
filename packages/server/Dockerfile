# Use the custom base image
FROM node:latest

# Set the working directory in the container
WORKDIR /app

# Install Redis
RUN apt-get update && apt-get install -y redis-server

# Expose the Redis port
EXPOSE 6379

# Expose the server port
EXPOSE 3000

# Copy the server directory into the container
COPY . /app/server

# Install dependencies for the server package
RUN cd /app/server && npm install

# Set the working directory to the server directory
WORKDIR /app/server

# Start Redis and the server application
CMD redis-server & npm run dev
