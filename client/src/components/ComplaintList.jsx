import React, { useState, useEffect } from 'react';
import axios from 'axios';

// Complaint Management Component
const ComplaintList = () => {
  // State variables
  const [complaints, setComplaints] = useState([]);
  const [newComplaint, setNewComplaint] = useState({
    descp: '',
    blockno: '',
    roomno: '',
  });
  const [userId, setUserId] = useState(''); // User ID (can be dynamically set based on logged-in user)
  const [ownerComplaints, setOwnerComplaints] = useState([]);

  // Fetch all complaints when the component mounts
  useEffect(() => {
    axios
      .get('/viewcomplaints')
      .then((response) => {
        setComplaints(response.data);
      })
      .catch((error) => {
        console.error('There was an error fetching complaints!', error);
      });
  }, []);

  // Handle form input change for new complaint
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewComplaint((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  // Handle form submission to register a new complaint
  const handleRegisterComplaint = () => {
    axios
      .post('/raisingcomplaint', newComplaint)
      .then(() => {
        alert('Complaint raised successfully!');
        setNewComplaint({ descp: '', blockno: '', roomno: '' });
        // Refetch complaints after submitting
        return axios.get('/viewcomplaints');
      })
      .then((response) => {
        setComplaints(response.data);
      })
      .catch((error) => {
        console.error('Error registering complaint:', error);
      });
  };

  // Handle fetching complaints by owner (based on userId)
  const handleOwnerComplaints = () => {
    axios
      .post('/ownerroomdetails', { userId })
      .then((response) => {
        setOwnerComplaints(response.data);
      })
      .catch((error) => {
        console.error('Error fetching owner complaints:', error);
      });
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.header}>Complaint Management</h1>

      {/* Register Complaint Form */}
      <div style={styles.formContainer}>
        <h2>Raise a Complaint</h2>
        <textarea
          name="descp"
          placeholder="Complaint Description"
          value={newComplaint.descp}
          onChange={handleInputChange}
          style={styles.textarea}
        />
        <input
          type="text"
          name="blockno"
          placeholder="Block Number"
          value={newComplaint.blockno}
          onChange={handleInputChange}
          style={styles.input}
        />
        <input
          type="text"
          name="roomno"
          placeholder="Room Number"
          value={newComplaint.roomno}
          onChange={handleInputChange}
          style={styles.input}
        />
        <button onClick={handleRegisterComplaint} style={styles.button}>
          Raise Complaint
        </button>
      </div>

      {/* View Complaints */}
      <div style={styles.complaintList}>
        <h2>All Complaints</h2>
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.tableHeader}>Description</th>
              <th style={styles.tableHeader}>Block No</th>
              <th style={styles.tableHeader}>Room No</th>
            </tr>
          </thead>
          <tbody>
            {complaints.map((complaint, index) => (
              <tr key={index} style={styles.tableRow}>
                <td>{complaint.descp}</td>
                <td>{complaint.blockno}</td>
                <td>{complaint.roomno}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Fetch Complaints by Owner */}
      <div style={styles.formContainer}>
        <h2>View Your Complaints</h2>
        <input
          type="text"
          placeholder="Enter User ID"
          value={userId}
          onChange={(e) => setUserId(e.target.value)}
          style={styles.input}
        />
        <button onClick={handleOwnerComplaints} style={styles.button}>
          Fetch My Complaints
        </button>
      </div>

      {/* Display Owner Complaints */}
      {ownerComplaints.length > 0 && (
        <div style={styles.complaintList}>
          <h2>Your Complaints</h2>
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.tableHeader}>Description</th>
                <th style={styles.tableHeader}>Block No</th>
                <th style={styles.tableHeader}>Room No</th>
              </tr>
            </thead>
            <tbody>
              {ownerComplaints.map((complaint, index) => (
                <tr key={index} style={styles.tableRow}>
                  <td>{complaint.descp}</td>
                  <td>{complaint.blockno}</td>
                  <td>{complaint.roomno}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
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
  textarea: {
    width: '100%',
    padding: '10px',
    height: '100px',
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
  complaintList: {
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
};

export default ComplaintList;
