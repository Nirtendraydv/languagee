
'use server';

import { initializeApp, getApps, getApp, App, cert } from "firebase-admin/app";
import { getAuth as getAdminAuth, UserRecord } from "firebase-admin/auth";
import { getFirestore } from "firebase-admin/firestore";

// This function initializes and returns the Firebase Admin App instance.
// It uses a singleton pattern to ensure it's initialized only once.
const adminApp = (): App => {
    // If an app is already initialized, return it to prevent re-initialization.
    if (getApps().length > 0) {
        return getApp();
    }

    // Attempt to initialize with Base64 encoded service account from environment variables.
    // This is the recommended approach for secure environments like Firebase App Hosting.
    if (process.env.GOOGLE_SERVICE_ACCOUNT_BASE64) {
        try {
            const decodedServiceAccount = Buffer.from(process.env.GOOGLE_SERVICE_ACCOUNT_BASE64, 'base64').toString('utf-8');
            const serviceAccountJson = JSON.parse(decodedServiceAccount);
            console.log("Attempting to initialize Firebase Admin with Base64 service account...");
            return initializeApp({ credential: cert(serviceAccountJson) });
        } catch (e) {
            console.error("Failed to initialize with GOOGLE_SERVICE_ACCOUNT_BASE64. Ensure it's a valid Base64 encoded JSON. Falling back...", e);
        }
    }
    
    // If Base64 fails or isn't present, try initializing with a file path.
    // This is common for local development or environments where a file path is set.
    if (process.env.GOOGLE_APPLICATION_CREDENTIALS) {
      try {
        console.log("Attempting to initialize Firebase Admin with GOOGLE_APPLICATION_CREDENTIALS file...");
        return initializeApp({ credential: cert(process.env.GOOGLE_APPLICATION_CREDENTIALS) });
      } catch (e) {
         console.error("Failed to initialize with GOOGLE_APPLICATION_CREDENTIALS file. Falling back...", e);
      }
    }
    
    // As a last resort, initialize with Application Default Credentials (ADC).
    // This is useful for many Google Cloud environments (like Cloud Run, GCE) where the
    // runtime is already authenticated.
    console.log("Attempting to initialize Firebase Admin with Application Default Credentials...");
    try {
        return initializeApp();
    } catch (e) {
        console.error("FATAL: Could not initialize Firebase Admin SDK. All authentication methods failed.", e);
        // If all methods fail, we throw an error to prevent the app from running
        // in a broken state where backend services would inevitably fail.
        throw new Error("Could not initialize Firebase Admin SDK. Please check your service account credentials.");
    }
};


export async function listAllAuthUsers(): Promise<{ users: {uid: string, email: string | undefined}[]; error?: string }> {
  try {
    const auth = getAdminAuth(adminApp());
    const userRecords: UserRecord[] = [];
    let pageToken;

    do {
      const listUsersResult = await auth.listUsers(1000, pageToken);
      userRecords.push(...listUsersResult.users);
      pageToken = listUsersResult.pageToken;
    } while (pageToken);
    
    const users = userRecords.map(user => ({
        uid: user.uid,
        email: user.email
    }));

    return { users };

  } catch (error: any) {
    console.error('Error listing users:', error);
    // Check for specific permission error codes from Firebase Admin SDK
    if (error.code === 'permission-denied' || error.code === 'app/insufficient-permission' || (error.message && error.message.includes('insufficient permissions'))) {
        const errorMessage = "Could not list users. The service account does not have the 'Firebase Authentication Admin' role. Please follow the setup instructions.";
        return { users: [], error: errorMessage };
    }
     if (error.message.includes("Could not initialize Firebase Admin SDK")) {
        return { users: [], error: "The server is misconfigured. Please check the service account credentials." };
    }
    // For other errors, return a generic message
    return { users: [], error: error.message || "An unknown error occurred while listing users." };
  }
}

// Function to sync a newly created user from Auth to the 'users' collection in Firestore
export async function syncUserToFirestore(uid: string, email: string | null) {
    if (!uid || !email) return;

    try {
        const db = getFirestore(adminApp());
        const userRef = db.collection('users').doc(uid);

        await userRef.set({
            uid,
            email,
            createdAt: new Date().toISOString(),
        }, { merge: true });
    } catch (error) {
        console.error("Error syncing user to Firestore:", error);
        // We don't throw here to avoid failing the signup process, but we could add more robust error handling
    }
}
