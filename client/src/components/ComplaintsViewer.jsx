/* eslint-disable no-multi-str */
import React, { useEffect, useState } from "react";
import axios from "axios";

function ComplaintsViewer(props) {
  const [comps, setComps] = useState([]);
  const [loading, setLoading] = useState(true); // Loading state
  const [error, setError] = useState(null); // Error state

  // Fetch complaints from the server
  const getComplaints = async () => {
    try {
      const res = await axios.get("http://localhost:5000/viewcomplaints");
      console.log(res.data); // Debugging: log the response data

      if (Array.isArray(res.data)) {
        setComps(res.data); // Set complaints data if it's an array
      } else {
        setError("Invalid data format received.");
      }
    } catch (err) {
      console.error("Error fetching complaints:", err);
      setError("Error fetching complaints.");
    } finally {
      setLoading(false); // Set loading to false after fetching data
    }
  };

  // Fetch complaints when the component mounts
  useEffect(() => {
    getComplaints();
  }, []);

  return (
    <div className="p-5">
      {loading ? (
        <div>Loading...</div> // Show loading message while data is being fetched
      ) : error ? (
        <div className="text-red-500">{error}</div> // Show error message if there's an error
      ) : comps.length === 0 ? (
        <div>No complaints found.</div> // Show message if no complaints are available
      ) : (
        comps.map((ele, index) => {
          return (
            ele.complaints &&
            ele.room_no && (
              <div
                key={index + 1}
                className="border-2 my-3 border-gray-300 p-5 flex justify-evenly"
              >
                <div className="mx-3">
                  <h1 className="font-semibold capitalize text-center">Room No</h1>
                  <h2 className="text-center">{ele.room_no}</h2>
                </div>
                <div className="mx-3">
                  <h1 className="font-semibold capitalize text-center">Complaints</h1>
                  <h2 className="text-center">{ele.complaints}</h2>
                </div>
              </div>
            )
          );
        })
      )}
    </div>
  );
}

export default ComplaintsViewer;
