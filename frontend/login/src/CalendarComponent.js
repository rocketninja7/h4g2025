import React from 'react';
import "react-big-calendar/lib/css/react-big-calendar.css";
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';

const ModernCalendar = ({ tasksList }) => {
    const localizer = momentLocalizer(moment);

    const allViews = {
        month: true,
        week: true,
        day: true,
        agenda: true
    }


    return (
        <div className="flex justify-center items-center min-h-screen p-6">
            <div className="w-full max-w-6xl bg-white rounded-2xl shadow-xl overflow-hidden">
                <style>{`
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
                    style={{ height: '700px' }}
                    views={allViews}
                    defaultView="month"
                />
            </div>
        </div>
    );
};

export default ModernCalendar;