import React, { useState, useEffect, useRef, useCallback } from 'react';
import './UserChat.css';

const UserChat = ({ isOpen, onClose, currentUserId, selectedUserId, selectedUserName }) => {
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    const fetchMessages = useCallback(async () => {
        if (!isOpen) return;

        try {
            const response = await fetch(`http://127.0.0.1:5000/getMessages/${currentUserId}`);
            const allMessages = await response.json();
            const relevantMessages = allMessages.filter(msg => 
                (msg.sender_id === currentUserId && msg.receiver_id === selectedUserId) ||
                (msg.sender_id === selectedUserId && msg.receiver_id === currentUserId)
            );
            setMessages(relevantMessages);
        } catch (error) {
            console.error('Error fetching messages:', error);
        }
    }, [isOpen, currentUserId, selectedUserId]);

    useEffect(() => {
        if (isOpen) {
            fetchMessages();
            const interval = setInterval(fetchMessages, 5000);
            return () => clearInterval(interval);
        }
    }, [isOpen, currentUserId, selectedUserId, fetchMessages]);

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

    if (!isOpen) return null;

    return (
        <div className="chat-overlay">
            <div className="chat-window">
                <div className="chat-header">
                    <h2>{selectedUserName}</h2>
                    <button className="close-button" onClick={onClose}>&times;</button>
                </div>
                <div className="chat-messages">
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
                <div className="chat-input">
                    <input
                        type="text"
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                        placeholder="Type your message..."
                    />
                    <button onClick={handleSend}>Send</button>
                </div>
            </div>
        </div>
    );
};

export default UserChat;
