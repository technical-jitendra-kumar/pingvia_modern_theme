export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ reply: "Only POST allowed" });
  }

  try {
    const { message } = req.body;

    if (!message) {
      return res.status(400).json({ reply: "Message is required" });
    }

    const API_KEY = process.env.GEMINI_API_KEY;
     console.log("API KEY EXISTS:", !!API_KEY);

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${API_KEY}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
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

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Gemini HTTP Error:", errorText);
      return res.status(500).json({ reply: "Gemini API failed" });
    }

    const data = await response.json();

    const botReply =
      data.candidates?.[0]?.content?.parts?.[0]?.text ||
      "Sorry, I couldn't understand that.";

    return res.status(200).json({ reply: botReply });

  } catch (err) {
    console.error("Server Error:", err);
    return res.status(500).json({ reply: "Server error" });
  }
}