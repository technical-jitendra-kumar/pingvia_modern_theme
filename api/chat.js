export const config = {
  runtime: "edge",
};

export default async function handler(req) {
  if (req.method !== "POST") {
    return new Response(
      JSON.stringify({ reply: "Method not allowed" }),
      { status: 405 }
    );
  }

  try {
    const { message } = await req.json();

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [
            {
              role: "user",
              parts: [{ text: message }],
            },
          ],
        }),
      }
    );

    // 🔴 TEMP DEBUG
    const rawText = await response.text();

    return new Response(
      JSON.stringify({
        debug: true,
        geminiRaw: rawText
      }),
      { status: 200 }
    );

  } catch (err) {
    return new Response(
      JSON.stringify({ reply: err.message }),
      { status: 500 }
    );
  }
}
