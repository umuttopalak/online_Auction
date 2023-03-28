import os

import psycopg2
import psycopg2.extras

from typing import Union, Annotated
import uvicorn
# fastapi requirements
from fastapi import FastAPI, status, Body, Response, Request, Depends, WebSocket
from fastapi.middleware.cors import CORSMiddleware
from fastapi_login import LoginManager
from fastapi.security import OAuth2PasswordRequestForm
from fastapi_login.exceptions import InvalidCredentialsException

from pydantic import BaseModel, Field


# region basta yapilacaklar


SECRET = f'{os.urandom(24).hex()}'

manager = LoginManager(SECRET, token_url='/auth/token')

app = FastAPI()

# if __name__ == "__main__":
#     uvicorn.run(app, host="0.0.0.0", port=8000)

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

# endregion

# region siniflar


class User(BaseModel):
    username: str  # = Field(min_length=3, max_length=20)
    mail: str
    password: str  # = Field(min_length=6, max_length=20)


class Product(BaseModel):
    id: int
    name: str
    lastprice: int
    price: int


class ResponseMessage(BaseModel):
    message: str


# endregion

# region DB

CREATE_USERS_TABLE = (
    "CREATE TABLE IF NOT EXISTS users (id SERIAL PRIMARY KEY, username TEXT,mail TEXT ,password TEXT)")

CREATE_PRODUCTS_TABLE = (
    "CREATE TABLE IF NOT EXISTS products (id SERIAL PRIMARY KEY,name TEXT, lastPrice INTEGER ,price INTEGER, username TEXT)""")

CREATE_AUCTIONS_TABLE = (
    "CREATE TABLE IF NOT EXISTS auctions (id SERIAL PRIMARY KEY,name VARCHAR(255) NOT NULL,start_price NUMERIC(10, 2) NOT NULL,end_time TIMESTAMP NOT NULL)")

CREATE_BIDS_TABLE = ("CREATE TABLE IF NOT EXISTS bids (id SERIAL PRIMARY KEY,auction_id INTEGER REFERENCES auctions(id),user_id INTEGER NOT NULL,amount NUMERIC(10, 2) NOT NULL,timestamp TIMESTAMP NOT NULL)")


def db():

    connection = psycopg2.connect("DATABASE_URL")
    connection.autocommit = True
    return connection


def dbWebSocketCursor():
    return db().cursor(cursor_factory=psycopg2.extras.DictCursor)


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
dbPost(CREATE_AUCTIONS_TABLE)
dbPost(CREATE_BIDS_TABLE)
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
    print(user)
    if not user:
        raise InvalidCredentialsException  # you can also use your own HTTPException
    elif password != user['password']:
        raise InvalidCredentialsException

    access_token = manager.create_access_token(
        data=dict(sub=email)
    )

    return {'username': user['username'], 'token': access_token, 'tokenType': 'bearer'}


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
        return dbSorgu("select * from products order by id")

    return dbSorgu("select * from products where id=%s", (id,), True)


@app.get('/api/products', tags=['Products'])
def get_products():
    return load_product()


@app.post('/api/product/update', tags=['Products'], response_model=ResponseMessage)
def update_product(product: Product, username: str, res: Response):

    dbPost("UPDATE products SET lastprice = %s WHERE id= %s",
           (product.lastprice, product.id))
    dbPost("UPDATE products SET username = %s WHERE id= %s",
           (username, product.id))
    return {'message': 'asd'}

# endregion


if __name__ == "__main__":
    uvicorn.run("main:app", port=5000, log_level="info")
