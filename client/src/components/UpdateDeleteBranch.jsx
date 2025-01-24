import React, { useState, useEffect } from 'react';
import axios from 'axios';

function UpdateDeleteBranch() {
  const [branches, setBranches] = useState([]);
  const [selectedBranch, setSelectedBranch] = useState(null);
  const [branchData, setBranchData] = useState({
    branch_name: '',
    manager: '',
    rooms_available: '',
    rooms_empty: '',
    rooms_occupied: '',
  });

  useEffect(() => {
    axios.get('http://localhost:5000/branches')
      .then(response => setBranches(response.data))
      .catch(error => console.error('Error fetching branches:', error));
  }, []);

  const handleSelectBranch = (branch) => {
    setSelectedBranch(branch);
    setBranchData(branch);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setBranchData({ ...branchData, [name]: value });
  };

  const handleUpdateBranch = () => {
    axios.put(`http://localhost:5000/updatebranch/${selectedBranch.branch_id}`, branchData)
      .then(() => alert('Branch updated successfully!'))
      .catch(error => console.error('Error updating branch:', error));
  };

  const handleDeleteBranch = () => {
    axios.delete(`http://localhost:5000/deletebranch/${selectedBranch.branch_id}`)
      .then(() => {
        alert('Branch deleted successfully!');
        setBranches(branches.filter(branch => branch.branch_id !== selectedBranch.branch_id));
        setSelectedBranch(null);
      })
      .catch(error => console.error('Error deleting branch:', error));
  };

  return (
    <div>
      <h1>Update/Delete Branch</h1>
      <ul>
        {branches.map(branch => (
          <li key={branch.branch_id} onClick={() => handleSelectBranch(branch)}>
            {branch.branch_name}
          </li>
        ))}
      </ul>
      {selectedBranch && (
        <div>
          <h2>Edit Branch</h2>
          <input
            type="text"
            name="branch_name"
            value={branchData.branch_name}
            onChange={handleInputChange}
            placeholder="Branch Name"
          />
          <input
            type="text"
            name="manager"
            value={branchData.manager}
            onChange={handleInputChange}
            placeholder="Manager"
          />
          <input
            type="number"
            name="rooms_available"
            value={branchData.rooms_available}
            onChange={handleInputChange}
            placeholder="Rooms Available"
          />
          <input
            type="number"
            name="rooms_empty"
            value={branchData.rooms_empty}
            onChange={handleInputChange}
            placeholder="Rooms Empty"
          />
          <input
            type="number"
            name="rooms_occupied"
            value={branchData.rooms_occupied}
            onChange={handleInputChange}
            placeholder="Rooms Occupied"
          />
          <button onClick={handleUpdateBranch}>Update Branch</button>
          <button onClick={handleDeleteBranch}>Delete Branch</button>
        </div>
      )}
    </div>
  );
}

export default UpdateDeleteBranch;