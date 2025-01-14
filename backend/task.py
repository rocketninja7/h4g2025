import json
from datetime import datetime

class Task:
    def __init__(self, name, start, end, pending_users, users):
        self.name = name
        self.start = start
        self.end = end
        self.pending_users = pending_users
        self.users = users

    def jsonify(self):
        jsondict = {
            "name": self.name,
            "start": self.start.strftime("%Y-%m-%d %H:%M"),
            "end": self.end.strftime("%Y-%m-%d %H:%M"),
            "pending_users": self.pending_users,
            "users": self.users
        }
        return jsondict
