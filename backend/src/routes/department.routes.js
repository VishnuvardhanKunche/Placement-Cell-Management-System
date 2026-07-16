const express = require("express");

const router = express.Router();

const departmentController = require("../controllers/department.controller");

router.get("/", departmentController.getAllDepartments);

module.exports = router;