import React, { useState } from 'react';
import axios from 'axios';

function Settings() {
  const [password, setPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const handleNewPasswordChange = (e) => {
    setNewPassword(e.target.value);
  };

  const handleChangePassword = () => {
    axios.post('http://localhost:5000/changepassword', { password, newPassword }) // Update with actual endpoint
      .then(() => alert('Password changed successfully!'))
      .catch(error => console.error('Error changing password:', error));
  };

  return (
    <div>
      <h1>Settings</h1>
      <input
        type="password"
        value={password}
        onChange={handlePasswordChange}
        placeholder="Current Password"
      />
      <input
        type="password"
        value={newPassword}
        onChange={handleNewPasswordChange}
        placeholder="New Password"
      />
      <button onClick={handleChangePassword}>Change Password</button>
    </div>
  );
}

export default Settings;