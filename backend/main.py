import os
from typing import List, Union
from datetime import datetime, timedelta
import jwt
import psycopg2
import psycopg2.extras
import redis
from dotenv import load_dotenv
from fastapi import FastAPI, HTTPException, Response, WebSocket, WebSocketDisconnect, status, Body, Request, Depends
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import HTTPBasic, HTTPBasicCredentials, OAuth2PasswordBearer, OAuth2PasswordRequestForm
from fastapi_login import LoginManager
from fastapi_login.exceptions import InvalidCredentialsException
from pydantic import BaseModel, Field

SECRET_KEY = "secretkey"
ACCESS_TOKEN_EXPIRE_MINUTES = 60

# .env dosyasından değişkenleri al

load_dotenv()


# region api tanımlamaları

app = FastAPI()
security = HTTPBasic()
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

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


# region Classlar

class User(BaseModel):
    username: str
    email: str
    password: str


class Product(BaseModel):
    id: int
    name: str
    lastprice: int
    price: int


class ResponseMessage(BaseModel):
    message: str

# endregion


# region Database

CREATE_USERS_TABLE = (
    "CREATE TABLE IF NOT EXISTS users (id SERIAL PRIMARY KEY, username TEXT,mail TEXT ,password TEXT)")

CREATE_PRODUCTS_TABLE = (
    "CREATE TABLE IF NOT EXISTS products (id SERIAL PRIMARY KEY,name TEXT, lastPrice INTEGER ,price INTEGER, username TEXT)""")


def db():
    database_url = os.environ.get("DATABASE_URL")
    if not database_url:
        raise ValueError("DATABASE_URL environment variable not set")

    connection = psycopg2.connect(database_url)
    connection.autocommit = True
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

    sorgu = dbSorgu("SELECT COUNT(*) FROM products")

    # ürünleri database e ekler
    if sorgu[0]['count'] == 0:

        product1 = Product(id=1, name="Cep Saati", lastprice=0, price=400)
        product2 = Product(id=2, name="Tablo", lastprice=0, price=1000)
        product3 = Product(id=3, name="Ayna", lastprice=0, price=350)

        dbPost("insert into products (id , name , lastprice, price) values (%s, %s, %s , %s)",
               (product1.id, product1.name, product1.lastprice, product1.price))
        dbPost("insert into products (id , name , lastprice, price) values (%s, %s, %s , %s)",
               (product2.id, product2.name, product2.lastprice, product2.price))
        dbPost("insert into products (id , name , lastprice, price) values (%s, %s, %s , %s)",
               (product3.id, product3.name, product3.lastprice, product3.price))


dbPost(CREATE_USERS_TABLE)
dbPost(CREATE_PRODUCTS_TABLE)
addProducts()

# endregion


# region redis

redis_port = 6379
redis_host = "REDIS_HOST"
redis_client = redis.Redis(host=redis_host , port=redis_port , db=0, decode_responses=True)


def set_token(username, token):
    redis_client.set(token, username)


def get_token(token):
    return redis_client.get(token)


def delete_token(token: str):
    deleted = redis_client.delete(token)
    if deleted == 0:
        raise ValueError("Token not found in Redis.")
    else:
        print(f"Token {token} deleted from Redis.")
        
        
# endregion


# region Fonksiyonlarım

async def load_user(email: str):
    return dbSorgu("select * from users where mail=%s", (email,), True)


def create_access_token(username: str) -> str:
    # tokenın son kullanma tarihi
    expires_delta = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    expires_date = datetime.utcnow() + expires_delta

    # token bilgileri
    token_inf = {"sub": username, "exp": expires_date}

    # token oluşturma
    token = jwt.encode(token_inf, SECRET_KEY, algorithm="HS256")

    return token


async def get_current_user(token: str = Depends(oauth2_scheme)):
    # Redis veritabanından token'ın geçerli olup olmadığını kontrol edin
    username = get_token(token)
    print(username)
    if not username:
        raise HTTPException(status_code=401, detail="Invalid credentials")
    
    return username


def load_product(id: int = None):
    if id == None:
        return dbSorgu("select * from products order by id")

    return dbSorgu("select * from products where id=%s", (id,), True)


# endregion


# region kullanıcı işlemleri

@app.post("/register", response_model=ResponseMessage, tags=["users"], responses={400: {'model': ResponseMessage}, 201: {'model': ResponseMessage}})
async def create_user(user: User, res: Response):


    # kullanıcının mail adresine kayıtlı user_id var mı diye kontrol ediyor
    if await load_user(user.email) != None:
        res.status_code = 400
        return {'message': 'User already exists'}

    # eğer bulamazsa user id oluşturuyor maile value olarak veriliyor ve user id ye de hash set veriliyor

    username = user.username
    email = user.email
    password = user.password

    dbPost("insert into users (username , mail , password) values (%s , %s , %s)",
           (username, email, password))

    res.status_code = 201
    return {'message': 'successfully registered'}


@app.post("/login", tags=["users"], responses={400: {'model': ResponseMessage}, 201: {'model': ResponseMessage}})
async def login(credentials: HTTPBasicCredentials):

    # username burada email olarak alınıyor
    email = credentials.username
    password = credentials.password

    user = await load_user(email)

    if not user:
        raise HTTPException(status_code=401, detail="Invalid credentials")

    if password != user['password']:
        raise HTTPException(status_code=401, detail="Invalid credentials")

    username = user['username']

    token = create_access_token(username)
    set_token(username, token)

    return {'token': token , 'tokenType' : 'Bearer', 'username' : username}


@app.post("/logout", tags=["users"])
def logout(token: str = Depends(oauth2_scheme)):
    delete_token(token)
    return {"message": "Successfully logged out."}


@app.get("/protected")
def protected_route(current_user: str = Depends(get_current_user)):
    # Korumalı rotanın gerçek işlemini burada gerçekleştirin
    return {"username": current_user}
# endregion


# region websocket tanımlama

class ConnectionManager:
    def __init__(self):
        self.active_connections: List[WebSocket] = []

    async def connect(self, websocket: WebSocket):
        await websocket.accept()
        self.active_connections.append(websocket)

    def disconnect(self, websocket: WebSocket):
        self.active_connections.remove(websocket)

    async def broadcast(self, message: str):
        for connection in self.active_connections:
            await connection.send_json(message)


wsManager = ConnectionManager()

# endregion


# region websocket dinleme

@app.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    await wsManager.connect(websocket)
    await websocket.send_json(dbSorgu("select * from products order by id"))
    try:
        while True:
            message = await websocket.receive_json()
            if message["type"] == "get_bid":
                product = load_product(message["id"])
                await wsManager.broadcast(product)

            elif message["type"] == "set_bid":
                if load_product(message["id"]) != None:
                    dbPost(("UPDATE products SET lastprice=%s ,username=%s WHERE id = %s"),
                           (message["bid"], message["username"], message["id"],))
                    await wsManager.broadcast(dbSorgu("select * from products order by id"))

    except WebSocketDisconnect:
        wsManager.disconnect(websocket)

# endregion

