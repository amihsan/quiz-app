# Use a base image with Python pre-installed
FROM python:3.9.12-alpine

# Set the working directory inside the container
WORKDIR /app

# Copy and install requirements
COPY requirements.txt /app/requirements.txt
RUN pip install --no-cache-dir -r requirements.txt

# Copy the entire project to the working directory
COPY . .

# Expose the port the app runs on
EXPOSE 5000

# Command to run the application
CMD ["gunicorn", "-b", "0.0.0.0:5000", "run:app"]





