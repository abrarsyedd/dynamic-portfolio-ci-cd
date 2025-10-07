# Dynamic Portfolio CI/CD

A simple **CI/CD-enabled portfolio project** built with Node.js and Docker.  
This repository demonstrates how to containerize a Node.js application and manage builds/deployments with Docker.

---

## 🚀 Getting Started

### 1. Clone the repository
```bash
git clone https://github.com/abrarsyedd/dynamic-portfolio-ci-cd.git
cd dynamic-portfolio-ci-cd
```
### 2. View instructions from Docker image (optional)
```bash
# You can display full deployment instructions directly from the Docker image:
docker run --rm syed048/portfolio-app:latest --help
```
### 3. Build and run with Docker
```bash
# Build the Docker image
docker build -t syed048/portfolio-app:latest .

# start everything (app + mysql + adminer)
docker-compose up -d
```

### 4. Stop Docker container
```bash
# stop everything (app + mysql + adminer)
docker-compose down
```

Your app will be available at: **http://localhost:3000**

---

## 🛠 Useful Docker Commands

```bash
# List all containers
docker ps -a

# Stop a running container
docker stop <container_id>

# Remove a container
docker rm <container_id>

# List all images
docker images

# Remove an image
docker rmi <image_id>

# Delete ALL containers (⚠️ careful!)
docker rm -f $(docker ps -aq)

# Delete ALL images (⚠️ careful!)
docker rmi -f $(docker images -aq)
```

---

## 📦 CI/CD Notes
This project is prepared for CI/CD pipelines:
- Dockerized application for consistent builds
- Easily integratable with GitHub Actions, Jenkins, or GitLab CI/CD

---

## 📜 License
This project is open source under the [MIT License](LICENSE).
