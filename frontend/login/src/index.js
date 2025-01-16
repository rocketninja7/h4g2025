import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import App from './App';
import Register from './Register';
import Calendar from './Calendar';
import HomePage from './HomePage';


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  // <React.StrictMode>
    <Router>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/register" element={<Register />} />
        <Route path="/calendar" element={<Calendar />} />
        <Route path="/homepage" element={<HomePage />} />
      </Routes>
    </Router>
  // </React.StrictMode>
);
