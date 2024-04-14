import React, { useState } from 'react';
import axios from 'axios';
import './SignUpForm.css';

const SignupForm = () => {
  const [user_name, setuser_name] = useState('');
  const [user_email, setuser_email] = useState('');
  const [password, setPassword] = useState('');

  const handleSignup = async () => {
    try {
      const response = await axios.post('http://localhost:5000/api/signup', { user_name, user_email, password },      { withCredentials: true}
    );
      console.log(response.data); // Handle success
    } catch (error) {
      console.error(error.response.data); // Handle error
    }
  };

  return (
    <div class='signup-container'>
      <div class='signup-form'>
        <h2>Signup</h2>
        <label>Name</label>
        <input type="text" placeholder="Name" value={user_name} onChange={e => setuser_name(e.target.value)} />
        <label>Email</label>
        <input type="text" placeholder="email" value={user_email} onChange={e => setuser_email(e.target.value)} />
        <label>Password</label>
        <input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} />
        <button onClick={handleSignup}>Signup</button>
      </div>
    </div>

  );
};

export default SignupForm;
