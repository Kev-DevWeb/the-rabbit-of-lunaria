import * as admin from 'firebase-admin';

if (!admin.apps.length) {
  try {
    // Initialize Firebase Admin SDK
    // Ensure your service account key is stored securely as an environment variable
    // For Vercel, you can add this as an environment variable in your project settings.
    // The value should be the JSON content of your service account key file.
    admin.initializeApp({
      credential: admin.credential.cert(JSON.parse(process.env.FIREBASE_ADMIN_SDK_CONFIG || '{}')),
      databaseURL: `https://${process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID}.firebaseio.com`,
    });
  } catch (error) {
    console.error('Firebase Admin initialization error', error);
  }
}

const adminDb = admin.firestore();

export { adminDb };
