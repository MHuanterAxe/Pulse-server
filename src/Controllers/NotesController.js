const config = require('../Config/default');
const { pool } = require('../DataBase');
const jwt = require('jsonwebtoken');

exports.userNotes = async (req, res) => {
  try {
    const { id } = req.body
    await pool.query(
      'SELECT n.note_id, n.note_label, n."text", n.created_at,  f.folder_id, f.folder_label ' +
      'FROM "Users" u ' +
      'JOIN "Notes" n ON u.user_id = n.user_id ' +
      'JOIN "Folders" f ON u.user_id = f.user_id ' +
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
exports.addNote = async (req, res) => {
  try {
    const date = new Date().toDateString()
    const { id, label, text, folder_id } = req.body
    if (label === undefined || text === undefined || folder_id === undefined) {
      return res.status(400).json({ message: 'incorrect data' })
    }
    await pool.query(
      'INSERT INTO "Notes" ( user_id, note_label, text, created_at, updated_at, folder_id ) ' +
      'VALUES ( $1, $2, $3, $4, $5, $6 )',
      [id, label, text, date, date, folder_id],
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
    const { note_id } = req.params
    if (note_id === undefined) {
      return res.status(400).json({ message: 'incorrect data'})
    }
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
