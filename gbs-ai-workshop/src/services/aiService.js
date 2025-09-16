import { httpsCallable } from "firebase/functions";
import { functions } from './firebase.js';

export const generateReversePrompt = async (inputText) => {
    if (!functions) {
        throw new Error("Firebase Functions is not initialized.");
    }

    const generateFunction = httpsCallable(functions, 'generateReversePrompt');

    try {
        const result = await generateFunction({ text: inputText });
        return result.data;
    } catch (error) {
        console.error("Error calling generateReversePrompt function:", error);
        // Re-throw the error so the component can handle it
        throw error;
    }
};
