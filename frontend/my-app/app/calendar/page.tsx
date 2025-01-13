export default async function Main() {
    const tasks = await getTasks()
    return (
        <div>
            {
                tasks.map((task => {
                    return <div>{task.start}, {task.end}, {task.pending_users}, {task.users}</div>
                }))
            }
        </div>
    );
}

export const getTasks = (async() => {
    const res = await fetch("http://127.0.0.1:5000/getTasks/1")
    const tasks = await res.json()
    return tasks
})
