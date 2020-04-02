const { Pool } = require('pg')
const pool = new Pool({
  user: 'postgres',
  password: '45685255',
  host: '84.38.180.139',
  port: 5432,
  database: 'PulseDB'
})

module.exports = {
  pool
}
