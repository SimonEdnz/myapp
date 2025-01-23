import axios from "axios";
import React, { useState, useEffect } from "react";

function ParkingSlot(props) {
  const [parkingSlot, setParkingSlot] = useState([]);

  const slots = async () => {
    try {
      const res = await axios.post("http://localhost:5000/viewparking", {
        userId: JSON.parse(localStorage.getItem("whom")).username,
      });
      setParkingSlot(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    slots();
  }, []);

  return (
    <div>
      <div>
        <h1 style={{ marginLeft: '8px', fontSize: '1.125rem', marginBottom: '8px', fontWeight: 'bold' }}>
          Parking Slot
        </h1>
      </div>
      <div style={{ display: 'flex' }}>
        {parkingSlot.map((ele, index) => {
          if (ele.parking_slot === null) {
            return (
              <div
                key={index + 1}
                style={{ width: '100%', height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}
              >
                <h1 style={{ fontWeight: '500', fontSize: '1.125rem' }}>
                  No parking slot alloted
                </h1>
              </div>
            );
          } else {
            return (
              <div
                key={index + 1}
                style={{ padding: '20px', border: '2px solid', margin: '8px' }}
              >
                <h1>Slot no</h1>
                <p>{ele.parking_slot}</p>
              </div>
            );
          }
        })}
      </div>
    </div>
  );
}

export default ParkingSlot;