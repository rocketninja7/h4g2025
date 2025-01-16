import React, { useEffect, useState, useRef } from 'react';
import Select from 'react-select';
import ChatWindow from './ChatWindow';
import styles from './ChatWindow.module.css'; 

async function getUsers() {
    const res = await fetch("http://127.0.0.1:5000/getUsers")
    const users = await res.json()
    return users
}

export default function CreateTask({start, end, onClose}) {
    const [users, setUsers] = useState([]);
    const [taskname, setTaskname] = useState('');
    const [selectedUsers, setSelectedUsers] = useState([]);
    const [repeatOption, setRepeatOption] = useState('never');
    const [reminder, setReminder] = useState('none');
    const modalRef = useRef();
    const [isChatOpen, setIsChatOpen] = useState(false);

    const repeatOptions = [
        { value: 'never', label: 'Never' },
        { value: 'daily', label: 'Daily' },
        { value: 'weekly', label: 'Weekly' },
        { value: 'monthly', label: 'Monthly' }
    ];

    const reminderOptions = [
        { value: 'none', label: 'None' },
        { value: '5min', label: '5 minutes before' },
        { value: '15min', label: '15 minutes before' },
        { value: '30min', label: '30 minutes before' },
        { value: '1hour', label: '1 hour before' },
        { value: '1day', label: '1 day before' }
    ];

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

        // Add click outside listener
        const handleClickOutside = (event) => {
            if (modalRef.current && !modalRef.current.contains(event.target)) {
                onClose();
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [onClose]);

    const handleTaskCreation = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch('http://127.0.0.1:5000/addTask', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name: taskname,
                    start,
                    end,
                    pending_users: selectedUsers.map(user => ({
                        id: user.value,
                        name: user.label
                    })),
                    repeat: repeatOption,
                    reminder: reminder
                }),
            });
            if (response.ok) {
                onClose();
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };

    const customStyles = {
        modal: {
            position: 'fixed',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            backgroundColor: 'white',
            borderRadius: '8px',
            padding: '24px',
            width: '400px',
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
            zIndex: 1000
        },
        overlay: {
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            zIndex: 999
        },
        form: {
            display: 'flex',
            flexDirection: 'column',
            gap: '16px'
        },
        formGroup: {
            display: 'flex',
            flexDirection: 'column',
            gap: '8px'
        },
        label: {
            fontSize: '14px',
            fontWeight: '500',
            color: '#374151'
        },
        input: {
            padding: '8px 12px',
            borderRadius: '6px',
            border: '1px solid #e5e7eb',
            fontSize: '14px'
        },
        select: {
            control: (base) => ({
                ...base,
                borderRadius: '6px',
                border: '1px solid #e5e7eb'
            })
        },
        button: {
            backgroundColor: '#10B981',
            color: 'white',
            padding: '10px 16px',
            borderRadius: '6px',
            border: 'none',
            fontSize: '14px',
            fontWeight: '500',
            cursor: 'pointer',
            transition: 'background-color 0.2s',
            marginTop: '8px'
        },
        timeGroup: {
            display: 'flex',
            gap: '16px',
            alignItems: 'center'
        },
        timeLabel: {
            fontSize: '14px',
            color: '#6B7280',
            minWidth: '60px'
        }
    };

    return (
        <div style={customStyles.overlay}>
            <div ref={modalRef} style={customStyles.modal}>
                <h2 style={{ margin: '0 0 20px 0', color: '#111827' }}>Create Task</h2>
                <form onSubmit={handleTaskCreation} style={customStyles.form}>
                    <div style={customStyles.formGroup}>
                        <label style={customStyles.label}>Task name:</label>
                        <input
                            type="text"
                            value={taskname}
                            onChange={(e) => setTaskname(e.target.value)}
                            required
                            style={customStyles.input}
                            placeholder="Enter task name"
                        />
                    </div>

                    <div style={customStyles.formGroup}>
                        <label style={customStyles.label}>Time:</label>
                        <div style={customStyles.timeGroup}>
                            <span style={customStyles.timeLabel}>Start:</span>
                            <input
                                type="datetime-local"
                                value={start}
                                readOnly
                                style={customStyles.input}
                            />
                        </div>
                        <div style={customStyles.timeGroup}>
                            <span style={customStyles.timeLabel}>End:</span>
                            <input
                                type="datetime-local"
                                value={end}
                                readOnly
                                style={customStyles.input}
                            />
                        </div>
                    </div>

                    <div style={customStyles.formGroup}>
                        <label style={customStyles.label}>People involved:</label>
                        <Select
                            options={users}
                            styles={customStyles.select}
                            isMulti
                            value={selectedUsers}
                            onChange={setSelectedUsers}
                            placeholder="Select people..."
                        />
                    </div>

                    <div style={customStyles.formGroup}>
                        <label style={customStyles.label}>Repeat:</label>
                        <Select
                            options={repeatOptions}
                            styles={customStyles.select}
                            value={repeatOptions.find(option => option.value === repeatOption)}
                            onChange={(option) => setRepeatOption(option.value)}
                            placeholder="Select repeat option..."
                        />
                    </div>

                    <div style={customStyles.formGroup}>
                        <label style={customStyles.label}>Reminder:</label>
                        <Select
                            options={reminderOptions}
                            styles={customStyles.select}
                            value={reminderOptions.find(option => option.value === reminder)}
                            onChange={(option) => setReminder(option.value)}
                            placeholder="Select reminder..."
                        />
                    </div>
                    <button className="action-button" 
                                onClick={() => setIsChatOpen(true)}>
                        AI Assistant
                    </button>
                    <button type="submit" style={customStyles.button}>
                        Create Task
                    </button>
                </form>
            </div>
            <ChatWindow 
                isOpen={isChatOpen} 
                onClose={() => setIsChatOpen(false)} 
            />
        </div>
    );
}