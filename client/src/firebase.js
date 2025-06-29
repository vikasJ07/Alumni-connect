
// firebase.js
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// Your Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyAwkiWg22w2tpM1IjPCpOfnU4mD2_tex6Y",
    authDomain: "chat-app-8e084.firebaseapp.com",
    projectId: "chat-app-8e084",
    storageBucket: "chat-app-8e084.firebasestorage.app",
    messagingSenderId: "595805676690",
    appId: "1:595805676690:web:87e66798527e5e31ad724b",
    measurementId: "G-CW1FZHNRD0",
};
// Initialize Firebase app
const app = initializeApp(firebaseConfig);

// Initialize Firestore
const db = getFirestore(app);

export { app, db };
