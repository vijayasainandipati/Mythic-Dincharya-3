import { db } from './firebase';
import { doc, getDoc, updateDoc, increment, setDoc, serverTimestamp } from 'firebase/firestore';
import type { User as FirebaseUser } from 'firebase/auth';

export type AppUser = {
    id: string;
    username: string;
    email: string | null;
    dharmaPoints: number;
    createdAt: any;
}

export const incrementDharmaPoints = async (userId: string, points: number) => {
  if (!userId) return;
  const userRef = doc(db, 'users', userId);
  await updateDoc(userRef, {
    dharmaPoints: increment(points)
  });
};

export const getUserData = async (userId: string): Promise<AppUser | null> => {
    if (!userId) return null;
    const userRef = doc(db, 'users', userId);
    const userSnap = await getDoc(userRef);
    if (userSnap.exists()) {
        return { id: userSnap.id, ...userSnap.data() } as AppUser;
    } else {
        return null;
    }
}

export const createUserInFirestore = async (user: FirebaseUser, username: string) => {
    if (!user) return;
    const userRef = doc(db, 'users', user.uid);
    const userData = {
        username: username,
        email: user.email,
        dharmaPoints: 0,
        createdAt: serverTimestamp()
    };
    await setDoc(userRef, userData);
    return userData;
}
