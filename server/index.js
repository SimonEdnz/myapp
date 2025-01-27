const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const db = require("./mysql_connect");

const app = express();
const port = 5000;

// Middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());

// Home Page
app.get("/", (req, res) => {
  res.send("Rental Management System API");
});

// Authorization
app.post("/auth", (req, res) => {
  const { username, password } = req.body;

  if (!username || !password || password.length < 6) {
    return res.send({ user: "passunknown" });
  }

  const firstChar = username.toUpperCase().charAt(0);
  const userTypeMap = { E: "employee", A: "admin", T: "tenant", O: "owner" };
  const userType = userTypeMap[firstChar] || "unknown";

  db.authorizeUser(username, password, (err, result) => {
    if (err) return res.status(500).send(err);
    res.send({ access: result, user: userType });
  });
});

// Complaints Routes
app.route("/complaints")
  .post((req, res) => {
    const { descp, blockno, roomno } = req.body;
    const values = [descp, blockno, roomno];

    db.registerComplaint(values, (err, result) => {
      if (err) return res.status(500).send(err);
      res.send(result);
    });
  })
  .get((req, res) => {
    db.viewComplaints((err, result) => {
      if (err) return res.status(500).send(err);
      res.send(result);
    });
  });

// Branches Routes
app.route("/branches")
  .get((req, res) => {
    db.getAllBranches((err, results) => {
      if (err) {
        console.error("Error fetching branches:", err.message);
        return res.status(500).send({ error: "Error fetching branches", details: err.message });
      }
      res.send(results);
    });
  })
  .post((req, res) => {
    const { branch_name, manager, rooms_available, rooms_empty, rooms_occupied } = req.body;
    const values = [branch_name, manager, rooms_available, rooms_empty, rooms_occupied];

    db.createBranch(values, (err, result) => {
      if (err) {
        console.error("Error creating branch:", err.message);
        return res.status(500).send({ error: "Error creating branch", details: err.message });
      }
      res.status(201).send({ message: "Branch created successfully", branchId: result.insertId });
    });
  });

app.route("/branches/:branchId")
  .get((req, res) => {
    const { branchId } = req.params;

    const branchQuery = `SELECT * FROM branches WHERE branch_id = ?`;
    const roomsAvailableQuery = `SELECT COUNT(*) AS rooms_available FROM rooms WHERE branch_id = ? AND status = 'available'`;
    const roomsOccupiedQuery = `SELECT COUNT(*) AS rooms_occupied FROM rooms WHERE branch_id = ? AND status = 'occupied'`;

    db.query(branchQuery, [branchId], (err, branchResult) => {
      if (err) {
        console.error("Error fetching branch details:", err.message);
        return res.status(500).send({ error: "Error fetching branch details", details: err.message });
      }

      if (branchResult.length === 0) {
        return res.status(404).send({ error: "Branch not found" });
      }

      const branch = branchResult[0];

      db.query(roomsAvailableQuery, [branchId], (err, availableResult) => {
        if (err) {
          console.error("Error fetching available rooms count:", err.message);
          return res.status(500).send({ error: "Error fetching available rooms count", details: err.message });
        }

        db.query(roomsOccupiedQuery, [branchId], (err, occupiedResult) => {
          if (err) {
            console.error("Error fetching occupied rooms count:", err.message);
            return res.status(500).send({ error: "Error fetching occupied rooms count", details: err.message });
          }

          branch.rooms_available = availableResult[0].rooms_available;
          branch.rooms_occupied = occupiedResult[0].rooms_occupied;

          res.send(branch);
        });
      });
    });
  })
  .put((req, res) => {
    const { branchId } = req.params;
    const { branch_name, manager, rooms_available, rooms_empty, rooms_occupied } = req.body;
    const values = [branch_name, manager, rooms_available, rooms_empty, rooms_occupied, branchId];

    db.updateBranch(values, (err, result) => {
      if (err) {
        console.error("Error updating branch:", err.message);
        return res.status(500).send({ error: "Error updating branch", details: err.message });
      }
      res.send({ message: "Branch updated successfully" });
    });
  })
  .delete((req, res) => {
    const { branchId } = req.params;

    db.deleteBranch(branchId, (err, result) => {
      if (err) {
        console.error("Error deleting branch:", err.message);
        return res.status(500).send({ error: "Error deleting branch", details: err.message });
      }
      res.send({ message: "Branch deleted successfully" });
    });
  });

