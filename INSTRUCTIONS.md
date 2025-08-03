
# How to Fix the "Missing or insufficient permissions" Error

You are seeing this error because the service account used by your application does not have the required permissions to manage Firebase Authentication users. The Firebase Admin SDK needs the **"Firebase Authentication Admin"** role to list users.

Since this AI assistant cannot modify your Google Cloud project's permissions, you will need to do this manually. It's a quick process.

## Steps to Grant Permissions

1.  **Find your Service Account:**
    *   Go to the Google Cloud Console: [https://console.cloud.google.com/](https://console.cloud.google.com/)
    *   Make sure you have selected the correct Google Cloud project that corresponds to your Firebase project.
    *   In the navigation menu (`☰`), go to **IAM & Admin** > **Service Accounts**.
    *   You are looking for the service account that your App Hosting backend uses. It usually looks like this: `firebase-app-hosting-backend@[YOUR-PROJECT-ID].iam.gserviceaccount.com`.

2.  **Grant the Required Role:**
    *   Go to the **IAM** page in the Google Cloud Console (`☰` > **IAM & Admin** > **IAM**).
    *   Click the **"+ GRANT ACCESS"** button at the top of the page.
    *   In the "New principals" field, paste the service account email you found in the previous step.
    *   In the "Assign roles" section, search for and select the **`Firebase Authentication Admin`** role.
    *   Click **"Save"**.

## For Local Development

If you are running this application on your local machine, you will need to authenticate using a service account key file.

1.  **Generate a Key:**
    *   On the **Service Accounts** page in the Google Cloud Console, find the same App Hosting service account.
    *   Click on the service account email.
    *   Go to the **"KEYS"** tab.
    *   Click **"ADD KEY"** > **"Create new key"**.
    *   Choose **"JSON"** as the key type and click **"CREATE"**. A JSON file will be downloaded to your computer.

2.  **Set the Environment Variable:**
    *   You need to tell the Admin SDK where to find this key file. You do this by setting an environment variable named `GOOGLE_APPLICATION_CREDENTIALS`.
    *   The value should be the **absolute path** to the JSON key file you downloaded.
    *   You can set this in your `.env` file (if you are using one) or directly in your terminal before running the app.

After you have granted the permissions in the Google Cloud Console, the "Missing or insufficient permissions" error should be resolved.
