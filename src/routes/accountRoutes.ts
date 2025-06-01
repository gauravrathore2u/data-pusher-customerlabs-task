import { Router } from 'express';
import { AccountController } from '../controllers/AccountController';

const router = Router();
const accountController = new AccountController();

router.post('/', accountController.create.bind(accountController));
router.get('/', accountController.getAll.bind(accountController));
router.get('/:id', accountController.getById.bind(accountController));
router.put('/:id', accountController.update.bind(accountController));
router.delete('/:id', accountController.delete.bind(accountController));

export default router;