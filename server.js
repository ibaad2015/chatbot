require("dotenv").config();
console.log("API Key loaded:", process.env.GROQ_API_KEY?.substring(0, 8));

const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static("public"));

app.post("/chat", async (req, res) => {
    try {
        const userMessage = req.body.message;

        const response = await fetch(
            "https://api.groq.com/openai/v1/chat/completions",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${process.env.GROQ_API_KEY}`
                },
                body: JSON.stringify({
                    model: "llama-3.3-70b-versatile",
                    messages: [
                        {
                            role: "system",
                            content: `You are Auto AI, an expert automotive assistant.

Only answer questions about:
- Cars
- SUVs
- Trucks
- Motorcycles
- EVs
- Engines
- Repairs
- Maintenance
- Fuel economy
- Vehicle buying advice

If the question is unrelated to vehicles, politely explain that Auto AI specializes in automotive topics.`
                        },
                        {
                            role: "user",
                            content: userMessage
                        }
                    ],
                    temperature: 0.7,
                    max_tokens: 800
                })
            }
        );

        const data = await response.json();

        console.log("Groq Response:", data);

        if (data.error) {
            return res.status(500).json({
                reply: `Groq Error: ${data.error.message}`
            });
        }

        const reply =
            data.choices?.[0]?.message?.content ||
            "Sorry, I could not generate a response.";

        res.json({ reply });

    } catch (error) {
        console.error("Server Error:", error);

        res.status(500).json({
            reply: "Server error. Check terminal for details."
        });
    }
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`🚗 Auto AI running at http://localhost:${PORT}`);
});