// Rooms Routes
app.route("/branches/:branchId/rooms")
  .get((req, res) => {
    const { branchId } = req.params;

    db.getRoomsByBranch(branchId, (err, results) => {
      if (err) {
        console.error("Error fetching rooms:", err.message);
        return res.status(500).send({ error: "Error fetching rooms", details: err.message });
      }
      res.send(results);
    });
  })
  .post((req, res) => {
    const { branchId } = req.params;
    const { room_number, room_type, price, status, tenant_id, created_by, updated_by } = req.body;

    if (!room_number || !room_type || !price || !status || !created_by || !updated_by) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const query = `
      INSERT INTO rooms (branch_id, room_number, room_type, price, status, tenant_id, created_by, updated_by)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const values = [
      branchId,
      room_number,
      room_type,
      price,
      status === "available" ? "available" : "occupied",
      tenant_id || null,
      created_by,
      updated_by,
    ];

    db.query(query, values, (err, results) => {
      if (err) {
        console.error("Error creating room:", err);
        return res.status(500).json({ error: "Database error" });
      }
      res.status(201).json({ message: "Room created successfully", roomId: results.insertId });
    });
  });

app.route("/branches/:branchId/rooms/:roomId")
  .put((req, res) => {
    const { branchId, roomId } = req.params;
    const { room_number, room_type, price, status, tenant_id, updated_by } = req.body;

    if (!room_number || !room_type || !price || !status || !updated_by) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const query = `
      UPDATE rooms 
      SET room_number = ?, room_type = ?, price = ?, status = ?, tenant_id = ?, updated_by = ?
      WHERE room_id = ? AND branch_id = ?
    `;

    const values = [
      room_number,
      room_type,
      price,
      status,
      tenant_id || null,
      updated_by,
      roomId,
      branchId,
    ];

    db.query(query, values, (err, results) => {
      if (err) {
        console.error("Error updating room:", err);
        return res.status(500).json({ error: "Database error" });
      }
      if (results.affectedRows === 0) {
        return res.status(404).json({ error: "Room not found" });
      }
      res.status(200).json({ message: "Room updated successfully" });
    });
  })
  .delete((req, res) => {
    const { branchId, roomId } = req.params;

    const query = `DELETE FROM rooms WHERE room_id = ? AND branch_id = ?`;

    db.query(query, [roomId, branchId], (err, results) => {
      if (err) {
        console.error("Error deleting room:", err);
        return res.status(500).json({ error: "Database error" });
      }
      if (results.affectedRows === 0) {
        return res.status(404).json({ error: "Room not found" });
      }
      res.status(200).json({ message: "Room deleted successfully" });
    });
  });

// Tenant management
  app.route("/tenants")
  .post((req, res) => {
    const {
      branch_id,
      first_name,
      last_name,
      email,
      phone_number,
      Gender,
      Age,
      room_number,
      move_in_date,
      move_out_date,
      rent_amount,
      deposit_amount,
      is_active,
      Emergency_Contact,
    } = req.body;

    const values = [
      branch_id,
      first_name,
      last_name,
      email,
      phone_number,
      Gender,
      Age,
      room_number,
      move_in_date,
      move_out_date,
      rent_amount,
      deposit_amount,
      is_active,
      Emergency_Contact,
    ];

    db.createTenant(values, (err, result) => {
      if (err) {
        console.error("Error creating tenant:", err.message);
        return res.status(500).send({ error: "Error creating tenant", details: err.message });
      }
      res.status(201).send({ message: "Tenant created successfully", tenantId: result.insertId });
    });
  });
// Fetch all tenants
app.get('/tenants', (req, res) => {
  db.getAllTenants((err, tenants) => {
    if (err) {
      console.error('Error fetching tenants:', err.message);
      return res.status(500).send({ error: 'Error fetching tenants', details: err.message });
    }
    res.send(tenants);
  });
});
const getAllTenants = (callback) => {
  connection.query('SELECT * FROM tenants', (err, results) => {
    if (err) {
      return callback(err);
    }
    callback(null, results);
  });
};module.exports = { getAllTenants };

// Update a tenant
app.route("/tenants/:tenant_id")
.put((req, res) => {
  const { tenant_id } = req.params;
  const {
    branch_id,
    first_name,
    last_name,
    email,
    phone_number,
    Gender,
    Age,
    room_number,
    move_in_date,
    move_out_date,
    rent_amount,
    deposit_amount,
    is_active,
    Emergency_Contact,
  } = req.body;

  const values = [
    branch_id,
    first_name,
    last_name,
    email,
    phone_number,
    Gender,
    Age,
    room_number,
    move_in_date,
    move_out_date,
    rent_amount,
    deposit_amount,
    is_active,
    Emergency_Contact,
    tenant_id,
  ];

  db.updateTenant(values, (err, result) => {
    if (err) {
      console.error("Error updating tenant:", err.message);
      return res.status(500).send({ error: "Error updating tenant", details: err.message });
    }
    res.send({ message: "Tenant updated successfully" });
  });
})
.delete((req, res) => {
  const { tenant_id } = req.params;

  db.deleteTenant(tenant_id, (err, result) => {
    if (err) {
      console.error("Error deleting tenant:", err.message);
      return res.status(500).send({ error: "Error deleting tenant", details: err.message });
    }
    res.send({ message: "Tenant deleted successfully" });
  });
});
// Create a Complaint
app.post('/complaints', (req, res) => {
  const { tenant_id, category_id, description } = req.body;
  db.createComplaint(tenant_id, category_id, description, (err, results) => {
    if (err) {
      console.error('Error creating complaint:', err);
      return res.status(500).send({ error: 'Error creating complaint', details: err.message });
    }
    res.status(201).send({ message: 'Complaint created successfully', complaintId: results.insertId });
  });
});

// Get All Complaints for a Tenant
app.get('/complaints/tenant/:tenant_id', (req, res) => {
  const { tenant_id } = req.params;
  db.getComplaintsByTenantId(tenant_id, (err, results) => {
    if (err) {
      console.error('Error fetching complaints:', err);
      return res.status(500).send({ error: 'Error fetching complaints', details: err.message });
    }
    res.send(results);
  });
});

// Update a Complaint Status
app.put('/complaints/:complaint_id', (req, res) => {
  const { complaint_id } = req.params;
  const { status, resolved_at } = req.body;
  db.updateComplaint(complaint_id, status, resolved_at, (err, results) => {
    if (err) {
      console.error('Error updating complaint:', err);
      return res.status(500).send({ error: 'Error updating complaint', details: err.message });
    }
    res.send({ message: 'Complaint updated successfully' });
  });
});

// Delete a Complaint
app.delete('/complaints/:complaint_id', (req, res) => {
  const { complaint_id } = req.params;
  db.deleteComplaint(complaint_id, (err, results) => {
    if (err) {
      console.error('Error deleting complaint:', err);
      return res.status(500).send({ error: 'Error deleting complaint', details: err.message });
    }
    res.send({ message: 'Complaint deleted successfully' });
  });
});

// Invalid URL Fallback
app.get("*", (req, res) => {
  res.send("Invalid URL.");
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});