import { Request, Response, NextFunction } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

import { User, IUser } from '../models/User';
import Maquette, { IMaquette } from '../models/Maquette';

declare global {
  namespace Express {
    interface Request {
      user?: { id: string };
    }
  }
}

const register = async (req: Request, res: Response, next: NextFunction) => {
  const { email, password, role, pseudo } = req.body;

  try {
    // Vérifie si l'utilisateur existe déjà
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(409).json({ message: 'Cet utilisateur existe déjà' });
    }

    // Crypte le mot de passe avant de l'enregistrer dans la base de données
    const hashedPassword = await bcrypt.hash(password, 10);

    // Crée un nouvel utilisateur avec les informations fournies
    const newUser: IUser = new User({
      email,
      password: hashedPassword,
      role,
      pseudo,
    });

    // Enregistre le nouvel utilisateur dans la base de données
    await newUser.save();

    res.status(201).json({ message: 'Utilisateur créé avec succès' });
  } catch (error) {
    next(error);
  }
};

const login = async (req: Request, res: Response, next: NextFunction) => {
  const { email, password } = req.body;

  try {
    // Vérifie si l'utilisateur existe dans la base de données
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({ message: 'Identifiants invalides' });
    }

    // Vérifie si le mot de passe est correct
    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      return res.status(401).json({ message: 'Identifiants invalides' });
    }

    // Crée un token d'authentification
    const token = jwt.sign(
      { userId: user._id, email: user.email },
      process.env.JWT_SECRET as string,
      { expiresIn: '1h' }
    );

    res.status(200).json({ token, expiresIn: 3600, userId: user._id, role: user.role });
  } catch (error) {
    next(error);
  }
};

const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
  try {
    // Vérifie que la variable d'environnement JWT_SECRET est définie
    if (!process.env.JWT_SECRET) {
      throw new Error('JWT_SECRET must be defined');
    }

    // Récupère le token d'authentification s'il est présent
    const authorizationHeader = req.headers.authorization;
    if (!authorizationHeader) {
      throw new Error('Authentification requise');
    }

    const token = authorizationHeader.split(' ')[1];
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);

    // Stocke l'ID de l'utilisateur dans la requête
    req.user = { id: (decodedToken as any).userId };
    next();
  } catch (error) {
    res.status(401).json({ message: error.message });
  }
};



const getMaquettes = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const maquettes = await Maquette.find({ artist: req.body.userId });
    res.status(200).json(maquettes); } catch (error) { next(error); } };

    const createMaquette = async (req: Request, res: Response, next: NextFunction) => { const { name, url, title } = req.body;
    
    try { // Crée une nouvelle maquette avec les informations fournies 
    const newMaquette = new Maquette({ name, url, title, artist: req.body.userId, });
    
    // Enregistre la nouvelle maquette dans la base de données
    await newMaquette.save();
    
    // Ajoute la maquette à la liste des maquettes de l'artiste
    const user = await User.findById(req.body.userId);
    user?.maquettes?.push(newMaquette._id);
    await user?.save();
    
    res.status(201).json({ message: 'Maquette créée avec succès' });
    } catch (error) { next(error); } };
    
export { getMaquettes, createMaquette, authMiddleware, register, login };