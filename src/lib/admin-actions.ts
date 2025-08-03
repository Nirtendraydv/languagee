
'use server';

import { initializeApp, getApps, getApp, App, cert } from "firebase-admin/app";
import { getAuth as getAdminAuth, UserRecord } from "firebase-admin/auth";

const adminApp = (): App => {
    if (getApps().length > 0) {
        return getApp();
    }

    const serviceAccountString = process.env.GOOGLE_APPLICATION_CREDENTIALS;
    if (serviceAccountString) {
        try {
            const serviceAccount = JSON.parse(serviceAccountString);
            return initializeApp({
                credential: cert(serviceAccount),
            });
        } catch (e) {
            console.error("Failed to parse GOOGLE_APPLICATION_CREDENTIALS. Falling back to default initialization.", e);
            // Fallthrough to default initialization for environments like App Hosting
        }
    }

    // Use default credentials provided by the App Hosting environment.
    return initializeApp();
};

export async function listAllUsers(): Promise<{uid: string, email: string}[]> {
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
        email: user.email || 'No email'
    }));

  } catch (error) {
    console.error('Error listing users:', error);
    // Depending on your error handling policy, you might want to re-throw the error
    // or return an empty array.
    throw new Error("Could not list users.");
  }
}
