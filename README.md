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

## Database

Our database contains the following five tables (with column names in brackets):
- ```tasks(id, time_start, time_end, event_name, event_desc)```
- ```users(id, username, password)```
- ```taskpendingusers(task, user)```
- ```taskconfirmedusers(task, user)```
- ```messages(id,sender_id,receiver_id,content,timestamp)```

Note that ```tasks```, ```users``` and ```messages``` have ```id``` as a primary key. Also, for ```taskpendingusers``` and ```taskconfirmedusers```, the ```task``` columns are foreign keys to the ```id``` column of ```tasks```, and the ```user``` columns are foreign keys to the ```id``` column of ```users```. Furthermore in ```messages```, the ```sender_id``` and ```receiver_id``` columns are foreign keys to the ```id``` column of ```users```.


## Usage

This app comes prepared with three user credentials. These should be removed from the system when deployed. They are as follows:
```
pikachu:pikachu
piplup:piplup
mewtwo:mewtwo
```
