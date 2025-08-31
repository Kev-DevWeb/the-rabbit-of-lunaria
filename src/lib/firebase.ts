// src/lib/firebase.ts
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// TODO: Reemplaza esto con tu objeto de configuración de Firebase
// Puedes encontrarlo en la consola de Firebase, en Configuración del proyecto -> Tus apps -> Web
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAZO5sQc-inY1GfcCNqQ_3ovjW8B8zynBo",
  authDomain: "lunariarabbit.firebaseapp.com",
  projectId: "lunariarabbit",
  storageBucket: "lunariarabbit.firebasestorage.app",
  messagingSenderId: "953994126619",
  appId: "1:953994126619:web:0123a6b84f462fd488dfbe",
  measurementId: "G-PM472KT27W"
};

// Inicializa Firebase
const app = initializeApp(firebaseConfig);

// Exporta la instancia de Firestore
export const db = getFirestore(app);
