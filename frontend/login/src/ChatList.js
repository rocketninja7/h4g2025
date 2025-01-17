// ChatList.js
import React, { useState, useEffect } from 'react';
import ChatBox from './ChatBox';
import './ChatList.css';

const ChatList = ({ currentUserId }) => {
    const [users, setUsers] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await fetch('http://127.0.0.1:5000/getUsers');
                const allUsers = await response.json();
                // Filter out current user
                const otherUsers = allUsers.filter(user => user.id !== currentUserId);
                setUsers(otherUsers);
            } catch (error) {
                console.error('Error fetching users:', error);
            }
        };

        fetchUsers();
    }, [currentUserId]);

    return (
        <div className="chat-container">
            <div className="users-list">
                <h2>Chats</h2>
                {users.map((user) => (
                    <div
                        key={user.id}
                        className="user-item"
                        onClick={() => setSelectedUser(user)}
                    >
                        {user.name}
                    </div>
                ))}
            </div>
            {selectedUser && (
                <ChatBox
                    currentUserId={currentUserId}
                    selectedUserId={selectedUser.id}
                    selectedUserName={selectedUser.name}
                    onClose={() => setSelectedUser(null)}
                />
            )}
        </div>
    );
};

export default ChatList;