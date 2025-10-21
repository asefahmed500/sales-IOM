import mongoose, { Schema, Document } from 'mongoose'

export interface ISale extends Document {
  salesExecutive: mongoose.Types.ObjectId
  productName: string
  saleAmount: number
  quantity: number
  saleDate: Date
  status: 'sold' | 'not_sold'
  productImage?: string
  createdAt: Date
  updatedAt: Date
}

const SaleSchema: Schema = new Schema({
  salesExecutive: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  productName: {
    type: String,
    required: true,
    trim: true
  },
  saleAmount: {
    type: Number,
    required: true,
    min: 0
  },
  quantity: {
    type: Number,
    required: true,
    min: 1
  },
  saleDate: {
    type: Date,
    required: true,
    default: Date.now
  },
  status: {
    type: String,
    enum: ['sold', 'not_sold'],
    required: true,
    default: 'sold'
  },
  productImage: {
    type: String,
    required: false
  }
}, {
  timestamps: true
})

export default mongoose.models.Sale || mongoose.model<ISale>('Sale', SaleSchema)
