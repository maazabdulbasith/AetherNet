FROM node:20-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy source code
COPY . .

# Expose the port your server runs on
EXPOSE 3000

# Start the server
CMD ["npm", "start"] 