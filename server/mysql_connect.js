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
  const query = `
    INSERT INTO Rooms (branch_id, room_number, room_type, price, status, created_by, updated_by)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `;
  connection.query(query, values, (err, results) => {
    if (err) {
      console.error('Error creating room:', err.message);
      return callback(err);
    }
    callback(null, results);
  });
}

function updateRoom(values, callback) {
  const query = `
    UPDATE Rooms 
    SET room_number = ?, room_type = ?, price = ?, status = ?, updated_by = ?
    WHERE room_id = ?
  `;
  connection.query(query, values, (err, results) => {
    if (err) {
      console.error('Error updating room:', err.message);
      return callback(err);
    }
    callback(null, results);
  });
}

// Delete a room
function deleteRoom(room_id, callback) {
  const query = 'DELETE FROM rooms WHERE room_id = ?';
  connection.query(query, [room_id], (err, results) => {
    if (err) {
      console.error('Error deleting room:', err.message);
      return callback(err);
    }
    callback(null, results);
  });
}
//get rooms by id
function getRoomsByBranch(branch_id, callback) {
  const query = 'SELECT * FROM rooms WHERE branch_id = ?';
  connection.query(query, [branch_id], (err, results) => {
    if (err) {
      console.error('Error fetching rooms by branch:', err.message);
      return callback(err);
    }
    callback(null, results);
  });
}

// Fetch data from a given table
function getData(tableName, callback) {
  const sql = `SELECT * FROM ${tableName}`;
  connection.query(sql, (err, results) => {
    if (err) {
      console.error(`Error fetching data from ${tableName}:`, err.message);
      return callback(err);
    }
    callback(null, results);
  });
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

// Fetch branch by ID
function getBranchById(branchId, callback) {
  const query = 'SELECT * FROM branches WHERE branch_id = ?';
  connection.query(query, [branchId], (err, results) => {
    if (err) {
      console.error('Error fetching branch by ID:', err.message);
      return callback(err);
    }
    callback(null, results[0]); // Return the first result (single branch)
  });
}

// Fetch all branches
function getAllBranches(callback) {
  const query = 'SELECT * FROM branches';
  connection.query(query, (err, results) => {
    if (err) {
      console.error('Error fetching branches:', err.message);
      return callback(err);
    }
    callback(null, results);
  });
}

// Create a new branch
function createBranch(values, callback) {
  const query = `
    INSERT INTO branches (branch_name, manager, rooms_available, rooms_empty, rooms_occupied)
    VALUES (?, ?, ?, ?, ?)
  `;
  connection.query(query, values, (err, results) => {
    if (err) {
      console.error('Error creating branch:', err.message);
      return callback(err);
    }
    callback(null, results);
  });
}

// Update branch details
function updateBranch(values, callback) {
  const query = `
    UPDATE branches 
    SET branch_name = ?, manager = ?, rooms_available = ?, rooms_empty = ?, rooms_occupied = ? 
    WHERE branch_id = ?
  `;
  connection.query(query, values, (err, results) => {
    if (err) {
      console.error('Error updating branch:', err.message);
      return callback(err);
    }
    callback(null, results);
  });
}

// Delete a branch
function deleteBranch(branchId, callback) {
  const query = 'DELETE FROM branches WHERE branch_id = ?';
  connection.query(query, [branchId], (err, results) => {
    if (err) {
      console.error('Error deleting branch:', err.message);
      return callback(err);
    }
    callback(null, results);
  });
}

// Create a new tenant
function createTenant(values, callback) {
  const query = `
    INSERT INTO tenants (
  branch_id, first_name, last_name, email, phone_number, Gender, Age, room_number,
  move_in_date, move_out_date, rent_amount, deposit_amount, is_active, Emergency_Contact
) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;
  connection.query(query, values, (err, results) => {
    if (err) {
      console.error('Error creating tenant:', err.message);
      return callback(err);
    }
    callback(null, results);
  });
}

// Update tenant details
function updateTenant(values, callback) {
  const query = `
    UPDATE tenants 
    SET 
      branch_id = ?, first_name = ?, last_name = ?, email = ?, phone_number = ?, Gender = ?, Age = ?,
      room_number = ?, move_in_date = ?, move_out_date = ?, rent_amount = ?, deposit_amount = ?,
      is_active = ?, Emergency_Contact = ?
    WHERE tenant_id = ?
  `;
  connection.query(query, values, (err, results) => {
    if (err) {
      console.error('Error updating tenant:', err.message);
      return callback(err);
    }
    callback(null, results);
  });
}

// Delete a tenant
function deleteTenant(tenantId, callback) {
  const query = 'DELETE FROM tenants WHERE tenant_id = ?';
  connection.query(query, [tenantId], (err, results) => {
    if (err) {
      console.error('Error deleting tenant:', err.message);
      return callback(err);
    }
    callback(null, results);
  });
}
// Get tenant by ID
function getTenantById(tenantId, callback) {
  const query = 'SELECT * FROM tenants WHERE tenant_id = ?';
  connection.query(query, [tenantId], (err, results) => {
    if (err) {
      console.error('Error fetching tenant by ID:', err.message);
      return callback(err);
    }
    callback(null, results[0]); // Return the first result (single tenant)
  });
}

// Get all tenants
function getAllTenants(callback) {
  const query = 'SELECT * FROM tenants';
  connection.query(query, (err, results) => {
    if (err) {
      console.error('Error fetching tenants:', err.message);
      return callback(err);
    }
    callback(null, results);
  });
}
 //Function to create a complaint
const createComplaint = (tenantId, categoryId, description, callback) => {
  const query = 'INSERT INTO complaints (tenant_id, category_id, description) VALUES (?, ?, ?)';
  connection.query(query, [tenantId, categoryId, description], (err, results) => {
    callback(err, results);
  });
};

// Function to get complaints by tenant ID
const getComplaintsByTenantId = (tenantId, callback) => {
  const query = 'SELECT * FROM complaints WHERE tenant_id = ?';
  connection.query(query, [tenantId], (err, results) => {
    callback(err, results);
  });
};

// Function to update a complaint
const updateComplaint = (complaintId, status, resolvedAt, callback) => {
  const query = 'UPDATE complaints SET status = ?, resolved_at = ? WHERE complaint_id = ?';
  connection.query(query, [status, resolvedAt, complaintId], (err, results) => {
    callback(err, results);
  });
};

// Function to delete a complaint
const deleteComplaint = (complaintId, callback) => {
  const query = 'DELETE FROM complaints WHERE complaint_id = ?';
  connection.query(query, [complaintId], (err, results) => {
    callback(err, results);
  });
};


module.exports = {
  connection,
  query: (sql, values, callback) => connection.query(sql, values, callback),
  registerComplaint,
  createRoom,
  updateRoom,
  deleteRoom,
  getRoomsByBranch,
  getData,
  createComplaint,
  getComplaintsByTenantId,
  updateComplaint,
  deleteComplaint,
  totalTenant,
  totalEmployee,
  totalComplaint,
  viewComplaints,
  authorizeUser,
  getBranchById,
  getAllBranches,
  createBranch,
  updateBranch,
  deleteBranch,
  createTenant,
  updateTenant,
  deleteTenant,
  getTenantById,
  getAllTenants,
};