FROM tiangolo/uvicorn-gunicorn-fastapi:python3.10

WORKDIR /app

COPY ./requirements.txt /app/requirements.txt

RUN pip install --no-cache-dir -r /app/requirements.txt

COPY . /app

ENV DATABASE_URL=postgresql://postgres:secretpass@db:5432/database
ENV REDIS_URL=redis://redis:6379/0

CMD ["uvicorn", "backend.main:app", "--host", "0.0.0.0", "--port", "8000"]