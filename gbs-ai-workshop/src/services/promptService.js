import { doc, addDoc, deleteDoc, onSnapshot, collection, query } from "firebase/firestore";
import { db, auth } from './firebase.js';

const getPromptsCollectionPath = () => {
    if (!auth.currentUser) return null;
    const appId = 'gbs-gemini-training'; // This could also be an environment variable
    return `/artifacts/${appId}/users/${auth.currentUser.uid}/prompts`;
};

export const loadUserLibrary = (callback) => {
    const path = getPromptsCollectionPath();
    if (!path) {
        // If user is not authenticated yet, we can't load their library.
        // The callback will be called again once auth state changes.
        return () => {}; // Return an empty unsubscribe function
    }

    const q = query(collection(db, path));

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
        const userLibrary = [];
        querySnapshot.forEach((doc) => {
            userLibrary.push({ id: doc.id, ...doc.data() });
        });
        console.log("User library loaded/updated:", userLibrary);
        callback(userLibrary);
    });

    return unsubscribe;
};

export const addPromptToLibrary = async (promptData) => {
    const path = getPromptsCollectionPath();
    if (!path) {
        console.error("User not authenticated, cannot add prompt.");
        return;
    }
    try {
        await addDoc(collection(db, path), promptData);
        console.log("Prompt added to library");
    } catch (e) {
        console.error("Error adding document: ", e);
    }
};

export const removePromptFromLibrary = async (promptId) => {
    const path = getPromptsCollectionPath();
    if (!path) {
        console.error("User not authenticated, cannot remove prompt.");
        return;
    }
    try {
        const docRef = doc(db, path, promptId);
        await deleteDoc(docRef);
        console.log("Prompt removed from library");
    } catch (e) {
        console.error("Error removing document: ", e);
    }
};
