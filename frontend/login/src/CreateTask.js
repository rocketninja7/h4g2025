import React, { useEffect, useState, useRef } from 'react';
import Select from 'react-select';
import ChatWindow from './ChatWindow';
import moment from 'moment';

async function getUsers() {
    const res = await fetch("http://127.0.0.1:5000/getUsers")
    const users = await res.json()
    return users
}

export default function CreateTask({
  start, 
  end, 
  onClose, 
  updateCalendarState, 
  userId, 
  task, 
  isEditing
}) {
  // Initialize selectedUsers by combining both pending and confirmed users if editing
  const [selectedUsers, setSelectedUsers] = useState(() => {
      if (task) {
          // Combine both pending and confirmed users
          const allUsers = [
              ...(task.pending_users || []),
              ...(task.users || [])
          ];
          
          // Convert to the format expected by react-select
          return allUsers.map(user => ({
              value: user.id,
              label: user.name
          }));
      }
      return [];
    });
  
      const [users, setUsers] = useState([]);
      const [taskname, setTaskname] = useState(task ? task.name : '');
      const [repeatOption, setRepeatOption] = useState(task ? task.repeat || 'never' : 'never');
      const [reminder, setReminder] = useState(task ? task.reminder || 'none' : 'none');
      const modalRef = useRef();
      const [startTime, setStartTime] = useState(start);
      const [endTime, setEndTime] = useState(end);
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
          const formattedUsers = fetchedUsers
              .filter(user => user.id !== userId)
              .map(user => ({
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
    }, [onClose, userId]);

    const handleStartTimeChange = (e) => {
      setStartTime(e.target.value);
      // If end time is before start time, update end time
      if (new Date(e.target.value) > new Date(endTime)) {
          setEndTime(e.target.value);
      }
  };

    const handleEndTimeChange = (e) => {
        // Only allow end time to be after start time
        if (new Date(e.target.value) >= new Date(startTime)) {
            setEndTime(e.target.value);
        }
    };

    const handleTaskCreation = async (e) => {
      e.preventDefault();
      try {
          const response = await fetch('http://127.0.0.1:5000/addTask', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                  name: taskname,
                  start: moment(startTime).format("YYYY-MM-DD HH:mm"),
                  end: moment(endTime).format("YYYY-MM-DD HH:mm"),
                  creator_id: userId,  // Add creator_id
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
            updateCalendarState();
        }
    } catch (error) {
        console.error('Error:', error);
    }
};

const handleTaskUpdate = async (e) => {
  e.preventDefault();
  try {
      const response = await fetch(`http://127.0.0.1:5000/updateTask/${task.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
              name: taskname,
              start: moment(startTime).format("YYYY-MM-DD HH:mm"),
              end: moment(endTime).format("YYYY-MM-DD HH:mm"),
              // Keep the original confirmed users in the users array
              users: task.users,
              // Update pending users with any new selections
              pending_users: selectedUsers
                  .filter(selected => 
                      !task.users.some(user => user.id === selected.value)
                  )
                  .map(user => ({
                      id: user.value,
                      name: user.label
                  })),
              repeat: repeatOption,
              reminder: reminder
          }),
      });
      if (response.ok) {
          onClose();
          updateCalendarState();
      }
  } catch (error) {
      console.error('Error:', error);
  }
};

const handleTaskDelete = async () => {
  if (window.confirm('Are you sure you want to delete this task?')) {
      try {
          const response = await fetch(`http://127.0.0.1:5000/deleteTask/${task.id}`, {
              method: 'DELETE',
          });
          if (response.ok) {
              onClose();
              updateCalendarState();
          }
      } catch (error) {
          console.error('Error:', error);
      }
  }
};

const isUserConfirmed = (userId) => {
  return task?.users?.some(user => user.id === userId);
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
            padding: '8px 5px',
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
        // button: {
        //     backgroundColor: '#10B981',
        //     color: 'white',
        //     padding: '10px 16px',
        //     borderRadius: '6px',
        //     border: 'none',
        //     fontSize: '14px',
        //     fontWeight: '500',
        //     cursor: 'pointer',
        //     transition: 'background-color 0.2s',
        //     marginTop: '8px'
        // },
        timeGroup: {
            display: 'flex',
            gap: '16px',
            alignItems: 'center'
        },
        timeLabel: {
            fontSize: '14px',
            color: '#6B7280',
            minWidth: '60px'
        },

        buttonGroup: {
          display: 'flex',
          justifyContent: 'flex-end',
          marginTop: '16px'
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
          '&:hover': {
              opacity: 0.9
          }
      }
    };

    return (
      <div style={customStyles.overlay}>
          <div ref={modalRef} style={customStyles.modal}>
              <h2 style={{ margin: '0 0 20px 0', color: '#111827' }}>
                  {isEditing ? 'Edit Task' : 'Create Task'}
              </h2>
              <form onSubmit={isEditing ? handleTaskUpdate : handleTaskCreation} style={customStyles.form}>
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
                              value={startTime}
                              onChange={handleStartTimeChange}
                              style={customStyles.input}
                          />
                      </div>
                      <div style={customStyles.timeGroup}>
                          <span style={customStyles.timeLabel}>End:</span>
                          <input
                              type="datetime-local"
                              value={endTime}
                              onChange={handleEndTimeChange}
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
                        formatOptionLabel={(option) => (
                            <div style={{ 
                                display: 'flex', 
                                alignItems: 'center', 
                                justifyContent: 'space-between'
                            }}>
                                <span>{option.label}</span>
                                {isEditing && isUserConfirmed(option.value) && (
                                    <span style={{ 
                                        fontSize: '12px',
                                        color: '#10B981',
                                        marginLeft: '8px'
                                    }}>
                                        ✓ Confirmed
                                    </span>
                                )}
                            </div>
                        )}
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
  
                  <div style={customStyles.buttonGroup}>
                      {isEditing && (
                          <button 
                              type="button" 
                              onClick={handleTaskDelete}
                              style={{
                                  ...customStyles.button,
                                  backgroundColor: '#DC2626',
                                  marginRight: '8px'
                              }}
                          >
                              Delete Task
                          </button>
                      )}
  
                      <button 
                          className="action-button" 
                          type="button"
                          onClick={() => setIsChatOpen(true)}
                          style={{
                              ...customStyles.button,
                              backgroundColor: '#4F46E5',
                              marginRight: '8px'
                          }}
                      >
                          AI Assistant
                      </button>
  
                      <button 
                          type="submit" 
                          style={customStyles.button}
                      >
                          {isEditing ? 'Update Task' : 'Create Task'}
                      </button>
                  </div>
              </form>
          </div>
          <ChatWindow 
              isOpen={isChatOpen} 
              onClose={() => setIsChatOpen(false)} 
          />
      </div>
  );
}