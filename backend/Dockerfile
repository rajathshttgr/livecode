FROM python:3.11-slim 

WORKDIR /app

# 1. Install dependencies
RUN apt-get update && apt-get install -y libpq-dev gcc

# 2. Install Python libs
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# 3. Copy Code
COPY . .

# PROD: Uses $PORT variable and removes --reload
CMD sh -c "uvicorn app.main:app --host 0.0.0.0 --port ${PORT:-8000}"