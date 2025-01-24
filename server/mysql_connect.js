const mysql = require('mysql2');
const config = require('./config_sql');

// Establish connection to MySQL
const connection = mysql.createConnection({
  host: config.host,
  user: config.user,
  password: config.password,
  database: config.database
});

// Test the database connection
connection.connect((err) => {
  if (err) {
    console.error('Error connecting to the database:', err.message);
    return;
  }
  console.log('Connected to the MySQL database!');
});

// Register a complaint for a block
function registerComplaint(values, callback) {
  const sql = 'UPDATE block SET complaints = ? WHERE block_no = ? AND room_no = ?';
  connection.query(sql, values, (err, results) => callback(err, results));
}

// Create a new room
function createRoom(values, callback) {
  const query = "INSERT INTO Rooms (branch_id, room_number, room_type, rent_amount, status, created_by) VALUES (?, ?, ?, ?, ?, ?)";
  connection.query(query, values, callback);
}

// Update an existing room
function updateRoom(values, callback) {
  const query = "UPDATE Rooms SET room_number = ?, room_type = ?, rent_amount = ?, status = ?, updated_by = ? WHERE room_id = ?";
  connection.query(query, values, callback);
}

// Delete a room
function deleteRoom(room_id, callback) {
  const query = "DELETE FROM Rooms WHERE room_id = ?";
  connection.query(query, [room_id], callback);
}

// Get room details for a specific branch
function getRoomsByBranch(branch_id, callback) {
  const query = "SELECT * FROM Rooms WHERE branch_id = ?";
  connection.query(query, [branch_id], callback);
}

// Fetch data from a given table
function getData(tableName, callback) {
  const sql = `SELECT * FROM ${tableName};`;
  connection.query(sql, (err, results) => callback(err, results));
}

// Calculate the total number of tenants
function totalTenant(callback) {
  const sql = 'SELECT COUNT(tenant_id) AS total FROM tenant';
  connection.query(sql, (err, results) => callback(err, results));
}

// Calculate the total number of employees
function totalEmployee(callback) {
  const sql = 'SELECT COUNT(emp_id) AS total FROM employee';
  connection.query(sql, (err, results) => callback(err, results));
}

// Calculate the total number of complaints
function totalComplaint(callback) {
  const sql = 'SELECT COUNT(complaints) AS total FROM block';
  connection.query(sql, (err, results) => callback(err, results));
}

// View all complaints
function viewComplaints(callback) {
  const sql = 'SELECT * FROM complaints';
  connection.query(sql, (err, results) => callback(err, results));
}

// Authorize user based on username and password
function authorizeUser(username, password, callback) {
  const sql = 'SELECT password FROM auth WHERE user_id = ?';
  connection.query(sql, [username], (err, results) => {
    if (results.length === 0) {
      callback(err, "denied");
    } else {
      if (results[0].password === password) {
        callback(err, "granted");
      } else {
        callback(err, "denied");
      }
    }
  });
}

// Create a new branch
function createBranch(values, callback) {
  const sql = "INSERT INTO branches (branch_name, manager, rooms_available, rooms_empty, rooms_occupied) VALUES (?, ?, ?, ?, ?)";
  connection.query(sql, values, callback);
}

// Update branch details
function updateBranch(values, callback) {
  const sql = "UPDATE branches SET branch_name = ?, manager = ?, rooms_available = ?, rooms_empty = ?, rooms_occupied = ? WHERE branch_id = ?";
  connection.query(sql, values, callback);
}

// Delete a branch
function deleteBranch(branch_id, callback) {
  const sql = "DELETE FROM branches WHERE branch_id = ?";
  connection.query(sql, [branch_id], callback);
}

module.exports = {
  connection,
  registerComplaint,
  createRoom,
  updateRoom,
  deleteRoom,
  getRoomsByBranch,
  getData,
  totalTenant,
  totalEmployee,
  totalComplaint,
  viewComplaints,
  authorizeUser,
  createBranch,
  updateBranch,
  deleteBranch
};
