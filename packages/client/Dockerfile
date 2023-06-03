# Use the custom base image
FROM whatsapp-clone-common

# Set the working directory in the container
WORKDIR /app

# Copy the client directory into the container
COPY . /app/client

# Install dependencies for the client package
RUN cd /app/client && npm install

# Set the working directory to the client directory
WORKDIR /app/client

# Expose the desired port for the client application
EXPOSE 8080

# Start the client application
CMD ["npm", "run", "dev"]