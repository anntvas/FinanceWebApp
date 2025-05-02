import pandas as pd
from prophet import Prophet  # Заменяем from fbprophet import Prophet
import numpy as np

def predict_future_expenses(df, periods=30):
    # Агрегировать по дате
    df = df.groupby('date', as_index=False).sum()

    # Убрать экстремальные значения (например, выше 99 перцентиля)
    upper_threshold = df['amount'].quantile(0.99)
    df = df[df['amount'] <= upper_threshold]

    # Проверка, что остались хотя бы 10 уникальных дат
    if df['date'].nunique() < 10:
        raise ValueError("Недостаточно данных для построения прогноза.")

    # Переименовать колонки для Prophet
    df.rename(columns={'date': 'ds', 'amount': 'y'}, inplace=True)

    # (опционально) логарифмируем для сглаживания
    df['y'] = df['y'].apply(lambda x: max(x, 0.01))  # чтобы не было лог(0)
    df['y'] = df['y'].apply(lambda x: np.log(x))

    # Обучаем модель
    model = Prophet()
    model.fit(df)

    future = model.make_future_dataframe(periods=periods)
    forecast = model.predict(future)

    # Обратно преобразуем прогноз из логарифма
    forecast[['yhat', 'yhat_lower', 'yhat_upper']] = forecast[['yhat', 'yhat_lower', 'yhat_upper']].apply(np.exp)

    return forecast[['ds', 'yhat', 'yhat_lower', 'yhat_upper']]