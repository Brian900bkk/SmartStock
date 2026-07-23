const { GoogleGenAI } = require("@google/genai");

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

async function askGemini(prompt) {
  try {
    const response = await ai.models.generateContent({
        model: "gemini-2.0-flash",
        contents: prompt,
      });

    return response.text;
  } catch (error) {
    console.error("Gemini Error:");
    console.dir(error, { depth: null });
    return "Sorry, I couldn't answer that question right now.";
  }
}

module.exports = {
  askGemini,
};