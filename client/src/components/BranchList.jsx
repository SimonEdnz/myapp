import React, { useEffect, useState } from 'react';
import axios from 'axios';

function BranchList() {
  const [branches, setBranches] = useState([]);

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

  return (
    <div>
      <h1>Branches</h1>
      <ul>
        {branches.map((branch) => (
          <li key={branch.branch_id}>
            {branch.branch_name} - Manager: {branch.manager} - Rooms Available: {branch.rooms_available} - Empty: {branch.rooms_empty} - Occupied: {branch.rooms_occupied}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default BranchList;