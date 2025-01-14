import CalendarComponent from './calendar'
import moment from 'moment'

export default async function Main() {
    const tasks = await getTasks()
    const formattedTasks = tasks.map(task => {return {
        title: task.name,
        start: moment(task.start),
        end: moment(task.end)
    }})
    return <CalendarComponent tasksList={JSON.stringify(formattedTasks)}></CalendarComponent>
}

export const getTasks = (async() => {
    const res = await fetch("http://127.0.0.1:5000/getTasks/1")
    const tasks = await res.json()
    return tasks
})
