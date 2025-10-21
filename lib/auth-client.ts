import { createAuthClient } from "better-auth/react"
import { bearer } from "better-auth/plugins"

export const authClient = createAuthClient({
  baseURL: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
  plugins: [bearer()]
})

export const { signIn, signOut, useSession } = authClient
