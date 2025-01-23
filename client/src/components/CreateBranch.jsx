import React, { useState } from 'react';
import axios from 'axios';

function CreateBranch() {
  const [branchName, setBranchName] = useState('');
  const [manager, setManager] = useState('');
  const [roomsAvailable, setRoomsAvailable] = useState('');
  const [roomsEmpty, setRoomsEmpty] = useState('');
  const [roomsOccupied, setRoomsOccupied] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newBranch = {
      branch_name: branchName,
      manager: manager,
      rooms_available: roomsAvailable,
      rooms_empty: roomsEmpty,
      rooms_occupied: roomsOccupied,
    };

    try {
      await axios.post('http://localhost:5000/createbranch', newBranch);
      alert('Branch created successfully!');
    } catch (error) {
      console.error('Error creating branch:', error);
      alert('Failed to create branch.');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label>Branch Name:</label>
        <input type="text" value={branchName} onChange={(e) => setBranchName(e.target.value)} required />
      </div>
      <div>
        <label>Manager:</label>
        <input type="text" value={manager} onChange={(e) => setManager(e.target.value)} required />
      </div>
      <div>
        <label>Rooms Available:</label>
        <input type="number" value={roomsAvailable} onChange={(e) => setRoomsAvailable(e.target.value)} required />
      </div>
      <div>
        <label>Rooms Empty:</label>
        <input type="number" value={roomsEmpty} onChange={(e) => setRoomsEmpty(e.target.value)} required />
      </div>
      <div>
        <label>Rooms Occupied:</label>
        <input type="number" value={roomsOccupied} onChange={(e) => setRoomsOccupied(e.target.value)} required />
      </div>
      <button type="submit">Create Branch</button>
    </form>
  );
}

export default CreateBranch;