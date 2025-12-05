FROM node:20-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production

# Copy application code
COPY . .

# Expose port (internal only - not published in docker-compose)
EXPOSE 8080

# Start the server
CMD ["npm", "start"]
