// backend/src/routes/noteRoutes.js
import express from 'express';
import {
  createNote,
  getNote,
  updateNote,
  getAllNotes,
  searchNotes,
  deleteNote
} from '../controllers/noteController.js';

const router = express.Router();

router.get('/', getAllNotes);
router.get('/search', searchNotes);
router.post('/', createNote);
router.get('/:id', getNote);
router.put('/:id', updateNote);
router.delete('/:id', deleteNote);

export default router;