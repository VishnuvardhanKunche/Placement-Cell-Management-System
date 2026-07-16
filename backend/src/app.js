const express = require("express");

const app = express();

const departmentRoutes = require("./routes/department.routes");
const authRoutes = require("./routes/auth.routes");

app.use(express.json());

app.use("/api/departments", departmentRoutes);
app.use("/api/auth", authRoutes);

module.exports = app;