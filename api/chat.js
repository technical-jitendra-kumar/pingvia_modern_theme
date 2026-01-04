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

    if (!message || !message.trim()) {
      return new Response(
        JSON.stringify({ reply: "Please type a message." }),
        { status: 400 }
      );
    }

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents: [
            {
              role: "user",
              parts: [
                {
                  text: `
You are Pingvia AI Assistant for Pingvia Technologies.

Company services:
- WhatsApp Business API
- RCS Messaging
- IVR Solutions
- Digital Marketing
- Customer Engagement Automation

Rules:
- Always reply professionally and clearly
- Be helpful, concise, and business-focused
- Never return an empty response
- If user says "hi", greet politely
- If user asks about services, explain Pingvia offerings
- If unsure, ask a clarifying question

User message:
"${message}"
                  `,
                },
              ],
            },
          ],
          generationConfig: {
            temperature: 0.6,
            maxOutputTokens: 300,
          },
        }),
      }
    );

    const data = await response.json();

    const reply =
      data?.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!reply) {
      return new Response(
        JSON.stringify({
          reply:
            "Thanks for reaching out! 👋 Could you please tell me a bit more about what you're looking for?",
        }),
        { status: 200 }
      );
    }

    return new Response(
      JSON.stringify({ reply }),
      { status: 200 }
    );
  } catch (err) {
    return new Response(
      JSON.stringify({
        reply: "Sorry, something went wrong. Please try again shortly.",
      }),
      { status: 500 }
    );
  }
}
