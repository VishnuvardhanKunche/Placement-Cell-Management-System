const express = require("express");

const app = express();

const departmentRoutes = require("./routes/department.routes");

app.use(express.json());

app.use("/api/departments", departmentRoutes);

module.exports = app;