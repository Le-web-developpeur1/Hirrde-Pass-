import { FirebaseApp, initializeApp } from "firebase/app";
import { Firestore, getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY || "AIzaSyBUVMhx3hOy66bIcHONsZrRqwbV_5lwCO0",
    authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN || "hirrde-pass.firebaseapp.com",
    projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID || "hirrde-pass",
    storageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET || "hirrde-pass.firebasestorage.app",
    messagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "597549685708",
    appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID || "1:597549685708:android:88b8375330c489e4f9db69",
    measurementId: process.env.EXPO_PUBLIC_FIREBASE_MEASUREMENT_ID || "G-8QRSTVKP0J"
};

let app: FirebaseApp;
let db: Firestore;

try {
    app = initializeApp(firebaseConfig);
    db = getFirestore(app);
} catch (error) {
    console.error("Firebase initialization error:", error);
    // Fallback: réessayer avec les valeurs par défaut
    app = initializeApp(firebaseConfig);
    db = getFirestore(app);
}

export { db };

