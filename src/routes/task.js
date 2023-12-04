// importing requirements
const router = require('express').Router();
const { getNotes, createNote } = require('../controllers/task');
const { validateTaskFields, validateMongoFields, validateUpdationTaskFields } = require('../middlewares/validationFields');
const { fetchUser } = require('../middlewares/auth/authMiddleware');
const { validateValidationResult } = require('../middlewares/validationMiddleware');


// Route 1: To create task: '/api/v1/task/create' [using POST] (login required)
router.post('/create', validateTaskFields, validateValidationResult, fetchUser, createNote);

// Route 2: To fetch all the task: '/api/v1/task/get-task' [using GET] (login required)
router.get('/get-notes', fetchUser, getNotes);

// Route 3: To delete the task: '/api/v1/task/delete-task?task-id=<mongoose object id>' [using DELETE] (login required)
router.delete('/delete-task', validateMongoFields, validateValidationResult, fetchUser, (req, res) => {res.send("ok")});

// Route 4: To update the task: '/api/v1/task/update-task?task-id=<mongoose object id>' [using PUT] (login required)
router.put('/update-task', validateUpdationTaskFields, validateTaskFields, validateValidationResult, fetchUser, (req, res) => {res.send("ok")});

// exporting the router object
module.exports = router;