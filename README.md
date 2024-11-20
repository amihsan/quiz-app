[![CI/CD for Quiz App](https://github.com/amihsan/quiz-app/actions/workflows/ci-cd-docker-aws-ec2.yml/badge.svg)](https://github.com/amihsan/quiz-app/actions/workflows/ci-cd-docker-aws-ec2.yml)
[![Docker](https://img.shields.io/badge/Docker-Ready-blue?logo=docker)](https://www.docker.com/)

## 💡 About

This is the main repository of the Lebentest quiz app which includes both the frontend and backend logic of the application. It is a free online learning platform for individuals preparing for German integration tests, offering a range of quizzes to enhance their language skills and cultural knowledge. It is hosted on an Amazon EC2 instance, with traffic managed by an AWS Elastic Load Balancer for reliability. AWS CloudFront speeds up content delivery, and AWS Certificate Manager (ACM) ensures secure, encrypted communication. This setup provides a fast, secure, and reliable experience for users.

## View Demo (Deployed on AWS EC2)

http://lebentest.online

http://ec2-18-198-190-227.eu-central-1.compute.amazonaws.com

### 🧱 Built With

1. React
2. Python
3. Flask
4. npm
5. MongoDB
6. AWS EC2
7. AWS CloudFront
8. AWS Elastic Load Balancer (ELB)
9. AWS Certificate Manager (ACM)

## ⚡ Getting Started

### ⚙️ Local Setup

1. Install MongoDB

2. Clone Git Repository, both frontend and backend.

3. Setup npm in frontend root:

   ```shell
   npm install
   ```

4. Setup virtual env in backend root:
   ```shell
   python -m venv venv
   ```
5. To activate the virtual environment:

   - On Windows:

   ```bash
   .\venv\Scripts\activate
   ```

   - On macOS/Linux:

   ```bash
   source venv/bin/activate
   ```

   To install the Python dependencies specified in your `requirements.txt` file, use the following command:

   ```bash
   pip install -r requirements.txt
   ```

## 👟 Usage

### 🏠 Local Usage

1. Run local MongoDB

2. Run frontend:

   ```bash
   npm start
   ```

3. Run backend: after activate venv:

   ```bash
   flask run
   ```

4. Create two seperate .env files inside both frontend and backend directory. Follow template.env and replace with necessary values.

## ⛴️ Docker Usage

For Docker MongoDB atlas is used. Nginx is used used to serve react build and proxy to backend flask api.

##### For local development:

```bash
docker-compose -f docker-compose-dev.yml up --build -d
```

## 🌍 Cloud Deployment on AWS EC2

This project is deployed using GitHub Actions for CI/CD. For production (Let's Encrypt) certbot is used to apply ssl/tls. The app is deployed on EC2 AWS. You need a valid domain configured with Route 53. Follow the next steps bellow:

### Setting Up GitHub Secrets

For continuous deployment via GitHub Actions, the following GitHub secrets must be configured in your repository:

- `EC2_HOST_DNS`: Your AWS EC2 public ip.
- `EC2_USERNAME`: Your EC2 user name.
- `EC2_SSH_KEY`: The SSH private key (PEM file) to connect to your EC2 instance
- `EC2_TARGET_DIR`: Your project directory in EC2
- `DOCKER_USERNAME`: Your Docker Hub username
- `DOCKER_PASSWORD`: Your Docker Hub password

You can set these in the repository by navigating to **Settings > Secrets > Actions**.

### Deployment Steps

#### Manual Deployment

First clone the github repository to ec2 instance and then go inside the project root directory in ec2. Need to create two seperate .env in frontend and backend directory.Then

1. Run init-letsencrypt to get ssl certificate from Let's Encrypt (Only one time before the deployment. Then certbot auto renews from later.)
   The script is from: article [Nginx and Let’s Encrypt with Docker in Less Than 5 Minutes](https://pentacent.medium.com/nginx-and-lets-encrypt-with-docker-in-less-than-5-minutes-b4b8a60d3a71)

```bash
chmod +x ./init-letsencrypt.sh
```

```bash
sudo ./init-letsencrypt.sh
```

```bash
docker-compose.yml up --build -d
```

#### CI/CD Deployment

1. First disable the ci-cd-docker-aws-ec2.yml workflow. (for deployment)
2. Then run the lets-encrypt-ssl.yml workflow for the first time and then diasble the workflow. (valid email and domain required which needs to be set in frontend/.env).
3. Then enable the ci-cd-docker-aws-ec2.yml workflow again.
   Now whenever you push to the main branch, the GitHub Actions workflow automatically triggers deployment. Both the workflow run automatically when push to main branch. Thats why lets-encrypt-ssl.yml workflow only needs to be run onetime before first deployment to collect ssl certificates and then needs to be disabled.

## 🖥️ Local Deployment with Kubernetes and Minikube

For local deployment using Minikube and Kubernetes, follow the steps below:

### Install Required Tools

- **Minikube**: A tool to run Kubernetes locally.
- **Kubectl**: The command-line tool for interacting with the Kubernetes cluster.

### Deployment Steps

Once you have the required tools installed, follow these steps to deploy your application:

1. **Start Minikube**:
   ```bash
   minikube start
   ```
2. **Apply the Kubernetes configurations**: Deploy the backend and frontend services using the following commands:
   ```bash
   kubectl apply -f backend-config.yaml
   kubectl apply -f nginx-config.yaml
   kubectl apply -f frontend-deployment.yaml
   kubectl apply -f frontend-service.yaml
   kubectl apply -f backend-deployment.yaml
   kubectl apply -f backend-service.yaml
   ```

### Accessing the Application

To access the frontend service, use the following command:

```bash
minikube service frontend-service
```
