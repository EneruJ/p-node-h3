import { Schema, model, Document } from 'mongoose';
import { IUser } from './User';
export interface IMaquette extends Document {
  name: string;
  url: string;
  title: string;
  artist: Schema.Types.ObjectId | IUser;
  validated: boolean;
  managerApprovals?: Array<Schema.Types.ObjectId>;
}


const maquetteSchema = new Schema({
  name: {
      type: String,
      required: true,
  },
  url: {
      type: String,
      required: true,
  },
  title: {
      type: String,
      required: true,
  },
  artist: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
  },
  validated: {
      type: Boolean,
      default: false,
  },
  managerApprovals: [{
      type: Schema.Types.ObjectId,
      ref: 'User',
  }],
});

maquetteSchema.methods.remove = async function () {
  await this.deleteOne();
};
const Maquette = model<IMaquette>('Maquette', maquetteSchema);

export default Maquette;