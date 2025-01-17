import React, { useState } from 'react';
import "react-big-calendar/lib/css/react-big-calendar.css";
import { Calendar, momentLocalizer } from 'react-big-calendar';
import { useLocation, useNavigate } from 'react-router-dom';
import moment from 'moment';
import './Calendar.css';
import ChatWindow from './ChatWindow';
import styles from './ChatWindow.module.css'; 

const ModernCalendar = ({ tasksList, handleSelectSlot, handleSelectEvent }) => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const localizer = momentLocalizer(moment);
    const location = useLocation();
    const { username, id } = location.state || {};
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

    const allViews = {
        month: true,
        week: true,
        day: true,
        agenda: true,
    };

    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };

    return (
        <div className="calendar-container">
            <div className="calendar-header">
                <div className="header-left">
                <button onClick={toggleSidebar} className="menu-button">
                    <span>☰</span>
                </button>
                </div>
                <h1 className="calendar-title">Calendar</h1>
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

                <div className="calendar-content">
                    <div className="calendar-wrapper">
                        <Calendar
                            localizer={localizer}
                            events={typeof tasksList === 'string' ? JSON.parse(tasksList) : tasksList}
                            startAccessor="start"
                            endAccessor="end"
                            style={{ height: '100%' }}
                            views={allViews}
                            defaultView="month"
                            onSelectEvent={handleSelectEvent}
                            onSelectSlot={handleSelectSlot}
                            selectable
                        />
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

export default ModernCalendar;