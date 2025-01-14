from flask import Flask, request, jsonify
from flask_cors import CORS
from task import *

app = Flask(__name__)
CORS(app)

users = {"pikachu": "pikachu"}

@app.route("/")
def main():
    return "It works!"

@app.route("/getTasks/<int:user_id>")
def getTaskForUser(user_id):
    temp = [
        Task("Test1", datetime(2025,2,25,13), datetime(2025,2,25,14), [1,2], [3]), 
        Task("Test2", datetime(2025,4,1,8), datetime(2025,4,1,9), [2,3], [1])]
    return [task.jsonify() for task in temp]

@app.route('/login', methods=['POST'])
def login():
    data = request.json
    username = data.get('username')
    password = data.get('password')

    if users.get(username) == password:
        return jsonify({"message": "Login successful"}), 200
    else:
        return jsonify({"message": "Invalid username or password"}), 401

@app.route('/register', methods=['POST'])
def register():
    data = request.json
    username = data.get('username')
    password = data.get('password')

    if username in users:
        return jsonify({"message": "User already exists"}), 400
    users[username] = password
    return jsonify({"message": "User registered successfully"}), 201

if __name__ == '__main__':
    app.run(debug=True)

