# Use Node 20 as base image
FROM node:20-alpine

# Set working directory
WORKDIR /app

# Copy root package.json and workspace configuration if present
COPY package*.json ./

# Copy server and client package.json files
COPY server/package.json ./server/
COPY client/package.json ./client/

# Install dependencies (this will install for both root, server, and client because of workspaces or npm install:all)
RUN npm run install:all || (npm install && cd server && npm install && cd ../client && npm install)

# Copy the rest of the application code
COPY . .

# Build the client and server (adjust based on your actual build scripts)
RUN cd client && npm run build
RUN cd server && npm run build

# Expose the port your server runs on (change if your Express server uses a different port)
EXPOSE 5000

# Start the server (adjust path if your compiled code is in a dist/ build/ folder)
CMD ["node", "server/dist/index.js"]
