import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaPlus, FaEdit, FaTrash } from "react-icons/fa";

const TenantManagement = ({ branchId }) => {
  const [tenants, setTenants] = useState([]);
  const [showTenantForm, setShowTenantForm] = useState(false);
  const [tenantFormData, setTenantFormData] = useState({
    branch_id: branchId || "",
    first_name: "",
    last_name: "",
    email: "",
    phone_number: "",
    Gender: "",
    Age: "",
    room_number: "",
    move_in_date: "",
    move_out_date: "",
    rent_amount: "",
    deposit_amount: "",
    is_active: true,
    Emergency_Contact: "",
  });

  // Fetch tenants from the backend
  const fetchTenants = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/tenants`);
      console.log("Tenants fetched:", response.data);
      setTenants(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      console.error("Error fetching tenants:", error);
    }
  };

  // Handle editing a tenant
  const handleEditTenant = (tenantId) => {
    const tenantToEdit = tenants.find((tenant) => tenant.tenant_id === tenantId);
    if (tenantToEdit) {
      setTenantFormData({
        ...tenantToEdit,
        move_in_date: tenantToEdit.move_in_date.split("T")[0],
        move_out_date: tenantToEdit.move_out_date ? tenantToEdit.move_out_date.split("T")[0] : "",
      });
      setShowTenantForm(true);
    }
  };

  // Handle deleting a tenant
  const handleDeleteTenant = async (tenantId) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this tenant?");
    if (confirmDelete) {
      try {
        await axios.delete(`http://localhost:5000/tenants/${tenantId}`);
        fetchTenants(); // Refresh the tenant list
      } catch (error) {
        console.error("Error deleting tenant:", error);
      }
    }
  };

  // Handle form input changes
  const handleTenantFormChange = (e) => {
    const { name, value } = e.target;
    setTenantFormData({
      ...tenantFormData,
      [name]: value,
    });
  };

  // Handle form submission (create or update tenant)
  const handleTenantFormSubmit = async (e) => {
    e.preventDefault();
    try {
      if (tenantFormData.tenant_id) {
        // Update existing tenant
        await axios.put(
          `http://localhost:5000/tenants/${tenantFormData.tenant_id}`,
          tenantFormData
        );
      } else {
        // Create new tenant
        await axios.post(`http://localhost:5000/tenants`, tenantFormData);
      }
      fetchTenants(); // Refresh the tenant list
      setShowTenantForm(false); // Hide the form
      setTenantFormData({
        branch_id: branchId || "",
        first_name: "",
        last_name: "",
        email: "",
        phone_number: "",
        Gender: "",
        Age: "",
        room_number: "",
        move_in_date: "",
        move_out_date: "",
        rent_amount: "",
        deposit_amount: "",
        is_active: true,
        Emergency_Contact: "",
      }); // Reset form data
    } catch (error) {
      console.error("Error handling tenant form:", error);
    }
  };

  // Fetch tenants on component mount
  useEffect(() => {
    fetchTenants();
  }, []);

  return (
    <div>
      <h3 style={{ color: "#007bff", marginBottom: "10px" }}>Tenants</h3>
      <button
        onClick={() => setShowTenantForm(!showTenantForm)}
        style={{
          backgroundColor: "#007bff",
          color: "#fff",
          padding: "10px 20px",
          border: "none",
          borderRadius: "4px",
          cursor: "pointer",
          marginBottom: "20px",
        }}
      >
        <FaPlus style={{ marginRight: "8px" }} />
        {showTenantForm ? "Hide Tenant Form" : "Add New Tenant"}
      </button>

      {showTenantForm && (
        <form onSubmit={handleTenantFormSubmit} style={{ marginBottom: "20px" }}>
          {/* Form fields */}
          <div style={{ marginBottom: "10px" }}>
            <label>First Name:</label>
            <input
              type="text"
              name="first_name"
              value={tenantFormData.first_name}
              onChange={handleTenantFormChange}
              required
              style={{ width: "100%", padding: "8px", borderRadius: "4px", border: "1px solid #ddd" }}
            />
          </div>
          <div style={{ marginBottom: "10px" }}>
            <label>Last Name:</label>
            <input
              type="text"
              name="last_name"
              value={tenantFormData.last_name}
              onChange={handleTenantFormChange}
              required
              style={{ width: "100%", padding: "8px", borderRadius: "4px", border: "1px solid #ddd" }}
            />
          </div>
          <div style={{ marginBottom: "10px" }}>
            <label>Email:</label>
            <input
              type="email"
              name="email"
              value={tenantFormData.email}
              onChange={handleTenantFormChange}
              required
              style={{ width: "100%", padding: "8px", borderRadius: "4px", border: "1px solid #ddd" }}
            />
          </div>
          <div style={{ marginBottom: "10px" }}>
            <label>Phone:</label>
            <input
              type="text"
              name="phone_number"
              value={tenantFormData.phone_number}
              onChange={handleTenantFormChange}
              required
              style={{ width: "100%", padding: "8px", borderRadius: "4px", border: "1px solid #ddd" }}
            />
          </div>
          <div style={{ marginBottom: "10px" }}>
            <label>Gender:</label>
            <select
              name="Gender"
              value={tenantFormData.Gender}
              onChange={handleTenantFormChange}
              required
              style={{ width: "100%", padding: "8px", borderRadius: "4px", border: "1px solid #ddd" }}
            >
              <option value="">Select Gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
          </div>
          <div style={{ marginBottom: "10px" }}>
            <label>Age:</label>
            <input
              type="number"
              name="Age"
              value={tenantFormData.Age}
              onChange={handleTenantFormChange}
              required
              style={{ width: "100%", padding: "8px", borderRadius: "4px", border: "1px solid #ddd" }}
            />
          </div>
          <div style={{ marginBottom: "10px" }}>
            <label>Room Number:</label>
            <input
              type="text"
              name="room_number"
              value={tenantFormData.room_number}
              onChange={handleTenantFormChange}
              required
              style={{ width: "100%", padding: "8px", borderRadius: "4px", border: "1px solid #ddd" }}
            />
          </div>
          <div style={{ marginBottom: "10px" }}>
            <label>Move-In Date:</label>
            <input
              type="date"
              name="move_in_date"
              value={tenantFormData.move_in_date}
              onChange={handleTenantFormChange}
              required
              style={{ width: "100%", padding: "8px", borderRadius: "4px", border: "1px solid #ddd" }}
            />
          </div>
          <div style={{ marginBottom: "10px" }}>
            <label>Move-Out Date:</label>
            <input
              type="date"
              name="move_out_date"
              value={tenantFormData.move_out_date}
              onChange={handleTenantFormChange}
              style={{ width: "100%", padding: "8px", borderRadius: "4px", border: "1px solid #ddd" }}
            />
          </div>
          <div style={{ marginBottom: "10px" }}>
            <label>Rent Amount:</label>
            <input
              type="number"
              name="rent_amount"
              value={tenantFormData.rent_amount}
              onChange={handleTenantFormChange}
              required
              style={{ width: "100%", padding: "8px", borderRadius: "4px", border: "1px solid #ddd" }}
            />
          </div>
          <div style={{ marginBottom: "10px" }}>
            <label>Deposit Amount:</label>
            <input
              type="number"
              name="deposit_amount"
              value={tenantFormData.deposit_amount}
              onChange={handleTenantFormChange}
              style={{ width: "100%", padding: "8px", borderRadius: "4px", border: "1px solid #ddd" }}
            />
          </div>
          <div style={{ marginBottom: "10px" }}>
            <label>Emergency Contact:</label>
            <input
              type="text"
              name="Emergency_Contact"
              value={tenantFormData.Emergency_Contact}
              onChange={handleTenantFormChange}
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
              cursor: "pointer",
            }}
          >
            {tenantFormData.tenant_id ? "Update Tenant" : "Create Tenant"}
          </button>
        </form>
      )}

      {/* Tenants Table */}
      <table style={{ width: "100%", borderCollapse: "collapse", border: "1px solid #ddd" }}>
        <thead>
          <tr>
            <th style={{ padding: "10px", border: "1px solid #ddd", backgroundColor: "#f1f1f1" }}>First Name</th>
            <th style={{ padding: "10px", border: "1px solid #ddd", backgroundColor: "#f1f1f1" }}>Last Name</th>
            <th style={{ padding: "10px", border: "1px solid #ddd", backgroundColor: "#f1f1f1" }}>Email</th>
            <th style={{ padding: "10px", border: "1px solid #ddd", backgroundColor: "#f1f1f1" }}>Phone</th>
            <th style={{ padding: "10px", border: "1px solid #ddd", backgroundColor: "#f1f1f1" }}>Room Number</th>
            <th style={{ padding: "10px", border: "1px solid #ddd", backgroundColor: "#f1f1f1" }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {Array.isArray(tenants) && tenants.length === 0 ? (
            <tr>
              <td colSpan="6" style={{ textAlign: "center", padding: "10px" }}>
                No tenants available
              </td>
            </tr>
          ) : (
            tenants.map((tenant) => (
              <tr key={tenant.tenant_id}>
                <td style={{ padding: "10px", border: "1px solid #ddd" }}>{tenant.first_name}</td>
                <td style={{ padding: "10px", border: "1px solid #ddd" }}>{tenant.last_name}</td>
                <td style={{ padding: "10px", border: "1px solid #ddd" }}>{tenant.email}</td>
                <td style={{ padding: "10px", border: "1px solid #ddd" }}>{tenant.phone_number}</td>
                <td style={{ padding: "10px", border: "1px solid #ddd" }}>{tenant.room_number}</td>
                <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                  <button
                    onClick={() => handleEditTenant(tenant.tenant_id)}
                    style={{
                      backgroundColor: "#ffc107",
                      color: "#000",
                      padding: "5px 10px",
                      border: "none",
                      borderRadius: "4px",
                      cursor: "pointer",
                      marginRight: "5px",
                    }}
                  >
                    <FaEdit />
                  </button>
                  <button
                    onClick={() => handleDeleteTenant(tenant.tenant_id)}
                    style={{
                      backgroundColor: "#dc3545",
                      color: "#fff",
                      padding: "5px 10px",
                      border: "none",
                      borderRadius: "4px",
                      cursor: "pointer",
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

export default TenantManagement;