import React, { useContext, useState, useEffect } from "react";
import axios from "axios";
import { HamContext } from "../HamContextProvider";
import { useNavigate } from "react-router-dom";

function Dashboard(props) {
  console.log("Dashboard component rendered"); // Debugging log
  const { hamActive, hamHandler } = useContext(HamContext);
  const [forBox, setForBox] = useState([]);
  const [loading, setLoading] = useState(true); // Loading state
  const [error, setError] = useState(null); // Error state
  const navigate = useNavigate();

  // Fetching dashboard information based on user type
  const getBoxInfo = async () => {
    const whom = JSON.parse(window.localStorage.getItem("whom")).userType;
    try {
      const res = await axios.post(`http://localhost:5000/dashboard/${whom}`, {
        userId: JSON.parse(window.localStorage.getItem("whom")).username,
      });

      if (res.data) {
        if (whom === "admin") {
          const forAdminBox = [
            { "Total Owners": res.data.totalowner },
            { "Total Tenants": res.data.totaltenant },
            { "Total Employees": res.data.totalemployee },
          ];
          setForBox(forAdminBox);
        }
        if (whom === "owner") {
          const forOwnerBox = [
            { "No of Employees": res.data.totalemployee },
            { "Total Complaints": res.data.totalcomplaint },
          ];
          setForBox(forOwnerBox);
        }
        if (whom === "employee") {
          const forEmployeeBox = [
            { "Total Complaints": res.data.totalcomplaint },
            { Salary: "Rs. " + res.data.salary },
          ];
          setForBox(forEmployeeBox);
        }
        if (whom === "tenant") {
          const forTenantBox = [
            { "Tenant ID": res.data[0].tenant_id },
            { "Tenant Name": res.data[0].name },
            { "Tenant Age": res.data[0].age },
            { DOB: res.data[0].dob },
            { "Room No": res.data[0].room_no },
          ];
          setForBox(forTenantBox);
        }
      }
    } catch (error) {
      console.log(error);
      setError("Error fetching dashboard data.");
    } finally {
      setLoading(false); // Set loading to false once the data is fetched
    }
  };

  useEffect(() => {
    getBoxInfo();
  }, []);

  // Handle box click based on the key value
  const handleBoxClick = (key) => {
    switch (key) {
      case "Total Owners":
        navigate("/OwnerDetails");
        break;
      case "Total Tenants":
        navigate("/admin/tenants");
        break;
      case "Total Employees":
        navigate("/admin/employees");
        break;
      case "No of Employees":
        navigate("/owner/employees");
        break;
      case "Total Complaints":
        navigate("/complaints");
        break;
      case "Tenant ID":
        navigate("/tenant/profile");
        break;
      default:
        console.log("No action for this box");
    }
  };

  return (
    <div
      onClick={() => {
        if (hamActive === true) {
          hamHandler();
        }
      }}
      style={{
        filter: hamActive ? "blur(2px)" : "blur(0px)",
        backgroundColor: "#f8f9fa",
        minHeight: "100vh",
        padding: "20px",
      }}
      className="w-screen"
    >
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
          gap: "20px",
        }}
      >
        {/* Loading, Error, and Data rendering */}
        {loading ? (
          <div>Loading...</div> // Show loading while fetching data
        ) : error ? (
          <div className="text-red-500">{error}</div> // Show error if fetching fails
        ) : (
          forBox.map((ele, index) => (
            <div
              key={index + 1}
              style={{
                padding: "20px",
                border: "2px solid #007bff",
                borderRadius: "10px",
                backgroundColor: "#ffffff",
                boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
                transition: "transform 0.2s ease-in-out",
                cursor: "pointer",
              }}
              onClick={() => handleBoxClick(Object.keys(ele)[0])}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "scale(1.05)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "scale(1)";
              }}
            >
              <h1
                style={{
                  fontSize: "24px",
                  fontWeight: "bold",
                  textAlign: "center",
                  color: "#007bff",
                }}
              >
                {Object.values(ele)}
              </h1>
              <p
                style={{
                  fontSize: "16px",
                  fontWeight: "bold",
                  textAlign: "center",
                  color: "#6c757d",
                  marginTop: "10px",
                  textTransform: "capitalize",
                }}
              >
                {Object.keys(ele)}
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default Dashboard;
