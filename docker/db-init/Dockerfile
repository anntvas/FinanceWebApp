FROM python:3.9-bullseye

# Установка postgresql клиента
RUN apt-get update && \
    apt-get install -y postgresql-client && \
    rm -rf /var/lib/apt/lists/*

# Копируем зависимости
COPY requirements.txt /code/
WORKDIR /code/

# Обновляем pip и устанавливаем зависимости
RUN python -m pip install --upgrade pip && \
    pip install -r requirements.txt

# Копируем весь код
COPY . /code/

# Команда запуска
CMD ["./docker/db-init/wait-for-postgres.sh", "db", "./docker/db-init/startup.sh"]