import express from 'express';
import { register, login } from '../controllers/AuthController';
import { addMaquette, getArtistMaquettes ,getAllMaquettes, deleteMaquette } from '../controllers/MaquetteController';
import { authMiddleware } from '../middlewares/authenticationMiddleware';
import { createApproval, getApprovals } from '../controllers/approvalController';
import { deleteUser, banArtist, addManager } from '../controllers/AdminController';

const router = express.Router();

// Routes pour l'authentification
router.post('/register', register);
router.post('/login', login);

// Routes pour les maquettes
router.post('/maquettes/add', authMiddleware, addMaquette);
router.get('/maquettes/artist', authMiddleware, getArtistMaquettes);
router.get('/maquettes/manager', authMiddleware, getAllMaquettes);

router.delete('/maquettes/:id', authMiddleware, deleteMaquette);

// Routes pour l'approbation de maquettes
router.post('/approvals/create', authMiddleware, createApproval);
router.get('/approvals/:maquetteId', authMiddleware, getApprovals);

// Routes pour l'administration des comptes
router.delete('/admin/delete-user/:userId', authMiddleware, deleteUser);
router.post('/admin/ban-artist/:userId', authMiddleware, banArtist);
router.post('/admin/add-manager/:userId', authMiddleware, addManager);

export default router;
