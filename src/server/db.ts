const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
	user: process.env.POSTGRES_USER,
	password: process.env.POSTGRES_PASSWORD,
	host: process.env.POSTGRES_HOST,
	port: process.env.POSTGRES_PORT,
	database: process.env.POSTGRES_DB,
	ssl: false
});

// const pool = new Pool({
// 	connectionString: process.env.DATABASE_URL,
// 	ssl: false
// });

export default pool;
