import mongoose from 'mongoose'
import bcrypt from 'bcryptjs'
import dbConnect from '../lib/db'
import User from '../models/User'
import Sale from '../models/Sale'
import CommissionRule from '../models/CommissionRule'

async function seedDatabase() {
  try {
    console.log('🌱 Starting database seeding...')
    
    await dbConnect()
    
    // Clear existing data
    await User.deleteMany({})
    await Sale.deleteMany({})
    await CommissionRule.deleteMany({})
    
    console.log('🧹 Cleared existing data')
    
    // Hash passwords
    const hashedPassword = await bcrypt.hash('password123', 10)
    
    // Create users
    const admin = await User.create({
      name: 'Admin User',
      email: 'admin@company.com',
      password: await bcrypt.hash('admin123', 10),
      role: 'admin',
      employeeId: 'A001'
    })
    
    const manager = await User.create({
      name: 'John Manager',
      email: 'manager@company.com',
      password: await bcrypt.hash('manager123', 10),
      role: 'manager',
      employeeId: 'M001'
    })
    
    const executive1 = await User.create({
      name: 'John Doe',
      email: 'john@company.com',
      password: await bcrypt.hash('exec123', 10),
      role: 'executive',
      employeeId: 'E001',
      assignedManager: manager._id,
      assignedTarget: 10000,
      phone: '+1-555-0101',
      isActive: true
    })
    
    const executive2 = await User.create({
      name: 'Jane Smith',
      email: 'jane@company.com',
      password: await bcrypt.hash('exec123', 10),
      role: 'executive',
      employeeId: 'E002',
      assignedManager: manager._id,
      assignedTarget: 10000,
      phone: '+1-555-0102',
      isActive: true
    })
    
    const executive3 = await User.create({
      name: 'Mike Johnson',
      email: 'mike@company.com',
      password: await bcrypt.hash('exec123', 10),
      role: 'executive',
      employeeId: 'E003',
      assignedManager: manager._id,
      assignedTarget: 12000,
      phone: '+1-555-0103',
      isActive: true
    })
    
    console.log('👥 Created users')
    
    // Create commission rules
    await CommissionRule.create([
      {
        targetFrom: 80,
        targetTo: 89,
        commissionRate: 1
      },
      {
        targetFrom: 90,
        targetTo: 99,
        commissionRate: 2
      },
      {
        targetFrom: 100,
        targetTo: null,
        commissionRate: 3
      }
    ])
    
    console.log('📊 Created commission rules')
    
    // Create sample sales for demonstration
    const sampleSales = [
      {
        salesExecutive: executive1._id,
        productName: 'Laptop Computer',
        saleAmount: 1200,
        quantity: 1,
        saleDate: new Date(),
        status: 'sold'
      },
      {
        salesExecutive: executive2._id,
        productName: 'Software License',
        saleAmount: 500,
        quantity: 2,
        saleDate: new Date(),
        status: 'sold'
      }
    ]
    
    await Sale.insertMany(sampleSales)
    
    console.log('💰 Created sample sales records')
    
    console.log('✅ Database seeding completed successfully!')
    console.log('\n📋 Demo Accounts:')
    console.log('Admin: admin@company.com / admin123')
    console.log('Manager: manager@company.com / manager123')
    console.log('Executive: john@company.com / exec123')
    console.log('Executive: jane@company.com / exec123')
    console.log('Executive: mike@company.com / exec123')
    
    process.exit(0)
  } catch (error) {
    console.error('❌ Error seeding database:', error)
    process.exit(1)
  }
}

seedDatabase()
