const functions = require("firebase-functions");
const admin = require("firebase-admin");
const axios = require("axios");

admin.initializeApp();

exports.generateReversePrompt = functions.https.onCall(async (data, context) => {
  // 1. Authentication check: Make sure the user is authenticated.
  if (!context.auth) {
    throw new functions.https.HttpsError(
      "unauthenticated",
      "The function must be called while authenticated."
    );
  }

  const inputText = data.text;
  if (!inputText || typeof inputText !== "string" || inputText.trim().length === 0) {
    throw new functions.https.HttpsError(
      "invalid-argument",
      "The function must be called with a non-empty 'text' argument."
    );
  }

  // 2. Retrieve API key from environment configuration.
  // This assumes you have set the key in your Firebase environment:
  // firebase functions:config:set google.api_key="YOUR_API_KEY"
  const apiKey = process.env.GOOGLE_API_KEY;

  if (!apiKey) {
    throw new functions.https.HttpsError(
        "internal",
        "API key is not configured. Please contact the administrator."
    );
  }

  const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${apiKey}`;

  const metaPrompt = `You are an expert in prompt engineering. Analyze the following text and generate a high-quality, effective prompt that could have been used to create it. Break down your reasoning, explaining why the prompt you created is effective. The prompt should be structured to include: 1. A clear persona (e.g., 'Act as a...'). 2. A specific task or goal. 3. Instructions on tone and format if they can be inferred from the text. Return your response as a JSON object with two keys: "generated_prompt" and "explanation".\n\nText to analyze:\n---\n${inputText}\n---`;

  const payload = {
    contents: [{ role: "user", parts: [{ text: metaPrompt }] }],
  };

  try {
    // 3. Make the request to the Google AI API using axios.
    const response = await axios.post(apiUrl, payload, {
      headers: { "Content-Type": "application/json" },
    });

    if (response.data && response.data.candidates && response.data.candidates[0].content.parts[0].text) {
        // 4. Return the successful response to the client.
        const responseText = response.data.candidates[0].content.parts[0].text;
        // The API often returns the JSON wrapped in markdown, so we clean it.
        const cleanedText = responseText.replace(/```json|```/g, "").trim();
        return JSON.parse(cleanedText);
    } else {
         throw new functions.https.HttpsError(
            "internal",
            "Invalid response structure from the Google AI API."
        );
    }

  } catch (error) {
    console.error("Error calling Google AI API:", error.response ? error.response.data : error.message);
    // 5. Throw a structured error that the client can handle.
    throw new functions.https.HttpsError(
      "internal",
      "Failed to call the Google AI API."
    );
  }
});
