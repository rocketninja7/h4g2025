import React, { useState, useEffect } from 'react';
import styles from './ChatWindow.module.css';

const UserChatWindow = ({ isOpen, onClose, userId }) => {
    const [message, setMessage] = useState('');
    const [chatHistory, setChatHistory] = useState([]);
    const [users, setUsers] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);

    useEffect(() => {
        if (isOpen) {
            fetchUsers();
        }
    }, [isOpen]);

    const fetchUsers = async () => {
        try {
            const response = await fetch(`http://127.0.0.1:5000/getUsers`);
            const data = await response.json();
            setUsers(data);
        } catch (error) {
            console.error('Error fetching users:', error);
        }
    };

    const fetchChatHistory = async (recipientId) => {
        try {
            const response = await fetch(`http://127.0.0.1:5000/getChatHistory/${userId}/${recipientId}`);
            const data = await response.json();
            setChatHistory(data);
        } catch (error) {
            console.error('Error fetching chat history:', error);
        }
    };

    const handleSendMessage = async () => {
        if (message.trim() === '' || !selectedUser) return;

        try {
            const response = await fetch(`http://127.0.0.1:5000/sendMessage`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    senderId: userId,
                    recipientId: selectedUser.id,
                    message,
                }),
            });
            if (response.ok) {
                setMessage('');
                fetchChatHistory(selectedUser.id);
            }
        } catch (error) {
            console.error('Error sending message:', error);
        }
    };

    const handleUserSelect = (user) => {
        setSelectedUser(user);
        fetchChatHistory(user.id);
    };

    if (!isOpen) return null;

    return (
        <div className={styles.chatWindowOverlay}>
            <div className={styles.chatWindow}>
                <button className="close-button" onClick={onClose}>×</button>
                <div className="user-list">
                    <h3>Users</h3>
                    <ul>
                        {users.map((user) => (
                            <li 
                                key={user.id} 
                                onClick={() => handleUserSelect(user)} 
                                className={selectedUser?.id === user.id ? 'selected' : ''}
                            >
                                {user.username}
                            </li>
                        ))}
                    </ul>
                </div>
                <div className="chat-area">
                    <h3>Chat with {selectedUser?.username || '...'}</h3>
                    <div className="chat-history">
                        {chatHistory.map((chat, index) => (
                            <div 
                                key={index} 
                                className={chat.senderId === userId ? 'chat-bubble outgoing' : 'chat-bubble incoming'}
                            >
                                {chat.message}
                            </div>
                        ))}
                    </div>
                    <div className="message-input">
                        <input 
                            type="text" 
                            placeholder="Type a message..." 
                            value={message} 
                            onChange={(e) => setMessage(e.target.value)}
                        />
                        <button onClick={handleSendMessage}>Send</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UserChatWindow;
