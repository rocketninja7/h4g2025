import csv
import os
import pandas as pd
from datetime import datetime
from user import *
from task import *
from message import Message

def get_users():
    with open("backend/users.csv", "r") as f:
        reader = csv.reader(f)
        users = []
        userlist = []
        for row in reader:
            users.append(row[1:])
            userlist.append(User(int(row[0]), row[1]))
    return dict(users), userlist

def add_user(idx, user, password):
    with open("backend/users.csv", "a") as f:
        writer = csv.writer(f)
        writer.writerow([idx, user, password])
    return True


# Get tasks with these users, if empty return all tasks
def get_tasks(all_users, query_users):
    tasks_df = None
    taskpendingusers_df = None
    taskconfirmedusers_df = None
    with open("backend/tasks.csv", "r") as f:
        tasks_df = pd.read_csv(f)
    with open("backend/taskpendingusers.csv", "r") as f:
        taskpendingusers_df = pd.read_csv(f)
    with open("backend/taskconfirmedusers.csv", "r") as f:
        taskconfirmedusers_df = pd.read_csv(f)
    if tasks_df is None or taskpendingusers_df is None or taskconfirmedusers_df is None:
        print("ERROR!")
        return []
    

    user_ids = [user.id for user in query_users]
    if user_ids:
        taskpendingusers_df = taskpendingusers_df[taskpendingusers_df["user"].isin(user_ids)]
        taskconfirmedusers_df = taskconfirmedusers_df[taskconfirmedusers_df["user"].isin(user_ids)]

    matching_tasks = pd.concat([taskpendingusers_df["task"], taskconfirmedusers_df["task"]]).unique()
    df = tasks_df[tasks_df["id"].isin(matching_tasks)]

    cleaned_tasks = []
    for _, task_row in df.iterrows():
        curr_task = task_row["id"]
        curr_pendingusers = taskpendingusers_df[taskpendingusers_df["task"] == curr_task]["user"].unique()
        curr_pendingusers = [[user for user in all_users if user.id == user_id][0] for user_id in curr_pendingusers]
        curr_users = taskconfirmedusers_df[taskconfirmedusers_df["task"] == curr_task]["user"].unique()
        curr_users = [[user for user in all_users if user.id == user_id][0] for user_id in curr_users]
        cleaned_tasks.append(Task(
            int(curr_task), 
            task_row["event_name"], 
            task_row["event_desc"],
            datetime.strptime(task_row["time_start"], fmt), 
            datetime.strptime(task_row["time_end"], fmt), 
            curr_pendingusers, 
            curr_users))

    return cleaned_tasks


def write_tasks(tasks):
    df = pd.DataFrame([{
        "id": task.id, 
        "time_start": task.start.strftime(fmt), 
        "time_end": task.end.strftime(fmt),
        "event_name": task.name,
        "event_desc": task.desc
    } for task in tasks])
    df.to_csv("backend/tasks.csv", index=False)

    taskpendingusers = []
    for task in tasks:
        for user in task.pending_users:
            taskpendingusers.append({"task": task.id, "user": user.id})
    if taskpendingusers:
        df = pd.DataFrame(taskpendingusers)
    else:
        df = pd.DataFrame(columns=["task","user"])
    
    df.to_csv("backend/taskpendingusers.csv", index=False)

    taskconfirmedusers = []
    for task in tasks:
        for user in task.users:
            taskconfirmedusers.append({"task": task.id, "user": user.id})
    if taskconfirmedusers:
        df = pd.DataFrame(taskconfirmedusers)
    else:
        df = pd.DataFrame(columns=["task","user"])
    
    df.to_csv("backend/taskconfirmedusers.csv", index=False)


# print(get_tasks())

def get_messages():
    messages = []
    try:
        with open('messages.csv', 'r', newline='') as file:
            reader = csv.reader(file)
            next(reader)  # Skip header
            for row in reader:
                message = Message(
                    int(row[0]),  # id
                    int(row[1]),  # sender_id
                    int(row[2]),  # receiver_id
                    row[3],       # content
                    datetime.strptime(row[4], "%Y-%m-%d %H:%M:%S")  # timestamp
                )
                messages.append(message)
    except FileNotFoundError:
        # Create messages.csv with headers if it doesn't exist
        with open('messages.csv', 'w', newline='') as file:
            writer = csv.writer(file)
            writer.writerow(['id', 'sender_id', 'receiver_id', 'content', 'timestamp'])
    return messages

def write_messages(messages):
    with open('messages.csv', 'w', newline='') as file:
        writer = csv.writer(file)
        writer.writerow(['id', 'sender_id', 'receiver_id', 'content', 'timestamp'])
        for message in messages:
            writer.writerow([
                message.id,
                message.sender_id,
                message.receiver_id,
                message.content,
                message.timestamp.strftime("%Y-%m-%d %H:%M:%S")
            ])