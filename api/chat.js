export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ reply: "Only POST allowed" });
    }

    try {
        const { message } = req.body;
        const API_KEY = process.env.GEMINI_API_KEY;

        // FIXED URL: v1 version aur model ka sahi path
        const response = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${API_KEY}`,
            {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    contents: [{ parts: [{ text: message }] }],
                }),
            }
        );

        const data = await response.json();

        // Agar Gemini error de (Jaise model not found)
        if (data.error) {
            console.error("Gemini API Error:", data.error.message);
            return res.status(500).json({ reply: "AI Error: " + data.error.message });
        }

        // Response extraction
        const botReply = data.candidates?.[0]?.content?.parts?.[0]?.text || "I'm sorry, I couldn't process that.";
        
        return res.status(200).json({ reply: botReply });

    } catch (err) {
        return res.status(500).json({ reply: "Server error: " + err.message });
    }
}