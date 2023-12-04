// importing all requirements
const User = require('../models/User');
const Task = require('../models/Task');


// to add task
const createTask = async (req, res) => {
    try {
        // fetching the data from the request body
        const { taskTitle, taskDesc, taskCategory } = req.body;

        // confirm that the useer exists
        const user = await User.findById(req.user.id);
        if (!user) return res.status(404).json({ status: 404, message: "User not found!!" });

        // now, add the task in the task model
        Task.create({
            user: req.user.id,
            taskTitle: taskTitle,
            taskDesc: taskDesc,
            taskCategory: taskCategory
        })
            .then(task => {  // task created successfully
                return res.status(200).json({ status: 200, message: "Task Created!", task: task });
            })
            .catch(err => {  // the task is not added in the task model
                return res.status(500).json({ status: 500, message: "Task creation failed!", errors: err });
            });

    } catch (err) {  // unrecogonized errors
        return res.status(500).json({ status: 500, message: "Internal Server Errors", errors: err });
    }
};

// to get the task by logged in users and delete all the blank tasks
const getTask = async (req, res) => {
    try {
        // confirm that the logged in user exists
        const user = await User.findById(req.user.id);
        if (!user) return res.status(404).json({ status: 404, message: "User Not Found!" });

        // now, fetch all the tasks
        let tasks = await Task.find({ user: req.user.id });
        if (tasks.length === 0) return res.status(200).json({ status: 200, message: "You didn't added any task yet!!" });

        // delete empty task
        for (const task of tasks) {
            if (task.taskTitle.length === 0 && task.taskDesc.length === 0) {
                await Task.findByIdAndDelete(task._id);
            }
        }

        // Filter non-empty tasks
        const filteredTasks = tasks.filter((task) => task.taskTitle.length > 0 || task.taskDesc.length > 0);

        // here, we need to sort the task by date recent first (issue #21)
        const sortedTasks = filteredTasks.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));

        // if there is any task for the user
        return res.status(200).json({ status: 200, message: "Tasks Found!", totalResults: sortedTasks.length, tasks: sortedTasks });

    } catch (err) {  // unrecogonized errors
        return res.status(500).json({ status: 500, message: "Internal Server Errors", errors: err });
    }
};

// to delete the task
const deleteTask = async (req, res) => {
    try {
        // fetch the task id from the query param
        const taskId = req.query['task-id'];

        // verify that the user exists
        const user = await User.findById(req.user.id);
        if (!user) return res.status(404).json({ status: 404, message: "User Not Found!" });

        // now, confirm that the task exists
        const task = await Task.findById(taskId);
        if (!task) return res.status(404).json({ status: 404, message: "Task Not Found!" });

        // now, check that the task is accessible by the user
        if (task.user.toString() != req.user.id) return res.status(403).json({ status: 403, message: "Access Denied!" });

        // now, delete the task
        await Task.findByIdAndDelete(taskId);
        return res.status(200).json({ status: 200, message: "Task Deleted Successfully!" });

    } catch (err) {  // unrecogonized errors
        return res.status(500).json({ status: 500, message: "Internal Server Errors", errors: err });
    }
};

// to update the task
const updateTask = async (req, res) => {
    try {
        // fetching data from qyery params
        const taskId = req.query['task-id'];
        const { taskTitle, taskCategory, taskDesc } = req.body;

        // now, find that the user exists
        const user = await User.findById(req.user.id);
        if (!user) return res.status(404).json({ status: 404, message: "User not found!!" });

        // now, confirm that the task exists
        const task = await Task.findById(taskId);
        if (!task) return res.status(404).json({ status: 404, message: "Task Not Found!" });

        // updating all fields
        task.taskCategory = taskCategory;
        task.taskDesc = taskDesc;
        task.taskTitle = taskTitle;
        task.save();

        // task updated successfully
        return res.status(200).json({ status: 200, message: "Task Updated!", task: task });

    } catch (err) {  // unrecogonized errors
        return res.status(500).json({ status: 500, message: "Internal Server Errors", errors: err });
    }
}

// exporting tasks functions
module.exports = { createTask, getTask, deleteTask, updateTask };