const config = require('../Config/default');
const { pool } = require('../DataBase');
const jwt = require('jsonwebtoken');

exports.userData = async (req, res) => {
  try {
    const { id } = req.body
    await pool.query(
      'SELECT u.first_name, u.last_name ' +
      'FROM "Users" u ' +
      'WHERE u.user_id = $1',
      [id],
      (err, result) => {
        if (err) {
          return res.status(400).json({ message: err.message })
        }
        return res.json({ data: result.rows[0] })
      }
    )
  } catch (e) {
    res.status(500).json({ message: e.message })
  }
};
