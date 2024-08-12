const NoteModel = require('../models/note.model');
const { body, param, query, validationResult } = require("express-validator");


exports.createNote = [
    // Validate and sanitize fields.
    body("title").trim().isLength({ min: 1 }).withMessage("Title must be specified."),
    body("body").trim().isLength({ min: 1 }).withMessage("Body must be specified."),

    async (req, res) => {
        // Extracting the validation errors from a request.
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return res.status(400).json({
                status: 'fail',
                data: {
                    errors: errors.array()
                }
            });
        }

        const { title, body } = req.body;

        try {
            // Check whether the title already exists.
            const isTitleExist = await NoteModel.findOne({ title: title });
            if (isTitleExist) {
                return res.status(409).json({
                    status: 'fail',
                    data: {
                        message: 'Title already exists, please enter a new title'
                    }
                });
            }

            // Save the new note.
            const newNote = await NoteModel.create({ title, body });

            return res.status(201).json({
                status: 'success',
                data: {
                    message: 'New note created',
                    note: newNote
                }
            });
        } catch (err) {
            return res.status(500).json({
                status: 'error',
                message: 'Server error. Unable to create note.'
            });
        }
    }
];


exports.getNoteById = [
    // Validate and sanitize the id parameter
    param("id").isMongoId().withMessage("Invalid or missing note ID."),

    async (req, res) => {
        // Handle validation errors
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                status: 'fail',
                data: {
                    errors: errors.array()
                }
            });
        }

        const { id } = req.params;

        try {
            // Attempt to find the note by ID
            const note = await NoteModel.findById(id);

            if (!note) {
                return res.status(404).json({
                    status: 'fail',
                    data: {
                        message: 'Note not found'
                    }
                });
            }

            // Return the found note
            return res.status(200).json({
                status: 'success',
                data: {
                    note
                }
            });
        } catch (err) {
            return res.status(500).json({
                status: 'error',
                message: 'Server error. Unable to retrieve the note.'
            });
        }
    }
];


exports.getAllNotes = async (req, res) => {
    try {
        // Retrieve all notes from the database
        const notes = await NoteModel.find();

        // Check if there are any notes
        if (notes.length === 0) {
            return res.status(404).json({
                status: 'fail',
                data: {
                    message: 'No notes found'
                }
            });
        }

        // Return the list of notes
        return res.status(200).json({
            status: 'success',
            data: {
                notes
            }
        });
    } catch (err) {
        return res.status(500).json({
            status: 'error',
            message: 'Server error. Unable to retrieve notes.'
        });
    }
};


exports.getNoteByKeyword = [
    // Validate the query parameter
    query("keyword").trim().isLength({ min: 1 }).withMessage("Keyword must be specified."),

    async (req, res) => {
        // Handle validation errors
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                status: 'fail',
                data: {
                    errors: errors.array()
                }
            });
        }

        const { keyword } = req.query;

        try {
            // Search for notes where the title contains the keyword (case-insensitive)
            const note = await NoteModel.findOne({ title: new RegExp(keyword, 'i') });

            if (!note) {
                return res.status(404).json({
                    status: 'fail',
                    data: {
                        message: 'No note found with the given keyword in the title'
                    }
                });
            }

            // Return the found note
            return res.status(200).json({
                status: 'success',
                data: {
                    note
                }
            });
        } catch (err) {
            return res.status(500).json({
                status: 'error',
                message: 'Server error. Unable to retrieve the note.'
            });
        }
    }
];


exports.updateNoteById = [
    // Validate and sanitize the id parameter
    param("id").isMongoId().withMessage("Invalid or missing note ID."),

    // Validate the title and body fields
    body("title").trim().isLength({ min: 1 }).withMessage("Title must be specified."),
    body("body").trim().isLength({ min: 1 }).withMessage("Body must be specified."),

    async (req, res) => {
        // Handle validation errors
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                status: 'fail',
                data: {
                    errors: errors.array()
                }
            });
        }

        const { id } = req.params;
        const { title, body } = req.body;

        try {
            // Find the note by ID
            const note = await NoteModel.findById(id);

            if (!note) {
                return res.status(404).json({
                    status: 'fail',
                    data: {
                        message: 'Note not found'
                    }
                });
            }

            // If a new title is provided, check for uniqueness
            if (title && title !== note.title) {
                const existingNote = await NoteModel.findOne({ title: title });
                if (existingNote) {
                    return res.status(409).json({
                        status: 'fail',
                        data: {
                            message: 'Title already exists. Please choose a different title.'
                        }
                    });
                }
                note.title = title; // Update the title
            }

            // Update the body if provided
            if (body) note.body = body;

            // Save the updated note
            const updatedNote = await note.save();

            // Return the updated note
            return res.status(200).json({
                status: 'success',
                data: {
                    message: 'Note updated successfully',
                    note: updatedNote
                }
            });
        } catch (err) {
            return res.status(500).json({
                status: 'error',
                message: 'Server error. Unable to update the note.'
            });
        }
    }
];


exports.deleteNoteById = [
    // Validate and sanitize the id parameter
    param("id").isMongoId().withMessage("Invalid or missing note ID."),

    async (req, res) => {
        // Handle validation errors
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                status: 'fail',
                data: {
                    errors: errors.array()
                }
            });
        }

        const { id } = req.params;

        try {
            // Find the note by ID
            const note = await NoteModel.findById(id);

            if (!note) {
                return res.status(404).json({
                    status: 'fail',
                    data: {
                        message: 'Note not found'
                    }
                });
            }

            // Delete the note
            await NoteModel.findByIdAndDelete(id);

            // Return success message
            return res.status(200).json({
                status: 'success',
                data: {
                    message: 'Note deleted successfully'
                }
            });
        } catch (err) {
            return res.status(500).json({
                status: 'error',
                message: 'Server error. Unable to delete the note.'
            });
        }
    }
];