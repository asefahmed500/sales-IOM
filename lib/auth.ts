import { betterAuth } from "better-auth"
import { mongooseAdapter } from "better-auth/adapters/mongoose"
import dbConnect from "./db"

export const auth = betterAuth({
  database: mongooseAdapter(dbConnect, {
    modelName: "User",
  }),
  emailAndPassword: {
    enabled: true,
  },
  session: {
    expiresIn: 60 * 60 * 24 * 7, // 7 days
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
    },
  },
})

export type Session = typeof auth.$Infer.Session
