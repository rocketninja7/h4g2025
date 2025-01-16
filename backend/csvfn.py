import csv
import os
import pandas as pd

def get_users():
    with open("backend/users.csv", "r") as f:
        reader = csv.reader(f)
        users = []
        for row in reader:
            users.append(row)
    return dict(users)

def add_user(user, password):
    with open("backend/users.csv", "a") as f:
        writer = csv.writer(f)
        writer.writerow([user, password])
    return True

def get_tasks(*username):
    with open("backend/tasks.csv", "r") as f:
        reader = csv.reader(f)
        tasks = []
        for row in reader:
            if not username:  
                tasks.append(row)
            elif any(user in row[4] for user in username):  
                tasks.append(row)

    cleaned_tasks = []
    for task in tasks[1:]:
        cleaned_tasks.append({
            "Created Time": task[0].strip(),
            "Event Time": task[1].strip(),
            "Event Name": task[2].strip().strip('"'),
            "Event Desc": task[3].strip().strip('"'),
            "Users Involved": ', '.join([x.strip('"') for x in task[4:]])[2:]
        })

    df = pd.DataFrame(cleaned_tasks)

    return df.to_string(index=False)

print(get_tasks())