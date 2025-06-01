import { Router } from 'express';
import { DataHandlerController } from '../controllers/DataHandlerController';

const router = Router();
const dataHandlerController = new DataHandlerController();

router.post('/incoming_data', dataHandlerController.handleIncomingData.bind(dataHandlerController));

export default router;