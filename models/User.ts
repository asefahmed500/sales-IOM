import mongoose, { Schema, Document } from 'mongoose'

export interface IUser extends Document {
  name: string
  email: string
  password: string
  role: 'admin' | 'manager' | 'executive'
  employeeId: string
  assignedManager?: mongoose.Types.ObjectId
  assignedTarget?: number
  phone?: string
  profilePicture?: string
  isActive?: boolean
  createdAt: Date
  updatedAt: Date
}

const UserSchema: Schema = new Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: true
  },
  role: {
    type: String,
    enum: ['admin', 'manager', 'executive'],
    required: true
  },
  employeeId: {
    type: String,
    required: true,
    unique: true
  },
  assignedManager: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: false
  },
  assignedTarget: {
    type: Number,
    required: false
  },
  phone: {
    type: String,
    required: false
  },
  profilePicture: {
    type: String,
    required: false
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
})

export default mongoose.models.User || mongoose.model<IUser>('User', UserSchema)
