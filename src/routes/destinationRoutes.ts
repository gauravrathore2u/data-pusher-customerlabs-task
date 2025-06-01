import { Router } from 'express';
import { DestinationController } from '../controllers/DestinationController';

const router = Router();
const destinationController = new DestinationController();

router.post('/', destinationController.create.bind(destinationController));
router.get('/', destinationController.getAll.bind(destinationController));
router.get('/:id', destinationController.getById.bind(destinationController));
router.get('/account/:accountId', destinationController.getByAccountId.bind(destinationController));
router.put('/:id', destinationController.update.bind(destinationController));
router.delete('/:id', destinationController.delete.bind(destinationController));

export default router;