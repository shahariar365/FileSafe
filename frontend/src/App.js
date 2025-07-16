// frontend/src/App.js

import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import LoginPage from './components/auth/Login'; // ফাইলের নাম Login.js
import RegisterPage from './components/auth/Register'; // ফাইলের নাম Register.js
import HomePage from './components/dashboard/HomePage'; // ফাইলের নাম HomePage.js
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {
    return (
        <Router>
            {/* নোটিফিকেশন দেখানোর জন্য এই কন্টেইনারটি পুরো অ্যাপে কাজ করবে */}
            <ToastContainer 
                position="top-right"
                autoClose={5000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
            />
            {/* অ্যাপের বিভিন্ন পেজের জন্য রাউটিং */}
            <Routes>
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/" element={<HomePage />} />
            </Routes>
        </Router>
    );
}

export default App;