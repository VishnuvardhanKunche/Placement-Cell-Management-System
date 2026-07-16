const pool = require("../config/db");

async function getAllDepartments(){
    const result = await pool.query("SELECT * FROM departments ORDER BY id");
    return result.rows;
}

module.exports = {
    getAllDepartments,
};