"use client"

import "react-big-calendar/lib/css/react-big-calendar.css"
import { Calendar, momentLocalizer } from 'react-big-calendar'
import moment from 'moment'

const CalendarComponent = (props) => {
    const localizer = momentLocalizer(moment)
    
    return (
        <div style={ {height: "720px", width: "1000px"} }>
            <Calendar
                localizer={localizer}
                events={JSON.parse(props.tasksList)}
                //   startAccessor="start"
                //   endAccessor="end"
            />
        </div>
    );
}

export default CalendarComponent;
