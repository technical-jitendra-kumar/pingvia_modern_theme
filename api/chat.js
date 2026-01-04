// api/chat.js
export default async function handler(req, res) {
    // Sirf POST request allow karenge
    if (req.method !== 'POST') {
        return res.status(405).json({ reply: "Method not allowed" });
    }

    try {
        const { message } = req.body;
        const API_KEY = process.env.GEMINI_API_KEY;

        if (!API_KEY) {
            return res.status(500).json({ reply: "API Key missing on Vercel dashboard!" });
        }

        // Stable v1beta URL with Gemini 1.5 Flash
        const response = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${API_KEY}`,
            {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    contents: [{ parts: [{ text: `You are a professional assistant for Pingvia Technologies. Keep responses concise. User: ${message}` }] }],
                }),
            }
        );

        const data = await response.json();

        if (data.error) {
            return res.status(500).json({ reply: "Gemini Error: " + data.error.message });
        }

        const botReply = data.candidates?.[0]?.content?.parts?.[0]?.text || "Main abhi offline hoon, thodi der mein try karein.";
        
        // Sahi JSON response bhej rahe hain
        return res.status(200).json({ reply: botReply });

    } catch (err) {
        console.error("Backend Error:", err);
        return res.status(500).json({ reply: "Server error: " + err.message });
    }
}