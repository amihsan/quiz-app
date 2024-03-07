# Use the official Python image as a base
FROM python:3.9.12-alpine

WORKDIR /app/backend

COPY ./backend/requirements.txt /app/backend/

COPY ./backend /app/backend

RUN pip install --upgrade pip && \
    pip install --no-cache-dir -r requirements.txt


# COPY ./docker /app/docker


EXPOSE 5000


CMD ["gunicorn", "-b", "0.0.0.0:5000", "run:app"]
