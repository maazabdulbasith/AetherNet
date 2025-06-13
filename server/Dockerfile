FROM node:20-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install ALL dependencies (including dev)
RUN npm install

# Copy source code
COPY . .

# Build the project (transpile TypeScript to JS)
RUN npm run build

# Expose the port
EXPOSE 4000

# Start the server from compiled JavaScript
CMD ["node", "dist/index.js"]
