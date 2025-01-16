import ModernCalendar from './CalendarComponent'
import { useEffect, useState, useCallback } from 'react'
import CreateTask from './CreateTask'
import moment from 'moment';
import Notifications from './Notifications';

export default function Calendar() {
    const [tasks, setTasks] = useState([])
    const [start, setStart] = useState(null)
    const [end, setEnd] = useState(null)
    const [calendarState, setCalendarState] = useState(0)

    const fetchTasks = async () => {
        const fetchedTasks = await getTasks()
        const formattedTasks = fetchedTasks.map(task => ({
            title: task.name,
            start: new Date(task.start),
            end: new Date(task.end)
        }))
        setTasks(formattedTasks)
    }

    const handleSelectSlot = useCallback(
        ({ start, end }) => {
            setStart(start)
            setEnd(end)
        // const title = window.prompt('New Event name')
        // if (title) {
        //     setEvents((prev) => [...prev, { start, end, title }])
        // }
        },
        []
    )

    const handleSelectEvent = useCallback(
        (event) => window.alert(event.title),
        []
    )

    const updateCalendarState = () => {
        fetchTasks()
        setCalendarState(calendarState + 1)
    }

    useEffect(() => {
        fetchTasks()
    }, [])

    return (
        <div key={calendarState}
        // style={{display: "flex"}}
        >
            <ModernCalendar 
                tasksList={tasks} 
                handleSelectSlot={handleSelectSlot} 
                handleSelectEvent={handleSelectEvent} 
                />
            <Notifications updateCalendarState={updateCalendarState} />
            { start && end && (
                <div style={{position: "absolute", top: "50%", left: "50%", zIndex: 10}} >
                    <div style={{position: "relative", left: "-50%", backgroundColor: "#D3D3D3", padding: "10px"}} >
                        <CreateTask 
                            start={moment(start).format("YYYY-MM-DD HH:mm")} 
                            end={moment(end).format("YYYY-MM-DD HH:mm")}/>
                    </div>
                </div>
            )}
        </div>
    )
}

async function getTasks() {
    const res = await fetch("http://127.0.0.1:5000/getTasks/1")
    const tasks = await res.json()
    return tasks
}
