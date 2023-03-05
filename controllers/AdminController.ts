import { Request, Response } from 'express';
import { User, IUser } from '../models/User';

// Supprimer un compte utilisateur
export const deleteUser = async (req: Request, res: Response) => {
  try {
    const user = req.user as IUser;

    // Vérifier que l'utilisateur est un admin
    if (user.role !== 'admin') {
      return res.status(403).json({ message: 'Vous n\'êtes pas autorisé à supprimer des utilisateurs' });
    }

    const userId = req.params.id;

    // Vérifier que l'utilisateur existe
    const userToDelete = await User.findById(userId);
    if (!userToDelete) {
      return res.status(404).json({ message: 'L\'utilisateur n\'existe pas' });
    }

    // Supprimer l'utilisateur
    await User.deleteOne({ _id: userId });

    res.status(204).send();
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Une erreur est survenue' });
  }
};


// Bannir un artiste
export const banArtist = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    // Vérifier que l'utilisateur existe et est un artiste
    const user = await User.findById(id);
    if (!user || user.role !== 'artist') {
      return res.status(404).json({ message: 'L\'artiste n\'existe pas' });
    }

    // Bannir l'artiste
    user.isBanned = true;
    await user.save();

    res.json({ message: 'L\'artiste a été banni' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Une erreur est survenue' });
  }
};

// Ajouter un manager
export const addManager = async (req: Request, res: Response) => {
  try {
    const { email } = req.body;

    // Vérifier que l'utilisateur existe
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'L\'utilisateur n\'existe pas' });
    }

    // Ajouter le rôle de manager à l'utilisateur
    user.role = 'manager';
    await user.save();

    res.json({ message: 'Le manager a été ajouté' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Une erreur est survenue' });
  }
};
