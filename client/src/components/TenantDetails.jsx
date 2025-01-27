import React, { useState, useEffect } from 'react';
import axios from 'axios';

// TenantList component
const TenantList = () => {
  // State variables
  const [tenants, setTenants] = useState([]);
  const [newTenant, setNewTenant] = useState({
    first_name: '',
    last_name: '',
    phone: '',
    email: '',
    address: '',
    date_of_birth: '',
    occupation: '',
    emergency_contact: '',
    created_by: 'admin', // Example, replace with actual user ID if necessary
  });
  const [editingTenant, setEditingTenant] = useState(null);

  // Fetch tenants when the component mounts
  useEffect(() => {
    axios
      .get('http://localhost:5000/tenants')
      .then((response) => {
        setTenants(response.data);
      })
      .catch((error) => {
        console.error('There was an error fetching tenants!', error);
      });
  }, []);

  // Handle changes in tenant form inputs
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewTenant((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  // Handle changes in tenant edit form
  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditingTenant((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  // Create new tenant
  const handleCreateTenant = () => {
    axios
      .post('http://localhost:5000/tenants', newTenant)
      .then(() => {
        alert('Tenant created successfully!');
        setNewTenant({
          ...newTenant,
          first_name: '',
          last_name: '',
          phone: '',
          email: '',
          address: '',
          date_of_birth: '',
          occupation: '',
          emergency_contact: '',
        });
        // Refetch tenants after creating
        return axios.get('http://localhost:5000/tenants');
      })
      .then((response) => {
        setTenants(response.data);
      })
      .catch((error) => {
        console.error('Error creating tenant:', error);
      });
  };

  // Update tenant
  const handleUpdateTenant = () => {
    axios
      .put(`http://localhost:5000/tenants/${editingTenant.tenant_id}`, editingTenant)
      .then(() => {
        alert('Tenant updated successfully!');
        // Refetch tenants after updating
        return axios.get('http://localhost:5000/tenants');
      })
      .then((response) => {
        setTenants(response.data);
        setEditingTenant(null); // Reset edit form
      })
      .catch((error) => {
        console.error('Error updating tenant:', error);
      });
  };

  // Delete tenant
  const handleDeleteTenant = (tenantId) => {
    axios
      .delete(`http://localhost:5000/tenants/${tenantId}`)
      .then(() => {
        alert('Tenant deleted successfully!');
        // Refetch tenants after deleting
        return axios.get('http://localhost:5000/tenants');
      })
      .then((response) => {
        setTenants(response.data);
      })
      .catch((error) => {
        console.error('Error deleting tenant:', error);
      });
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.header}>Tenant Management</h1>

      {/* Add new tenant form */}
      <div style={styles.formContainer}>
        <h2>Add New Tenant</h2>
        <input
          type="text"
          name="first_name"
          placeholder="First Name"
          value={newTenant.first_name}
          onChange={handleInputChange}
          style={styles.input}
        />
        <input
          type="text"
          name="last_name"
          placeholder="Last Name"
          value={newTenant.last_name}
          onChange={handleInputChange}
          style={styles.input}
        />
        <input
          type="text"
          name="phone"
          placeholder="Phone Number"
          value={newTenant.phone}
          onChange={handleInputChange}
          style={styles.input}
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={newTenant.email}
          onChange={handleInputChange}
          style={styles.input}
        />
        <input
          type="text"
          name="address"
          placeholder="Address"
          value={newTenant.address}
          onChange={handleInputChange}
          style={styles.input}
        />
        <input
          type="date"
          name="date_of_birth"
          placeholder="Date of Birth"
          value={newTenant.date_of_birth}
          onChange={handleInputChange}
          style={styles.input}
        />
        <input
          type="text"
          name="occupation"
          placeholder="Occupation"
          value={newTenant.occupation}
          onChange={handleInputChange}
          style={styles.input}
        />
        <input
          type="text"
          name="emergency_contact"
          placeholder="Emergency Contact"
          value={newTenant.emergency_contact}
          onChange={handleInputChange}
          style={styles.input}
        />
        <button onClick={handleCreateTenant} style={styles.button}>Add Tenant</button>
      </div>

      {/* Edit tenant form */}
      {editingTenant && (
        <div style={styles.formContainer}>
          <h2>Edit Tenant</h2>
          <input
            type="text"
            name="first_name"
            placeholder="First Name"
            value={editingTenant.first_name}
            onChange={handleEditChange}
            style={styles.input}
          />
          <input
            type="text"
            name="last_name"
            placeholder="Last Name"
            value={editingTenant.last_name}
            onChange={handleEditChange}
            style={styles.input}
          />
          <input
            type="text"
            name="phone"
            placeholder="Phone Number"
            value={editingTenant.phone}
            onChange={handleEditChange}
            style={styles.input}
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={editingTenant.email}
            onChange={handleEditChange}
            style={styles.input}
          />
          <input
            type="text"
            name="address"
            placeholder="Address"
            value={editingTenant.address}
            onChange={handleEditChange}
            style={styles.input}
          />
          <input
            type="date"
            name="date_of_birth"
            placeholder="Date of Birth"
            value={editingTenant.date_of_birth}
            onChange={handleEditChange}
            style={styles.input}
          />
          <input
            type="text"
            name="occupation"
            placeholder="Occupation"
            value={editingTenant.occupation}
            onChange={handleEditChange}
            style={styles.input}
          />
          <input
            type="text"
            name="emergency_contact"
            placeholder="Emergency Contact"
            value={editingTenant.emergency_contact}
            onChange={handleEditChange}
            style={styles.input}
          />
          <button onClick={handleUpdateTenant} style={styles.button}>Update Tenant</button>
        </div>
      )}

      {/* Tenant list */}
      <div style={styles.tenantList}>
        <h2>Tenants</h2>
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.tableHeader}>Name</th>
              <th style={styles.tableHeader}>Phone</th>
              <th style={styles.tableHeader}>Email</th>
              <th style={styles.tableHeader}>Occupation</th>
              <th style={styles.tableHeader}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {tenants.map((tenant) => (
              <tr key={tenant.tenant_id} style={styles.tableRow}>
                <td>{tenant.first_name} {tenant.last_name}</td>
                <td>{tenant.phone}</td>
                <td>{tenant.email}</td>
                <td>{tenant.occupation}</td>
                <td>
                  <button
                    onClick={() => setEditingTenant(tenant)}
                    style={styles.editButton}
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteTenant(tenant.tenant_id)}
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

// Inline CSS styles
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
  button: {
    padding: '10px 20px',
    backgroundColor: '#4CAF50',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    fontSize: '16px',
  },
  tenantList: {
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

export default TenantList;