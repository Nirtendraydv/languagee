
'use server';

import { initializeApp, getApps, getApp, App, cert } from "firebase-admin/app";
import { getAuth as getAdminAuth, UserRecord } from "firebase-admin/auth";
import { getFirestore } from "firebase-admin/firestore";

const adminApp = (): App => {
    if (getApps().length > 0) {
        return getApp();
    }
    
    if (process.env.GOOGLE_APPLICATION_CREDENTIALS) {
      try {
        const serviceAccount = JSON.parse(process.env.GOOGLE_APPLICATION_CREDENTIALS);
         return initializeApp({
            credential: cert(serviceAccount),
        });
      } catch (e) {
         console.error("Failed to parse GOOGLE_APPLICATION_CREDENTIALS. Please ensure it's a valid JSON string or a path to a file.", e);
         // Fallback to default credentials if parsing fails
      }
    }

    if (process.env.SERVICE_ACCOUNT) {
        try {
            const serviceAccount = JSON.parse(process.env.SERVICE_ACCOUNT);
            return initializeApp({
                credential: cert(serviceAccount),
            });
        } catch (e) {
            console.error("Failed to parse SERVICE_ACCOUNT. Please ensure it's a valid JSON string.", e);
        }
    }
    
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
    const errorMessage = "Could not list users. Ensure the service account has 'Firebase Authentication Admin' role.";
    // Check for specific permission error codes
    if (error.code === 'permission-denied' || error.message.includes('insufficient permissions')) {
        return { users: [], error: errorMessage };
    }
    // Re-throw other types of errors
    throw new Error(error.message || "An unknown error occurred while listing users.");
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
