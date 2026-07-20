const express = require("express");

const app = express();

const departmentRoutes = require("./routes/department.routes");
const authRoutes = require("./routes/auth.routes");
const companyRoutes = require("./routes/company.routes");
const coordinatorRoutes = require("./routes/coordinator.routes");
const studentRoutes = require("./routes/student.routes");
const driveRoutes = require("./routes/drive.routes");
const applicationRoutes = require("./routes/application.routes");
const offerRoutes = require("./routes/offer.routes");
const dashboardRoutes = require("./routes/dashboard.routes");

app.use(express.json());

app.use("/api/departments", departmentRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/companies", companyRoutes);
app.use("/api/coordinators", coordinatorRoutes);
app.use("/api/students", studentRoutes);
app.use("/api/drives", driveRoutes);
app.use("/api/applications", applicationRoutes);
app.use("/api/offers", offerRoutes);
app.use("/api/dashboard", dashboardRoutes);

module.exports = app;