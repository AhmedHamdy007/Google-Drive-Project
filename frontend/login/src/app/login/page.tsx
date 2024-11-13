import React from 'react';

export default function Login() {
  return (
    <div>
      <h2>Login</h2>
      <form>
        <div>
          <label htmlFor="username">Username</label>
          <input
            type="text"
            id="username"
            name="username"
            placeholder="Enter your username"
            required
          />
        </div>
        <div>
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            name="password"
            placeholder="Enter your password"
            required
          />
        </div>
        <div>
          <button type="submit">Login</button>
        </div>
      </form>
      <p>
        Don't have an account? <a href="#">Sign up</a>
      </p>
    </div>
  );
}
