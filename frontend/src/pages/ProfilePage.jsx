import { useEffect, useState } from 'react';
import axios from 'axios';

export default function ProfilePage() {
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      setError('No token found');
      return;
    }

    axios
      .get('http://localhost:8000/api/logs', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        setUser(res.data);
      })
      .catch(() => {
        setError('Failed to fetch user data');
      });
  }, []);

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      paddingTop: '40px',
      backgroundColor: '#f3f4f6',
      boxSizing: 'border-box',
      position: 'fixed',
      top: 70,
      left: 600,
      zIndex: 1000
    }}>
      <div style={{
        display: 'flex',
        gap: '20px',
        backgroundColor: 'white',
        padding: '60px',
        borderRadius: '10px',
        boxShadow: '0 4px 10px rgba(0,0,0,0.1)',
        width: '400px',
        alignItems: 'center'
      }}>
        {error ? (
          <p style={{ color: 'red' }}>{error}</p>
        ) : user ? (
          <>
            <img
              src={`https://ui-avatars.com/api/?name=${user.user_name}`}
              alt="avatar"
              style={{
                width: '80px',
                height: '80px',
                borderRadius: '50%',
                objectFit: 'cover'
              }}
            />
            <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
              <h2 style={{ margin: '0 0 10px 0', color: '#333' }}>My Profile</h2>
              <p><strong>Name:</strong> {user.user_name}</p>
              <p><strong>Email:</strong> {user.user_id}</p>
            </div>
          </>
        ) : (
          <p style={{ color: '#666' }}>Loading...</p>
        )}
      </div>
    </div>
  );
}
