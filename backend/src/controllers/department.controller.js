const departmentModel = require("../models/department.model");

async function getAllDepartments(req, res){
    try{
        const departments = await departmentModel.getAllDepartments();

        res.status(200).json(departments);
    }catch(error){
        console.error(error);

        res.status(500).json({
            message : "Intenal server error",
        });
    }
}

module.exports = {
    getAllDepartments,
};