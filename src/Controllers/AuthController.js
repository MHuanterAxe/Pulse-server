const { validationResult } = require( "express-validator");
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { secret } = require('../Config/default');
const { pool } = require('../DataBase');

exports.register = async function (req, res) {
  try {
    const errors = validationResult(req)

    if(!errors.isEmpty()) {
      return res.status(400).json({
        errors: errors.array(),
        message: 'Incorrect data while register'
      })
    }

    const { first_name, last_name, email, password } = req.body;
    await pool.connect().catch(error => console.log(error));
    const candidate = await pool.query('SELECT u.email FROM "Users" u WHERE u.email = $1', [email]);
    if (candidate.rows.length) {
      res.status(400).json({ message: 'User with this email already exist!' })
    }
    const hashedPassword = await bcrypt.hash(password, 12);
    await pool.query(
      'INSERT INTO "Users" (first_name, last_name, email, password) ' +
      'VALUES ($1, $2, $3, $4)',
      [ first_name, last_name, email, hashedPassword ]
    ).catch(err => {
      res.status(400).json('Incorrect data')
    })
    await pool.query(
      'SELECT u.user_id FROM "Users" u WHERE u.email = $1', [email], async (err, result) => {
        if (err) {
          return res.status(400).json({ error: err })
        }
        await pool.query(
          'INSERT INTO "Folders" (folder_label, user_id) ' +
          'VALUES ($1, $2)',
          [ "Все заметки", result.rows[0].user_id]
        )
      }
    )
  } catch (e) {
    res.status(500).json({ message: 'Что-то пошло не так' })
  }
};
exports.login = async function (req, res) {
  try {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({
        errors: errors.array(),
        message: 'Incorrect data while logging in'
      })
    }
    const {email, password} = req.body
    await pool.query(
      'SELECT * FROM "Users" u WHERE u.email = $1',
      [email],
      (err, result) => {
        if (!result.rows) {
          return res.status(400).json('User did not found')
        }
        const isMatch = bcrypt.compare(password, result.rows[0].password)
        if (isMatch) {
          const token = jwt.sign({ id: result.rows[0].user_id }, secret)
          return res.json({ message: 'Successfully logging in', token })
        } else {
          return res.status(400).json('Incorrect password')
        }
      })

  } catch (e) {
    res.status(500).json({message: 'Что-то пошло не так'})
  }
};
