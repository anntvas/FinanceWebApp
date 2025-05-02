#!/bin/bash

HOST="db"
PORT="5432"
DB="finance"
TIMEOUT=30

# Альтернативная проверка доступности PostgreSQL
until python -c "import psycopg2; psycopg2.connect(host='$HOST', dbname='$DB', user='postgres')" 2>/dev/null; do
  echo "Waiting for PostgreSQL to become available..."
  sleep 2
done

# Миграции Django (если используется)
python3 manage.py makemigrations
python manage.py migrate
python manage.py runserver 0.0.0.0:8000
# Запуск приложения
exec "$@"