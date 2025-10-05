pipeline {
    agent any

    environment {
        // Assume these credentials are set up in Jenkins
        DOCKERHUB_CREDENTIALS = credentials('dockerhub-creds')
        GITHUB_CREDENTIALS = credentials('github-creds')
        DOCKER_IMAGE = "syed048/portfolio-app"
    }

    stages {
        stage('Checkout') {
            steps {
                script {
                    // Check out the code into the workspace
                    git(
                        branch: 'master',
                        url: 'https://github.com/abrarsyedd/dynamic-portfolio-ci-cd.git',
                        credentialsId: "${GITHUB_CREDENTIALS}"
                    )
                }
            }
        }

        stage('Build Docker Image') {
            steps {
                script {
                    // Build the image using the Dockerfile in the current directory (workspace root)
                    sh "docker build -t ${DOCKER_IMAGE}:${BUILD_NUMBER} -t ${DOCKER_IMAGE}:latest ."
                }
            }
        }

        stage('Push to DockerHub') {
            steps {
                script {
                    // Log in and push images
                    sh "echo ${DOCKERHUB_CREDENTIALS_PSW} | docker login -u ${DOCKERHUB_CREDENTIALS_USR} --password-stdin"
                    sh "docker push ${DOCKER_IMAGE}:${BUILD_NUMBER}"
                    sh "docker push ${DOCKER_IMAGE}:latest"
                }
            }
        }

        stage('Deploy') {
            steps {
                script {
                    // Use -p flag to explicitly set the project name for reliable 'down' command
                    // If the pipeline executes in the root directory where docker-compose.yml is located, this should work.
                    sh """
                    # Explicitly set the project name to ensure 'down' works reliably
                    docker-compose -f docker-compose.yml -p dynamic-portfolio-app down --remove-orphans
                    
                    # Pull the newly pushed image
                    docker-compose -f docker-compose.yml -p dynamic-portfolio-app pull app
                    
                    # Bring up the new version
                    docker-compose -f docker-compose.yml -p dynamic-portfolio-app up -d
                    """
                }
            }
        }
    }

    post {
        always {
            echo "Pipeline finished."
        }
    }
}
