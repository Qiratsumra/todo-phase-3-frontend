import { betterAuth } from "better-auth";
import { nextCookies } from "better-auth/next-js";
import { Pool } from "pg";

// Get the base URL dynamically for both development and production
const getBaseURL = () => {
    // For server-side rendering in production (Vercel)
    if (process.env.VERCEL_URL) {
        return `https://${process.env.VERCEL_URL}`;
    }
    // For explicit BETTER_AUTH_URL (can override in environment)
    if (process.env.BETTER_AUTH_URL) {
        return process.env.BETTER_AUTH_URL;
    }
    // Default to localhost for development
    return "http://localhost:3000";
};

export const auth = betterAuth({
    database: new Pool({
        connectionString: process.env.DATABASE_URL
    }),
    emailAndPassword: {
        enabled: true,
    },

    baseURL: getBaseURL(),
    secret: process.env.BETTER_AUTH_SECRET!,

    plugins: [nextCookies()]

})