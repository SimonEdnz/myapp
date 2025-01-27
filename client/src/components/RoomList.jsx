import React, { useState, useEffect } from 'react';
import axios from 'axios';

const RoomList = ({ branchId }) => {
  const [rooms, setRooms] = useState([]);
  const [newRoom, setNewRoom] = useState({
    branch_id: branchId,
    room_number: '',
    room_type: 'single',
    price: '',
    status: 'empty',
    tenant_id: '',
    created_by: 'admin', // Example, replace with actual user ID if necessary
  });
  const [editingRoom, setEditingRoom] = useState(null);

  useEffect(() => {
    fetchRooms();
  }, [branchId]);

  const fetchRooms = () => {
    axios
      .get(`http://localhost:5000/branches/${branchId}/rooms`)
      .then((response) => {
        setRooms(response.data);
      })
      .catch((error) => {
        console.error('There was an error fetching rooms!', error);
      });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewRoom((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditingRoom((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleCreateRoom = () => {
    axios
      .post('http://localhost:5000/rooms', newRoom)
      .then(() => {
        alert('Room created successfully!');
        setNewRoom({
          ...newRoom,
          room_number: '',
          room_type: 'single',
          price: '',
          status: 'empty',
          tenant_id: '',
        });
        fetchRooms();
      })
      .catch((error) => {
        console.error('Error creating room:', error);
        console.log('Error details:', error.response ? error.response.data : error.message);
      });
  };

  const handleUpdateRoom = () => {
    axios
      .put(`http://localhost:5000/rooms/${editingRoom.room_id}`, editingRoom)
      .then(() => {
        alert('Room updated successfully!');
        fetchRooms();
        setEditingRoom(null); // Reset edit form
      })
      .catch((error) => {
        console.error('Error updating room:', error);
      });
  };

  const handleDeleteRoom = (roomId) => {
    axios
      .delete(`http://localhost:5000/rooms/${roomId}`)
      .then(() => {
        alert('Room deleted successfully!');
        fetchRooms();
      })
      .catch((error) => {
        console.error('Error deleting room:', error);
      });
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.header}>Room Management</h1>

      <div style={styles.formContainer}>
        <h2>Add New Room</h2>
        <input
          type="text"
          name="room_number"
          placeholder="Room Number"
          value={newRoom.room_number}
          onChange={handleInputChange}
          style={styles.input}
        />
        <select
          name="room_type"
          value={newRoom.room_type}
          onChange={handleInputChange}
          style={styles.select}
        >
          <option value="single">Single</option>
          <option value="double">Double</option>
          <option value="fullhouse">Fullhouse</option>
          <option value="studio">Studio</option>
        </select>
        <input
          type="number"
          name="price"
          placeholder="Price"
          value={newRoom.price}
          onChange={handleInputChange}
          style={styles.input}
        />
        <select
          name="status"
          value={newRoom.status}
          onChange={handleInputChange}
          style={styles.select}
        >
          <option value="empty">Empty</option>
          <option value="occupied">Occupied</option>
        </select>
        <input
          type="text"
          name="tenant_id"
          placeholder="Tenant ID (if occupied)"
          value={newRoom.tenant_id}
          onChange={handleInputChange}
          style={styles.input}
        />
        <button onClick={handleCreateRoom} style={styles.button}>Add Room</button>
      </div>

      {editingRoom && (
        <div style={styles.formContainer}>
          <h2>Edit Room</h2>
          <input
            type="text"
            name="room_number"
            placeholder="Room Number"
            value={editingRoom.room_number}
            onChange={handleEditChange}
            style={styles.input}
          />
          <select
            name="room_type"
            value={editingRoom.room_type}
            onChange={handleEditChange}
            style={styles.select}
          >
            <option value="single">Single</option>
            <option value="double">Double</option>
            <option value="fullhouse">Fullhouse</option>
            <option value="studio">Studio</option>
          </select>
          <input
            type="number"
            name="price"
            placeholder="Price"
            value={editingRoom.price}
            onChange={handleEditChange}
            style={styles.input}
          />
          <select
            name="status"
            value={editingRoom.status}
            onChange={handleEditChange}
            style={styles.select}
          >
            <option value="empty">Empty</option>
            <option value="occupied">Occupied</option>
          </select>
          <input
            type="text"
            name="tenant_id"
            placeholder="Tenant ID (if occupied)"
            value={editingRoom.tenant_id}
            onChange={handleEditChange}
            style={styles.input}
          />
          <button onClick={handleUpdateRoom} style={styles.button}>Update Room</button>
        </div>
      )}

      <div style={styles.roomList}>
        <h2>Rooms</h2>
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.tableHeader}>Room Number</th>
              <th style={styles.tableHeader}>Room Type</th>
              <th style={styles.tableHeader}>Price</th>
              <th style={styles.tableHeader}>Status</th>
              <th style={styles.tableHeader}>Tenant ID</th>
              <th style={styles.tableHeader}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {rooms.map((room) => (
              <tr key={room.room_id} style={styles.tableRow}>
                <td>{room.room_number}</td>
                <td>{room.room_type}</td>
                <td>{room.price}</td>
                <td>{room.status}</td>
                <td>{room.tenant_id}</td>
                <td>
                  <button
                    onClick={() => setEditingRoom(room)}
                    style={styles.editButton}
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteRoom(room.room_id)}
                    style={styles.deleteButton}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const styles = {
  container: {
    padding: '20px',
    maxWidth: '900px',
    margin: '0 auto',
    backgroundColor: '#f9f9f9',
    borderRadius: '8px',
  },
  header: {
    textAlign: 'center',
    color: '#333',
  },
  formContainer: {
    marginBottom: '30px',
    padding: '20px',
    backgroundColor: '#fff',
    borderRadius: '8px',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
  },
  input: {
    width: '100%',
    padding: '10px',
    marginBottom: '10px',
    borderRadius: '5px',
    border: '1px solid #ccc',
    fontSize: '16px',
  },
  select: {
    width: '100%',
    padding: '10px',
    marginBottom: '10px',
    borderRadius: '5px',
    border: '1px solid #ccc',
    fontSize: '16px',
  },
  button: {
    padding: '10px 20px',
    backgroundColor: '#4CAF50',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    fontSize: '16px',
  },
  roomList: {
    marginTop: '30px',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
  },
  tableHeader: {
    padding: '10px',
    backgroundColor: '#4CAF50',
    color: 'white',
  },
  tableRow: {
    backgroundColor: '#f2f2f2',
    textAlign: 'center',
  },
  editButton: {
    padding: '8px 16px',
    backgroundColor: '#FFA500',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    marginRight: '8px',
  },
  deleteButton: {
    padding: '8px 16px',
    backgroundColor: '#F44336',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
  },
};

export default RoomList;