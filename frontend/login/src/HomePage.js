import { useLocation } from 'react-router-dom';
import './HomePage.css';
import { useNavigate } from 'react-router-dom';
import ChatWindow from './ChatWindow';
import UserChatWindow from './UserChatWindow'; // Import User-to-User Chat Component
import styles from './ChatWindow.module.css';
import CreateTask from './CreateTask';
import ModernCalendar from './CalendarComponent';
import { useEffect, useState, useCallback } from 'react';
import moment from 'moment';
import Notifications from './Notifications';

const HomePage = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const location = useLocation();
    const { username, id } = location.state || {};
    const [recentTasks, setRecentTasks] = useState([]);
    const [upcomingTasks, setUpcomingTasks] = useState([]);
    const [isChatOpen, setIsChatOpen] = useState(false); // AI Chatbot
    const [isUserChatOpen, setIsUserChatOpen] = useState(false); // User-to-User Chat
    const [showModal, setShowModal] = useState(false);

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

    const fetchTasks = async () => {
        try {
            const res = await fetch(`http://127.0.0.1:5000/getTasks/${id}`);
            const tasks = await res.json();
            const now = new Date();

            const upcoming = tasks.filter(task => new Date(task.start) > now).slice(0, 5);
            const recent = tasks.filter(task => new Date(task.start) <= now).slice(0, 5);

            setUpcomingTasks(upcoming);
            setRecentTasks(recent);
        } catch (error) {
            console.error('Error fetching tasks:', error);
        }
    };

    const handleCloseModal = useCallback(() => {
        setShowModal(false);
    }, []);

    useEffect(() => {
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
                        <li className="sidebar-item" onClick={() => setIsUserChatOpen(true)}>Chat with Users</li>
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
                            <button 
                                className="action-button" 
                                onClick={() => setShowModal(true)}
                            >
                                Create New Task
                            </button>
                            <button className="action-button" onClick={navigateToCalendar}>View Calendar</button>
                            <button 
                                className="action-button" 
                                onClick={() => setIsChatOpen(true)}
                            >
                                AI Assistant
                            </button>
                            <button 
                                className="action-button" 
                                onClick={() => setIsUserChatOpen(true)}
                            >
                                User Chat
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
                                <Notifications updateCalendarState={fetchTasks} userId={id} />
                            </ul>
                        </div>
                    </div>
                </div>
            </div>

            {showModal && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <CreateTask 
                            onClose={handleCloseModal} 
                            updateCalendarState={fetchTasks} 
                        />
                    </div>
                </div>
            )}

            {/* AI Assistant */}
            <ChatWindow 
                isOpen={isChatOpen} 
                onClose={() => setIsChatOpen(false)} 
            />

            {/* User-to-User Chat */}
            <UserChatWindow 
                isOpen={isUserChatOpen} 
                onClose={() => setIsUserChatOpen(false)} 
                userId={id} 
            />
        </div>
    );
};

export default HomePage;
