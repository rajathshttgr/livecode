FROM python:3.11-slim 

WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y libpq-dev gcc

# Install Python libs
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy Code
COPY . .

# PROD: Uses $PORT variable and removes --reload
CMD sh -c "uvicorn app.main:app --host 0.0.0.0 --port ${PORT:-8000}"

