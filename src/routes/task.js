// importing requirements
const router = require('express').Router();
const { createTask, getTask, deleteTask, createBlankTask, updateTask } = require('../controllers/task');
const { validateTaskFields, validateMongoFields, validateUpdationTaskFields } = require('../middlewares/validationFields');
const { fetchUser } = require('../middlewares/auth/authMiddleware');
const { validateValidationResult } = require('../middlewares/validationMiddleware');


// Route 1: To create task: '/todo/v1/task/create' [using POST] (login required)
router.post('/create', validateTaskFields, validateValidationResult, fetchUser, createTask);

// Route 2: To fetch all the task: '/todo/v1/task/get-task' [using GET] (login required)
router.get('/get-task', fetchUser, getTask);

// Route 3: To delete the task: '/todo/v1/task/delete-task?task-id=<mongoose object id>' [using DELETE] (login required)
router.delete('/delete-task', validateMongoFields, validateValidationResult, fetchUser, deleteTask);

// Route 4: To update the task: '/todo/v1/task/update-task?task-id=<mongoose object id>' [using PUT] (login required)
router.put('/update-task', validateUpdationTaskFields, validateTaskFields, validateValidationResult, fetchUser, updateTask);

// Route 5.1: To create task with no data: '/todo/v1/task/create-task' [using POST] (login required)
router.post('/create-task', fetchUser, createBlankTask);

// exporting the router object
module.exports = router;