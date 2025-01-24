import React, { useState, useEffect } from 'react';
import axios from 'axios';

function Notifications() {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:5000/notifications') // Update with actual endpoint
      .then(response => setNotifications(response.data))
      .catch(error => console.error('Error fetching notifications:', error));
  }, []);

  return (
    <div>
      <h1>Notifications</h1>
      <ul>
        {notifications.map(notification => (
          <li key={notification.notification_id}>{notification.message}</li>
        ))}
      </ul>
    </div>
  );
}

export default Notifications;