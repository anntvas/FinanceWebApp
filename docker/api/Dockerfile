FROM python:3.9-bullseye

# Установка системных зависимостей
RUN apt-get update && \
    apt-get install -y --no-install-recommends \
    postgresql-client \
    build-essential \
    libpython3-dev \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /code

# Установка зависимостей
COPY requirements.txt .
RUN pip install --upgrade pip && \
    pip install numpy cython wheel && \
    pip install prophet && \
    pip install --no-cache-dir -r requirements.txt
RUN pip install transformers
RUN pip install whitenoise crispy-bootstrap5

COPY . .

CMD ["./docker/api/startup.sh"]