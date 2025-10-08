#!/usr/bin/env sh
set -e

# Help / instructions
show_help() {
cat <<'EOF'
======================================================
Dynamic Portfolio App - Docker Instructions
======================================================

Steps to run the app:

1. Pull the Docker images (if not built locally):
   docker pull syed048/portfolio-app:latest
   docker pull mysql:8.0
   docker pull adminer

2. Create Docker network (optional, ensures app can reach MySQL):
   docker network create dynamic-portfolio-net

3. Run containers manually (If you have nt cloned the repo from GitHub)
   # Create a network
   docker network create dynamic-portfolio-net

   # Run MySQL
   docker run -d --name portfolio-db --network dynamic-portfolio-net -e MYSQL_ROOT_PASSWORD=123admin -e MYSQL_DATABASE=portfolio_db -e MYSQL_USER=syed -e MYSQL_PASSWORD=123admin -v portfolio-db-data:/var/lib/mysql -p 3307:3306 mysql:8.0

   # Run Node.js app
   docker run -d --name portfolio-app --network dynamic-portfolio-net -p 3000:3000 -e DB_HOST=portfolio-db -e DB_PORT=3306 -e DB_USER=syed -e DB_PASSWORD=123admin -e DB_NAME=portfolio_db syed048/portfolio-app:latest

   # Run Adminer
   docker run -d --name portfolio-adminer --network dynamic-portfolio-net -p 8082:8080 adminer

4. Access the app and adminer:
   - Node app: http://localhost:3000
   - Adminer: http://localhost:8082

5. Stop the containers:
   docker stop portfolio-app portfolio-db portfolio-adminer
   docker rm portfolio-app portfolio-db portfolio-adminer


======================================================
EOF
}

# If argument is --help, show help and exit
if [ "$1" = "--help" ]; then
    show_help
    exit 0
fi

# Optional: wait for MySQL to be ready
# Uncomment the following lines if your app uses MySQL
# echo "Waiting for MySQL at $DB_HOST:$DB_PORT ..."
# while ! nc -z "$DB_HOST" "$DB_PORT"; do
#     sleep 2
# done

# Start Node.js server
exec node server.js

