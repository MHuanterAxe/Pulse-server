const config = require('../config/default');
const { pool } = require('../db');
const jwt = require('jsonwebtoken');

exports.userNotes = async (req, res) => {
  try {
    const { token } = req.params
    const { userId } = jwt.verify(token, config.jwt)
    await pool.query(
      'SELECT n.user_id, n.note_id, n.note_label, n.text, n.created_at, n.updated_at, n.folder_id, f.folder_label ' +
      'FROM "Notes" n ' +
      'LEFT JOIN "Folders" f ON n.folder_id = f.folder_id AND n.user_id = $1',
      [userId],
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
exports.addNote = async (req, res) => {
  try {
    const date = new Date().toDateString()

    const { token } = req.params
    const { label, text, folder_id } = req.body
    const { userId } = jwt.verify(token, config.jwt)
    if (label === undefined || text === undefined || folder_id === undefined) {
      return res.status(400).json({ message: 'incorrect data' })
    }
    await pool.query(
      'INSERT INTO "Notes" ( user_id, note_label, text, created_at, updated_at, folder_id ) ' +
      'VALUES ( $1, $2, $3, $4, $5, $6 )',
      [userId, label, text, date, date, folder_id],
      (err, result) => {
        if (err) {
          return res.status(400).json({ message: err })
        }
        return res.status(201).json({ message: 'Note have been created' })
      }
    )

  } catch (e) {
    res.status(500).json({ message: e.message })
  }
};
exports.deleteNote = async (req, res) => {
  try {
    const { token } = req.params
    const { note_id } = req.body
    const { userId } = jwt.verify(token, config.jwt)
    await pool.query(
      'DELETE FROM "Notes" WHERE note_id = $1',
      [note_id],
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
}
