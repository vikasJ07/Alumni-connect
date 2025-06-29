const mysql = require("mysql2/promise");

// Create a connection pool
const pool = mysql.createPool({
    host: "localhost", // Your database host (use localhost for local development)
    user: "root",    // Your database username
    password: "mysql", // Replace with the password for the `Mellow` user
    database: "alumni", // Name of the database
    waitForConnections: true, // Ensures queueing for connections
    connectionLimit: 10, // Max number of connections in the pool
    queueLimit: 0,       // No limit to the number of queued connection requests
});

module.exports = { pool };
