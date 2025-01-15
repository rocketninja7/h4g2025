import React, { useEffect, useState } from 'react';
import Select from 'react-select';

async function getUsers() {
    const res = await fetch("http://127.0.0.1:5000/getUsers")
    const users = await res.json()
    return users
}

export default function CreateTask({start, end}) {
    const [users, setUsers] = useState([])
    const [taskname, setTaskname] = useState('');

    useEffect(() => {
        const fetchUsers = async () => {
            const fetchedUsers = await getUsers()
            const formattedUsers = fetchedUsers.map(user => ({
                value: user.id, 
                label: user.name
            }))
            setUsers(formattedUsers)
        }
        fetchUsers()
    }, [])

    const handleTaskCreation = async (e) => {
        // e.preventDefault();
        try {
          const response = await fetch('http://127.0.0.1:5000/addTask', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name: taskname, start, end, pending_users: users.map(user => ({
                id: user.value,
                name: user.label
            }))}),
          });
        //   const data = await response.json();
        //   alert(data.message);
        } catch (error) {
          console.error('Error:', error);
        }
      };

    const styles = {
        // theme: "primary"
    }

    return (
        <div>
          <h1>Create Task</h1>
          <form onSubmit={handleTaskCreation}>
            <div className="form-group">
              <label>Task name:</label>
              <input
                type="text"
                id="taskname"
                value={taskname}
                onChange={(e) => setTaskname(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label>People involved:</label>
              <Select 
                options={users}
                styles={styles}
                isMulti
              />
            </div>
            <button type="submit" className="login-button">Create Task</button>
          </form>
        </div>
      );
}

