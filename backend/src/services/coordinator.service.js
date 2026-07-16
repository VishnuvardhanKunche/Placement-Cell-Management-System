const bcrypt = require("bcrypt");
const pool = require("../config/db");
const userModel = require("../models/user.model");
const coordinatorModel = require("../models/coordinator.model");
const departmentModel = require("../models/department.model");

async function createCoordinator(data) {
    const { email, password, full_name, department_id, phone } = data;

    // 1. Check if email already in use
    const existingUser = await userModel.getUserByEmail(email);
    if (existingUser) {
        const error = new Error("Email is already registered");
        error.statusCode = 409;
        throw error;
    }

    // 2. Check if department exists
    const department = await departmentModel.getDepartmentById(department_id);
    if (!department) {
        const error = new Error("Department not found");
        error.statusCode = 400;
        throw error;
    }

    // 3. Check if department already has a coordinator (1:1 constraint)
    const existingCoordinator = await coordinatorModel.getCoordinatorByDepartmentId(department_id);
    if (existingCoordinator) {
        const error = new Error("Department is already assigned to a coordinator");
        error.statusCode = 409;
        throw error;
    }

    // 4. Hash password
    const hash = await bcrypt.hash(password, 10);

    // 5. Database transaction
    const client = await pool.connect();
    try {
        await client.query("BEGIN");

        const user = await userModel.createUser(email, hash, "department_coordinator", client);
        const profile = await coordinatorModel.createCoordinatorProfile(
            user.id,
            department_id,
            full_name,
            phone,
            client
        );

        await client.query("COMMIT");

        return {
            user_id: user.id,
            email: user.email,
            role: user.role,
            is_active: user.is_active,
            department_id: profile.department_id,
            full_name: profile.full_name,
            phone: profile.phone,
            department_code: department.code,
            department_name: department.name,
        };
    } catch (error) {
        await client.query("ROLLBACK");
        throw error;
    } finally {
        client.release();
    }
}

async function getAllCoordinators() {
    return await coordinatorModel.getAllCoordinators();
}

async function getCoordinatorById(id) {
    const coordinator = await coordinatorModel.getCoordinatorById(id);
    if (!coordinator) {
        const error = new Error("Department coordinator not found");
        error.statusCode = 404;
        throw error;
    }
    return coordinator;
}

async function updateCoordinator(id, data) {
    const { email, full_name, phone } = data;

    // 1. Check if coordinator exists
    const coordinator = await coordinatorModel.getCoordinatorById(id);
    if (!coordinator) {
        const error = new Error("Department coordinator not found");
        error.statusCode = 404;
        throw error;
    }

    // 2. Check if new email conflicts with another user
    const existingUser = await userModel.getUserByEmail(email);
    if (existingUser && existingUser.id !== id) {
        const error = new Error("Email is already in use by another user");
        error.statusCode = 409;
        throw error;
    }

    // 3. Database transaction (Email, Name, Phone updates only)
    const client = await pool.connect();
    try {
        await client.query("BEGIN");

        await userModel.updateUserEmail(id, email, client);
        const profile = await coordinatorModel.updateCoordinatorProfile(id, full_name, phone, client);

        await client.query("COMMIT");

        return {
            user_id: id,
            email,
            department_id: coordinator.department_id,
            full_name: profile.full_name,
            phone: profile.phone,
            department_code: coordinator.department_code,
            department_name: coordinator.department_name,
        };
    } catch (error) {
        await client.query("ROLLBACK");
        throw error;
    } finally {
        client.release();
    }
}

async function deleteCoordinator(id) {
    // Check if coordinator exists
    const coordinator = await coordinatorModel.getCoordinatorById(id);
    if (!coordinator) {
        const error = new Error("Department coordinator not found");
        error.statusCode = 404;
        throw error;
    }

    // Delete user account (which cascades and removes profile)
    return await userModel.deleteUser(id);
}

module.exports = {
    createCoordinator,
    getAllCoordinators,
    getCoordinatorById,
    updateCoordinator,
    deleteCoordinator,
};
