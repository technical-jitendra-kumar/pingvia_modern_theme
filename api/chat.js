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

        // VERSION FIXED: v1beta ki jagah v1 use kiya hai jo stable hai
        const apiUrl = `https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key=${key}`;

        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{
                    parts: [{ text: `You are a professional assistant for Pingvia Technologies. 
                    Services: WhatsApp API, RCS, IVR, Digital Marketing. 
                    Answer this query professionally: ${message}` }]
                }]
            })
        });

        const data = await response.json();

        if (data.error) {
            console.error("Gemini API Error:", data.error.message);
            return res.status(500).json({ reply: "AI Error: " + data.error.message });
        }

        if (data.candidates && data.candidates[0].content.parts[0].text) {
            return res.status(200).json({ reply: data.candidates[0].content.parts[0].text });
        } else {
            return res.status(500).json({ reply: "AI ne koi jawab nahi diya." });
        }

    } catch (error) {
        console.error("Fetch Error:", error.message);
        return res.status(500).json({ reply: "Server error, check connection." });
    }
}