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
    pool.query('SELECT u.email FROM "Users" u WHERE u.email = $1', [email])
      .then(candidate => {
        if (candidate.rowCount) {
          return res.status(400).json({ message: 'User with this email already exist!' })
        }
        const hashedPassword = bcrypt.hashSync(password, 12);
        pool.query(
          'INSERT INTO "Users" (first_name, last_name, email, password) ' +
          'VALUES ($1, $2, $3, $4)',
          [ first_name, last_name, email, hashedPassword ])
          .then(() => {
            pool.query(
              'SELECT u.user_id FROM "Users" u WHERE u.email = $1', [email])
              .then(async result => {
                console.log(result.rows)
                await pool.query(
                  'INSERT INTO "Folders" (user_id) VALUES ($1)',
                  [result.rows[0].user_id]
                ).catch(e => res.status(400).json({ error: 'err1' }));
                await pool.query(
                  'INSERT INTO "TaskLists" (user_id) VALUES ($1)',
                  [result.rows[0].user_id]
                ).catch(e => res.status(400).json({ error: err }));
                return res.status(201).json({ message: 'Successfully signed up!' })
              })
              .catch(err => {
                if (err) {
                  return res.status(400).json({ error: 'err2' })
                }
              })
          })
          })
          .catch(err => {
            if (err) {
              return res.status(400).json('Incorrect data')
            }
          })
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
    pool.query('SELECT * FROM "Users" u WHERE u.email = $1', [email])
      .then(result => {
        if (result.rows.length === 0) {
          return res.status(400).json({ message: 'User did not found' })
        }
        const isMatch = bcrypt.compareSync(password, result.rows[0].password)
        if (isMatch) {
          pool.query('SELECT t.user_id FROM "TaskLists" t WHERE t.task_list_label = \'Все задачи\' AND t.user_id = $1', [result.rows[0].user_id])
            .then(defTaskList => {
              if (defTaskList.rowCount === 0) {
                pool.query('INSERT INTO "TaskLists" (user_id) VALUES ($1)', [result.rows[0].user_id])
                  .catch(e => res.status(400).json({ error: err }));
              }
            });
          pool.query('SELECT f.user_id FROM "Folders" f WHERE f.folder_label = \'Все заметки\' AND f.user_id = $1', [result.rows[0].user_id])
            .then(defFolder => {
              if (defFolder.rowCount === 0) {
                pool.query('INSERT INTO "Folders" (user_id) VALUES ($1)', [result.rows[0].user_id])
                  .catch(e => res.status(400).json({ error: err }));
              }
            })
          const token = jwt.sign({ id: result.rows[0].user_id }, secret)
          return res.json({ message: 'Successfully logging in', token })
        } else {
          return res.status(400).json({ message: 'Incorrect password' })
        }
      })
      .catch(err => {
        if (err) {
          return res.status(400).json({ message: err })
        }
      })

  } catch (e) {
    res.status(500).json({message: 'Что-то пошло не так'})
  }
};
