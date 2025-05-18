const express = require("express");
const axios = require("axios");
const cors = require("cors");
require("dotenv").config();

const app = express();

// ✅ Log all incoming requests (debugging)
app.use((req, res, next) => {
  console.log(`[${req.method}] ${req.url}`);
  console.log('Origin:', req.headers.origin); // Add this to debug origins
  next();
});

// ✅ CORS configuration
const corsOptions = {
  origin: ['https://ai-generator-cover-letter.netlify.app', 'http://localhost:3000'],
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type'],
  credentials: true,
  preflightContinue: false,
  optionsSuccessStatus: 204
};

app.use(cors(corsOptions));

// Handle preflight requests explicitly
app.options('*', cors(corsOptions));

app.use(express.json());

// ✅ Debug route to verify backend is up
app.get("/", (req, res) => {
  res.send("CoverLetterGPT backend is live.");
});

app.post("/api/generate", async (req, res) => {
  // Add explicit CORS headers for this endpoint
  res.header('Access-Control-Allow-Origin', 'https://ai-generator-cover-letter.netlify.app');
  res.header('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  res.header('Access-Control-Allow-Credentials', 'true');

  const { resume, job } = req.body;
  const prompt = `
Act as a world-class cover letter expert. Write a professional, compelling, and personalized cover letter that follows international standards. 
Use the resume and job description provided. Analyze keywords, company mission, and values. 
Show alignment between the candidate and the role. Be specific, concise, and inspiring.

Resume:
${resume}

Job Description:
${job}
`;

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

app.listen(process.env.PORT || 3000, () => console.log("✅ Server running on port 3000"));

