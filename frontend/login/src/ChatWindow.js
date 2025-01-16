import React, { useState, useRef, useEffect } from 'react';
import styles from './ChatWindow.module.css';

const ChatWindow = ({ isOpen, onClose }) => {
    const [messages, setMessages] = useState([]);
    const [inputMessage, setInputMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef(null);
    const inputRef = useRef(null);

    useEffect(() => {
        if (isOpen && inputRef.current) {
            inputRef.current.focus();
        }
    }, [isOpen]);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSend = async () => {
        if (!inputMessage.trim()) return;

        const userMessage = {
            content: inputMessage,
            sender: 'user'
        };

        setMessages(prev => [...prev, userMessage]);
        setInputMessage('');
        setIsLoading(true);

        try {
            const response = await fetch('http://127.0.0.1:5000/chat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ message: inputMessage }),
            });

            const data = await response.json();
            
            const botMessage = {
                content: data.response,
                sender: 'bot'
            };

            setMessages(prev => [...prev, botMessage]);
        } catch (error) {
            console.error('Error sending message:', error);
            setMessages(prev => [...prev, {
                content: "Sorry, I'm having trouble connecting. Please try again.",
                sender: 'bot'
            }]);
        } finally {
            setIsLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className={styles.chatWindowOverlay}>
            <div className={styles.chatWindow}>
                <div className={styles.chatHeader}>
                    <div className={styles.chatHeaderInfo}>
                        <div className={styles.statusDot}></div>
                        <h3>AI Assistant</h3>
                    </div>
                    <button onClick={onClose} className={styles.closeButton}>
                        <span>×</span>
                    </button>
                </div>
                <div className={styles.chatMessages}>
                    {messages.length === 0 && (
                        <div className={styles.welcomeMessage}>
                            👋 Hi! How can I help you today?
                        </div>
                    )}
                    {messages.map((message, index) => (
                        <div 
                            key={index} 
                            className={`${styles.message} ${
                                message.sender === 'user' ? styles.userMessage : styles.botMessage
                            }`}
                        >
                            {message.content}
                        </div>
                    ))}
                    {isLoading && (
                        <div className={`${styles.message} ${styles.botMessage} ${styles.loadingMessage}`}>
                            <div className={styles.typingIndicator}>
                                <span></span>
                                <span></span>
                                <span></span>
                            </div>
                        </div>
                    )}
                    <div ref={messagesEndRef} />
                </div>
                <div className={styles.chatInput}>
                    <input
                        ref={inputRef}
                        type="text"
                        value={inputMessage}
                        onChange={(e) => setInputMessage(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                        placeholder="Type your message..."
                        className={styles.messageInput}
                    />
                    <button 
                        onClick={handleSend} 
                        disabled={isLoading || !inputMessage.trim()}
                        className={styles.sendButton}
                    >
                        Send
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ChatWindow;