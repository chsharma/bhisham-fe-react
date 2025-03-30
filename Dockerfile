# Stage 1: Build the Vite app
FROM node:18-alpine AS builder

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json first (for better caching)
COPY package.json package-lock.json ./

# Install dependencies
RUN npm install --force

# Copy the rest of the project files
COPY . .

# Build the project
RUN npm run build

# Stage 2: Serve the app using a simple Node.js server
FROM node:18-alpine

WORKDIR /app

# Install a lightweight static file server
RUN npm install -g serve

# Copy built files from builder stage
COPY --from=builder /app/dist /app

# Expose port 3000
EXPOSE 3000

# Start the app
CMD ["serve", "-s", ".", "-l", "3000"]
