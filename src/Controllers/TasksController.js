const config = require('../Config/default');
const { pool } = require('../DataBase');
const jwt = require('jsonwebtoken');

exports.userTasks = async (req, res) => {
  try {
    const { id } = req.body
    await pool.query(
      'SELECT t.task_id, t.task_label, t.importance, t.created_at, t.date, t.completed, tl.task_list_id, tl.task_list_label ' +
      'FROM "Users" u ' +
      'JOIN "Tasks" t ON u.user_id = t.user_id ' +
      'JOIN "TaskLists" tl ON u.user_id = t.user_id ' +
      'WHERE u.user_id = $1',
      [id],
      (err, result) => {
        if (err) {
          return res.status(400).json({ message: err.message })
        }
        return res.json({ data: result.rows })
      }
    )

  } catch (e) {
    res.status(500).json({ message: e.message })
  }
};

exports.addTask = async (req, res) => {
  try {
    const createDate = new Date();
    const { id, label, importance, date } = req.body;

    await pool.query(
      'SELECT t.task_list_id FROM "TaskLists" t WHERE t.user_id = $1', [id], async (err, result) => {

        await pool.query(
          'INSERT INTO "Tasks" ( user_id, task_list_id, task_label, importance, date, created_at, updated_at ) ' +
          'VALUES ($1, $2, $3, $4, $5, $6, $7)',
          [id, result.rows[0].task_list_id, label, importance, date, createDate, createDate],
          (err, result) => {
            if (err) {
              return res.status(400).json({message: err.message})
            }
            return res.status(201).json({message: 'Task have been created'})
          }
        )
    })
  } catch (e) {
    res.status(500).json({ message: e.message })
  }
};
exports.deleteTask = async (req, res) => {
  try {
    const { task_id } = req.params
    if (task_id === undefined) {
      return res.status(400).json({ message: 'incorrect data'})
    }
    await pool.query(
      'DELETE FROM "Tasks" WHERE task_id = $1',
      [task_id],
      (err, result) => {
        if (err) {
          return res.status(400).json({ message: err })
        }
        return res.status(201).json({ message: 'Note have been deleted' })
      }
    )

  } catch (e) {
    res.status(500).json({ message: e.message })
  }
};
