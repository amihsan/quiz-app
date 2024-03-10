[![CI/CD for Quiz App](https://github.com/amihsan/quiz-app/actions/workflows/ci-cd-docker-aws-ec2.yml/badge.svg)](https://github.com/amihsan/quiz-app/actions/workflows/ci-cd-docker-aws-ec2.yml)
[![Docker](https://img.shields.io/badge/Docker-Ready-blue?logo=docker)](https://www.docker.com/)

## 💡 About

This is the main repository of the Einbürgerungstest quiz app which includes both the frontend and backend logic of the application.

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

2. Clone Git Repository, both client and server.

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

### ⛴️ Docker Usage

For Docker MongoDB atlas is used. Nginx is used used to serve react build and proxy to backend flask api.

##### For local development:

```bash
docker-compose -f docker-compose-dev.yml up --build -d
```

##### For Production:

For production (Let's Encrypt) certbot is used to apply ssl/tls.

1. Run init-letsencrypt to get ssl certificate from Let's Encrypt (Only one time before 1st time deployment. Then certbot auto renews from later.)
    The script is from: article [Nginx and Let’s Encrypt with Docker in Less Than 5 Minutes](https://pentacent.medium.com/nginx-and-lets-encrypt-with-docker-in-less-than-5-minutes-b4b8a60d3a71))


```bash
chmod +x ./init-letsencrypt.sh
```

```bash
sudo ./init-letsencrypt.sh
```

```bash
docker-compose.yml up --build -d
```
