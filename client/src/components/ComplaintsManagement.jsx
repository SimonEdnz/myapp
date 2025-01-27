import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaPlus, FaEdit, FaTrash } from "react-icons/fa";

const ComplaintsManagement = ({ tenantId }) => {
  const [complaints, setComplaints] = useState([]);
  const [showComplaintForm, setShowComplaintForm] = useState(false);
  const [complaintFormData, setComplaintFormData] = useState({
    tenant_id: tenantId || "",
    category_id: "",
    description: ""
  });

  // Fetch complaints from the backend
  const fetchComplaints = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/complaints/tenant/${tenantId}`);
      console.log("Complaints fetched:", response.data);
      setComplaints(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      console.error("Error fetching complaints:", error);
    }
  };

  // Handle form input changes
  const handleComplaintFormChange = (e) => {
    const { name, value } = e.target;
    setComplaintFormData({
      ...complaintFormData,
      [name]: value,
    });
  };

  // Handle form submission (create or update complaint)
  const handleComplaintFormSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`http://localhost:5000/complaints`, complaintFormData);
      fetchComplaints(); // Refresh the complaints list
      setShowComplaintForm(false); // Hide the form
      setComplaintFormData({
        tenant_id: tenantId || "",
        category_id: "",
        description: ""
      }); // Reset form data
    } catch (error) {
      console.error("Error handling complaint form:", error);
    }
  };

  // Handle deleting a complaint
  const handleDeleteComplaint = async (complaintId) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this complaint?");
    if (confirmDelete) {
      try {
        await axios.delete(`http://localhost:5000/complaints/${complaintId}`);
        fetchComplaints(); // Refresh the complaints list
      } catch (error) {
        console.error("Error deleting complaint:", error);
      }
    }
  };

  // Fetch complaints on component mount
  useEffect(() => {
    fetchComplaints();
  }, [tenantId]);

  return (
    <div>
      <h3 style={{ color: "#007bff", marginBottom: "10px" }}>Complaints</h3>
      <button
        onClick={() => setShowComplaintForm(!showComplaintForm)}
        style={{
          backgroundColor: "#007bff",
          color: "#fff",
          padding: "10px 20px",
          border: "none",
          borderRadius: "4px",
          cursor: "pointer",
          marginBottom: "20px"
        }}
      >
        <FaPlus style={{ marginRight: "8px" }} />
        {showComplaintForm ? "Hide Complaint Form" : "Add New Complaint"}
      </button>

      {showComplaintForm && (
        <form onSubmit={handleComplaintFormSubmit} style={{ marginBottom: "20px" }}>
          {/* Form fields */}
          <div style={{ marginBottom: "10px" }}>
            <label>Category ID:</label>
            <input
              type="text"
              name="category_id"
              value={complaintFormData.category_id}
              onChange={handleComplaintFormChange}
              required
              style={{ width: "100%", padding: "8px", borderRadius: "4px", border: "1px solid #ddd" }}
            />
          </div>
          <div style={{ marginBottom: "10px" }}>
            <label>Description:</label>
            <textarea
              name="description"
              value={complaintFormData.description}
              onChange={handleComplaintFormChange}
              required
              style={{ width: "100%", padding: "8px", borderRadius: "4px", border: "1px solid #ddd" }}
            />
          </div>
          <button
            type="submit"
            style={{
              backgroundColor: "#28a745",
              color: "#fff",
              padding: "10px 20px",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer"
            }}
          >
            Submit Complaint
          </button>
        </form>
      )}

      {/* Complaints Table */}
      <table style={{ width: "100%", borderCollapse: "collapse", border: "1px solid #ddd" }}>
        <thead>
          <tr>
            <th style={{ padding: "10px", border: "1px solid #ddd", backgroundColor: "#f1f1f1" }}>Complaint ID</th>
            <th style={{ padding: "10px", border: "1px solid #ddd", backgroundColor: "#f1f1f1" }}>Category ID</th>
            <th style={{ padding: "10px", border: "1px solid #ddd", backgroundColor: "#f1f1f1" }}>Description</th>
            <th style={{ padding: "10px", border: "1px solid #ddd", backgroundColor: "#f1f1f1" }}>Status</th>
            <th style={{ padding: "10px", border: "1px solid #ddd", backgroundColor: "#f1f1f1" }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {Array.isArray(complaints) && complaints.length === 0 ? (
            <tr>
              <td colSpan="5" style={{ textAlign: "center", padding: "10px" }}>
                No complaints available
              </td>
            </tr>
          ) : (
            complaints.map((complaint) => (
              <tr key={complaint.complaint_id}>
                <td style={{ padding: "10px", border: "1px solid #ddd" }}>{complaint.complaint_id}</td>
                <td style={{ padding: "10px", border: "1px solid #ddd" }}>{complaint.category_id}</td>
                <td style={{ padding: "10px", border: "1px solid #ddd" }}>{complaint.description}</td>
                <td style={{ padding: "10px", border: "1px solid #ddd" }}>{complaint.status}</td>
                <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                  {/* Edit and Delete buttons can be added here as needed */}
                  <button
                    onClick={() => handleDeleteComplaint(complaint.complaint_id)}
                    style={{
                      backgroundColor: "#dc3545",
                      color: "#fff",
                      padding: "5px 10px",
                      border: "none",
                      borderRadius: "4px",
                      cursor: "pointer"
                    }}
                  >
                    <FaTrash />
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default ComplaintsManagement;