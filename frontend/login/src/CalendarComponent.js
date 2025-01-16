import React, { useState } from 'react';
import "react-big-calendar/lib/css/react-big-calendar.css";
import { Calendar, momentLocalizer } from 'react-big-calendar';
import { useLocation } from 'react-router-dom';
import moment from 'moment';
import './Calendar.css';

const ModernCalendar = ({ tasksList, handleSelectSlot, handleSelectEvent }) => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const localizer = momentLocalizer(moment);
    const location = useLocation();
    const { username } = location.state || {};

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
                        ☰
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
                        <li className="sidebar-item">Option 1</li>
                        <li className="sidebar-item">Option 2</li>
                        <li className="sidebar-item">Option 3</li>
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
        </div>
    );
};

export default ModernCalendar;