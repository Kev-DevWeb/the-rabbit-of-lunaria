import * as admin from 'firebase-admin';

// Esta es la versión final y simplificada.
// Lee una única variable de entorno que contiene el JSON de la clave de servicio.

if (!admin.apps.length) {
  try {
    const serviceAccountString = process.env.FIREBASE_ADMIN_SDK_CONFIG;

    if (!serviceAccountString) {
      throw new Error('La variable de entorno FIREBASE_ADMIN_SDK_CONFIG no está definida.');
    }

    const serviceAccount = JSON.parse(serviceAccountString);

    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
      databaseURL: `https://${process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID}.firebaseio.com`,
    });
    console.log('Firebase Admin SDK inicializado correctamente desde la variable de entorno.');

  } catch (error) {
    console.error('Error al inicializar Firebase Admin:', error);
  }
}

export const adminDb = admin.firestore();
