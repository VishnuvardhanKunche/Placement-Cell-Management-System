const pool = require("../config/db");

async function getAllDepartments(){
    const result = await pool.query("SELECT * FROM departments ORDER BY id");
    return result.rows;
}

async function getDepartmentById(id){
    const result = await pool.query("SELECT * FROM departments WHERE id = $1", [id]);
    return result.rows[0] || null;
}

async function getDepartmentByCodeOrName(code, name){
    const result = await pool.query(
        "SELECT * FROM departments WHERE LOWER(code) = LOWER($1) OR LOWER(name) = LOWER($2)",
        [code, name]
    );
    return result.rows;
}

async function getDepartmentByCodeOrNameExcludeId(code, name, id){
    const result = await pool.query(
        "SELECT * FROM departments WHERE (LOWER(code) = LOWER($1) OR LOWER(name) = LOWER($2)) AND id <> $3",
        [code, name, id]
    );
    return result.rows;
}

async function createDepartment(code, name, hod_name){
    const result = await pool.query(
        "INSERT INTO departments (code, name, hod_name) VALUES ($1, $2, $3) RETURNING *",
        [code, name, hod_name]
    );
    return result.rows[0];
}

async function updateDepartment(id, code, name, hod_name){
    const result = await pool.query(
        "UPDATE departments SET code = $1, name = $2, hod_name = $3, updated_at = CURRENT_TIMESTAMP WHERE id = $4 RETURNING *",
        [code, name, hod_name, id]
    );
    return result.rows[0];
}

async function deleteDepartment(id){
    const result = await pool.query("DELETE FROM departments WHERE id = $1 RETURNING *", [id]);
    return result.rowCount > 0;
}

module.exports = {
    getAllDepartments,
    getDepartmentById,
    getDepartmentByCodeOrName,
    getDepartmentByCodeOrNameExcludeId,
    createDepartment,
    updateDepartment,
    deleteDepartment,
};