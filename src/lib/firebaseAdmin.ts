import * as admin from 'firebase-admin';

// Esta es la versión final y simplificada.
// Lee una única variable de entorno que contiene el JSON de la clave de servicio.
// Es resiliente al build: no crashea si la variable no está definida (ej. en CI/CD o build local).

let _initialized = false;

function ensureInitialized() {
  if (_initialized) return;
  _initialized = true;

  if (admin.apps.length) return;

  try {
    const serviceAccountString = process.env.FIREBASE_ADMIN_SDK_CONFIG;

    if (!serviceAccountString) {
      console.warn(
        '⚠️ FIREBASE_ADMIN_SDK_CONFIG no está definida. ' +
        'Firebase Admin no se inicializará. Las API routes que dependen de Firestore no funcionarán.'
      );
      return;
    }

    const serviceAccount = JSON.parse(serviceAccountString);

    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
      databaseURL: `https://${process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID}.firebaseio.com`,
    });
  } catch (error) {
    console.error('Error al inicializar Firebase Admin:', error);
  }
}

/**
 * Proxy que inicializa Firebase Admin de forma lazy.
 * No crashea durante el build de Next.js, solo cuando se usa realmente en runtime.
 */
export const adminDb = new Proxy({} as admin.firestore.Firestore, {
  get(_target, prop) {
    ensureInitialized();
    if (!admin.apps.length) {
      throw new Error(
        'Firebase Admin no está inicializado. Verifica que FIREBASE_ADMIN_SDK_CONFIG esté definida en las variables de entorno.'
      );
    }
    const firestore = admin.firestore();
    return (firestore as unknown as Record<string | symbol, unknown>)[prop];
  },
});
