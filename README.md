[![CI/CD for Quiz App](https://github.com/amihsan/quiz-app/actions/workflows/ci-cd-docker-aws-ec2.yml/badge.svg)](https://github.com/amihsan/quiz-app/actions/workflows/ci-cd-docker-aws-ec2.yml)
[![Docker](https://img.shields.io/badge/Docker-Ready-blue?logo=docker)](https://www.docker.com/)

## 💡 About

This is the main repository of the Lebentest quiz app which includes both the frontend and backend logic of the application. It is a free online learning platform for individuals preparing for German integration tests, offering a range of quizzes to enhance their language skills and cultural knowledge.

## View Demo (Deployed on AWS EC2)

http://lebentest.online

http://ec2-18-198-190-227.eu-central-1.compute.amazonaws.com

### 🧱 Built With

1. React
2. Python
3. Flask
4. npm
5. MongoDB

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

### ⛴️ Docker Usage

For Docker MongoDB atlas is used. Nginx is used used to serve react build and proxy to backend flask api.

##### For local development:

```bash
docker-compose -f docker-compose-dev.yml up --build -d
```

##### For Production:

For production (Let's Encrypt) certbot is used to apply ssl/tls.

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

