
'use server';

import { initializeApp, getApps, getApp, App, cert } from "firebase-admin/app";
import { getAuth as getAdminAuth, UserRecord } from "firebase-admin/auth";

// This is the recommended way to initialize the Firebase Admin SDK.
// It handles both local development (using a service account file) and
// deployed environments (like App Hosting) where credentials are automatically discovered.
const adminApp = (): App => {
    // If the app is already initialized, return the existing instance.
    if (getApps().length > 0) {
        return getApp();
    }

    // Check if the service account credentials are provided as a JSON string
    // in the environment variable. This is for local development.
    const serviceAccountString = process.env.SERVICE_ACCOUNT;
    if (serviceAccountString) {
        try {
            const serviceAccount = JSON.parse(serviceAccountString);
            // Initialize with the parsed service account credentials.
            return initializeApp({
                credential: cert(serviceAccount),
            });
        } catch (e) {
            console.error("Failed to parse SERVICE_ACCOUNT. Please ensure it's a valid JSON string.", e);
            // If parsing fails, we throw an error because local development will not work without it.
            throw new Error("Invalid service account credentials.");
        }
    }

    // If the environment variable is not set, initialize with Application Default Credentials.
    // This is the standard for Firebase and Google Cloud environments (e.g., App Hosting, Cloud Functions).
    return initializeApp();
};

export async function listAllUsers(): Promise<{uid: string, email: string}[]> {
  try {
    const auth = getAdminAuth(adminApp());
    const userRecords: UserRecord[] = [];
    let pageToken;

    // The listUsers method retrieves users in batches.
    // This loop ensures all users are fetched.
    do {
      const listUsersResult = await auth.listUsers(1000, pageToken);
      userRecords.push(...listUsersResult.users);
      pageToken = listUsersResult.pageToken;
    } while (pageToken);
    
    // Map the user records to a simpler object for the client-side.
    return userRecords.map(user => ({
        uid: user.uid,
        email: user.email || 'No email'
    }));

  } catch (error) {
    console.error('Error listing users:', error);
    // Depending on your error handling policy, you might want to re-throw the error
    // or return an empty array.
    throw new Error("Could not list users.");
  }
}
