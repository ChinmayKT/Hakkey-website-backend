import express from 'express';
import { registerEarlyAccess } from '../controllers/earlyAccessController.js';

const router = express.Router();

router.post('/', registerEarlyAccess);

export default router;
