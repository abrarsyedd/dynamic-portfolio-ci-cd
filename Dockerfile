# Dockerfile
FROM node:18-alpine

WORKDIR /usr/src/app

COPY package*.json ./
# Use npm ci for clean, reproducible builds
RUN npm ci --only=production

# Copy all application files
COPY . .

ENV NODE_ENV=production
EXPOSE 3000

# Start the application
CMD ["node", "server.js"]
