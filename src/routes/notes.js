const { Router } = require('express');
const router = Router();
const NotesController = require('../controllers/NotesController')

router.get('/:token', NotesController.userNotes);
router.post('/create/:token', NotesController.addNote);
router.delete('/delete/:note_id/:token', NotesController.deleteNote);
module.exports = router
