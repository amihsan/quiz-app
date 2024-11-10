# Use Python base image
FROM python:3.9.12-alpine

# Set the working directory in the container
WORKDIR /app

# Copy the requirements file into the container
COPY requirements.txt .

# Install the Python dependencies
RUN pip install -r requirements.txt

# Copy the Flask app code into the container
COPY . .

# Expose the Flask app port

EXPOSE 5000

CMD ["gunicorn", "-b", "0.0.0.0:5000", "run:app"]