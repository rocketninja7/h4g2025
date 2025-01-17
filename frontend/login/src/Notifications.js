import React, { useState, useEffect } from 'react';
import ReceiveTask from './ReceiveTask';
import "./App.css"

export default function Notifications({updateCalendarState, userId}) {
    const [tasks, setTasks] = useState([])

    useEffect(() => {
        const fetchTasks = async () => {
            try {
                const res = await fetch("http://127.0.0.1:5000/getPendingTasks/" + userId);
                const tasks = await res.json();
                setTasks(tasks);
            } catch (error) {
                console.error('Error fetching tasks:', error);
            }
        };

        fetchTasks();
    }, [userId]); // Add userId as dependency

    const handleAcceptTask = (id) => {
        return async (e) => {
            try {
                const response = await fetch('http://127.0.0.1:5000/acceptTask/' + id, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ id: userId }),
                });
                if (response.ok) {
                    // Remove the task from local state immediately
                    setTasks(prevTasks => prevTasks.filter(task => task.id !== id));
                    updateCalendarState();
                }
            } catch (error) {
                console.error('Error:', error);
            }
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
                if (response.ok) {
                    // Remove the task from local state immediately
                    setTasks(prevTasks => prevTasks.filter(task => task.id !== id));
                    updateCalendarState();
                }
            } catch (error) {
                console.error('Error:', error);
            }
        }
    }

    return (
        <div>
            {tasks.map(task => (
                <ReceiveTask
                    key={task.id}
                    name={task.name}
                    start={task.start}
                    end={task.end}
                    invitedUsers={task.pending_users}
                    confirmedUsers={task.users}
                    handleAcceptTask={handleAcceptTask(task.id)}
                    handleRejectTask={handleRejectTask(task.id)}
                />
            ))}
        </div>
    )
}