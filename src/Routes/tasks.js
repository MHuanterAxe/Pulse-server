const { Router } = require('express');
const AuthMiddleWare = require('../MiddleWare/AuthMiddleWare')
const router = Router();
const TasksController = require('../Controllers/TasksController')

router.get('/',AuthMiddleWare, TasksController.userTasks);
router.post('/create',AuthMiddleWare, TasksController.addTask);
router.delete('/delete/:task_id/',AuthMiddleWare, TasksController.deleteTask);
module.exports = router
