import React, { useState, useEffect } from 'react';
import ReceiveTask from './ReceiveTask';
import "./App.css"

export default function Notifications({updateCalendarState, userId}) {
    async function getTasks() {
        const res = await fetch("http://127.0.0.1:5000/getPendingTasks/" + userId)
        const tasks = await res.json()
        return tasks
    }

    const [tasks, setTasks] = useState([])

    useEffect(() => {
        const fetchTasks = async () => {
            const fetchedTasks = await getTasks()
            setTasks(fetchedTasks)
        }
        fetchTasks()
    }, [])

    const handleAcceptTask = (id) => {
        return async (e) => {
            try {
                const response = await fetch('http://127.0.0.1:5000/acceptTask/' + id, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id: userId }),
                });
            //   const data = await response.json();
            //   alert(data.message);
            } catch (error) {
                console.error('Error:', error);
            }
            updateCalendarState();
        }
    }

    const handleRejectTask = (id) => {
        return async (e) => {
            try {
                const response = await fetch('http://127.0.0.1:5000/rejectTask/' + id, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id: userId }),
                });
            //   const data = await response.json();
            //   alert(data.message);
            } catch (error) {
                console.error('Error:', error);
            }
            updateCalendarState();
        }
    }

    return (
        <div>
            {
                tasks.map(task => <ReceiveTask
                    key = {task.id}
                    name = {task.name}
                    start = {task.start}
                    end = {task.end}
                    invitedUsers = {task.pending_users}
                    confirmedUsers = {task.users}
                    handleAcceptTask = {handleAcceptTask(task.id)}
                    handleRejectTask = {handleRejectTask(task.id)}
                />)
            }
        </div>
    )
}