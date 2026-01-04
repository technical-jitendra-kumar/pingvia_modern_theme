export const config = {
  runtime: "edge",
};

export default async function handler(req) {
  if (req.method !== "POST") {
    return new Response(
      JSON.stringify({ reply: "Method not allowed" }),
      { status: 405, headers: { "Content-Type": "application/json" } }
    );
  }

  try {
    const { message } = await req.json();
    const API_KEY = process.env.GEMINI_API_KEY;

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key=${API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [
            {
              parts: [{ text: `You are a professional assistant for Pingvia Technologies. Answer shortly: ${message}` }],
            },
          ],
        }),
      }
    );

    const data = await response.json();

    // Check if Gemini returned an error
    if (data.error) {
      return new Response(
        JSON.stringify({ reply: "Gemini Error: " + data.error.message }),
        { status: 500, headers: { "Content-Type": "application/json" } }
      );
    }

    // Asli reply extract karna (candidates -> content -> parts -> text)
    const botReply = data.candidates?.[0]?.content?.parts?.[0]?.text || "Sorry, I couldn't understand that.";

    return new Response(
      JSON.stringify({ reply: botReply }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );

  } catch (err) {
    return new Response(
      JSON.stringify({ reply: "Server Error: " + err.message }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}