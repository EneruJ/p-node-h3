import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { User, IUser } from '../models/User';

// Fonction pour générer un token JWT
function generateToken(user: IUser) {
  const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET_KEY!, {
    expiresIn: '1h',
  });
  return token;
}

// Fonction pour s'inscrire
async function register(req: Request, res: Response, next: NextFunction) {
  try {
    const { email, password, role, pseudo } = req.body;

    // Vérifier si l'utilisateur existe déjà
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Cet email est déjà utilisé.' });
    }

    // Hasher le mot de passe
    const hashedPassword = await bcrypt.hash(password, 10);

    // Créer un nouvel utilisateur
    const newUser = new User({
      email,
      password: hashedPassword,
      role,
      pseudo,
    });

    // Sauvegarder l'utilisateur dans la base de données
    await newUser.save();

    // Générer un token JWT pour l'utilisateur
    const token = generateToken(newUser);

    // Renvoyer la réponse
    return res.status(201).json({ token, user: newUser });
  } catch (error) {
    return next(error);
  }
}

// Fonction pour se connecter
async function login(req: Request, res: Response, next: NextFunction) {
  try {
    const { email, password } = req.body;

    // Vérifier si l'utilisateur existe
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Email ou mot de passe incorrect.' });
    }

    // Vérifier si le mot de passe est correct
    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) {
      return res.status(400).json({ message: 'Email ou mot de passe incorrect.' });
    }

    // Générer un token JWT pour l'utilisateur
    const token = generateToken(user);

    // Renvoyer la réponse
    return res.status(200).json({ token, user });
  } catch (error) {
    return next(error);
  }
}

export { register, login };
