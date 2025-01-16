from flask import Flask, request, jsonify
from flask_cors import CORS
from datetime import datetime
from task import *
from user import *
import csvfn
import os

app = Flask(__name__)
CORS(app)

users, userlist = csvfn.get_users()
print(users)

tasks = csvfn.get_tasks(userlist, [])
print(tasks)

@app.route("/")
def main():
    return "It works!"

@app.route("/getTasks/<int:user_id>")
def getTaskForUser(user_id):
    return [task.jsonify() for task in tasks if user_id in [curr_user.id for curr_user in task.users]]

@app.route("/getPendingTasks/<int:user_id>")
def getPendingTaskForUser(user_id):
    return [task.jsonify() for task in tasks if user_id in [curr_user.id for curr_user in task.pending_users]]

@app.route("/acceptTask/<int:task_id>", methods=['POST'])
def acceptTask(task_id):
    task = [curr_task for curr_task in tasks if curr_task.id == task_id]
    if len(task) > 1:
        return jsonify({"message": "There seems to be an error with the database!"}), 500
    if len(task) == 0:
        return jsonify({"message": "Task not found"}), 401
    task = task[0]
    data = request.json
    user_id = data.get("id")
    user = [user for user in userlist if user_id == user.id]
    if len(user) > 1:
        return jsonify({"message": "There seems to be an error with the database!"}), 500
    if len(user) == 0:
        return jsonify({"message": "User not found"}), 401
    user = user[0]
    if user not in task.pending_users:
        return jsonify({"message": "User is not invited to task or has already responded"}), 403
    task.users.append(user)
    task.pending_users.remove(user)
    csvfn.write_tasks(tasks)
    return jsonify({"message": "Task accepted successfully"}), 200

@app.route("/rejectTask/<int:task_id>", methods=['POST'])
def rejectTask(task_id):
    task = [curr_task for curr_task in tasks if curr_task.id == task_id]
    if len(task) > 1:
        return jsonify({"message": "There seems to be an error with the database!"}), 500
    if len(task) == 0:
        return jsonify({"message": "Task not found"}), 401
    task = task[0]
    data = request.json
    user_id = data.get("id")
    user = [user for user in userlist if user_id == user.id]
    if len(user) > 1:
        return jsonify({"message": "There seems to be an error with the database!"}), 500
    if len(user) == 0:
        return jsonify({"message": "User not found"}), 401
    user = user[0]
    if user not in task.pending_users:
        return jsonify({"message": "User is not invited to task or has already responded"}), 403
    task.pending_users.remove(user)
    csvfn.write_tasks(tasks)
    return jsonify({"message": "Task rejected successfully"}), 200

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
    pending_users = [[finduser for finduser in userlist if finduser.id == user.get("id")][0] for user in data.get("pending_users")]
    tasks.append(Task(len(tasks) + 1, name, "", start, end, pending_users, []))
    csvfn.write_tasks(tasks)
    return jsonify({"message": "Task added successfully"}), 201


if __name__ == '__main__':
    app.run(debug=True)

