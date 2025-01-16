import json
from datetime import datetime

fmt = "%Y-%m-%d %H:%M"

class Task:
    def __init__(self, id, name, desc, start, end, pending_users, users):
        self.id = id
        self.name = name
        self.desc = desc
        self.start = start
        self.end = end
        self.pending_users = pending_users
        self.users = users

    def jsonify(self):
        jsondict = {
            "id": self.id,
            "name": self.name,
            "start": self.start.strftime(fmt),
            "end": self.end.strftime(fmt),
            "pending_users": [user.jsonify() for user in self.pending_users],
            "users": [user.jsonify() for user in self.users]
        }
        return jsondict
