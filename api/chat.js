export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Only POST requests allowed' });
    }

    try {
        const { message } = req.body;
        const API_KEY = process.env.GEMINI_API_KEY;

        // Gemini 1.5 Flash use karein (Fast aur Reliable hai)
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${API_KEY}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                contents: [{
                    parts: [{ text: `You are a professional assistant for Pingvia Technologies. Services: WhatsApp API, RCS, IVR, Marketing. Summarize client needs. User says: ${message}` }]
                }]
            })
        });

        const data = await response.json();

        // Check if Gemini returned an error
        if (data.error) {
            console.error("Gemini API Error:", data.error);
            return res.status(500).json({ reply: "API Key issue or quota exceeded." });
        }

        const botReply = data.candidates[0].content.parts[0].text;
        return res.status(200).json({ reply: botReply });

    } catch (error) {
        console.error("Server Error:", error);
        return res.status(500).json({ reply: "Internal Server Error in API route." });
    }
}