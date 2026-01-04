export const config = {
  runtime: "edge",
};

export default async function handler(req) {
  if (req.method !== "POST") {
    return new Response(JSON.stringify({ reply: "Method not allowed" }), { status: 405 });
  }

  try {
    const { message } = await req.json();
    const API_KEY = process.env.GEMINI_API_KEY;

    // Fixed URL and Model Name for v1
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key=${API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{
            parts: [{ text: `You are a professional assistant for Pingvia Technologies. Keep it short. User: ${message}` }]
          }],
        }),
      }
    );

    const data = await response.json();

    if (data.error) {
      return new Response(JSON.stringify({ reply: "AI Error: " + data.error.message }), { status: 500 });
    }

    const botReply = data.candidates?.[0]?.content?.parts?.[0]?.text || "I'm having trouble thinking right now.";

    return new Response(JSON.stringify({ reply: botReply }), { 
      status: 200, 
      headers: { "Content-Type": "application/json" } 
    });

  } catch (err) {
    return new Response(JSON.stringify({ reply: "Backend Crash: " + err.message }), { status: 500 });
  }
}
