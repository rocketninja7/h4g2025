import ModernCalendar from './CalendarComponent'
import { useEffect, useState, useCallback } from 'react'
import CreateTask from './CreateTask'
import moment from 'moment';
import { useLocation } from 'react-router-dom';

export default function Calendar() {
    const [tasks, setTasks] = useState([])
    const [start, setStart] = useState(null)
    const [end, setEnd] = useState(null)
    const [calendarState, setCalendarState] = useState(0)
    const [showModal, setShowModal] = useState(false)
    const [selectedTask, setSelectedTask] = useState(null)
    const location = useLocation();
    const { id: userId } = location.state || {};

    const fetchTasks = useCallback(async () => {
        const res = await fetch("http://127.0.0.1:5000/getTasks/" + userId)
        const tasksData = await res.json()
        const formattedTasks = tasksData.map(task => ({
            ...task,
            title: task.name,
            start: moment(task.start, "YYYY-MM-DD HH:mm").toDate(),
            end: moment(task.end, "YYYY-MM-DD HH:mm").toDate()
        }))
        setTasks(formattedTasks)
    }, [userId])

    const handleSelectSlot = useCallback(
        ({ start, end }) => {
            setStart(start)
            setEnd(end)
            setSelectedTask(null)
            setShowModal(true)
        },
        []
    )

    const handleSelectEvent = useCallback(
        (event) => {
            setStart(event.start)
            setEnd(event.end)
            setSelectedTask(event)
            setShowModal(true)
        },
        []
    )

    const updateCalendarState = useCallback(() => {
        fetchTasks()
        setCalendarState(prev => prev + 1)
    }, [fetchTasks])
    
    const handleCloseModal = useCallback(() => {
        setShowModal(false)
        setStart(null)
        setEnd(null)
        setSelectedTask(null)
    }, [])

    useEffect(() => {
        if (userId) {
            fetchTasks()
        }
    }, [userId, fetchTasks])

    if (!userId) {
        return <div>Please log in to view calendar</div>
    }

    return (
        <div key={calendarState}>
            <ModernCalendar 
                tasksList={tasks} 
                handleSelectSlot={handleSelectSlot} 
                handleSelectEvent={handleSelectEvent} 
            />
            {showModal && start && end && userId && (
                <CreateTask 
                    start={moment(start).format("YYYY-MM-DD HH:mm")} 
                    end={moment(end).format("YYYY-MM-DD HH:mm")}
                    onClose={handleCloseModal}
                    updateCalendarState={updateCalendarState}
                    userId={userId}
                    task={selectedTask}
                    isEditing={!!selectedTask}
                />
            )}
        </div>
    )
}