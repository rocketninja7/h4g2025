# SBC-PA

This project is a PA system built for SBC. It has the following features:
- A login page
- A home page where users can see upcoming tasks
- A calendar view where users can see all their tasks
- A page to invite people to tasks
- A notification panel where users can accept/reject tasks

Work in progress:
- Alert and reminder system
- AI chatbot
- Recommending tasks based on past tasks
- Email summarisation
- Auto accepting/rejecting tasks

## Installation
Clone this repository! This repository is split into the backend and frontend. Currently, we are running it locally, and we plan to migrate the csv files to a database.

The backend uses Flask. To setup, run the following from the main folder:
```
pip install -r requirements.txt
flask --app backend/app.py run
```

The frontend uses React. To setup, go to the ```frontend/login``` folder and run the following:
```
npm install
npm run start
```