import mysql from 'mysql2/promise';

import { DATABASE_URL } from '../constants/app.constant';

// Create the connection pool. The pool-specific settings are the defaults
const pool = mysql.createPool({
  uri: DATABASE_URL,
  waitForConnections: true,
  connectionLimit: 10,
  maxIdle: 10, // max idle connections, the default value is the same as `connectionLimit`
  idleTimeout: 60000, // idle connections timeout, in milliseconds, the default value 60000
  queueLimit: 0,
  enableKeepAlive: true,
  keepAliveInitialDelay: 0,
});

try {
  await pool.query('SELECT 1+1 AS result');
  console.info('MYSQL2: \t Connection successfully');
} catch (error) {
  console.error('MYSQL2: \t Error connecting to MySQL2:', error);
}

export default pool;
