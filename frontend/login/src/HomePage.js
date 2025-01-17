import { useLocation } from 'react-router-dom';
import './HomePage.css';
import { useNavigate } from 'react-router-dom';
import ChatWindow from './ChatWindow';
import styles from './ChatWindow.module.css'; 
import CreateTask from './CreateTask';
import ModernCalendar from './CalendarComponent';
import { useEffect, useState, useCallback } from 'react';
import moment from 'moment';
import Notifications from './Notifications';
import UserChat from './UserChat';

const HomePage = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const location = useLocation();
    const { username, id } = location.state || {};
    const [recentTasks, setRecentTasks] = useState([]);
    const [upcomingTasks, setUpcomingTasks] = useState([]);
    const [isChatOpen, setIsChatOpen] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    const [showUserList, setShowUserList] = useState(false);
    const [userList, setUserList] = useState([]);
    const [chatUsers, setChatUsers] = useState([]);
    

    const navigate = useNavigate();
    const navigateToLogin = () => {
        navigate('/');
    };
    const navigateToHome = () => {
        navigate('/homepage', { state: { username, id } });
    };
    const navigateToCalendar = () => {
        navigate('/calendar', { state: { username, id } });
    };

    const fetchTasks = async () => {
        try {
            const res = await fetch(`http://127.0.0.1:5000/getTasks/${id}`);
            const tasks = await res.json();
            const now = new Date();

            const upcoming = tasks.filter(task => new Date(task.start) > now).slice(0, 5);
            const recent = tasks.filter(task => new Date(task.start) <= now).slice(0, 5);

            setUpcomingTasks(upcoming);
            setRecentTasks(recent);
        } catch (error) {
            console.error('Error fetching tasks:', error);
        }
    };

    const handleCloseModal = useCallback(() => {
        setShowModal(false);
    }, []);

    useEffect(() => {
        fetchTasks();
    }, []);

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', { 
            month: 'short', 
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };
    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await fetch('http://127.0.0.1:5000/getUsers');
                const users = await response.json();
                setUserList(users);
            } catch (error) {
                console.error('Error fetching users:', error);
            }
        };
        fetchUsers();
    }, []);
    useEffect(() => {
        const fetchChatUsers = async () => {
            try {
                // Fetch all messages
                const messagesResponse = await fetch(`http://127.0.0.1:5000/getMessages/${id}`);
                const messages = await messagesResponse.json();
                
                // Get unique user IDs from messages (excluding current user)
                const uniqueUserIds = new Set();
                messages.forEach(message => {
                    if (message.sender_id === id) {
                        uniqueUserIds.add(message.receiver_id);
                    } else if (message.receiver_id === id) {
                        uniqueUserIds.add(message.sender_id);
                    }
                });
                
                // Fetch user details for these IDs
                const usersResponse = await fetch('http://127.0.0.1:5000/getUsers');
                const allUsers = await usersResponse.json();
                
                // Filter users to only those you've chatted with
                const chatUsersList = allUsers.filter(user => 
                    uniqueUserIds.has(user.id)
                );
                
                setChatUsers(chatUsersList);
                setUserList(allUsers.filter(user => user.id !== id));
            } catch (error) {
                console.error('Error fetching chat users:', error);
            }
        };
    
        fetchChatUsers();
    }, [id]);

    return (
        <div className="container">
            <div className="top-bar">
                <button
                    onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                    className="menu-button"
                >
                   <span>☰</span>
                </button>
                {/* <h1 style={{ margin: 0, fontSize: '1.5rem', fontWeight: 'normal'}}>Dashboard</h1> */}
                <img src='/SBC-Logo-2019-Square_(png).png' alt='logo'></img>
                <div className="header-right">
                    {username && (
                        <span style={{ fontSize: '1rem' }}>
                            Welcome, <strong>{username}</strong>
                        </span>
                    )}
                </div>
            </div>
    
            <div className="main-content">
                <div className={`sidebar ${isSidebarOpen ? 'open' : ''}`}>
                    <ul className="sidebar-list">
                        <li className="sidebar-item" onClick={navigateToHome}>Dashboard</li>
                        <li className="sidebar-item" onClick={navigateToCalendar}>Calendar</li>
                        <li className="sidebar-item" onClick={() => setIsChatOpen(true)}>Get Help</li>
                        <li className="sidebar-item" onClick={navigateToLogin}>Logout</li>
                    </ul>
                </div>
    
                <div className={`content ${isSidebarOpen ? 'sidebar-open' : ''}`}>
                    <div className="welcome-section">
                        <h1 className="welcome-title">Welcome to Your Dashboard</h1>
                        <p className="welcome-text">
                            Here's an overview of your tasks and activities
                        </p>
                        <div className="quick-actions">
                            <button 
                                className="action-button" 
                                onClick={() => setShowModal(true)}
                            >
                                Create New Task
                            </button>
                            <button className="action-button" onClick={navigateToCalendar}>
                                View Calendar
                            </button>
                            <button 
                                className="action-button" 
                                onClick={() => setIsChatOpen(true)}
                            >
                                AI Assistant
                            </button>
                        </div>
                    </div>
    
                    <div className="grid">
    <div className="card">
        <div className="card-header">
            <h2 className="card-title">Upcoming Tasks</h2>
        </div>
        <ul className="task-list">
            {upcomingTasks.map((task, index) => (
                <li key={index} className="task-item">
                    <span className="task-name">{task.name}</span>
                    <span className="task-date">{formatDate(task.start)}</span>
                </li>
            ))}
            {upcomingTasks.length === 0 && (
                <li className="task-item">No upcoming tasks</li>
            )}
        </ul>
    </div>

    <div className="card">
        <div className="card-header">
            <h2 className="card-title">Recent Tasks</h2>
        </div>
        <ul className="task-list">
            {recentTasks.map((task, index) => (
                <li key={index} className="task-item">
                    <span className="task-name">{task.name}</span>
                    <span className="task-date">{formatDate(task.start)}</span>
                </li>
            ))}
            {recentTasks.length === 0 && (
                <li className="task-item">No recent tasks</li>
            )}
        </ul>
    </div>

    {/* Add the Requests section back */}
    <div className="card">
        <div className="card-header">
            <h2 className="card-title">Requests</h2>
        </div>
        <ul className="task-list">
            <Notifications updateCalendarState={fetchTasks} userId={id} />
        </ul>
    </div>

    <div className="card">
        <div className="card-header">
            <h2 className="card-title">Chats</h2>
            <button 
                className="new-chat-button"
                onClick={() => setShowUserList(true)}
                title="Start New Chat"
            >
                <span>+</span>
            </button>
        </div>
        <div className="chat-list">
            {chatUsers.map((user) => (
                <div
                    key={user.id}
                    className="chat-user-item"
                    onClick={() => {
                        setSelectedUser(user);
                        setIsChatOpen(true);
                    }}
                >
                    <div className="chat-user-name">{user.name}</div>
                </div>
            ))}
            {chatUsers.length === 0 && (
                <div className="no-chats">No conversations yet</div>
            )}
        </div>
    </div>
</div>
                </div>
            </div>
    
            {/* Task creation modal */}
            {showModal && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <CreateTask 
                            onClose={handleCloseModal} 
                            updateCalendarState={fetchTasks} 
                        />
                    </div>
                </div>
            )}
    
            {/* User selection modal for new chat */}
            {showUserList && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <div className="user-list-modal">
                            <div className="modal-header">
                                <h2>Start New Chat</h2>
                                <button className="close-button" onClick={() => setShowUserList(false)}>&times;</button>
                            </div>
                            <div className="user-list">
                                {userList
                                    .filter(user => !chatUsers.find(chatUser => chatUser.id === user.id))
                                    .map(user => (
                                        <div
                                            key={user.id}
                                            className="user-item"
                                            onClick={() => {
                                                setSelectedUser(user);
                                                setIsChatOpen(true);
                                                setShowUserList(false);
                                            }}
                                        >
                                            {user.name}
                                        </div>
                                    ))}
                            </div>
                        </div>
                    </div>
                </div>
            )}
    
            {/* AI Assistant chat window */}
            <ChatWindow 
                isOpen={isChatOpen} 
                onClose={() => setIsChatOpen(false)} 
            />
    
            {/* User chat window */}
            {selectedUser && (
                <UserChat
                    isOpen={isChatOpen}
                    onClose={() => {
                        setIsChatOpen(false);
                        setSelectedUser(null);
                    }}
                    currentUserId={id}
                    selectedUserId={selectedUser.id}
                    selectedUserName={selectedUser.name}
                />
            )}
        </div>
    );
};

export default HomePage;
