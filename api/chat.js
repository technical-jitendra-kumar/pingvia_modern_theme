export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const { message } = req.body;
        const key = process.env.GEMINI_API_KEY;

        if (!key) {
            return res.status(500).json({ reply: "Backend Error: API Key missing." });
        }

        // UPDATED URL: v1 version aur model name format fix kiya
        const apiUrl = `https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key=${key}`;

        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{
                    parts: [{ text: `You are a professional assistant for Pingvia Technologies. 
                    Services: WhatsApp API, RCS, IVR, Digital Marketing. 
                    User query: ${message}` }]
                }]
            })
        });

        const data = await response.json();

        // Error handling agar API response me error aaye
        if (data.error) {
            console.error("Gemini Error:", data.error.message);
            return res.status(500).json({ reply: "Gemini API Error: " + data.error.message });
        }

        if (data.candidates && data.candidates[0].content.parts[0].text) {
            const reply = data.candidates[0].content.parts[0].text;
            return res.status(200).json({ reply: reply });
        } else {
            return res.status(500).json({ reply: "Invalid response from AI." });
        }

    } catch (error) {
        console.error("Vercel Function Crash:", error.message);
        return res.status(500).json({ reply: "Server error, check logs." });
    }
}