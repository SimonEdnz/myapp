import React, { useState, useEffect } from 'react';
import axios from 'axios';

const BranchManagement = () => {
  const [branches, setBranches] = useState([]);
  const [formData, setFormData] = useState({
    branch_name: '',
    manager: '',
    rooms_available: '',
    rooms_empty: '',
    rooms_occupied: '',
  });
  const [editingBranchId, setEditingBranchId] = useState(null);

  // Fetch branches from the backend
  const fetchBranches = async () => {
    try {
      const res = await axios.get('http://localhost:5000/branches');
      setBranches(res.data);
    } catch (err) {
      console.log('Error fetching branches:', err);
    }
  };

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // Handle form submission to create or update a branch
  const handleFormSubmit = async (e) => {
    e.preventDefault();

    const url = editingBranchId
      ? `http://localhost:5000/branches/${editingBranchId}`
      : 'http://localhost:5000/branches';
    const method = editingBranchId ? 'put' : 'post';

    try {
      await axios[method](url, formData);
      fetchBranches(); // Refresh the list after submission
      setFormData({
        branch_name: '',
        manager: '',
        rooms_available: '',
        rooms_empty: '',
        rooms_occupied: '',
      });
      setEditingBranchId(null);
    } catch (err) {
      console.log('Error submitting form:', err);
    }
  };

  // Handle editing a branch
  const handleEdit = (branch) => {
    setFormData({
      branch_name: branch.branch_name,
      manager: branch.manager,
      rooms_available: branch.rooms_available,
      rooms_empty: branch.rooms_empty,
      rooms_occupied: branch.rooms_occupied,
    });
    setEditingBranchId(branch.branch_id);
  };

  // Handle deleting a branch
  const handleDelete = async (branch_id) => {
    try {
      await axios.delete(`http://localhost:5000/branches/${branch_id}`);
      fetchBranches(); // Refresh the list after deletion
    } catch (err) {
      console.log('Error deleting branch:', err);
    }
  };

  // Fetch branches on component mount
  useEffect(() => {
    fetchBranches();
  }, []);

  return (
    <div
      style={{
        padding: '20px',
        maxWidth: '1200px',
        margin: 'auto',
        fontFamily: 'Arial, sans-serif',
      }}
    >
      <h2 style={{ textAlign: 'center', color: '#007bff' }}>Branch Management</h2>

      {/* Branch List */}
      <div>
        <h3 style={{ marginBottom: '10px', fontSize: '20px', color: '#333' }}>Branches</h3>
        <table
          style={{
            width: '100%',
            borderCollapse: 'collapse',
            marginBottom: '20px',
            border: '1px solid #ddd',
          }}
        >
          <thead>
            <tr style={{ backgroundColor: '#f2f2f2' }}>
              <th style={{ padding: '10px', textAlign: 'left', fontWeight: 'bold' }}>
                Branch Name
              </th>
              <th style={{ padding: '10px', textAlign: 'left', fontWeight: 'bold' }}>Manager</th>
              <th style={{ padding: '10px', textAlign: 'left', fontWeight: 'bold' }}>
                Rooms Available
              </th>
              <th style={{ padding: '10px', textAlign: 'left', fontWeight: 'bold' }}>
                Rooms Empty
              </th>
              <th style={{ padding: '10px', textAlign: 'left', fontWeight: 'bold' }}>
                Rooms Occupied
              </th>
              <th style={{ padding: '10px', textAlign: 'left', fontWeight: 'bold' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {branches.map((branch) => (
              <tr key={branch.branch_id}>
                <td style={{ padding: '8px' }}>{branch.branch_name}</td>
                <td style={{ padding: '8px' }}>{branch.manager}</td>
                <td style={{ padding: '8px' }}>{branch.rooms_available}</td>
                <td style={{ padding: '8px' }}>{branch.rooms_empty}</td>
                <td style={{ padding: '8px' }}>{branch.rooms_occupied}</td>
                <td style={{ padding: '8px' }}>
                  <button
                    onClick={() => handleEdit(branch)}
                    style={{
                      backgroundColor: '#007bff',
                      color: '#fff',
                      padding: '5px 10px',
                      border: 'none',
                      cursor: 'pointer',
                      borderRadius: '4px',
                      marginRight: '10px',
                    }}
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(branch.branch_id)}
                    style={{
                      backgroundColor: '#dc3545',
                      color: '#fff',
                      padding: '5px 10px',
                      border: 'none',
                      cursor: 'pointer',
                      borderRadius: '4px',
                    }}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Branch Form */}
      <div>
        <h3
          style={{
            marginBottom: '20px',
            fontSize: '20px',
            color: '#007bff',
            textAlign: 'center',
          }}
        >
          {editingBranchId ? 'Edit Branch' : 'Add New Branch'}
        </h3>
        <form onSubmit={handleFormSubmit}>
          <div style={{ marginBottom: '10px' }}>
            <label htmlFor="branch_name" style={{ display: 'block', fontWeight: 'bold' }}>
              Branch Name:
            </label>
            <input
              type="text"
              id="branch_name"
              name="branch_name"
              value={formData.branch_name}
              onChange={handleInputChange}
              required
              style={{
                width: '100%',
                padding: '10px',
                border: '1px solid #ccc',
                borderRadius: '4px',
                fontSize: '16px',
              }}
            />
          </div>
          <div style={{ marginBottom: '10px' }}>
            <label htmlFor="manager" style={{ display: 'block', fontWeight: 'bold' }}>
              Manager:
            </label>
            <input
              type="text"
              id="manager"
              name="manager"
              value={formData.manager}
              onChange={handleInputChange}
              required
              style={{
                width: '100%',
                padding: '10px',
                border: '1px solid #ccc',
                borderRadius: '4px',
                fontSize: '16px',
              }}
            />
          </div>
          <div style={{ marginBottom: '10px' }}>
            <label htmlFor="rooms_available" style={{ display: 'block', fontWeight: 'bold' }}>
              Rooms Available:
            </label>
            <input
              type="number"
              id="rooms_available"
              name="rooms_available"
              value={formData.rooms_available}
              onChange={handleInputChange}
              required
              style={{
                width: '100%',
                padding: '10px',
                border: '1px solid #ccc',
                borderRadius: '4px',
                fontSize: '16px',
              }}
            />
          </div>
          <div style={{ marginBottom: '10px' }}>
            <label htmlFor="rooms_empty" style={{ display: 'block', fontWeight: 'bold' }}>
              Rooms Empty:
            </label>
            <input
              type="number"
              id="rooms_empty"
              name="rooms_empty"
              value={formData.rooms_empty}
              onChange={handleInputChange}
              required
              style={{
                width: '100%',
                padding: '10px',
                border: '1px solid #ccc',
                borderRadius: '4px',
                fontSize: '16px',
              }}
            />
          </div>
          <div style={{ marginBottom: '10px' }}>
            <label htmlFor="rooms_occupied" style={{ display: 'block', fontWeight: 'bold' }}>
              Rooms Occupied:
            </label>
            <input
              type="number"
              id="rooms_occupied"
              name="rooms_occupied"
              value={formData.rooms_occupied}
              onChange={handleInputChange}
              required
              style={{
                width: '100%',
                padding: '10px',
                border: '1px solid #ccc',
                borderRadius: '4px',
                fontSize: '16px',
              }}
            />
          </div>
          <button
            type="submit"
            style={{
              backgroundColor: '#007bff',
              color: '#fff',
              padding: '10px 20px',
              border: 'none',
              cursor: 'pointer',
              borderRadius: '4px',
              fontSize: '16px',
              width: '100%',
            }}
          >
            {editingBranchId ? 'Update Branch' : 'Add Branch'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default BranchManagement;
