import React, { useState, useEffect } from 'react';
import axios from 'axios';

const RoomList = ({ branchId }) => {
  // State variables
  const [rooms, setRooms] = useState([]);
  const [newRoom, setNewRoom] = useState({
    branch_id: branchId,
    room_number: '',
    room_type: '',
    rent_amount: '',
    status: 'available',
    created_by: 'admin', // Example, replace with actual user ID if necessary
  });
  const [editingRoom, setEditingRoom] = useState(null);

  // Fetch rooms when the component mounts or branchId changes
  useEffect(() => {
    console.log('Fetching rooms...');
    axios
      .get(`/branches/${branchId}/rooms`)
      .then((response) => {
        console.log('Rooms fetched:', response.data);
        setRooms(response.data);
      })
      .catch((error) => {
        console.error('There was an error fetching rooms!', error);
      });
  }, [branchId]);

  // Handle changes in room form inputs
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewRoom((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  // Handle changes in room edit form
  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditingRoom((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  // Create new room
  const handleCreateRoom = () => {
    console.log('Creating room with data:', newRoom);  // Debugging
    axios
      .post('/rooms', newRoom)
      .then((response) => {
        console.log('Room created:', response.data);
        alert('Room created successfully!');
        setNewRoom({
          ...newRoom,
          room_number: '',
          room_type: '',
          rent_amount: '',
          status: 'available',
        });
        // Refetch rooms after creating
        return axios.get(`/branches/${branchId}/rooms`);
      })
      .then((response) => {
        setRooms(response.data);
      })
      .catch((error) => {
        console.error('Error creating room:', error);
      });
  };

  // Update room
  const handleUpdateRoom = () => {
    console.log('Updating room with data:', editingRoom); // Debugging
    axios
      .put(`/rooms/${editingRoom.room_id}`, editingRoom)
      .then((response) => {
        console.log('Room updated:', response.data);
        alert('Room updated successfully!');
        // Refetch rooms after updating
        return axios.get(`/branches/${branchId}/rooms`);
      })
      .then((response) => {
        setRooms(response.data);
        setEditingRoom(null); // Reset edit form
      })
      .catch((error) => {
        console.error('Error updating room:', error);
      });
  };

  // Delete room
  const handleDeleteRoom = (roomId) => {
    console.log('Deleting room with ID:', roomId);  // Debugging
    axios
      .delete(`/rooms/${roomId}`)
      .then((response) => {
        console.log('Room deleted:', response.data);
        alert('Room deleted successfully!');
        // Refetch rooms after deleting
        return axios.get(`/branches/${branchId}/rooms`);
      })
      .then((response) => {
        setRooms(response.data);
      })
      .catch((error) => {
        console.error('Error deleting room:', error);
      });
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.header}>Room Management</h1>

      {/* Add new room form */}
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
        <input
          type="text"
          name="room_type"
          placeholder="Room Type"
          value={newRoom.room_type}
          onChange={handleInputChange}
          style={styles.input}
        />
        <input
          type="number"
          name="rent_amount"
          placeholder="Rent Amount"
          value={newRoom.rent_amount}
          onChange={handleInputChange}
          style={styles.input}
        />
        <select
          name="status"
          value={newRoom.status}
          onChange={handleInputChange}
          style={styles.select}
        >
          <option value="available">Available</option>
          <option value="occupied">Occupied</option>
        </select>
        <button onClick={handleCreateRoom} style={styles.button}>Add Room</button>
      </div>

      {/* Edit room form */}
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
          <input
            type="text"
            name="room_type"
            placeholder="Room Type"
            value={editingRoom.room_type}
            onChange={handleEditChange}
            style={styles.input}
          />
          <input
            type="number"
            name="rent_amount"
            placeholder="Rent Amount"
            value={editingRoom.rent_amount}
            onChange={handleEditChange}
            style={styles.input}
          />
          <select
            name="status"
            value={editingRoom.status}
            onChange={handleEditChange}
            style={styles.select}
          >
            <option value="available">Available</option>
            <option value="occupied">Occupied</option>
          </select>
          <button onClick={handleUpdateRoom} style={styles.button}>Update Room</button>
        </div>
      )}

      {/* Room list */}
      <div style={styles.roomList}>
        <h2>Rooms</h2>
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.tableHeader}>Room Number</th>
              <th style={styles.tableHeader}>Room Type</th>
              <th style={styles.tableHeader}>Rent Amount</th>
              <th style={styles.tableHeader}>Status</th>
              <th style={styles.tableHeader}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {rooms.map((room) => (
              <tr key={room.room_id} style={styles.tableRow}>
                <td>{room.room_number}</td>
                <td>{room.room_type}</td>
                <td>{room.rent_amount}</td>
                <td>{room.status}</td>
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

// Inline CSS styles (same as previous code)
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
