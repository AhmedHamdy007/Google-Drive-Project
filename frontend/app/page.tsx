"use client";

import { useState } from 'react';

export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        console.log('Email:', email);
        console.log('Password:', password);
        // Later, this is where you’ll send login data to the backend
    };

    return (
        <div style={{ maxWidth: '400px', margin: 'auto', padding: '2rem', textAlign: 'center' }}>
            <h2>Login</h2>
            <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column' }}>
                <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Email"
                    style={{ margin: '0.5rem 0', padding: '0.5rem' }}
                />
                <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Password"
                    style={{ margin: '0.5rem 0', padding: '0.5rem' }}
                />
                <button type="submit" style={{ padding: '0.5rem', marginTop: '1rem', cursor: 'pointer' }}>
                    Login
                </button>
            </form>
        </div>
    );
}
