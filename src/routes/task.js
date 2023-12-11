// importing requirements
const router = require('express').Router();
const { getNotes, createNote, deleteNote, updateNote, completeNote } = require('../controllers/task');
const { validateTaskFields, validateMongoFields, validateUpdationTaskFields } = require('../middlewares/validationFields');
const { fetchUser } = require('../middlewares/auth/authMiddleware');
const { validateValidationResult } = require('../middlewares/validationMiddleware');


// Route 1: To create task: '/api/v1/notes/create' [using POST] (login required)
router.post('/create', validateTaskFields, validateValidationResult, fetchUser, createNote);

// Route 2: To fetch all the task: '/api/v1/notes/get-notes?page=<number>&completed=<boolean string>' [using GET] (login required)
router.get('/get-notes', fetchUser, getNotes);

// Route 3: To delete the task: '/api/v1/notes/delete?note-id=<mongoose object id>' [using DELETE] (login required)
router.delete('/delete', validateMongoFields, validateValidationResult, fetchUser, deleteNote);

// Route 4: To update the task: '/api/v1/notes/update?note-id=<mongoose object id>' [using PUT] (login required)
router.put('/update', validateUpdationTaskFields, validateValidationResult, fetchUser, updateNote);

// Route 5: To mark the note as completed: '/api/v1/notes/complete?note-id=<object id>' [using PATCH] (login required)
router.patch('/complete', fetchUser, completeNote);

// exporting the router object
module.exports = router;