import { createAuthClient } from "better-auth/react"

// Get the base URL dynamically for client-side
const getClientBaseURL = () => {
    // In browser, use the current origin
    if (typeof window !== 'undefined') {
        return window.location.origin;
    }
    // Fallback for SSR
    return process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
};

export const authClient = createAuthClient({
    baseURL: getClientBaseURL()
})
