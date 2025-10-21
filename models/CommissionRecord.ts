import mongoose, { Schema, Document } from 'mongoose'

export interface ICommissionRecord extends Document {
  salesExecutive: mongoose.Types.ObjectId
  amount: number
  calculatedBy: mongoose.Types.ObjectId
  calculationDate: Date
  salesTotal: number
  targetAchievement: number
  commissionRate: number
  createdAt: Date
  updatedAt: Date
}

const CommissionRecordSchema: Schema = new Schema({
  salesExecutive: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  amount: {
    type: Number,
    required: true,
    min: 0
  },
  calculatedBy: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  calculationDate: {
    type: Date,
    required: true,
    default: Date.now
  },
  salesTotal: {
    type: Number,
    required: true,
    min: 0
  },
  targetAchievement: {
    type: Number,
    required: true,
    min: 0
  },
  commissionRate: {
    type: Number,
    required: true,
    min: 0
  }
}, {
  timestamps: true
})

export default mongoose.models.CommissionRecord || mongoose.model<ICommissionRecord>('CommissionRecord', CommissionRecordSchema)
