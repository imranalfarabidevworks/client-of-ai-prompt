import { betterAuth } from "better-auth";

export const auth = betterAuth({
  secret: process.env.BETTER_AUTH_SECRET || "change-this-secret-in-production",
  baseURL: process.env.BETTER_AUTH_URL || "http://localhost:3000",
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    },
  },
  // Better Auth session — শুধু Google OAuth handle করবে
  // বাকি সব (JWT, role, DB) তোমার MongoDB server করবে
  session: {
    expiresIn: 60 * 10, // 10 minutes — শুধু callback এর জন্য
  },
});
