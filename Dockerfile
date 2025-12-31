FROM python:3.11-slim

WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y \
    gcc \
    g++ \
    git \
    && rm -rf /var/lib/apt/lists/*

# Copy requirements
COPY requirements.txt .

# Install Python dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Copy application code
COPY infinity_matrix/ ./infinity_matrix/
COPY config/ ./config/
COPY setup.py .
COPY README.md .

# Install package
RUN pip install -e .

# Create data directories
RUN mkdir -p data/raw data/normalized data/analyzed data/tasks

# Expose ports for API (if needed)
EXPOSE 8000

# Default command
CMD ["python", "-m", "infinity_matrix.cli", "status"]
