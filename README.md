[![Deploy to EC2](https://github.com/amihsan/quiz-app/actions/workflows/main.yml/badge.svg)](https://github.com/amihsan/quiz-app/actions/workflows/main.yml)

## 💡 About

This is the main repository of the Einbürgerungstest quiz app which includes both the frontend and backend logic of the application.

## View Demo (Deployed on AWS EC2)

http://einbürgerungstest.online

http://ec2-18-158-125-116.eu-central-1.compute.amazonaws.com

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

3. Setup npm in client root:

   ```shell
   npm install
   ```

4. Setup virtual env in server root:
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

2. Run client:

   ```bash
   npm start
   ```

3. Run server: after activate venv:
   ```bash
   flask run
   ```
