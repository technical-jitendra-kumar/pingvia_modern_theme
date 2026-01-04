export const config = {
  runtime: "edge",
};

export default async function handler(req) {
  if (req.method !== 'POST') {
    return new Response(
      JSON.stringify({ error: "Method not allowed" }),
      { status: 405 }
    );
  }

  try {
    const { message } = await req.json();
    const key = process.env.GEMINI_API_KEY;

    if (!key) {
      return new Response(
        JSON.stringify({ reply: "Backend Error: API Key missing." }),
        { status: 500 }
      );
    }

    const apiUrl =
      `https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key=${key}`;

    const response = await fetch(apiUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              {
                text: `You are a professional assistant for Pingvia Technologies.
Services: WhatsApp API, RCS, IVR, Digital Marketing.
Answer professionally: ${message}`
              }
            ]
          }
        ]
      })
    });

    const data = await response.json();

    if (data?.candidates?.[0]?.content?.parts?.[0]?.text) {
      return new Response(
        JSON.stringify({ reply: data.candidates[0].content.parts[0].text }),
        { status: 200 }
      );
    }

    return new Response(
      JSON.stringify({ reply: "AI response empty." }),
      { status: 500 }
    );

  } catch (error) {
    return new Response(
      JSON.stringify({ reply: "Server error: " + error.message }),
      { status: 500 }
    );
  }
}
