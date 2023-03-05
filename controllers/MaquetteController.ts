import { Request, Response } from 'express';
import { User, IUser } from '../models/User';
import { IApproval } from '../models/Approval';
import Maquette, { IMaquette } from '../models/Maquette';
import Approval from '../models/Approval';



// Ajoute une maquette à un utilisateur
export const addMaquette = async (req: Request, res: Response) => {
  try {
    const user = req.user as IUser;
    const { name, url, title } = req.body;
    const maquette = new Maquette({
      name,
      url,
      title,
      artist: user._id,
    });
    const savedMaquette = await maquette.save();
    user.maquettes = user.maquettes ?? [];
    user.maquettes.push(savedMaquette._id);
    await user.save();
    res.status(201).json(savedMaquette);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Une erreur est survenue' });
  }
};

// Récupère les maquettes d'un artiste
export const getArtistMaquettes = async (req: Request, res: Response) => {
    try {
      const user = req.user as IUser;
  
      // Récupérer toutes les maquettes de l'artiste
      const maquettes = await Maquette.find({ artist: user._id });
  
      res.json(maquettes);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Une erreur est survenue' });
    }
  };
  
// Récupère toutes les maquettes (accessible pour les managers et les admins)
export const getAllMaquettes = async (req: Request, res: Response) => {
    try {
      const user = req.user as IUser;
  
      // Vérifier que l'utilisateur est un manager ou un admin
      if (user.role !== 'manager' && user.role !== 'admin') {
        return res.status(403).json({ message: 'Vous n\'êtes pas autorisé à voir toutes les maquettes' });
      }
  
      // Récupérer toutes les maquettes
      const maquettes = await Maquette.find();
  
      res.json(maquettes);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Une erreur est survenue' });
    }
  };
  
// Supprime une maquette d'un utilisateur
export const deleteMaquette = async (req: Request, res: Response) => {
  try {
    const user = req.user as IUser;
    const { id } = req.params;
    const maquette = await Maquette.findById(id) as Document & IMaquette;
    if (!maquette) {
      return res.status(404).json({ message: 'La maquette n\'existe pas' });
    }
    if (maquette.artist.toString() !== user._id.toString()) {
        return res.status(403).json({ message: 'Vous n\'êtes pas autorisé à supprimer cette maquette' });
      }
      
    await maquette.deleteOne();
    user.maquettes = user.maquettes ?? [];
    user.maquettes = user.maquettes.filter((maquetteId) => maquetteId.toString() !== id);
    await user.save();
    res.json({ message: 'La maquette a bien été supprimée' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Une erreur est survenue' });
  }
};
