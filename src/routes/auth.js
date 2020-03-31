const { Router } = require('express');
const config = require('../config/default')
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { check, validationResult } = require('express-validator')
const { pool } = require('../db');
const router = Router();

router.post('/register',
  [
    check('email', 'Incorrect Email address').isEmail(),
    check('password', 'Incorrect password').isLength({ min: 8 })
  ],
  async (req, res) => {
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
      const candidate = await pool.query('SELECT u.email FROM "User" u WHERE u.email = $1', [email]);
      if (candidate.rows.length) {
        res.status(400).json({ message: 'User with this email already exist!' })
      }
      const hashedPassword = await bcrypt.hash(password, 12);
      await pool.query(
        'INSERT INTO "User" (first_name, last_name, email, password) ' +
        'VALUES ($1, $2, $3, $4)',
        [ first_name, last_name, email, hashedPassword ]
      ).catch(err => {
        res.status(400).json('Incorrect data')
      })
    } catch (e) {
      res.status(500).json({ message: 'Что-то пошло не так' })
    }
});

router.post('/login',
  [
    check('email', 'Incorrect Email address').isEmail(),
    check('password', 'Incorrect password').exists()
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req)
      if(!errors.isEmpty()) {
        return res.status(400).json({
          errors: errors.array(),
          message: 'Incorrect data while logging in'
        })
      }
      const { email, password } = req.body
      console.log(email, password)
      const user = pool.query(
        'SELECT * FROM "User" u WHERE u.email = $1',
        [email],
        (err, result) => {
          if (!result.rows) {
            return res.status(400).json('User did not found')
          }
          const isMatch = bcrypt.compare(password, result.rows[0].password)
            .then(() => {
              if (!isMatch) {
                return res.status(400).json('Incorrect password')
              }
              const token = jwt.sign(
                { userId: result.rows[0].id },
                config.jwt,
                { expiresIn: '1h' }
              );
              res.json({token, id: result.rows[0].id})
            })
      })

    } catch (e) {
      res.status(500).json({ message: 'Что-то пошло не так' })
    }
});

module.exports = router
