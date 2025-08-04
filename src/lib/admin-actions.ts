
'use server';

import { initializeApp, getApps, getApp, App, cert } from "firebase-admin/app";
import { getAuth as getAdminAuth, UserRecord } from "firebase-admin/auth";
import { getFirestore } from "firebase-admin/firestore";

// This function initializes and returns the Firebase Admin App instance.
// It uses a singleton pattern to ensure it's initialized only once.
const adminApp = (): App => {
    // If the app is already initialized, return the existing instance.
    if (getApps().length > 0) {
        return getApp();
    }

    // Try initializing with Base64 encoded service account first.
    if (process.env.GOOGLE_SERVICE_ACCOUNT_BASE64) {
        try {
            const decodedServiceAccount = Buffer.from(process.env.GOOGLE_SERVICE_ACCOUNT_BASE64, 'base64').toString('utf-8');
            const serviceAccountJson = JSON.parse(decodedServiceAccount);
            console.log("Initializing Firebase Admin with Base64 service account.");
            return initializeApp({
                credential: cert(serviceAccountJson),
            });
        } catch (e) {
            console.error("Failed to parse GOOGLE_SERVICE_ACCOUNT_BASE64. Ensure it's a valid Base64 encoded JSON. Falling back...", e);
        }
    }
    
    // If Base64 fails or is not present, try with file path (e.g., App Hosting default or local dev).
    if (process.env.GOOGLE_APPLICATION_CREDENTIALS) {
      try {
        console.log("Initializing Firebase Admin with GOOGLE_APPLICATION_CREDENTIALS file.");
        return initializeApp({
            credential: cert(process.env.GOOGLE_APPLICATION_CREDENTIALS),
        });
      } catch (e) {
         console.error("Failed to parse GOOGLE_APPLICATION_CREDENTIALS. Falling back...", e);
      }
    }
    
    // As a last resort, initialize with Application Default Credentials (ADC).
    // This is useful for many Google Cloud environments.
    console.log("Initializing Firebase Admin with Application Default Credentials.");
    return initializeApp();
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
    // For other errors, return a generic message
    return { users: [], error: error.message || "An unknown error occurred while listing users." };
  }
}

// Function to sync a newly created user from Auth to the 'users' collection in Firestore
export async function syncUserToFirestore(uid: string, email: string | null) {
    if (!uid || !email) return;

    const db = getFirestore(adminApp());
    const userRef = db.collection('users').doc(uid);

    try {
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
