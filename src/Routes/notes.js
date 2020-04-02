const { Router } = require('express');
const AuthMiddleWare = require('../MiddleWare/AuthMiddleWare')
const router = Router();
const NotesController = require('../Controllers/NotesController')

router.get('/',AuthMiddleWare, NotesController.userNotes);
router.post('/create',AuthMiddleWare, NotesController.addNote);
router.delete('/delete/:note_id/',AuthMiddleWare, NotesController.deleteNote);
module.exports = router
