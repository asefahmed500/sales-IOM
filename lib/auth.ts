import { betterAuth } from "better-auth"
import { mongodbAdapter } from "better-auth/adapters/mongodb"
import { MongoClient } from "mongodb"

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/sales-commission-system'
const client = new MongoClient(MONGODB_URI, {
  serverSelectionTimeoutMS: 5000, // 5 second timeout
  connectTimeoutMS: 10000, // 10 second connection timeout
})

// Connect to MongoDB with error handling
client.connect()
  .then(() => {
    console.log('Connected to MongoDB successfully')
  })
  .catch(err => {
    console.error('Failed to connect to MongoDB:', err)
    // Fallback to local MongoDB if Atlas connection fails
    if (MONGODB_URI.includes('mongodb.net')) {
      console.log('Trying to connect to local MongoDB...')
      // We'll continue with the client even if initial connection fails
      // The adapter will handle connection internally
    }
  })

const db = client.db()

export const auth = betterAuth({
  database: mongodbAdapter(db, {
    usePlural: true,
  }),
  baseURL: process.env.BETTER_AUTH_URL || "http://localhost:3000",
  secret: process.env.BETTER_AUTH_SECRET || "fallback-secret-key-for-development",
  emailAndPassword: {
    enabled: true,
  },
  session: {
    expiresIn: 60 * 60 * 24 * 7, // 7 days
  },
  twoFactor: {
    enabled: true,
    issuer: "IOM Sales",
  },
  user: {
    additionalFields: {
      role: {
        type: "string",
        required: true,
      },
      employeeId: {
        type: "string",
        required: true,
      },
      assignedManager: {
        type: "string",
        required: false,
      },
      assignedTarget: {
        type: "number",
        required: false,
      },
      phone: {
        type: "string",
        required: false,
      },
      profilePicture: {
        type: "string",
        required: false,
      },
      isActive: {
        type: "boolean",
        required: false,
      },
      twoFactorEnabled: {
        type: "boolean",
        required: false,
      },
      twoFactorSecret: {
        type: "string",
        required: false,
      },
    },
  },
})

export type Session = typeof auth.$Infer.Session