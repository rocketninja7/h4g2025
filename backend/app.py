from flask import Flask
from flask_cors import CORS
from task import *

app = Flask(__name__)
CORS(app)

@app.route("/")
def main():
    return "It works!"

@app.route("/getTasks/<int:user_id>")
def getTaskForUser(user_id):
    temp = [
        Task("Test1", datetime(2025,2,25,13), datetime(2025,2,25,14), [1,2], [3]), 
        Task("Test2", datetime(2025,4,1,8), datetime(2025,4,1,9), [2,3], [1])]
    return [task.jsonify() for task in temp]



