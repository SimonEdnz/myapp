const express = require('express');
const router = express.Router();
const cors = require("cors");
const app = express();
router.use(cors());
const db = require('../mysql_connect');

// Helper function to handle async database queries
const getQueryResult = async (dbMethod, ...params) => {
  return new Promise((resolve, reject) => {
    dbMethod(...params, (err, result) => {
      if (err) {
        reject(err);
      } else {
        resolve(result);
      }
    });
  });
};

// Admin dashboard values
router.post("/admin", async (req, res) => {
  try {
    console.log(req.body);
    let totalowner, totaltenant, totalemployee, tenantdata;

    // Await each database query
    const ownerResult = await getQueryResult(db.totalowner);
    totalowner = Object.values(JSON.parse(JSON.stringify(ownerResult))[0])[0];

    const tenantResult = await getQueryResult(db.totaltenant);
    totaltenant = Object.values(JSON.parse(JSON.stringify(tenantResult))[0])[0];

    const employeeResult = await getQueryResult(db.totalemployee);
    totalemployee = Object.values(JSON.parse(JSON.stringify(employeeResult))[0])[0];

    tenantdata = await getQueryResult(db.getdata, 'tenant');

    const resdata = {
      totalowner,
      totaltenant,
      totalemployee,
      tenantdata,
    };

    res.send(resdata);
  } catch (err) {
    console.error(err);
    res.status(500).send({ error: 'An error occurred while fetching data' });
  }
});

// Owner dashboard values
router.post("/owner", async (req, res) => {
  try {
    let totaltenant, totalcomplaint, totalemployee;

    const tenantResult = await getQueryResult(db.totaltenant);
    totaltenant = Object.values(JSON.parse(JSON.stringify(tenantResult))[0])[0];

    const complaintResult = await getQueryResult(db.totalcomplaint);
    totalcomplaint = Object.values(JSON.parse(JSON.stringify(complaintResult))[0])[0];

    const employeeResult = await getQueryResult(db.totalemployee);
    totalemployee = Object.values(JSON.parse(JSON.stringify(employeeResult))[0])[0];

    const resdata = {
      totaltenant,
      totalcomplaint,
      totalemployee,
    };

    res.send(resdata);
  } catch (err) {
    console.error(err);
    res.status(500).send({ error: 'An error occurred while fetching data' });
  }
});

// Employee dashboard values
router.post("/employee", async (req, res) => {
  try {
    const empid = req.body.userId;
    let sal, totalcomplaint;

    const salaryResult = await getQueryResult(db.empsalary, empid);
    sal = Object.values(JSON.parse(JSON.stringify(salaryResult))[0])[0];

    const complaintResult = await getQueryResult(db.totalcomplaint);
    totalcomplaint = Object.values(JSON.parse(JSON.stringify(complaintResult))[0])[0];

    const resdata = {
      salary: sal,
      totalcomplaint,
    };

    res.send(resdata);
  } catch (err) {
    console.error(err);
    res.status(500).send({ error: 'An error occurred while fetching data' });
  }
});

// Tenant values
router.post("/tenant", async (req, res) => {
  try {
    const username = req.body.userId;
    const tenantData = await getQueryResult(db.gettenantdata, username);
    res.send(tenantData);
  } catch (err) {
    console.error(err);
    res.status(500).send({ error: 'An error occurred while fetching tenant data' });
  }
});

module.exports = router;
