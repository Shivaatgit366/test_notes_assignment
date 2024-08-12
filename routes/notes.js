const express = require('express');
const router = express.Router();


const noteController = require('../controllers/note.controller');


// for notes
router.post('/create-note', noteController.createNote);
router.get('/note/:id', noteController.getNote);
router.get('/notes', noteController.listAllNotes);
router.get('/notesByKeyword', noteController.listNotesByKeyword);
router.post('/update-note/:id', noteController.updateNote);
router.delete('/delete-note/:id', noteController.deleteNote);


module.exports = router;