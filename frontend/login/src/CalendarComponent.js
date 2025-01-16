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
                    backgroundColor: '#4f46e5',
                    color: '#fff',
                    padding: '1rem',
                    width: '90vw',
                    boxSizing: 'border-box',
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
                        backgroundColor: '#4f46e5',
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
                        <style jsx global>{`
                            .rbc-calendar {
                                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
                            }
                            
                            .rbc-header {
                                padding: 12px 4px;
                                font-weight: 500;
                                font-size: 14px;
                                border: none;
                                color: #666;
                            }
                            
                            .rbc-month-view {
                                border: none;
                                background: white;
                            }
                            
                            .rbc-date-cell {
                                padding: 8px;
                                font-size: 14px;
                                color: #333;
                            }
                            
                            .rbc-today {
                                background-color: #f3f4f6;
                            }
                            
                            .rbc-event {
                                background-color: #6366f1;
                                border-radius: 4px;
                                font-size: 13px;
                                padding: 2px 5px;
                            }
                            
                            .rbc-toolbar {
                                padding: 20px;
                                margin-bottom: 10px;
                            }
                            
                            .rbc-toolbar button {
                                color: #374151;
                                border: 1px solid #e5e7eb;
                                background: white;
                                border-radius: 6px;
                                padding: 8px 16px;
                                font-size: 14px;
                                font-weight: 500;
                            }
                            
                            .rbc-toolbar button:hover {
                                background-color: #f9fafb;
                                border-color: #d1d5db;
                            }
                            
                            .rbc-toolbar button.rbc-active {
                                background-color: #4f46e5;
                                color: white;
                                border-color: #4f46e5;
                            }
                            
                            .rbc-month-row {
                                min-height: 100px;
                            }
                            
                            .rbc-day-bg {
                                border: 1px solid #f3f4f6;
                            }
                            
                            .rbc-off-range-bg {
                                background: #fafafa;
                            }
                            
                            .rbc-off-range {
                                color: #9ca3af;
                            }
                            
                            .rbc-current-time-indicator {
                                background-color: #4f46e5;
                                height: 2px;
                            }

                            .rbc-agenda-view {
                                margin: 0 20px;
                            }

                            .rbc-agenda-empty {
                                padding: 20px;
                                text-align: center;
                                color: #666;
                            }

                            .rbc-agenda-table {
                                border: 1px solid #f3f4f6;
                                border-radius: 6px;
                            }

                            .rbc-agenda-table thead {
                                background-color: #f9fafb;
                            }

                            .rbc-agenda-table th,
                            .rbc-agenda-table td {
                                padding: 12px;
                                border-bottom: 1px solid #f3f4f6;
                            }
                        `}</style>
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