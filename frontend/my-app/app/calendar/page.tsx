"use client"
import ModernCalendar from './calendar'
import moment from 'moment'
import { useEffect, useState } from 'react'

export default function Main() {
    const [tasks, setTasks] = useState([])

    useEffect(() => {
        const fetchTasks = async () => {
            const fetchedTasks = await getTasks()
            const formattedTasks = fetchedTasks.map(task => ({
                title: task.name,
                start: new Date(task.start),
                end: new Date(task.end)
            }))
            setTasks(formattedTasks)
        }
        fetchTasks()
    }, [])

    return <ModernCalendar tasksList={tasks} />
}

async function getTasks() {
    const res = await fetch("http://127.0.0.1:5000/getTasks/1")
    const tasks = await res.json()
    return tasks
}