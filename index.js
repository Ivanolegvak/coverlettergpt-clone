const express = require("express");
const axios = require("axios");
const cors = require("cors");
require("dotenv").config();

const app = express();
const corsOptions = {
  origin: "https://ai-generator-cover-letter.netlify.app",
  methods: ["GET", "POST", "OPTIONS"],
  allowedHeaders: ["Content-Type"]
};

app.use(cors(corsOptions));
app.options("*", cors(corsOptions)); // Handle preflight
app.use(express.json());

app.post("/api/generate", async (req, res) => {
  const { resume, job } = req.body;
  const prompt = `Write a professional cover letter using this resume:\n${resume}\n\nand this job description:\n${job}`;

  try {
    const gptRes = await axios.post(
      "https://api.openai.com/v1/chat/completions",
      {
        model: "gpt-4",
        messages: [{ role: "user", content: prompt }],
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        },
      }
    );

    res.json({ result: gptRes.data.choices[0].message.content });
  } catch (err) {
    console.error("GPT error:", err.response?.data || err.message);
    res.status(500).send("GPT error");
  }
});

app.listen(process.env.PORT || 3000, () => console.log("Server running"));
