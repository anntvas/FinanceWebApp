#!/bin/sh
set -e

# Параметры подключения
HOST="db"
PORT="5432"
DB="finance"
TIMEOUT=30

echo "Waiting for PostgreSQL at $HOST:$PORT..."

count=0
until psql -h "$HOST" -U postgres -d "$DB" -p "$PORT" -c '\q' || [ $count -eq $TIMEOUT ]; do
  >&2 echo "PostgreSQL is unavailable - sleeping ($count/$TIMEOUT)"
  sleep 1
  count=$((count+1))
done

if [ $count -eq $TIMEOUT ]; then
  >&2 echo "Timeout reached while waiting for PostgreSQL"
  exit 1
fi

>&2 echo "PostgreSQL is up - executing command"
exec "$@"