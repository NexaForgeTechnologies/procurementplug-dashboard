import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

// Create a MySQL connection pool using env variables
export const db = mysql.createPool({
    host: process.env.DATABASE_HOST,       // Use env variable for host
    user: process.env.DATABASE_USER,       // Use env variable for user
    password: process.env.DATABASE_PASSWORD, // Use env variable for password
    database: process.env.DATABASE_NAME,   // Use env variable for database
});
