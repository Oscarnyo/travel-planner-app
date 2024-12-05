// Import the functions you need from the SDKs you need
import { initializeApp, getApps, getApp } from "firebase/app";
import { initializeAuth, getAuth, getReactNativePersistence, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, EmailAuthProvider, reauthenticateWithCredential, updatePassword } from "firebase/auth";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getFirestore, collection, doc, setDoc, deleteDoc, getDocs, getDoc, query, where } from "firebase/firestore";
import { sendPasswordResetEmail as firebaseSendPasswordResetEmail } from "firebase/auth";
import { v4 as uuidv4 } from 'uuid';
import {FIREBASE_API_KEY} from "@env";

// web app's Firebase configuration
const firebaseConfig = {
  apiKey: FIREBASE_API_KEY,
  authDomain: "travel-planner-9d3c3.firebaseapp.com",
  projectId: "travel-planner-9d3c3",
  storageBucket: "travel-planner-9d3c3.appspot.com",
  messagingSenderId: "96596184343",
  appId: "1:96596184343:web:b34ecb9ba31e7bb8e2fb52"
};

let app;
let auth;
let db;

if (getApps().length === 0) {
  app = initializeApp(firebaseConfig);
  auth = initializeAuth(app, {
    persistence: getReactNativePersistence(AsyncStorage)
  });
} else {
  app = getApp();
  auth = getAuth(app);
}

db = getFirestore(app);


export const signUp = async (email, password, username) => {
  const userCredential = await createUserWithEmailAndPassword(auth, email, password);
  const user = userCredential.user;
  await setDoc(doc(db, "users", user.uid), {
    username: username,
    email: email
  });
  return userCredential;
};

export const signIn = async (email, password) => {
  try {
    return await signInWithEmailAndPassword(auth, email, password);
  } catch (error) {
    throw error;
  }
};

export const signOutUser = () => {
  return signOut(auth);
};

export const changePassword = async (oldPassword, newPassword) => {
  const user = auth.currentUser;
  if (!user) throw new Error('No user is currently signed in');

  const credential = EmailAuthProvider.credential(user.email, oldPassword);

  try {
    await reauthenticateWithCredential(user, credential);
    await updatePassword(user, newPassword);
  } catch (error) {
    if (error.code === 'auth/wrong-password') {
      throw new Error('The old password is incorrect');
    }
    throw error;
  }
};

export const sendPasswordResetEmail = (email) => {
  return firebaseSendPasswordResetEmail(auth, email);
};

export const addToFavorites = async (userId, place) => {
  try {
    if (!place.id) {
      place.id = uuidv4(); // Generate a unique ID if it doesn't exist
    }
    const favoritesRef = collection(db, 'users', userId, 'favorites');
    const q = query(favoritesRef, where("name", "==", place.name));
    const querySnapshot = await getDocs(q);
    
    if (querySnapshot.empty) {
      const favoriteRef = doc(db, 'users', userId, 'favorites', place.id);
      await setDoc(favoriteRef, place);
      return true; // Return true if the place was added
    }
    return false; // Return false if the place already exists
  } catch (error) {
    console.error('Error adding to favorites:', error);
    throw error;
  }
};

export const removeFromFavorites = async (userId, placeId) => {
  try {
    if (!userId || !placeId) {
      console.error('Invalid userId or placeId:', { userId, placeId });
      throw new Error('Invalid userId or placeId');
    }
    console.log('Removing favorite:', userId, placeId);
    const favoriteRef = doc(db, 'users', userId, 'favorites', placeId);
    await deleteDoc(favoriteRef);
    console.log('Favorite removed successfully');
  } catch (error) {
    console.error('Error removing from favorites:', error);
    throw error;
  }
};

export const getFavorites = async (userId) => {
  try {
    const favoritesRef = collection(db, 'users', userId, 'favorites');
    const querySnapshot = await getDocs(favoritesRef);
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error('Error getting favorites:', error);
    throw error;
  }
};

export const checkPlaceInFavorites = async (userId, placeId) => {
  try {
    if (!userId || !placeId) {
      console.error('Invalid userId or placeId');
      return false;
    }
    const favoriteRef = doc(db, 'users', userId, 'favorites', placeId);
    const docSnap = await getDoc(favoriteRef);
    return docSnap.exists();
  } catch (error) {
    console.error('Error checking place in favorites:', error);
    return false;
  }
};


export { auth, db };