FROM jenkins/jenkins:lts

USER root

# Install Docker CLI and Docker Compose
# Use a common installation method for docker-compose to ensure it's available
RUN apt-get update && \
    apt-get install -y ca-certificates curl gnupg lsb-release git && \
    # Install Docker CLI
    mkdir -m 0755 -p /etc/apt/keyrings && \
    curl -fsSL https://download.docker.com/linux/debian/gpg | gpg --dearmor -o /etc/apt/keyrings/docker.gpg && \
    echo "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/debian $(lsb_release -cs) stable" | tee /etc/apt/sources.list.d/docker.list > /dev/null && \
    apt-get update && \
    apt-get install -y docker-ce-cli && \
    # Install docker-compose v1
    apt-get install -y docker-compose && \
    rm -rf /var/lib/apt/lists/*

# Add jenkins user to docker group
RUN usermod -aG docker jenkins

USER jenkins
