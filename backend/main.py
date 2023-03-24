import os
import psycopg2
from dotenv import load_dotenv
from typing import Union, Annotated
import json

# fastapi requirements
from fastapi import FastAPI, status, Body, Response, Request, Depends
from fastapi.middleware.cors import CORSMiddleware
from fastapi_login import LoginManager
from fastapi.security import OAuth2PasswordRequestForm
from fastapi_login.exceptions import InvalidCredentialsException

from pydantic import BaseModel, Field


# region basta yapilacaklar


SECRET = f'{os.urandom(24).hex()}'

manager = LoginManager(SECRET, token_url='/auth/token')

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
load_dotenv()

# endregion

# region siniflar


class Product(BaseModel):
    id: int
    name: str
    lastprice: int
    price: int


class User(BaseModel):
    username: str  # = Field(min_length=3, max_length=20)
    mail: str
    password: str  # = Field(min_length=6, max_length=20)


class ResponseMessage(BaseModel):
    message: str


# endregion

# region DB


CREATE_USERS_TABLE = (
    "CREATE TABLE IF NOT EXISTS users (id SERIAL PRIMARY KEY, name TEXT, surname TEXT, mail TEXT , password TEXT);")
CREATE_PRODUCTS_TABLE = (
    "CREATE TABLE IF NOT EXISTS products (id SERIAL PRIMARY KEY, name TEXT, lastPrice INTEGER , price INTEGER, username TEXT);")

# database bağlantısını yapar ve returnler


def db():

    url = os.environ.get("DATABASE_URL")
    connection = psycopg2.connect(url)
    return connection


def dbSorgu(sql, data=(), one=False):
    cur = db().cursor()
    cur.execute(sql, data)
    r = [dict((cur.description[i][0], value)
              for i, value in enumerate(row)) for row in cur.fetchall()]
    cur.connection.close()
    return (r[0] if r else None) if one else r


def dbPost(sql, data=()):
    datab = db()
    with datab:
        datab.cursor().execute(sql, data)
        pass
    datab.close()


def addProducts():
    # ürünleri database e ekler
    product1 = Product(id=1, name="Duvar Saati", lastprice=0, price=400)
    product2 = Product(id=2, name="Tablo", lastprice=0, price=1000)
    product3 = Product(id=3, name="Ayna", lastprice=0, price=350)

    dbPost("insert into products (id , name , lastprice, price) values (%s, %s, %s , %s)",
           (product1.id, product1.name, product1.lastprice, product1.price))
    dbPost("insert into products (id , name , lastprice, price) values (%s, %s, %s , %s)",
           (product2.id, product2.name, product2.lastprice, product2.price))
    dbPost("insert into products (id , name , lastprice, price) values (%s, %s, %s , %s)",
           (product3.id, product3.name, product3.lastprice, product3.price))


# tabloları oluşturur ve ürünleri ekler
dbPost(CREATE_USERS_TABLE)
dbPost(CREATE_PRODUCTS_TABLE)
#addProducts()

# endregion

# region Kullanıcı login/logout


@manager.user_loader()
def load_user(email: str):
    return dbSorgu("select * from users where mail=%s", (email,), True)


@app.post('/api/user/auth/token', tags=["users"])
def login(data: OAuth2PasswordRequestForm = Depends()):
    email = data.username
    password = data.password

    user = load_user(email)

    if not user:
        raise InvalidCredentialsException  # you can also use your own HTTPException
    elif password != user['password']:
        raise InvalidCredentialsException

    access_token = manager.create_access_token(
        data=dict(sub=email)
    )
    return {'access_token': access_token, 'token_type': 'bearer'}


@app.post("/api/user/register", response_model=ResponseMessage, tags=["users"], responses={400: {'model': ResponseMessage}, 201: {'model': ResponseMessage}})
def create_user(user: User, res: Response):

    mail = user.mail
    username = user.username
    password = user.password

    user = dbSorgu("select * from users where mail=(%s)", (user.mail,), True)

    if user:
        res.status_code = 400
        return {'message': 'kayitli'}
    else:
        res.status_code = 201
        dbPost("insert into users (username , mail , password) values (%s , %s , %s)",
               (username, mail, password))
        return {'message': 'kayit basarili'}

# endregion

# region Ürün işlemleri


def load_product(id: int = None):
    if id == None:
        return dbSorgu("select * from products")

    return dbSorgu("select * from products where id=%s", (id,), True)

@app.get('/api/products/', tags=['Product'] )
def get_products():
    return load_product()


@app.post('/api/product/update', tags=['Product'])
def update_product():
    pass


# endregion
