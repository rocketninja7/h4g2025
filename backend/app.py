from flask import Flask, request, jsonify
from flask_cors import CORS
from datetime import datetime
from task import *
from user import *
import csvfn
import os
from chatbot import AIAssistant
import csv

app = Flask(__name__)
CORS(app)

users, userlist = csvfn.get_users()
print(users)

tasks = csvfn.get_tasks(userlist, [])
print(tasks)

# Chat history storage (in-memory)
chat_history = []

# Ensure chathistory.csv exists
CHAT_HISTORY_FILE = 'chathistory.csv'
if not os.path.exists(CHAT_HISTORY_FILE):
    with open(CHAT_HISTORY_FILE, 'w', newline='', encoding='utf-8') as file:
        writer = csv.writer(file)
        writer.writerow(['SenderID', 'RecipientID', 'Message', 'Timestamp'])  # Add headers

@app.route('/sendMessage', methods=['POST'])
def send_message():
    """Send a message between users and save it to chat history."""
    data = request.json
    sender_id = data.get("senderId")
    recipient_id = data.get("recipientId")
    message = data.get("message")
    timestamp = datetime.now().strftime('%Y-%m-%d %H:%M:%S')

    if not sender_id or not recipient_id or not message:
        return jsonify({"error": "Invalid data"}), 400

    # Save message to in-memory history
    chat_history.append({
        "senderId": sender_id,
        "recipientId": recipient_id,
        "message": message,
        "timestamp": timestamp,
    })

    # Save message to CSV
    with open(CHAT_HISTORY_FILE, 'a', newline='', encoding='utf-8') as file:
        writer = csv.writer(file)
        writer.writerow([sender_id, recipient_id, message, timestamp])

    return jsonify({"message": "Message sent successfully"}), 200

@app.route('/getChatHistory/<int:user_id>/<int:recipient_id>', methods=['GET'])
def get_chat_history(user_id, recipient_id):
    """Retrieve chat history between two users."""
    chat_data = []

    # Load chat history from CSV
    with open(CHAT_HISTORY_FILE, 'r', encoding='utf-8') as file:
        reader = csv.DictReader(file)
        for row in reader:
            if (
                (int(row['SenderID']) == user_id and int(row['RecipientID']) == recipient_id) or
                (int(row['SenderID']) == recipient_id and int(row['RecipientID']) == user_id)
            ):
                chat_data.append({
                    "senderId": int(row['SenderID']),
                    "recipientId": int(row['RecipientID']),
                    "message": row['Message'],
                    "timestamp": row['Timestamp'],
                })

    return jsonify(chat_data), 200


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
        return jsonify({"message": "Login successful", "id": [user for user in userlist if user.name == username][0].id}), 200
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
    creator_id = data.get("creator_id")  # Get the creator's ID
    
    # Find the creator user object
    creator = [user for user in userlist if user.id == creator_id][0]
    
    # Filter out creator from pending users list if present
    pending_users = [
        [user for user in userlist if user.id == pending_user.get("id")][0]
        for pending_user in data.get("pending_users")
        if pending_user.get("id") != creator_id
    ]
    
    # Create new task with creator in confirmed users list
    new_task = Task(len(tasks) + 1, name, "", start, end, pending_users, [creator])
    tasks.append(new_task)
    csvfn.write_tasks(tasks)
    return jsonify({"message": "Task added successfully"}), 201

ai_assistant = AIAssistant()

@app.route('/chat', methods=['POST'])
def chat():
    try:
        data = request.json
        message = data.get('message')
        
        if not message:
            return jsonify({'error': 'No message provided'}), 400
        
        # Get response from AI assistant
        response = ai_assistant.get_answer(message)
        
        return jsonify({'response': response})
    
    except Exception as e:
        print(f"Error in chat endpoint: {str(e)}")
        return jsonify({'error': 'Internal server error'}), 500

@app.route('/reset-chat', methods=['POST'])
def reset_chat():
    try:
        ai_assistant.reset_conversation()
        return jsonify({'message': 'Chat history reset successfully'})
    except Exception as e:
        print(f"Error in reset-chat endpoint: {str(e)}")
        return jsonify({'error': 'Internal server error'}), 500

@app.route('/updateTask/<int:task_id>', methods=['PUT'])
def updateTask(task_id):
    task = [curr_task for curr_task in tasks if curr_task.id == task_id]
    if len(task) > 1:
        return jsonify({"message": "There seems to be an error with the database!"}), 500
    if len(task) == 0:
        return jsonify({"message": "Task not found"}), 401
    
    task = task[0]
    data = request.json
    
    # Update task details
    task.name = data.get('name', task.name)
    task.start = datetime.strptime(data.get('start'), fmt)
    task.end = datetime.strptime(data.get('end'), fmt)
    
    # Update pending users
    new_pending_users = []
    for user_data in data.get('pending_users', []):
        user = [u for u in userlist if u.id == user_data['id']]
        if user:
            new_pending_users.append(user[0])
    task.pending_users = new_pending_users
    
    csvfn.write_tasks(tasks)
    return jsonify({"message": "Task updated successfully"}), 200

@app.route('/deleteTask/<int:task_id>', methods=['DELETE'])
def deleteTask(task_id):
    task = [curr_task for curr_task in tasks if curr_task.id == task_id]
    if len(task) > 1:
        return jsonify({"message": "There seems to be an error with the database!"}), 500
    if len(task) == 0:
        return jsonify({"message": "Task not found"}), 401
    
    tasks.remove(task[0])
    csvfn.write_tasks(tasks)
    return jsonify({"message": "Task deleted successfully"}), 200


if __name__ == '__main__':
    app.run(debug=True)

