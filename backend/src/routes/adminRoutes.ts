import { Router } from 'express';
import { adminController } from '../controllers/adminController';

const router = Router();

// Agent routes
router.get('/agents', adminController.getAgents);
router.get('/agents/:id', adminController.getAgent);
router.post('/agents', adminController.createAgent);
router.post('/agents/:id/start', adminController.startAgent);
router.post('/agents/:id/stop', adminController.stopAgent);

// System routes
router.get('/system/status', adminController.getSystemStatus);

// Data source routes
router.get('/data-sources', adminController.getDataSources);

export default router;
