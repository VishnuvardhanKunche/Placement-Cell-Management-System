const departmentModel = require("../models/department.model");

async function getAllDepartments(req, res){
    try{
        const departments = await departmentModel.getAllDepartments();

        res.status(200).json(departments);
    }catch(error){
        console.error("Error in getAllDepartments:", error);

        res.status(500).json({
            message : "Internal server error",
        });
    }
}

async function getDepartmentById(req, res){
    try{
        const id = parseInt(req.params.id, 10);
        if (isNaN(id)) {
            return res.status(400).json({ message: "Invalid department ID" });
        }

        const department = await departmentModel.getDepartmentById(id);
        if (!department) {
            return res.status(404).json({ message: "Department not found" });
        }

        res.status(200).json(department);
    }catch(error){
        console.error("Error in getDepartmentById:", error);

        res.status(500).json({
            message : "Internal server error",
        });
    }
}

async function createDepartment(req, res){
    try{
        const { code, name, hod_name } = req.body;

        // Validation
        if (!code || typeof code !== "string" || code.trim() === "") {
            return res.status(400).json({ message: "Department code is required and must be a non-empty string" });
        }
        if (!name || typeof name !== "string" || name.trim() === "") {
            return res.status(400).json({ message: "Department name is required and must be a non-empty string" });
        }

        const trimmedCode = code.trim();
        const trimmedName = name.trim();
        const trimmedHodName = hod_name && typeof hod_name === "string" ? hod_name.trim() : null;

        if (trimmedCode.length > 10) {
            return res.status(400).json({ message: "Department code cannot exceed 10 characters" });
        }
        if (trimmedName.length > 100) {
            return res.status(400).json({ message: "Department name cannot exceed 100 characters" });
        }

        // Duplicate Check
        const existing = await departmentModel.getDepartmentByCodeOrName(trimmedCode, trimmedName);
        if (existing.length > 0) {
            const hasDuplicateCode = existing.some(d => d.code.toLowerCase() === trimmedCode.toLowerCase());
            const hasDuplicateName = existing.some(d => d.name.toLowerCase() === trimmedName.toLowerCase());

            if (hasDuplicateCode && hasDuplicateName) {
                return res.status(409).json({ message: "Department code and name already exist" });
            } else if (hasDuplicateCode) {
                return res.status(409).json({ message: "Department code already exists" });
            } else {
                return res.status(409).json({ message: "Department name already exists" });
            }
        }

        const newDept = await departmentModel.createDepartment(trimmedCode, trimmedName, trimmedHodName);
        res.status(201).json(newDept);
    }catch(error){
        console.error("Error in createDepartment:", error);

        res.status(500).json({
            message : "Internal server error",
        });
    }
}

async function updateDepartment(req, res){
    try{
        const id = parseInt(req.params.id, 10);
        if (isNaN(id)) {
            return res.status(400).json({ message: "Invalid department ID" });
        }

        const { code, name, hod_name } = req.body;

        // Validation
        if (!code || typeof code !== "string" || code.trim() === "") {
            return res.status(400).json({ message: "Department code is required and must be a non-empty string" });
        }
        if (!name || typeof name !== "string" || name.trim() === "") {
            return res.status(400).json({ message: "Department name is required and must be a non-empty string" });
        }

        const trimmedCode = code.trim();
        const trimmedName = name.trim();
        const trimmedHodName = hod_name && typeof hod_name === "string" ? hod_name.trim() : null;

        if (trimmedCode.length > 10) {
            return res.status(400).json({ message: "Department code cannot exceed 10 characters" });
        }
        if (trimmedName.length > 100) {
            return res.status(400).json({ message: "Department name cannot exceed 100 characters" });
        }

        // Check Existence
        const department = await departmentModel.getDepartmentById(id);
        if (!department) {
            return res.status(404).json({ message: "Department not found" });
        }

        // Duplicate Check excluding current ID
        const existing = await departmentModel.getDepartmentByCodeOrNameExcludeId(trimmedCode, trimmedName, id);
        if (existing.length > 0) {
            const hasDuplicateCode = existing.some(d => d.code.toLowerCase() === trimmedCode.toLowerCase());
            const hasDuplicateName = existing.some(d => d.name.toLowerCase() === trimmedName.toLowerCase());

            if (hasDuplicateCode && hasDuplicateName) {
                return res.status(409).json({ message: "Department code and name already exist" });
            } else if (hasDuplicateCode) {
                return res.status(409).json({ message: "Department code already exists" });
            } else {
                return res.status(409).json({ message: "Department name already exists" });
            }
        }

        const updatedDept = await departmentModel.updateDepartment(id, trimmedCode, trimmedName, trimmedHodName);
        res.status(200).json(updatedDept);
    }catch(error){
        console.error("Error in updateDepartment:", error);

        res.status(500).json({
            message : "Internal server error",
        });
    }
}

async function deleteDepartment(req, res){
    try{
        const id = parseInt(req.params.id, 10);
        if (isNaN(id)) {
            return res.status(400).json({ message: "Invalid department ID" });
        }

        // Check Existence
        const department = await departmentModel.getDepartmentById(id);
        if (!department) {
            return res.status(404).json({ message: "Department not found" });
        }

        // Delete
        const deleted = await departmentModel.deleteDepartment(id);
        if (!deleted) {
            return res.status(500).json({ message: "Failed to delete department" });
        }

        res.status(200).json({ message: "Department deleted successfully" });
    }catch(error){
        console.error("Error in deleteDepartment:", error);
        
        // Handle database constraint violation (foreign key block)
        if (error.code === "23503") {
            return res.status(409).json({ 
                message: "Cannot delete department because it has associated students or coordinators" 
            });
        }

        res.status(500).json({
            message : "Internal server error",
        });
    }
}

module.exports = {
    getAllDepartments,
    getDepartmentById,
    createDepartment,
    updateDepartment,
    deleteDepartment,
};