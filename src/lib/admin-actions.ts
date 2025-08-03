
'use server';

import { initializeApp, getApps, getApp, App, cert } from "firebase-admin/app";
import { getAuth as getAdminAuth, UserRecord } from "firebase-admin/auth";
import { getFirestore } from "firebase-admin/firestore";

// This is the recommended way to initialize the Firebase Admin SDK.
// It handles both local development (using a service account file) and
// deployed environments (like App Hosting) where credentials are automatically discovered.
const adminApp = (): App => {
    if (getApps().length > 0) {
        return getApp();
    }
    
    // Check for GOOGLE_APPLICATION_CREDENTIALS for local dev
    if (process.env.GOOGLE_APPLICATION_CREDENTIALS) {
      console.log('Initializing with GOOGLE_APPLICATION_CREDENTIALS');
      return initializeApp({
        credential: cert(process.env.GOOGLE_APPLICATION_CREDENTIALS),
      });
    }

    // Check for explicit SERVICE_ACCOUNT env var
    const serviceAccountString = process.env.SERVICE_ACCOUNT;
    if (serviceAccountString) {
        try {
            console.log('Initializing with SERVICE_ACCOUNT env var.');
            const serviceAccount = JSON.parse(serviceAccountString);
            return initializeApp({
                credential: cert(serviceAccount),
            });
        } catch (e) {
            console.error("Failed to parse SERVICE_ACCOUNT. Please ensure it's a valid JSON string.", e);
            throw new Error("Invalid service account credentials.");
        }
    }
    
    console.log('Initializing with Application Default Credentials');
    // Fallback for deployed environments
    return initializeApp();
};


export async function listAllAuthUsers(): Promise<{uid: string, email: string | undefined}[]> {
  try {
    const auth = getAdminAuth(adminApp());
    const userRecords: UserRecord[] = [];
    let pageToken;

    do {
      const listUsersResult = await auth.listUsers(1000, pageToken);
      userRecords.push(...listUsersResult.users);
      pageToken = listUsersResult.pageToken;
    } while (pageToken);
    
    return userRecords.map(user => ({
        uid: user.uid,
        email: user.email
    }));

  } catch (error) {
    console.error('Error listing users:', error);
    // Re-throw the error with a more specific message that includes the likely solution.
    // This helps the front-end identify the issue and display a helpful message.
    throw new Error("Could not list users. Ensure the service account has 'Firebase Authentication Admin' role.");
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
        // We don't throw here to avoid failing the signup process
    }
}
