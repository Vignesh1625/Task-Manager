import React, { useState } from "react";
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './LoginForm.css';

const LoginForm = () => {
    const [user_email, setUserEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const navigate = useNavigate();

    const handleLogin = async () => {
        try {
            const response = await axios.post('http://localhost:5000/api/login', { user_email, password },      { withCredentials: true}
        );
            
            console.log(response.data); 
            if (response.status === 200) {
                alert("Login successful");
                //send user_email to UserDashboard
                navigate('/userDashboard')
            }
        } catch (error) {
            console.error(error.response.data); 
            setErrorMessage(error.response.data.message); // Set error message if login fails
        }
    };

    return (
        <div class='login-container'>
            <div class='login-form'>
                <h2>Login</h2>
                <label>Email</label>
                <input type="text" placeholder="email" value={user_email} onChange={e => setUserEmail(e.target.value)} />
                <label>Password</label>
                <input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} />   
                <button onClick={handleLogin}>Login</button>
                {errorMessage && <p className="error">{errorMessage}</p>}
            </div>
        </div>

    );
};

export default LoginForm;
