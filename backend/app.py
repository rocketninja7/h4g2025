from flask import Flask, request, jsonify
from flask_cors import CORS
from datetime import datetime
from task import *
from user import *

app = Flask(__name__)
CORS(app)

users = {"pikachu": "pikachu"}
userlist = [User(1, "pikachu"), User(2, "piplup"), User(3, "mewtwo")]

tasks = [
    Task("Test1", datetime(2025,2,25,13), datetime(2025,2,25,14), [userlist[0],userlist[1]], [userlist[2]]), 
    Task("Test2", datetime(2025,4,1,8), datetime(2025,4,1,9), [userlist[1],userlist[2]], [userlist[0]])]

@app.route("/")
def main():
    return "It works!"

@app.route("/getTasks/<int:user_id>")
def getTaskForUser(user_id):
    return [task.jsonify() for task in tasks]

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

@app.route('/getUsers')
def getUsers():
    return [user.jsonify() for user in userlist]

@app.route('/addTask', methods=['POST'])
def addTask():
    data = request.json
    
    name = data.get("name")
    start = datetime.strptime(data.get("start"), fmt)
    end = datetime.strptime(data.get("end"), fmt)
    pending_users = [User(user.get("id"), user.get("name")) for user in data.get("pending_users")]

    tasks.append(Task(name, start, end, pending_users, []))
    return jsonify({"message": "Task added successfully"}), 201


if __name__ == '__main__':
    app.run(debug=True)

