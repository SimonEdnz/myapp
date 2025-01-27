import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { FaArrowRight, FaArrowLeft } from 'react-icons/fa';

const BranchManagement = () => {
  const [branches, setBranches] = useState([]);
  const [formData, setFormData] = useState({
    branch_name: '',
    manager: '',
    rooms_available: '',
    rooms_empty: '',
    rooms_occupied: '',
  });
  const navigate = useNavigate();

  // Fetch all branches
  const fetchBranches = async () => {
    try {
      const res = await axios.get('http://localhost:5000/branches');
      setBranches(res.data);
    } catch (error) {
      console.error('Error fetching branches:', error);
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

  // Handle form submission to create a new branch
  const handleFormSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/branches', formData);
      fetchBranches(); // Refresh the list after submission
      setFormData({
        branch_name: '',
        manager: '',
        rooms_available: '',
        rooms_empty: '',
        rooms_occupied: '',
      });
    } catch (error) {
      console.error('Error creating branch:', error);
    }
  };

  // Fetch branches on component mount
  useEffect(() => {
    fetchBranches();
  }, []);

  return (
    <div style={{ padding: '40px', maxWidth: '1200px', margin: 'auto', fontFamily: 'Arial, sans-serif', backgroundColor: '#f8f9fa' }}>
      <h2 style={{ textAlign: 'center', color: '#2c3e50', fontWeight: 'bold', marginBottom: '40px', fontSize: '32px' }}>
        Branch Management
      </h2>

      {/* Branch List */}
      <div>
        <h3 style={{ marginBottom: '20px', fontSize: '24px', color: '#34495e', textAlign: 'center' }}>
          Existing Branches
        </h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
          {branches.map((branch) => (
            <div
              key={branch.branch_id}
              style={{
                border: '1px solid #ddd',
                padding: '20px',
                borderRadius: '12px',
                backgroundColor: '#fff',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                cursor: 'pointer',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'scale(1.02)';
                e.currentTarget.style.boxShadow = '0 8px 20px rgba(0, 0, 0, 0.2)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'scale(1)';
                e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.1)';
              }}
            >
              <h4 style={{ color: '#2980b9', fontWeight: 'bold', marginBottom: '10px', fontSize: '20px' }}>{branch.branch_name}</h4>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '15px' }}>
                <span style={{ color: '#2980b9', fontWeight: 'bold', fontSize: '14px' }}>More Info</span>
                <Link to={`/admin/branches/${branch.branch_id}/details`}
                  style={{ fontSize: '20px', color: '#2980b9', transition: 'color 0.3s ease' }}
                  onMouseEnter={(e) => e.currentTarget.style.color = '#3498db'}
                  onMouseLeave={(e) => e.currentTarget.style.color = '#2980b9'}
                >
                  <FaArrowRight />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Create New Branch Form */}
      <div style={{ marginTop: '40px', backgroundColor: '#fff', padding: '30px', borderRadius: '12px', boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)' }}>
        <h3 style={{ marginBottom: '20px', fontSize: '24px', color: '#2980b9', textAlign: 'center' }}>
          Create New Branch
        </h3>
        <form onSubmit={handleFormSubmit} style={{ maxWidth: '600px', margin: 'auto' }}>
          <div style={{ marginBottom: '20px' }}>
            <label htmlFor="branch_name" style={{ display: 'block', fontWeight: 'bold', marginBottom: '8px', color: '#34495e' }}>
              Branch Name:
            </label>
            <input
              type="text"
              id="branch_name"
              name="branch_name"
              value={formData.branch_name}
              onChange={handleInputChange}
              required
              style={{ width: '100%', padding: '12px', border: '1px solid #ddd', borderRadius: '6px', fontSize: '16px', transition: 'border-color 0.3s ease' }}
            />
          </div>
          <div style={{ marginBottom: '20px' }}>
            <label htmlFor="manager" style={{ display: 'block', fontWeight: 'bold', marginBottom: '8px', color: '#34495e' }}>
              Manager:
            </label>
            <input
              type="text"
              id="manager"
              name="manager"
              value={formData.manager}
              onChange={handleInputChange}
              required
              style={{ width: '100%', padding: '12px', border: '1px solid #ddd', borderRadius: '6px', fontSize: '16px', transition: 'border-color 0.3s ease' }}
            />
          </div>
          <div style={{ marginBottom: '20px' }}>
            <label htmlFor="rooms_available" style={{ display: 'block', fontWeight: 'bold', marginBottom: '8px', color: '#34495e' }}>
              Rooms Available:
            </label>
            <input
              type="number"
              id="rooms_available"
              name="rooms_available"
              value={formData.rooms_available}
              onChange={handleInputChange}
              required
              style={{ width: '100%', padding: '12px', border: '1px solid #ddd', borderRadius: '6px', fontSize: '16px', transition: 'border-color 0.3s ease' }}
            />
          </div>
          <div style={{ marginBottom: '20px' }}>
            <label htmlFor="rooms_empty" style={{ display: 'block', fontWeight: 'bold', marginBottom: '8px', color: '#34495e' }}>
              Rooms Empty:
            </label>
            <input
              type="number"
              id="rooms_empty"
              name="rooms_empty"
              value={formData.rooms_empty}
              onChange={handleInputChange}
              required
              style={{ width: '100%', padding: '12px', border: '1px solid #ddd', borderRadius: '6px', fontSize: '16px', transition: 'border-color 0.3s ease' }}
            />
          </div>
          <div style={{ marginBottom: '20px' }}>
            <label htmlFor="rooms_occupied" style={{ display: 'block', fontWeight: 'bold', marginBottom: '8px', color: '#34495e' }}>
              Rooms Occupied:
            </label>
            <input
              type="number"
              id="rooms_occupied"
              name="rooms_occupied"
              value={formData.rooms_occupied}
              onChange={handleInputChange}
              required
              style={{ width: '100%', padding: '12px', border: '1px solid #ddd', borderRadius: '6px', fontSize: '16px', transition: 'border-color 0.3s ease' }}
            />
          </div>
          <button
            type="submit"
            style={{
              backgroundColor: '#2980b9',
              color: '#fff',
              padding: '12px 20px',
              border: 'none',
              borderRadius: '6px',
              fontSize: '16px',
              width: '100%',
              cursor: 'pointer',
              transition: 'background-color 0.3s ease',
            }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#3498db'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#2980b9'}
          >
            Add Branch
          </button>
        </form>
      </div>
    </div>
  );
};

export default BranchManagement;