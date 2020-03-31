const { Pool } = require('pg')
const pool = new Pool({
  user: 'postgres',
  password: '45685255',
  host: '0.0.0.0',
  port: 5432,
  database: 'PulseDB'
})

module.exports = {
  pool
}
