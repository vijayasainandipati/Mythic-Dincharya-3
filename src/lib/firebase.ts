// Import the functions you need from the SDKs you need
import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID
};

// Initialize Firebase on the client only to avoid Next.js prerender/SSR issues
const app = typeof window !== 'undefined'
  ? (!getApps().length ? initializeApp(firebaseConfig) : getApp())
  // During build/prerender there is no window. We export a typed placeholder that
  // is never used at runtime, keeping types intact without executing Firebase.
  : (null as unknown as ReturnType<typeof initializeApp>);

const auth = typeof window !== 'undefined'
  ? getAuth(app)
  : (null as unknown as ReturnType<typeof getAuth>);

const db = typeof window !== 'undefined'
  ? getFirestore(app)
  : (null as unknown as ReturnType<typeof getFirestore>);

export { app, auth, db };
