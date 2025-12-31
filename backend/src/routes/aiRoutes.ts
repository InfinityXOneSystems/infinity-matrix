import { Router } from 'express';
import { aiController } from '../controllers/aiController';

const router = Router();

router.post('/chat', aiController.chat);
router.get('/models', aiController.getModels);
router.post('/execute', aiController.executeCode);
router.post('/github', aiController.githubOperation);

export default router;
