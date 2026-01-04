export default async function handler(req, res) {
    // Sirf POST allow karein
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const { message } = req.body;
        const key = process.env.GEMINI_API_KEY;

        if (!key) {
            throw new Error("API Key missing on Vercel side");
        }

        // Gemini 1.5 Flash Model (Latest & Stable)
        const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${key}`;

        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{
                    parts: [{ text: `You are a professional assistant for Pingvia Technologies. Keep answers short and professional. User query: ${message}` }]
                }]
            })
        });

        const data = await response.json();

        // Agar Gemini error de (Jaise invalid key ya quota)
        if (data.error) {
            return res.status(500).json({ error: data.error.message });
        }

        // Response check karke bhej rahe hain
        if (data.candidates && data.candidates[0].content.parts[0].text) {
            const reply = data.candidates[0].content.parts[0].text;
            return res.status(200).json({ reply: reply });
        } else {
            throw new Error("Invalid response structure from Gemini");
        }

    } catch (error) {
        console.error("Vercel Function Error:", error.message);
        return res.status(500).json({ reply: "Server error, please try again later." });
    }
}