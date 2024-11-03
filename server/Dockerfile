# Use python slim image as base for x86 architecture
FROM --platform=linux/amd64 python:3.11-slim

# Set working directory
WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y \
  gcc \
  && rm -rf /var/lib/apt/lists/*

# Copy requirements first to leverage Docker cache
COPY requirements.txt .
COPY install install
# Install Python dependencies
RUN pip install --no-cache-dir -r requirements.txt
RUN pip install ./install/intersystems_irispython-5.0.1-8026-cp38.cp39.cp310.cp311.cp312-cp38.cp39.cp310.cp311.cp312-manylinux_2_17_x86_64.manylinux2014_x86_64.whl
# Copy the rest of the application
COPY . .

ENV FLASK_ENV=production

# Expose the port the app runs on
EXPOSE 8000

# Start Gunicorn
CMD ["gunicorn", "--bind", "0.0.0.0:8000", "--workers", "7", "http_server:app", "--error-logfile", "gunicorn.error.log", "--access-logfile gunicorn.log", "--capture-output"]