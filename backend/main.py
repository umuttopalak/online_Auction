from typing import Union
from fastapi import FastAPI, status, Body
from dotenv import load_dotenv
import os
import psycopg2
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from fastapi.responses import JSONResponse

load_dotenv()
app = FastAPI()

origins = [
    # "http://localhost.tiangolo.com",
    # "https://localhost.tiangolo.com",
    # "http://localhost",
    # "http://localhost:8080",
    # "https://localhost:3000/home"
    "*"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class User(BaseModel):
    username: str = Field(min_length=3, max_length=20)
    mail: str
    password: str = Field(min_length=6, max_length=20)


class ResponseMessage(BaseModel):
    message: str


url = os.environ.get("DATABASE_URL")  # gets variables from environment
connection = psycopg2.connect(url)
cursor = connection.cursor()


async def mailCheck():

    cursor.execute("SELECT * FROM users ")
    result = cursor.fetchall()

    mails = list()
    for json in result:
        mails.append(json[3])

    return mails

CREATE_USERS_TABLE = (
    "CREATE TABLE IF NOT EXISTS users (id SERIAL PRIMARY KEY,  username TEXT, mail TEXT , password TEXT);"
)


# Kullanıcı sorgu/kayıt 
@app.post("/register", response_model=ResponseMessage, tags=["users"])
async def create_user(user: User):

    _mails = await mailCheck()
    mail = user.mail
    username = user.username
    password = user.password

    stmt = "INSERT INTO users (username, mail , password) VALUES (%s, %s ,%s)"

    if mail in _mails:
        return {'message': 'kayitli'}
    else:
        cursor.execute(stmt, (username, mail, password),)
        connection.commit()
        return {'message': 'kayit basarili'}    


