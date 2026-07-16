require("dotenv").config();

const app = require("./src/app");
const pool = require("./src/config/db");

const PORT = process.env.PORT || 5000;

async function startServer(){
    try {
        await pool.query("SELECT NOW()");
        
        console.log("✅ Connected to PostgreSQL");

        app.listen(PORT,()=>{
            console.log(`🚀 Server started running in the port http://localhost:${PORT}`);
        });
    } catch(error) {
        console.error("❌ Failed to connect to PostgreSQL the db",error.message);
        process.exit(1);
    }
}

startServer();

