const { Pool } = require('pg')
const pool = new Pool({
  user: 'pserver',
  password: '45685255',
  host: '127.0.0.1',
  port: 5432,
  database: 'PulseDB'
})

module.exports = {
  pool
}
