const mysql = require('mysql2');
const config = require('./config_sql');

const connection = mysql.createConnection({
    host: config.host,
    user: config.user,
    password: config.password,
    database: config.database
});

// Test the connection
connection.connect((err) => {
    if (err) {
        console.error('Error connecting to the database:', err.message);
        return;
    }
    console.log('Connected to the MySQL database!');
});

module.exports = connection;

// Register the complaint to the block 
function registercomplaint(values, callback) {
    const sql = 'UPDATE block SET complaints = ? WHERE block_no = ? AND room_no = ?';
    connection.query(sql, values, (err, results) => {
        callback(err, results);
    });
}

// Function to calculate total number of owners
function totalowner(callback) {
    const sql = 'SELECT COUNT(owner_id) FROM owner';
    connection.query(sql, (err, results) => {
        callback(err, results);
    });
}

// Get all the data from the table using table name
function getdata(tablename, callback) {
    const sql = `SELECT * FROM ${tablename};`;
    connection.query(sql, (err, results) => {
        callback(err, results);
    });
}

// Add an owner tuple to the table
function createowner(values, callback) {
    const sql = 'INSERT INTO owner VALUES (?, ?, ?, ?, ?, ?)';
    connection.query(sql, values, (err, results) => {
        callback(err, results);
    });
}

// Function to create an owner proof
function createownerproof(values, callback) {
    const sql = 'INSERT INTO identity VALUES (?, ?, null)';
    connection.query(sql, values, (err, results) => {
        callback(err, results);
    });
}

// Book a parking slot for the tenant
function bookslot(values, callback) {
    const sql = 'UPDATE room SET parking_slot = ? WHERE room_no = ?';
    connection.query(sql, values, (err, results) => {
        callback(err, results);
    });
}

// View all the complaints
function viewcomplaints(callback) {
    const sql = 'SELECT * FROM oo';
    connection.query(sql, (err, results) => {
        callback(err, results);
    });
}

// View only owner complaints
function ownercomplaints(ownerid, callback) {
    const sql = 'SELECT complaints, room_no FROM block WHERE room_no IN (SELECT room_no FROM owner WHERE owner_id IN (SELECT id FROM auth WHERE user_id = ?))';
    connection.query(sql, ownerid, (err, results) => {
        callback(err, results);
    });
}

// Get the total number of tenants
function totaltenant(callback) {
    const sql = 'SELECT COUNT(tenant_id) FROM tenant';
    connection.query(sql, (err, results) => {
        callback(err, results);
    });
}

// Get the total number of employees
function totalemployee(callback) {
    const sql = 'SELECT COUNT(emp_id) FROM employee';
    connection.query(sql, (err, results) => {
        callback(err, results);
    });
}

// Function to retrieve all the complaints in the block
function totalcomplaint(callback) {
    const sql = 'SELECT COUNT(complaints) FROM block';
    connection.query(sql, (err, results) => {
        callback(err, results);
    });
}

// Get the data of tenant
function gettenantdata(tid, callback) {
    const sql = 'SELECT * FROM tenant WHERE tenant_id IN (SELECT id FROM auth WHERE user_id = ?)';
    connection.query(sql, tid, (err, results) => {
        callback(err, results);
    });
}

// Creating a tenant ID
function createtenant(values, callback) {
    const sql = 'INSERT INTO tenant VALUES (?, ?, ?, null, ?, ?)';
    connection.query(sql, values, (err, results) => {
        callback(err, results);
    });
}

// Creating a proof for tenant
function createtenantproof(values, callback) {
    const sql = 'INSERT INTO identity VALUES (?, null, ?)';
    connection.query(sql, values, (err, results) => {
        callback(err, results);
    });
}

// Function to create user ID
function createuserid(values, callback) {
    const sql = 'INSERT INTO auth VALUES (?, ?, ?)';
    connection.query(sql, values, (err, results) => {
        callback(err, results);
    });
}

// Owner viewing tenant details
function ownertenantdetails(values, callback) {
    const sql = 'SELECT * FROM tenant WHERE room_no IN (SELECT room_no FROM owner WHERE owner_id IN (SELECT id FROM auth WHERE user_id = ?))';
    connection.query(sql, values, (err, results) => {
        callback(err, results);
    });
}

// Tenant pays maintenance fee
function paymaintanence(id, callback) {
    const sql = 'UPDATE tenant SET stat = "paid" WHERE tenant_id IN (SELECT id FROM auth WHERE user_id = ?)';
    connection.query(sql, id, (err, results) => {
        callback(err, results);
    });
}

// Owner viewing room owned by them
function ownerroomdetails(values, callback) {
    const sql = 'SELECT * FROM room WHERE room_no IN (SELECT room_no FROM owner WHERE owner_id IN (SELECT id FROM auth WHERE user_id = ?))';
    connection.query(sql, values, (err, results) => {
        callback(err, results);
    });
}

// View parking allotted for tenant
function viewparking(id, callback) {
    const sql = 'SELECT parking_slot FROM room WHERE room_no IN (SELECT room_no FROM tenant WHERE tenant_id IN (SELECT id FROM auth WHERE user_id = ?))';
    connection.query(sql, id, (err, results) => {
        callback(err, results);
    });
}

// Employee salary get
function empsalary(id, callback) {
    const sql = 'SELECT salary FROM employee WHERE emp_id IN (SELECT id FROM auth WHERE user_id = ?)';
    connection.query(sql, id, (err, results) => {
        callback(err, results);
    });
}

// Function to validate user with username and password
function authoriseuser(username, password, callback) {
    let results;
    const sql = 'SELECT password FROM auth WHERE user_id = ?';
    const value = [username];
    connection.query(sql, value, (err, result) => {
        if (result.length === 0) {
            results = "denied";
            callback(err, results);
            return;
        } else {
            const resultArray = Object.values(JSON.parse(JSON.stringify(result))[0])[0];
            if (password === resultArray) {
                results = "granted";
            } else {
                results = "denied";
            }
            callback(err, results);
        }
    });
}

// Create a new branch
function createBranch(values, callback) {
    const sql = 'INSERT INTO branches (branch_name, manager, rooms_available, rooms_empty, rooms_occupied) VALUES (?, ?, ?, ?, ?)';
    connection.query(sql, values, (err, results) => {
        callback(err, results);
    });
}

// Update an existing branch
function updateBranch(values, callback) {
    const sql = 'UPDATE branches SET branch_name = ?, manager = ?, rooms_available = ?, rooms_empty = ?, rooms_occupied = ? WHERE branch_id = ?';
    connection.query(sql, values, (err, results) => {
        callback(err, results);
    });
}

// Delete a branch
function deleteBranch(branchId, callback) {
    const sql = 'DELETE FROM branches WHERE branch_id = ?';
    connection.query(sql, [branchId], (err, results) => {
        callback(err, results);
    });
}

module.exports = { 
    registercomplaint,
    createowner,
    bookslot,
    getdata,
    totalowner,
    totaltenant,
    totalemployee,
    totalcomplaint,
    createownerproof,
    viewcomplaints,
    authoriseuser,
    gettenantdata,
    createtenant,
    createtenantproof,
    ownerroomdetails,
    ownercomplaints,
    viewparking,
    createuserid,
    paymaintanence,
    empsalary,
    ownerroomdetails,
    ownertenantdetails,
    createBranch,     // New function
    updateBranch,     // New function
    deleteBranch      // New function
};