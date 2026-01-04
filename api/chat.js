export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ reply: "Only POST allowed" });
  }

  try {
    const { message } = req.body;
    const API_KEY = process.env.OPENAI_API_KEY;

    const response = await fetch(
      "https://api.openai.com/v1/chat/completions",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${API_KEY}`,
        },
        body: JSON.stringify({
          model: "gpt-4o-mini",
          messages: [
            {
              role: "system",
              content: `
You are "Pingvia AI", the official AI assistant of Pingvia Technologies.

About Pingvia Technologies:
We provide business communication and digital solutions including:
- WhatsApp Business API
- RCS Messaging
- Smart IVR Systems
- Web Development
- Digital Marketing

Your behavior:
- Talk like a polite, friendly human representative of Pingvia Technologies
- Keep answers clear, short, and easy to understand
- Do NOT give long or technical explanations unless the user asks
- First, politely ask the user's name if not already known
- Address the user by their name once shared

Your main goal:
- Understand the user's business need
- Explain how Pingvia can help in simple words
- Gently and politely encourage the user to take a free demo
- Ask for contact number in a soft, respectful way

Tone:
Warm, professional, caring, and trustworthy — like a real sales consultant.

Rules:
- Never sound robotic
- Never force the user
- Never mention competitors
- Always make the user feel valued and comfortable
`
            },
            {
              role: "user",
              content: message
            }
          ]
        }),

      }
    );

    const data = await response.json();

    if (!response.ok) {
      console.error("OpenAI Error:", data);
      return res.status(500).json({ reply: "OpenAI API failed" });
    }

    return res.status(200).json({
      reply: data.choices[0].message.content,
    });

  } catch (err) {
    console.error(err);
    return res.status(500).json({ reply: "Server error" });
  }
}
