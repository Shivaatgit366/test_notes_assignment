const express = require('express');
const router = express.Router();


const noteController = require('../controllers/note.controller');


// for notes
router.post('/create-note', noteController.createNote);
router.get('/note/:id', noteController.getNoteById);
router.get('/notes', noteController.getAllNotes);
router.get('/notesByKeyword', noteController.getNoteByKeyword);
router.post('/update-note/:id', noteController.updateNoteById);
router.delete('/delete-note/:id', noteController.deleteNoteById);


module.exports = router;