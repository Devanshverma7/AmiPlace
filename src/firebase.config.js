import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage"; // Import the storage service

// Your Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBS5syiZXCHaSlqA8goDDozgh-upgFGdis",
  authDomain: "amiplace-3c576.firebaseapp.com",
  projectId: "amiplace-3c576",
  storageBucket: "amiplace-3c576.appspot.com",
  messagingSenderId: "835524893178",
  appId: "1:835524893178:web:96d2de7b8c7c3bbcde2c43",
  measurementId: "G-MEVFD068W3",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Cloud Firestore and get a reference to the service
export const db = getFirestore(app);

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);

// Initialize Firebase Storage and get a reference to the service
export const storage = getStorage(app);