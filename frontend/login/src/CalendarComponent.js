import React, { useState } from 'react';
import "react-big-calendar/lib/css/react-big-calendar.css";
import { Calendar, momentLocalizer } from 'react-big-calendar';
import { useLocation } from 'react-router-dom';
import moment from 'moment';

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
        <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', width: '100%' }}>
            {/* Top Bar */}
            <div
                style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    backgroundColor: '#333',
                    color: '#fff',
                    padding: '1rem',
                    width: '100vw', // Ensure the top bar spans the entire screen
                    boxSizing: 'border-box', // Include padding in the width
                }}
            >
                <button
                    onClick={toggleSidebar}
                    style={{
                        background: 'none',
                        border: 'none',
                        color: '#fff',
                        fontSize: '1.5rem',
                        cursor: 'pointer',
                    }}
                >
                    ☰
                </button>
                <h1 style={{ margin: 0, fontSize: '1.5rem' }}>Calendar</h1>
                {username && (
                    <div style={{ fontSize: '1rem' }}>
                        Welcome, <span style={{ fontWeight: 'bold' }}>{username}</span>
                    </div>
                )}
            </div>

            <div style={{ display: 'flex', flex: 1 }}>
                {/* Sidebar */}
                <div
                    style={{
                        width: isSidebarOpen ? '15rem' : '0',
                        backgroundColor: '#444',
                        color: '#fff',
                        padding: isSidebarOpen ? '1rem' : '0',
                        overflow: 'hidden',
                        transition: 'width 0.3s',
                    }}
                >
                    {isSidebarOpen && (
                        <ul style={{ listStyle: 'none', padding: 0 }}>
                            <li style={{ padding: '1rem 0', cursor: 'pointer' }}>Option 1</li>
                            <li style={{ padding: '1rem 0', cursor: 'pointer' }}>Option 2</li>
                            <li style={{ padding: '1rem 0', cursor: 'pointer' }}>Option 3</li>
                        </ul>
                    )}
                </div>

                {/* Main Content */}
                <div style={{ flex: 1, padding: '1rem' }}>
                    <div
                        style={{
                            backgroundColor: '#fff',
                            borderRadius: '0.5rem',
                            boxShadow: '0 0.5rem 1rem rgba(0, 0, 0, 0.1)',
                            overflow: 'hidden',
                            height: '100%',
                        }}
                    >
                        <Calendar
                            localizer={localizer}
                            events={typeof tasksList === 'string' ? JSON.parse(tasksList) : tasksList}
                            startAccessor="start"
                            endAccessor="end"
                            style={{ height: '100%' }}
                            views={allViews}
                            defaultView="month"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ModernCalendar;
