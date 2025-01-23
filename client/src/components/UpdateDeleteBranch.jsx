import React, { useState, useEffect } from 'react';
import axios from 'axios';

function UpdateDeleteBranch() {
  const [branches, setBranches] = useState([]);
  const [selectedBranch, setSelectedBranch] = useState(null);
  const [branchName, setBranchName] = useState('');
  const [manager, setManager] = useState('');
  const [roomsAvailable, setRoomsAvailable] = useState('');
  const [roomsEmpty, setRoomsEmpty] = useState('');
  const [roomsOccupied, setRoomsOccupied] = useState('');

  useEffect(() => {
    const fetchBranches = async () => {
      try {
        const response = await axios.get('http://localhost:5000/branches');
        if (Array.isArray(response.data)) {
          setBranches(response.data);
        } else {
          console.error('API response is not an array:', response.data);
        }
      } catch (error) {
        console.error('Error fetching branches:', error);
      }
    };

    fetchBranches();
  }, []);

  const handleBranchSelect = (branch) => {
    setSelectedBranch(branch);
    setBranchName(branch.branch_name);
    setManager(branch.manager);
    setRoomsAvailable(branch.rooms_available);
    setRoomsEmpty(branch.rooms_empty);
    setRoomsOccupied(branch.rooms_occupied);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    const updatedBranch = {
      branch_name: branchName,
      manager: manager,
      rooms_available: roomsAvailable,
      rooms_empty: roomsEmpty,
      rooms_occupied: roomsOccupied,
    };

    try {
      await axios.put(`http://localhost:5000/updatebranch/${selectedBranch.branch_id}`, updatedBranch);
      alert('Branch updated successfully!');
      // Refresh branches list
      const response = await axios.get('http://localhost:5000/branches');
      setBranches(response.data);
      setSelectedBranch(null);
    } catch (error) {
      console.error('Error updating branch:', error);
      alert('Failed to update branch.');
    }
  };

  const handleDelete = async () => {
    try {
      await axios.delete(`http://localhost:5000/deletebranch/${selectedBranch.branch_id}`);
      alert('Branch deleted successfully!');
      // Refresh branches list
      const response = await axios.get('http://localhost:5000/branches');
      setBranches(response.data);
      setSelectedBranch(null);
    } catch (error) {
      console.error('Error deleting branch:', error);
      alert('Failed to delete branch.');
    }
  };

  return (
    <div>
      <h1>Update or Delete Branch</h1>
      <ul>
        {branches.map((branch) => (
          <li key={branch.branch_id} onClick={() => handleBranchSelect(branch)}>
            {branch.branch_name} - Manager: {branch.manager}
          </li>
        ))}
      </ul>
      {selectedBranch && (
        <div>
          <h2>Edit Branch</h2>
          <form onSubmit={handleUpdate}>
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
            <button type="submit">Update Branch</button>
          </form>
          <button onClick={handleDelete}>Delete Branch</button>
        </div>
      )}
    </div>
  );
}

export default UpdateDeleteBranch;