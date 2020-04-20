const { Router } = require('express');
const AuthMiddleWare = require('../MiddleWare/AuthMiddleWare')
const router = Router();
const TasksController = require('../Controllers/TasksController')

router.get('/',AuthMiddleWare, TasksController.userTasks);
router.get('/done/',AuthMiddleWare, TasksController.userTasksDone);
router.post('/create',AuthMiddleWare, TasksController.addTask);
router.put('/update/:task_id/',AuthMiddleWare, TasksController.updateTask);
router.delete('/delete/:task_id/',AuthMiddleWare, TasksController.deleteTask);
module.exports = router
