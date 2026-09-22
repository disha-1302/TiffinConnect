export const generateTextWithGemini = async (prompt, systemInstruction = "") => {
  const apiKey = "YOUR_GEMINI_API_KEY_HERE"; 
  const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;

  const payload = { contents: [{ parts: [{ text: prompt }] }] };
  if (systemInstruction) payload.systemInstruction = { parts: [{ text: systemInstruction }] };

  try {
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    const result = await response.json();
    return result.candidates?.[0]?.content?.parts?.[0]?.text || "Could not generate response.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "AI service is currently unavailable.";
  }
};