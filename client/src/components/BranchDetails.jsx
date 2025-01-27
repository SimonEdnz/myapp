import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom"; // Import Link
import axios from "axios";
import { FaArrowLeft, FaPlus, FaEdit, FaTrash } from "react-icons/fa";

const BranchDetails = () => {
  const { branchId } = useParams(); // Get branchId from the URL
  const navigate = useNavigate();
  const [branch, setBranch] = useState(null);
  const [rooms, setRooms] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showRoomForm, setShowRoomForm] = useState(false);
  const [roomFormData, setRoomFormData] = useState({
    room_id: "", // Added to track the room being edited
    room_number: "",
    room_type: "",
    price: "",
    status: "available",
    tenant_id: "",
    created_by: "admin",
    updated_by: "admin",
  });

  // Fetch branch details from the backend
  const fetchBranchDetails = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/branches/${branchId}`);
      if (response.data) {
        setBranch(response.data); // Set the fetched branch data
      } else {
        setError("Branch not found"); // Handle case where no data is returned
      }
    } catch (error) {
      setError("Error fetching branch details");
      console.error("Error fetching branch details:", error);
    } finally {
      setLoading(false); // Stop loading
    }
  };

  // Fetch rooms for the branch
  const fetchRooms = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/branches/${branchId}/rooms`);
      setRooms(response.data); // Set the fetched rooms
    } catch (error) {
      console.error("Error fetching rooms:", error);
    }
  };

  // Handle room edit
  const handleEditRoom = (roomId) => {
    const roomToEdit = rooms.find((room) => room.room_id === roomId);
    if (roomToEdit) {
      setRoomFormData({
        room_id: roomToEdit.room_id, // Set the room_id for editing
        room_number: roomToEdit.room_number,
        room_type: roomToEdit.room_type,
        price: roomToEdit.price,
        status: roomToEdit.status,
        tenant_id: roomToEdit.tenant_id,
        created_by: "admin",
        updated_by: "admin",
      });
      setShowRoomForm(true); // Show the form
    }
  };

  // Handle room deletion with confirmation
  const handleDeleteRoom = async (roomId) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this room?");
    if (confirmDelete) {
      try {
        const response = await axios.delete(
          `http://localhost:5000/branches/${branchId}/rooms/${roomId}`
        );
        if (response.status === 200) {
          fetchRooms(); // Refresh the rooms list
        }
      } catch (error) {
        console.error("Error deleting room:", error);
      }
    }
  };

  // Handle form input changes
  const handleRoomFormChange = (e) => {
    const { name, value } = e.target;
    setRoomFormData({
      ...roomFormData,
      [name]: value,
    });
  };

  // Handle room form submission (create or update)
  const handleRoomFormSubmit = async (e) => {
    e.preventDefault();
    try {
      if (roomFormData.room_id) {
        // Update existing room
        const response = await axios.put(
          `http://localhost:5000/branches/${branchId}/rooms/${roomFormData.room_id}`,
          roomFormData
        );
        if (response.status === 200) {
          fetchRooms(); // Refresh the rooms list
          setRoomFormData({
            room_id: "",
            room_number: "",
            room_type: "",
            price: "",
            status: "available",
            tenant_id: "",
            created_by: "admin",
            updated_by: "admin",
          });
          setShowRoomForm(false); // Hide the form
        }
      } else {
        // Create new room
        const response = await axios.post(
          `http://localhost:5000/branches/${branchId}/rooms`,
          roomFormData
        );
        if (response.status === 201) {
          fetchRooms(); // Refresh the rooms list
          setRoomFormData({
            room_id: "",
            room_number: "",
            room_type: "",
            price: "",
            status: "available",
            tenant_id: "",
            created_by: "admin",
            updated_by: "admin",
          });
          setShowRoomForm(false); // Hide the form
        }
      }
    } catch (error) {
      console.error("Error handling room form:", error);
    }
  };

  // Fetch branch details and rooms when the component mounts
  useEffect(() => {
    fetchBranchDetails();
    fetchRooms();
  }, [branchId]);

  // Display loading state
  if (loading) {
    return (
      <div style={{ textAlign: "center", padding: "20px" }}>
        <p>Loading branch details...</p>
      </div>
    );
  }

  // Display error state
  if (error) {
    return (
      <div style={{ textAlign: "center", padding: "20px" }}>
        <p style={{ color: "red" }}>{error}</p>
        <button onClick={() => navigate(-1)}>Go Back</button>
      </div>
    );
  }

  return (
    <div style={{ padding: "20px", maxWidth: "1200px", margin: "auto" }}>
      <button
        onClick={() => navigate(-1)}
        style={{
          backgroundColor: "transparent",
          border: "none",
          color: "#007bff",
          fontSize: "16px",
          display: "flex",
          alignItems: "center",
          marginBottom: "20px",
          cursor: "pointer",
        }}
      >
        <FaArrowLeft style={{ marginRight: "8px" }} />
        Back to Branches
      </button>

      <h2 style={{ textAlign: "center", color: "#007bff", marginBottom: "20px" }}>
        {branch.branch_name} - Details
      </h2>

      {/* Branch Details Table */}
      <table style={{ width: "100%", borderCollapse: "collapse", border: "1px solid #ddd", marginBottom: "20px" }}>
        <tbody>
          <tr>
            <td style={{ padding: "10px", border: "1px solid #ddd", fontWeight: "bold" }}>Branch ID:</td>
            <td style={{ padding: "10px", border: "1px solid #ddd" }}>{branch.branch_id}</td>
          </tr>
          <tr>
            <td style={{ padding: "10px", border: "1px solid #ddd", fontWeight: "bold" }}>Branch Name:</td>
            <td style={{ padding: "10px", border: "1px solid #ddd" }}>{branch.branch_name}</td>
          </tr>
          <tr>
            <td style={{ padding: "10px", border: "1px solid #ddd", fontWeight: "bold" }}>Manager:</td>
            <td style={{ padding: "10px", border: "1px solid #ddd" }}>{branch.manager}</td>
          </tr>
          <tr>
            <td style={{ padding: "10px", border: "1px solid #ddd", fontWeight: "bold" }}>Total Rooms:</td>
            <td style={{ padding: "10px", border: "1px solid #ddd" }}>{branch.rooms_available + branch.rooms_occupied}</td>
          </tr>
          <tr>
            <td style={{ padding: "10px", border: "1px solid #ddd", fontWeight: "bold" }}>Rooms Available:</td>
            <td style={{ padding: "10px", border: "1px solid #ddd" }}>{branch.rooms_available}</td>
          </tr>
          <tr>
            <td style={{ padding: "10px", border: "1px solid #ddd", fontWeight: "bold" }}>Rooms Occupied:</td>
            <td style={{ padding: "10px", border: "1px solid #ddd" }}>{branch.rooms_occupied}</td>
          </tr>
        </tbody>
      </table>

      {/* Room Management Section */}
      <div>
        <h3 style={{ color: "#007bff", marginBottom: "10px" }}>Rooms</h3>
        <button
          onClick={() => setShowRoomForm(!showRoomForm)}
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
          {showRoomForm ? "Hide Room Form" : "Add New Room"}
        </button>

        {/* Room Creation/Edit Form */}
        {showRoomForm && (
          <form onSubmit={handleRoomFormSubmit} style={{ marginBottom: "20px" }}>
            <div style={{ marginBottom: "10px" }}>
              <label>Room Number:</label>
              <input
                type="text"
                name="room_number"
                value={roomFormData.room_number}
                onChange={handleRoomFormChange}
                required
                style={{ width: "100%", padding: "8px", borderRadius: "4px", border: "1px solid #ddd" }}
              />
            </div>
            <div style={{ marginBottom: "10px" }}>
              <label>Room Type:</label>
              <input
                type="text"
                name="room_type"
                value={roomFormData.room_type}
                onChange={handleRoomFormChange}
                placeholder="Enter room type"
                style={{
                  width: "100%",
                  padding: "8px",
                  borderRadius: "4px",
                  border: "1px solid #ddd",
                }}
              />
            </div>
            <div style={{ marginBottom: "10px" }}>
              <label>Rent Amount:</label>
              <input
                type="number"
                name="price"
                value={roomFormData.price}
                onChange={handleRoomFormChange}
                required
                style={{ width: "100%", padding: "8px", borderRadius: "4px", border: "1px solid #ddd" }}
              />
            </div>
            <div style={{ marginBottom: "10px" }}>
              <label>Status:</label>
              <select
                name="status"
                value={roomFormData.status}
                onChange={handleRoomFormChange}
                style={{ width: "100%", padding: "8px", borderRadius: "4px", border: "1px solid #ddd" }}
              >
                <option value="available">Available</option>
                <option value="occupied">Occupied</option>
              </select>
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
              {roomFormData.room_id ? "Update Room" : "Create Room"}
            </button>
          </form>
        )}

        {/* Rooms Table */}
        <table style={{ width: "100%", borderCollapse: "collapse", border: "1px solid #ddd" }}>
          <thead>
            <tr>
              <th style={{ padding: "10px", border: "1px solid #ddd", backgroundColor: "#f1f1f1" }}>Room Number</th>
              <th style={{ padding: "10px", border: "1px solid #ddd", backgroundColor: "#f1f1f1" }}>Room Type</th>
              <th style={{ padding: "10px", border: "1px solid #ddd", backgroundColor: "#f1f1f1" }}>Price</th>
              <th style={{ padding: "10px", border: "1px solid #ddd", backgroundColor: "#f1f1f1" }}>Status</th>
              <th style={{ padding: "10px", border: "1px solid #ddd", backgroundColor: "#f1f1f1" }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {rooms.map((room) => (
              <tr key={room.room_id}>
                <td style={{ padding: "10px", border: "1px solid #ddd" }}>{room.room_number}</td>
                <td style={{ padding: "10px", border: "1px solid #ddd" }}>{room.room_type}</td>
                <td style={{ padding: "10px", border: "1px solid #ddd" }}>${room.price}</td>
                <td style={{ padding: "10px", border: "1px solid #ddd" }}>{room.status}</td>
                <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                  <button
                    onClick={() => handleEditRoom(room.room_id)}
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
                    onClick={() => handleDeleteRoom(room.room_id)}
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
            ))}
          </tbody>
        </table>
      </div>

      <div style={{ marginTop: "20px" }}>
        <Link to={`/admin/branches/${branch.branch_id}/details/tenants`}
          style={{
            backgroundColor: "#007bff",
            color: "#fff",
            padding: "10px 20px",
            borderRadius: "4px",
            textDecoration: "none",
            display: "inline-block",
          }}
        >
          Manage Tenants
        </Link>
      </div>
    </div>
  );
};

export default BranchDetails;