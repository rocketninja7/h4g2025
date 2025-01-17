// ChatBox.js
import React, { useState, useEffect, useRef } from 'react';
import './ChatBox.css';

const ChatBox = ({ currentUserId, selectedUserId, selectedUserName, onClose }) => {
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    const fetchMessages = async () => {
        try {
            const response = await fetch(`http://127.0.0.1:5000/getMessages/${currentUserId}`);
            const allMessages = await response.json();
            // Filter messages between current user and selected user
            const relevantMessages = allMessages.filter(msg => 
                (msg.sender_id === currentUserId && msg.receiver_id === selectedUserId) ||
                (msg.sender_id === selectedUserId && msg.receiver_id === currentUserId)
            );
            setMessages(relevantMessages);
        } catch (error) {
            console.error('Error fetching messages:', error);
        }
    };

    useEffect(() => {
        fetchMessages();
        const interval = setInterval(fetchMessages, 5000); // Poll for new messages
        return () => clearInterval(interval);
    }, [currentUserId, selectedUserId]);

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSend = async () => {
        if (!newMessage.trim()) return;

        try {
            const response = await fetch('http://127.0.0.1:5000/sendMessage', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    sender_id: currentUserId,
                    receiver_id: selectedUserId,
                    content: newMessage
                }),
            });

            if (response.ok) {
                setNewMessage('');
                fetchMessages();
            }
        } catch (error) {
            console.error('Error sending message:', error);
        }
    };

    return (
        <div className="chat-box">
            <div className="chat-header">
                <h3>{selectedUserName}</h3>
                <button onClick={onClose}>&times;</button>
            </div>
            <div className="messages-container">
                {messages.map((message) => (
                    <div
                        key={message.id}
                        className={`message ${message.sender_id === currentUserId ? 'sent' : 'received'}`}
                    >
                        <div className="message-content">
                            {message.content}
                            <span className="message-time">
                                {new Date(message.timestamp).toLocaleTimeString()}
                            </span>
                        </div>
                    </div>
                ))}
                <div ref={messagesEndRef} />
            </div>
            <div className="message-input">
                <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                    placeholder="Type a message..."
                />
                <button onClick={handleSend}>Send</button>
            </div>
        </div>
    );
};

export default ChatBox;