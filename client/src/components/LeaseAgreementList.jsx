import React, { useState, useEffect } from 'react';
import axios from 'axios';

function LeaseAgreementList() {
  const [leaseAgreements, setLeaseAgreements] = useState([]);
  const [newLease, setNewLease] = useState({
    tenant_id: '',
    room_id: '',
    start_date: '',
    end_date: '',
    lease_amount: '',
    deposit_amount: '',
    created_by: 1, // Example user ID
  });

  useEffect(() => {
    axios.get('http://localhost:5000/leases') // Update with actual endpoint
      .then(response => setLeaseAgreements(response.data))
      .catch(error => console.error('Error fetching lease agreements:', error));
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewLease({ ...newLease, [name]: value });
  };

  const handleCreateLease = () => {
    axios.post('http://localhost:5000/leases', newLease)
      .then(() => {
        alert('Lease agreement created successfully!');
        setLeaseAgreements([...leaseAgreements, newLease]);
      })
      .catch(error => console.error('Error creating lease agreement:', error));
  };

  return (
    <div>
      <h1>Lease Agreement List</h1>
      <ul>
        {leaseAgreements.map(lease => (
          <li key={lease.lease_id}>{lease.tenant_id} - {lease.room_id} - {lease.start_date}</li>
        ))}
      </ul>
      <h2>Create New Lease Agreement</h2>
      <input
        type="text"
        name="tenant_id"
        value={newLease.tenant_id}
        onChange={handleInputChange}
        placeholder="Tenant ID"
      />
      <input
        type="text"
        name="room_id"
        value={newLease.room_id}
        onChange={handleInputChange}
        placeholder="Room ID"
      />
      <input
        type="date"
        name="start_date"
        value={newLease.start_date}
        onChange={handleInputChange}
        placeholder="Start Date"
      />
      <input
        type="date"
        name="end_date"
        value={newLease.end_date}
        onChange={handleInputChange}
        placeholder="End Date"
      />
      <input
        type="number"
        name="lease_amount"
        value={newLease.lease_amount}
        onChange={handleInputChange}
        placeholder="Lease Amount"
      />
      <input
        type="number"
        name="deposit_amount"
        value={newLease.deposit_amount}
        onChange={handleInputChange}
        placeholder="Deposit Amount"
      />
      <button onClick={handleCreateLease}>Create Lease Agreement</button>
    </div>
  );
}

export default LeaseAgreementList;