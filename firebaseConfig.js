// Import the functions you need from the SDKs you need
import { initializeApp, getApps, getApp } from "firebase/app";
import { initializeAuth, getAuth,getReactNativePersistence, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, EmailAuthProvider,reauthenticateWithCredential, updatePassword } from "firebase/auth";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getFirestore, collection, doc, setDoc } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDIdhwjN-ZauQmpPMJC3tTDbxAAEBHzq1Y",
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

export { auth, db };