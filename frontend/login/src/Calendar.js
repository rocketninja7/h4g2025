import ModernCalendar from './CalendarComponent'
import { useEffect, useState, useCallback } from 'react'
import CreateTask from './CreateTask'
import moment from 'moment';

export default function Calendar() {
    const [tasks, setTasks] = useState([])
    const [start, setStart] = useState(null)
    const [end, setEnd] = useState(null)

    const handleSelectSlot = useCallback(
        ({ start, end }) => {
            setStart(start)
            setEnd(end)
        // const title = window.prompt('New Event name')
        // if (title) {
        //     setEvents((prev) => [...prev, { start, end, title }])
        // }
        },
        [setTasks]
    )

    const handleSelectEvent = useCallback(
        (event) => window.alert(event.title),
        []
    )

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

    return (
        <div style={{ display: "flex" }}>
            <ModernCalendar 
                tasksList={tasks} 
                handleSelectSlot={handleSelectSlot} 
                handleSelectEvent={handleSelectEvent} 
                />
            { start && end && (<CreateTask start={moment(start).format("YYYY-MM-DD HH:mm")} end={moment(end).format("YYYY-MM-DD HH:mm")} />) }
        </div>
    )
}

async function getTasks() {
    const res = await fetch("http://127.0.0.1:5000/getTasks/1")
    const tasks = await res.json()
    return tasks
}
