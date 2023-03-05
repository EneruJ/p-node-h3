import { Request, Response } from 'express';
import { IUser } from '../models/User';
import Maquette from '../models/Maquette';
import Approval from '../models/Approval';

// Crée une nouvelle approbation
export const createApproval = async (req: Request, res: Response) => {
  try {
    const user = req.user as IUser;
    const { maquetteId, isApproved, comment } = req.body;

    // Vérifier que l'utilisateur est un manager
    if (user.role !== 'manager') {
      return res.status(403).json({ message: 'Vous n\'êtes pas autorisé à approuver des maquettes' });
    }

    // Vérifier que la maquette existe
    const maquette = await Maquette.findById(maquetteId);
    if (!maquette) {
      return res.status(404).json({ message: 'La maquette n\'existe pas' });
    }

    // Créer une nouvelle approbation
    const approval = new Approval({
      isApproved,
      comment,
      manager: user._id,
      maquette: maquette._id,
    });

    // Enregistrer l'approbation
    const savedApproval = await approval.save();

    res.status(201).json(savedApproval);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Une erreur est survenue' });
  }
};

// Récupère toutes les approbations d'une maquette
export const getApprovals = async (req: Request, res: Response) => {
  try {
    const { maquetteId } = req.params;

    // Vérifier que la maquette existe
    const maquette = await Maquette.findById(maquetteId);
    if (!maquette) {
      return res.status(404).json({ message: 'La maquette n\'existe pas' });
    }

    // Récupérer toutes les approbations pour cette maquette
    const approvals = await Approval.find({ maquette: maquette._id }).populate('manager', 'email');

    res.json(approvals);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Une erreur est survenue' });
  }
};
