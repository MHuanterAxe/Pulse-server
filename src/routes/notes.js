const { Router } = require('express');
const router = Router();
const NotesController = require('../controllers/NotesController')

router.get('/:token', NotesController.userNotes);
router.post('/create/:token', NotesController.addNote);
router.post('/delete/:token', NotesController.deleteNote);
module.exports = router
