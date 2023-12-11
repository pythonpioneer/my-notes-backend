// importing requirements
const router = require('express').Router();
const { getNotes, createNote, deleteNote, updateNote } = require('../controllers/task');
const { validateTaskFields, validateMongoFields, validateUpdationTaskFields } = require('../middlewares/validationFields');
const { fetchUser } = require('../middlewares/auth/authMiddleware');
const { validateValidationResult } = require('../middlewares/validationMiddleware');


// Route 1: To create task: '/api/v1/task/create' [using POST] (login required)
router.post('/create', validateTaskFields, validateValidationResult, fetchUser, createNote);

// Route 2: To fetch all the task: '/api/v1/task/get-notes?page=<number>&completed=<boolean string>' [using GET] (login required)
router.get('/get-notes', fetchUser, getNotes);

// Route 3: To delete the task: '/api/v1/task/delete?note-id=<mongoose object id>' [using DELETE] (login required)
router.delete('/delete', validateMongoFields, validateValidationResult, fetchUser, deleteNote);

// Route 4: To update the task: '/api/v1/task/update?note-id=<mongoose object id>' [using PUT] (login required)
router.put('/update', validateUpdationTaskFields, validateValidationResult, fetchUser, updateNote);

// exporting the router object
module.exports = router;