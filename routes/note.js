// backend/src/routes/noteRoutes.js
import express from 'express';
import {
  createNote,
  getNote,
  updateNote
} from '../controllers/noteController.js';

const router = express.Router();

router.post('/', createNote);
router.get('/:id', getNote);
router.put('/:id', updateNote);

export default router;