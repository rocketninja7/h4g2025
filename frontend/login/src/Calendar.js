import ModernCalendar from './CalendarComponent'
import { useEffect, useState, useCallback } from 'react'
import CreateTask from './CreateTask'
import moment from 'moment';
import Notifications from './Notifications';
import { useLocation } from 'react-router-dom';


export default function Calendar() {
    const [tasks, setTasks] = useState([])
    const [start, setStart] = useState(null)
    const [end, setEnd] = useState(null)
    const [calendarState, setCalendarState] = useState(0)
    const [showModal, setShowModal] = useState(false)  // Add this line
    const location = useLocation();
    const { username, id } = location.state || {};

    async function getTasks() {
        const res = await fetch("http://127.0.0.1:5000/getTasks/" + id)
        const tasks = await res.json()
        return tasks
    }

    const fetchTasks = async () => {
        const fetchedTasks = await getTasks()
        const formattedTasks = fetchedTasks.map(task => ({
            title: task.name,
            start: moment(task.start, "YYYY-MM-DD HH:mm").toDate(),
            end: moment(task.end, "YYYY-MM-DD HH:mm").toDate()
        }))
        setTasks(formattedTasks)
    }

    const handleSelectSlot = useCallback(
        ({ start, end }) => {
            setStart(start)
            setEnd(end)
            setShowModal(true)  // Add this line
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
    
    const handleCloseModal = useCallback(() => {  // Add this function
        setShowModal(false)
        setStart(null)
        setEnd(null)
    }, [])

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
            <Notifications updateCalendarState={updateCalendarState} userId={id} />
            {showModal && start && end && (  // Update this condition
                <CreateTask 
                    start={moment(start).format("YYYY-MM-DD HH:mm")} 
                    end={moment(end).format("YYYY-MM-DD HH:mm")}
                    onClose={handleCloseModal}  // Pass the handler
                    updateCalendarState={updateCalendarState}
                />
            )}
        </div>
    )
}
