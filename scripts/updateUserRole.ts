import mongoose from 'mongoose'
import User from '../models/User'
import dbConnect from '../lib/db'

async function updateUserRole() {
  try {
    await dbConnect()
    
    // Find a user and update their role
    // Replace 'test@example.com' with an actual email from your database
    const user = await User.findOne({ email: 'test@example.com' })
    
    if (!user) {
      console.log('User not found')
      return
    }
    
    console.log('Current role:', user.role)
    
    // Change role (cycle through roles for testing)
    if (user.role === 'executive') {
      user.role = 'manager'
    } else if (user.role === 'manager') {
      user.role = 'admin'
    } else {
      user.role = 'executive'
    }
    
    await user.save()
    console.log('Updated role to:', user.role)
  } catch (error) {
    console.error('Error updating user role:', error)
  } finally {
    await mongoose.connection.close()
  }
}

updateUserRole()