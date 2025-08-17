FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./
RUN npm install

# Copy source code
COPY . .

# Build the application
RUN npm run build

# Expose port
EXPOSE 3002

# Set environment variables
ENV NODE_ENV=production
ENV MCP_PORT=3002

# Start the HTTP server
CMD ["node", "build/http-server.js"]