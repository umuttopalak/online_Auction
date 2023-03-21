# from flask import Flask, request, jsonify
from flask_cors import CORS
from flask import Flask, jsonify, request
from dotenv import load_dotenv
import os
import psycopg2
# from json import JSONEncoder
# import json
# from flask_cors import CORS

# CREATE_USERS_TABLE = (
#     "CREATE TABLE IF NOT EXISTS users (id SERIAL PRIMARY KEY, name TEXT, surname TEXT, mail TEXT , password TEXT);"
# )

load_dotenv()  # loads variables from .env file into environment

# app = Flask(__name__)
url = os.environ.get("DATABASE_URL")  # gets variables from environment
connection = psycopg2.connect(url)
# CORS(app)

# def createTable():
#     with connection:
#         cursor = connection.cursor()
#         cursor.execute(CREATE_USERS_TABLE)
#         cursor.close()


def userCollect():
    with connection:
        cursor = connection.cursor()
        cursor.execute("SELECT * FROM users ORDER BY ID")
        Users.append(cursor.fetchall())


# class User:
#     def __init__(self, _id, _name, _surname, _password):
#         self.id = _id
#         self.name = _name
#         self.surname = _surname
#         self.password = _password


Users = list()

# # ---------------------------------------------------------------------------------------------------
# createTable()
# # ---------------------------------------------------------------------------------------------------
# # ---------------------------------------------------------------------------------------------------


# @app.route('/user', methods=['GET', 'POST'])
# def getUsers():
#     if request.method == 'GET':
#         Users.clear()
#         userCollect()
#         return jsonify(Users)

#     if request.method == 'POST':
#         data = request.get_json()
#         with connection:
#             connection.cursor().execute("INSERT INTO users (name, surname, mail , password) VALUES (%s, %s, %s ,%s)",
#                                         (data['name'], data['surname'], data['mail'], data['password']))
#             connection.cursor().close()
#         return {
#             'message': 'user added'
#         }, 201


# @app.route('/user/5', methods=['GET'])
# def deneme():
#     with connection:
#         cursor = connection.cursor()
#         cursor.execute("SELECT * FROM users ORDER BY ID")
#         user = cursor.fetchall()
#         return jsonify(Users)


app = Flask(__name__)
CORS(app)

# Örnek bir GET isteği işleyicisi


@app.route('/api/data', methods=['GET'])
def get_data():
    data = {
        'name': 'John Doe',
        'age': 30,
        'location': 'New York'
    }
    return jsonify(data)


@app.route('/user', methods=['GET', 'POST'])
def getUsers():
    if request.method == 'GET':
        Users.clear()
        userCollect()
        return jsonify(Users)

    if request.method == 'POST':
        data = request.get_json()
        with connection:
            connection.cursor().execute("INSERT INTO users (name, surname, mail , password) VALUES (%s, %s, %s ,%s)",
                                        (data['name'], data['surname'], data['mail'], data['password']))
            connection.cursor().close()
        return {
            'message': 'user added'
        }, 201


@app.route('/')
def main():
    return{
        "diviviviv" : "dididiidid"
    }



if __name__ == '__main__':
    app.run(debug=True)
