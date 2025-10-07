# Dockerfile
FROM node:18-alpine

WORKDIR /usr/src/app

COPY package*.json ./
RUN npm ci --only=production

COPY . .

# Optional: install netcat if using wait-for MySQL
RUN apk add --no-cache netcat-openbsd

# Copy entrypoint script
COPY entrypoint.sh /usr/local/bin/entrypoint.sh
RUN chmod +x /usr/local/bin/entrypoint.sh

ENV NODE_ENV=production
EXPOSE 3000

# Use entrypoint
ENTRYPOINT ["/usr/local/bin/entrypoint.sh"]
CMD []

