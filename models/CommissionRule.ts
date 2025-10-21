import mongoose, { Schema, Document } from 'mongoose'

export interface ICommissionRule extends Document {
  targetFrom: number
  targetTo: number | null
  commissionRate: number
  createdAt: Date
  updatedAt: Date
}

const CommissionRuleSchema: Schema = new Schema({
  targetFrom: {
    type: Number,
    required: true,
    min: 0
  },
  targetTo: {
    type: Number,
    required: false,
    min: 0
  },
  commissionRate: {
    type: Number,
    required: true,
    min: 0,
    max: 100
  }
}, {
  timestamps: true
})

export default mongoose.models.CommissionRule || mongoose.model<ICommissionRule>('CommissionRule', CommissionRuleSchema)
