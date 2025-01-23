import axios from "axios";
import React, { useContext, useState, useEffect } from "react";
import { HamContext } from "../HamContextProvider";
import { useNavigate } from "react-router-dom";

function Dashboard(props) {
  const { hamActive, hamHandler } = useContext(HamContext);
  const [forBox, setForBox] = useState();
  const navigate = useNavigate();

  const getBoxInfo = async () => {
    const whom = JSON.parse(window.localStorage.getItem("whom")).userType;
    try {
      const res = await axios.post(`http://localhost:5000/dashboard/${whom}`, {
        userId: JSON.parse(window.localStorage.getItem("whom")).username,
      });
      if (whom === "admin") {
        const forAdminBox = [
          { "Total Owners": 59 },
          { "Total Tenants": 39 },
          { "Total Employees": 20 },
        ];
        forAdminBox[0]["Total Owners"] = res.data.totalowner;
        forAdminBox[2]["Total Employees"] = res.data.totalemployee;
        forAdminBox[1]["Total Tenants"] = res.data.totaltenant;
        setForBox(forAdminBox);
      }
      if (whom === "owner") {
        const forOwnerBox = [
          { "No of Employees": 5 },
          { "Total Complaints": 2 },
        ];
        forOwnerBox[0]["No of Employees"] = res.data.totalemployee;
        forOwnerBox[1]["Total Complaints"] = res.data.totalcomplaint;
        setForBox(forOwnerBox);
      }
      if (whom === "employee") {
        const forEmployeeBox = [
          { "Total Complaints": 31 },
          { Salary: "Rs. 20,0000" },
        ];
        forEmployeeBox[0]["Total Complaints"] = res.data.totalcomplaint;
        forEmployeeBox[1].Salary = "Rs. " + res.data.salary;
        setForBox(forEmployeeBox);
      }
      if (whom === "tenant") {
        const forTenantBox = [
          { "Tenant ID": 12132 },
          { "Tenant Name": "Tharun" },
          { "Tenant Age": 20 },
          { DOB: "12-1-2002" },
          { "Room No": 123456 },
        ];
        forTenantBox[0]["Tenant ID"] = res.data[0].tenant_id;
        forTenantBox[1]["Tenant Name"] = res.data[0].name;
        forTenantBox[2]["Tenant Age"] = res.data[0].age;
        forTenantBox[3].DOB = res.data[0].dob;
        forTenantBox[4]["Room No"] = res.data[0].room_no;
        setForBox(forTenantBox);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getBoxInfo();
  }, []);

  const handleBoxClick = (key) => {
    // Navigate to specific pages based on the box key
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
        {forBox &&
          forBox.map((ele, index) => {
            return (
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
            );
          })}
      </div>
    </div>
  );
}

export default Dashboard;
