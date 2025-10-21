import mongoose, { Schema, Document } from 'mongoose'

export interface ICommissionRecord extends Document {
  salesExecutive: mongoose.Types.ObjectId
  amount: number
  calculatedBy: mongoose.Types.ObjectId
  calculationDate: Date
  salesTotal: number
  targetAchievement: number
  commissionRate: number
  status: 'pending' | 'approved' | 'rejected' | 'paid'
  approvedBy?: mongoose.Types.ObjectId
  approvedDate?: Date
  rejectedBy?: mongoose.Types.ObjectId
  rejectedDate?: Date
  paidDate?: Date
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
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected', 'paid'],
    default: 'pending'
  },
  approvedBy: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: false
  },
  approvedDate: {
    type: Date,
    required: false
  },
  rejectedBy: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: false
  },
  rejectedDate: {
    type: Date,
    required: false
  },
  paidDate: {
    type: Date,
    required: false
  }
}, {
  timestamps: true
})

export default mongoose.models.CommissionRecord || mongoose.model<ICommissionRecord>('CommissionRecord', CommissionRecordSchema)