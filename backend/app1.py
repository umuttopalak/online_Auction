from flask_cors import CORS
from flask import Flask, jsonify, request
from dotenv import load_dotenv
import os
import psycopg2

load_dotenv()
app = Flask(__name__)
CORS(app)


CREATE_USERS_TABLE = (
    "CREATE TABLE IF NOT EXISTS users (id SERIAL PRIMARY KEY, name TEXT, surname TEXT, mail TEXT , password TEXT);"
)
def createTable():
    url = os.environ.get("DATABASE_URL")  # gets variables from environment
    connection = psycopg2.connect(url)
    with connection:
        cursor = connection.cursor()
        cursor.execute(CREATE_USERS_TABLE)
        cursor.close()
    connection.close()


createTable()

x = True



# 0-register | 1- login |
def dataBaseManager(metod, data):
    if metod == 0:
        url = os.environ.get("DATABASE_URL")  # gets variables from environment
        connection = psycopg2.connect(url) 
        if mailCheck(data["mail"]):
            print("girdi")
            with connection:
                cur = connection.cursor()
                cur.execute("INSERT INTO users (name, surname, mail , password) VALUES (%s, %s, %s ,%s)",
                        (data['name'], data['surname'], data['mail'], data['password']))
            connection.close()
        else:
            print("kayıt olunamadı")
    

def mailCheck(mail):
    url = os.environ.get("DATABASE_URL")  # gets variables from environment
    connection = psycopg2.connect(url)
    cur = connection.cursor()
    mails = []
    with connection:
        cur.execute("SELECT 'mail' from users")
        mails = cur.fetchall()
    
    for _mail in mails:
       if _mail == mail:
           return False
    
    return True
    

# kayıt
@app.route('/user', methods=['POST'])
def register():
    if request.method == 'POST':
        try:
            data = request.get_json()
            dataBaseManager(0, data)
            return {
                
            },201
        except:
            return {}, 501
       