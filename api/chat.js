export default async function handler(req, res) {
    // Sirf POST request allow karenge
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Only POST requests allowed' });
    }

    const { message } = req.body;
    const API_KEY = process.env.GEMINI_API_KEY; // Ye Vercel Dashboard se aayegi

    // Gemini ko train karne ke liye "System Instruction"
    const systemPrompt = `
    Aap Pingvia Technologies ke expert assistant hain. 
    Hamari services: WhatsApp Business API, RCS Messaging, IVR Systems, aur Digital Marketing.
    Rule 1: Sirf hamari services ke baare mein baat karein.
    Rule 2: Agar user service lena chahta hai, toh unka 'Name' aur 'Mobile Number' maangein.
    Rule 3: User ki query ko short aur professional rakhein.
    User ki baat: ${message}`;

    try {
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${API_KEY}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{ parts: [{ text: systemPrompt }] }]
            })
        });

        const data = await response.json();
        const botReply = data.candidates[0].content.parts[0].text;

        res.status(200).json({ reply: botReply });
    } catch (error) {
        res.status(500).json({ error: "Gemini API Error" });
    }
}