# Stage 1: Build the React application
FROM node:18-slim AS builder

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json to install dependencies
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Build the React application for production
RUN npm run build


# Stage 2: Serve the built application
FROM node:18-slim AS alpine

# Install serve - a lightweight static file server
RUN npm install -g serve

# Copy the built files from the previous stage
COPY --from=build /app/build /app/build

# Expose port 3000 for the server
EXPOSE 3000

# Serve the build folder on port 3000
CMD ["serve", "-s", "/app/build", "-l", "3000"]