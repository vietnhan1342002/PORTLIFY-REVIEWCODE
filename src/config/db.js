// db/config.js
import mysql from 'mysql2'
import dotenv from 'dotenv'
dotenv.config()

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
})

pool.getConnection((err, connection) => {
  if (err) {
    console.error('❌ Connection Error:', err.message)
  } else {
    console.log('✅ Connection Successfully!')
    connection.release()
  }
})

const db = pool.promise()
export default db
