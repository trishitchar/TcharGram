# Stage 1: Build Stage
FROM node:20 AS build

# Set working directory
WORKDIR /usr/src/app

# Copy package.json and package-lock.json for dependencies installation
COPY package*.json ./

# Install dependencies (including dev dependencies for building)
RUN npm install

# Copy the rest of the application code
COPY . .

# Build the TypeScript code
RUN npm run build

# Stage 2: Production Stage
FROM node:20

# Set working directory
WORKDIR /usr/src/app

# Copy only necessary files from build stage
COPY --from=build /usr/src/app/dist ./dist
COPY --from=build /usr/src/app/package*.json ./

# Install only production dependencies (no dev dependencies)
RUN npm install --production

# Copy the .env file (if you're using one)
COPY .env .env

# Expose the port the app will run on
EXPOSE 8080

# Command to run the application in production
CMD ["npm", "start"]