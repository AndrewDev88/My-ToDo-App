import { Router } from 'express';
import taskController from '../controllers/task.controller.js';
import { authMiddleware } from '../middlewares/auth.middleware.js';
import { roleMiddleware } from '../middlewares/role.middleware.js';
import { validateTask } from '../middlewares/validations/task.validator.js';
import { checkIfUserOwnsTask } from '../middlewares/taskOwnership.middleware.js';

const router = Router();

router.use(authMiddleware);

router.get('/all', roleMiddleware(['admin']), taskController.getAllTasks);
router.get('/', roleMiddleware(['user','admin']), taskController.getAllUserTasks);
router.get('/:id', roleMiddleware(['user','admin']), checkIfUserOwnsTask, taskController.getTaskById);

router.post('/', roleMiddleware(['user']), validateTask, taskController.createTask);

router.put('/:id', roleMiddleware(['user']), checkIfUserOwnsTask, taskController.updateTask);

router.delete('/:id', roleMiddleware(['user','admin']), checkIfUserOwnsTask, taskController.deleteTask);

export default router;
