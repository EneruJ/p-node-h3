import { Schema, model, Document } from 'mongoose';

export interface IApproval extends Document {
  isApproved: boolean;
  comment: string;
  manager: Schema.Types.ObjectId;
  maquette: Schema.Types.ObjectId;
}

const approvalSchema = new Schema({
  isApproved: {
    type: Boolean,
    required: true,
  },
  comment: {
    type: String,
    required: true,
  },
  manager: {
    type: Schema.Types.ObjectId,
    ref: 'Manager',
    required: true,
  },
  maquette: {
    type: Schema.Types.ObjectId,
    ref: 'Maquette',
    required: true,
  },
});

const Approval = model<IApproval>('Approval', approvalSchema);

export default Approval;