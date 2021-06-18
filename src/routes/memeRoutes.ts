import express from 'express';
import memeController from '../controllers/memeController';
const router = express.Router();

router.get('/', memeController.GetMemes);
router.get('/:id', memeController.GetMemeById);
router.get('/:id/img', memeController.GetMemeImage);
export default router;
