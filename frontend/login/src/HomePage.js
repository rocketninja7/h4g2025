import { useLocation } from 'react-router-dom';
import './HomePage.css';
import { useNavigate } from 'react-router-dom';
import ChatWindow from './ChatWindow';
import styles from './ChatWindow.module.css'; 
import CreateTask from './CreateTask';
import ModernCalendar from './CalendarComponent'
import { useEffect, useState, useCallback } from 'react'
import moment from 'moment';
import Notifications from './Notifications';


const HomePage = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const location = useLocation();
    const { username, id } = location.state || {};
    const [recentTasks, setRecentTasks] = useState([]);
    const [upcomingTasks, setUpcomingTasks] = useState([]);
    const [isChatOpen, setIsChatOpen] = useState(false);

    const navigate = useNavigate();
    const navigateToLogin = () => {
        navigate('/');
    };
    const navigateToHome = () => {
        navigate('/homepage', { state: { username, id } });
    };
    const navigateToCalendar = () => {
        navigate('/calendar', { state: { username, id } });
    };
    const [tasks, setTasks] = useState([])
    const [start, setStart] = useState(null)
    const [end, setEnd] = useState(null)
    const [calendarState, setCalendarState] = useState(0)
    const [showModal, setShowModal] = useState(false)  // Add this line

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
    useEffect(() => {
        const fetchTasks = async () => {
            try {
                const res = await fetch("http://127.0.0.1:5000/getTasks/1");
                const tasks = await res.json();
                
                const now = new Date();
                const upcoming = tasks
                    .filter(task => new Date(task.start) > now)
                    .slice(0, 5);
                const recent = tasks
                    .filter(task => new Date(task.start) <= now)
                    .slice(0, 5);

                setUpcomingTasks(upcoming);
                setRecentTasks(recent);
            } catch (error) {
                console.error('Error fetching tasks:', error);
            }
        };
        fetchTasks();
    }, []);

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', { 
            month: 'short', 
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    return (
        <div className="container">
            <div className="top-bar">
                <button
                    onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                    className="menu-button"
                >
                   <span>☰</span>
                </button>
                <h1 style={{ margin: 0, fontSize: '1.5rem' }}>Dashboard</h1>
                <div className="header-right">
                    {username && (
                        <span style={{ fontSize: '1rem' }}>
                            Welcome, <strong>{username}</strong>
                        </span>
                    )}
                </div>
            </div>

            <div className="main-content">
                <div className={`sidebar ${isSidebarOpen ? 'open' : ''}`}>
                    <ul className="sidebar-list">
                        <li className="sidebar-item" onClick={navigateToHome}>Dashboard</li>
                        <li className="sidebar-item" onClick={navigateToCalendar}>Calendar</li>
                        <li className="sidebar-item" onClick={() => setIsChatOpen(true)}>Get Help</li>
                        <li className="sidebar-item" onClick={navigateToLogin}>Logout</li>
                    </ul>
                </div>

                <div className={`content ${isSidebarOpen ? 'sidebar-open' : ''}`}>
                    <div className="welcome-section">
                        <h1 className="welcome-title">Welcome to Your Dashboard</h1>
                        <p className="welcome-text">
                            Here's an overview of your tasks and activities
                        </p>
                        <div className="quick-actions">
                            <button className="action-button">Create New Task</button>
                            <button className="action-button" onClick={navigateToCalendar}>View Calendar</button>
                            <button 
                                className="action-button" 
                                onClick={() => setIsChatOpen(true)}
                            >
                                AI Assistant
                            </button>
                        </div>
                    </div>

                    <div className="grid">
                        <div className="card">
                            <h2 className="card-title">Upcoming Tasks</h2>
                            <ul className="task-list">
                                {upcomingTasks.map((task, index) => (
                                    <li key={index} className="task-item">
                                        <span className="task-name">{task.name}</span>
                                        <span className="task-date">{formatDate(task.start)}</span>
                                    </li>
                                ))}
                                {upcomingTasks.length === 0 && (
                                    <li className="task-item">No upcoming tasks</li>
                                )}
                            </ul>
                        </div>

                        <div className="card">
                            <h2 className="card-title">Recent Tasks</h2>
                            <ul className="task-list">
                                {recentTasks.map((task, index) => (
                                    <li key={index} className="task-item">
                                        <span className="task-name">{task.name}</span>
                                        <span className="task-date">{formatDate(task.start)}</span>
                                    </li>
                                ))}
                                {recentTasks.length === 0 && (
                                    <li className="task-item">No recent tasks</li>
                                )}
                            </ul>
                        </div>
                        <div className="card">
                            <h2 className="card-title">Requests</h2>
                            <ul className="task-list">
                                <Notifications updateCalendarState={updateCalendarState} userId={id} />
                                    {showModal && start && end && (  // Update this condition
                                        <CreateTask 
                                            start={moment(start).format("YYYY-MM-DD HH:mm")} 
                                            end={moment(end).format("YYYY-MM-DD HH:mm")}
                                            onClose={handleCloseModal}  // Pass the handler
                                            updateCalendarState={updateCalendarState}
                                        /> )}
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
            <ChatWindow 
                isOpen={isChatOpen} 
                onClose={() => setIsChatOpen(false)} 
            />
        </div>
    );
};

export default HomePage;