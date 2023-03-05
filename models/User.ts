import { Schema, model, Document } from 'mongoose';

export interface IUser extends Document {
  email: string;
  password: string;
  role: 'admin' | 'manager' | 'artist';
  isBanned?: boolean;
  maquettes?: Array<Schema.Types.ObjectId>;
  pseudo?: string;
  dateInscription: Date;
}

const userSchema = new Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ['admin', 'manager', 'artist'],
    required: true,
  },
  isBanned: {
    type: Boolean,
    default: false,
  },
  maquettes: [{
    type: Schema.Types.ObjectId,
    ref: 'Maquette',
  }],
  pseudo: {
    type: String,
  },
  dateInscription: {
    type: Date,
    default: Date.now,
  },
});

export const User = model<IUser>('User', userSchema);