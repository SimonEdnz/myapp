const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const db = require("./mysql_connect");

const app = express();
const port = 5000;

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());

// Home Page
app.get("/", (req, res) => {
  res.send("Only accepting GET and POST requests!");
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

// Register Complaint
app.post("/raisingcomplaint", (req, res) => {
  const { descp, blockno, roomno } = req.body;
  const values = [descp, blockno, roomno];

  db.registerComplaint(values, (err, result) => {
    if (err) return res.status(500).send(err);
    res.send(result);
  });
});

// View Complaints
app.get("/viewcomplaints", (req, res) => {
  db.viewComplaints((err, result) => {
    if (err) return res.status(500).send(err);
    res.send(result);
  });
});

// Branch Management
app.route("/branches")
  .get((req, res) => {
    db.getData("branches", (err, result) => {
      if (err) return res.status(500).send(err);
      res.send(result);
    });
  })
  .post((req, res) => {
    const { branch_name, manager, rooms_available, rooms_empty, rooms_occupied } = req.body;
    const values = [branch_name, manager, rooms_available, rooms_empty, rooms_occupied];

    db.createBranch(values, (err, result) => {
      if (err) return res.status(500).send(err);
      res.sendStatus(201);
    });
  });

app.route("/branches/:branch_id")
  .put((req, res) => {
    const { branch_id } = req.params;
    const { branch_name, manager, rooms_available, rooms_empty, rooms_occupied } = req.body;
    const values = [branch_name, manager, rooms_available, rooms_empty, rooms_occupied, branch_id];

    db.updateBranch(values, (err, result) => {
      if (err) return res.status(500).send(err);
      res.sendStatus(200);
    });
  })
  .delete((req, res) => {
    const { branch_id } = req.params;

    db.deleteBranch(branch_id, (err, result) => {
      if (err) return res.status(500).send(err);
      res.sendStatus(200);
    });
  });

// Room Management
app.route("/branches/:branch_id/rooms")
  .get((req, res) => {
    const { branch_id } = req.params;

    db.getRoomsByBranch(branch_id, (err, result) => {
      if (err) return res.status(500).send(err);
      res.send(result);
    });
  });

app.route("/rooms")
  .post((req, res) => {
    const { branch_id, room_number, room_type, rent_amount, status, created_by } = req.body;
    const values = [branch_id, room_number, room_type, rent_amount, status, created_by];

    db.createRoom(values, (err, result) => {
      if (err) return res.status(500).send(err);
      res.sendStatus(201);
    });
  });

app.route("/rooms/:room_id")
  .put((req, res) => {
    const { room_id } = req.params;
    const { room_number, room_type, rent_amount, status, updated_by } = req.body;
    const values = [room_number, room_type, rent_amount, status, updated_by, room_id];

    db.updateRoom(values, (err, result) => {
      if (err) return res.status(500).send(err);
      res.sendStatus(200);
    });
  })
  .delete((req, res) => {
    const { room_id } = req.params;

    db.deleteRoom(room_id, (err, result) => {
      if (err) return res.status(500).send(err);
      res.sendStatus(200);
    });
  });

// Tenant Management
app.route("/tenants")
  .get((req, res) => {
    db.getData("tenants", (err, result) => {
      if (err) return res.status(500).send(err);
      res.send(result);
    });
  })
  .post((req, res) => {
    const { first_name, last_name, phone, email, address, date_of_birth, occupation, emergency_contact, created_by } = req.body;
    const values = [first_name, last_name, phone, email, address, date_of_birth, occupation, emergency_contact, created_by];

    db.createRoom(values, (err, result) => {
      if (err) return res.status(500).send(err);
      res.sendStatus(201);
    });
  });

app.route("/tenants/:tenant_id")
  .put((req, res) => {
    const { tenant_id } = req.params;
    const { first_name, last_name, phone, email, address, date_of_birth, occupation, emergency_contact, updated_by } = req.body;
    const values = [first_name, last_name, phone, email, address, date_of_birth, occupation, emergency_contact, updated_by, tenant_id];

    db.updateRoom(values, (err, result) => {
      if (err) return res.status(500).send(err);
      res.sendStatus(200);
    });
  })
  .delete((req, res) => {
    const { tenant_id } = req.params;

    db.deleteRoom(tenant_id, (err, result) => {
      if (err) return res.status(500).send(err);
      res.sendStatus(200);
    });
  });

// Invalid URL Fallback
app.get("*", (req, res) => {
  res.send("Invalid URL.");
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
