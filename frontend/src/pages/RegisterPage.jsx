import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';

function RegisterPage() {
  const [form, setForm] = useState({ name: '', email: '', password: '', password_confirmation: '' });
  const navigate = useNavigate();

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      await api.post('/register', form);
      alert('Registration successful! Please login.');
      navigate('/login');
    } catch (err) {
      alert('Registration failed');
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      paddingTop: '50px', 
      backgroundColor: '#f3f4f6',
      boxSizing: 'border-box',
      position: "fixed", 
      top: 60,
      left: 600,
      zIndex: 1000 
    }}>
      <form onSubmit={handleSubmit} style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '15px',
        backgroundColor: 'white',
        padding: '30px',
        borderRadius: '10px',
        boxShadow: '0 4px 10px rgba(0,0,0,0.1)',
        width: '300px'
      }}>
        <h2 style={{ textAlign: 'center', marginBottom: '10px', color: '#333' }}>Register</h2>

        <input
          name="name"
          placeholder="Name"
          onChange={handleChange}
          required
          style={{
            padding: '10px',
            borderRadius: '5px',
            border: '1px solid #ccc'
          }}
        />
        <input
          name="email"
          type="email"
          placeholder="Email"
          onChange={handleChange}
          required
          style={{
            padding: '10px',
            borderRadius: '5px',
            border: '1px solid #ccc'
          }}
        />
        <input
          name="password"
          type="password"
          placeholder="Password"
          onChange={handleChange}
          required
          style={{
            padding: '10px',
            borderRadius: '5px',
            border: '1px solid #ccc'
          }}
        />
        <input
          name="password_confirmation"
          type="password"
          placeholder="Confirm Password"
          onChange={handleChange}
          required
          style={{
            padding: '10px',
            borderRadius: '5px',
            border: '1px solid #ccc'
          }}
        />
        <button type="submit" style={{
          backgroundColor: '#001f3f',
          color: 'white',
          padding: '10px',
          border: 'none',
          borderRadius: '5px',
          fontWeight: 'bold',
          cursor: 'pointer'
        }}>
          Register
        </button>

        <p style={{ textAlign: 'center', marginTop: '10px' }}>
          Already have an account? <a href="/login" style={{ color: '#001f3f', textDecoration: 'underline' }}>Login here</a>
        </p>
      </form>
    </div>
  );
}

export default RegisterPage;
