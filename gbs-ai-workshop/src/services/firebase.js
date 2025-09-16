import { initializeApp } from "firebase/app";
import { getAuth, signInAnonymously, signInWithCustomToken, onAuthStateChanged } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getFunctions } from "firebase/functions";

// These will be initialized and then exported for use in other modules
let app, auth, db, functions;

// This function will be called from app.js to start the Firebase connection
const initFirebase = async () => {
    const firebaseConfigString = import.meta.env.VITE_FIREBASE_CONFIG;

    if (!firebaseConfigString) {
        console.error("Firebase config not found. Please set VITE_FIREBASE_CONFIG in your .env file.");
        // Display a user-friendly error on the page
        document.body.innerHTML = `<div style="font-family: sans-serif; text-align: center; padding: 4rem;">
            <h1>Configuration Error</h1>
            <p>The application is not configured correctly. Please contact the administrator.</p>
            <p style="color: #666; font-size: 0.9rem;">Error: VITE_FIREBASE_CONFIG is not set.</p>
        </div>`;
        return;
    }

    const firebaseConfig = JSON.parse(firebaseConfigString);

    app = initializeApp(firebaseConfig);
    db = getFirestore(app);
    auth = getAuth(app);
    functions = getFunctions(app);

    console.log("Firebase initialized");

    // Handle authentication
    return new Promise((resolve, reject) => {
        onAuthStateChanged(auth, (user) => {
            if (user) {
                console.log("User is signed in with UID:", user.uid);
                resolve(user);
            } else {
                // If no user, sign in anonymously
                signInAnonymously(auth).then(userCredential => {
                    console.log("Signed in anonymously:", userCredential.user.uid);
                    resolve(userCredential.user);
                }).catch(error => {
                    console.error("Anonymous sign-in failed:", error);
                    reject(error);
                });
            }
        });
    });
};

export { initFirebase, auth, db, functions };
