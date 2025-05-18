const express = require("express");
const axios = require("axios");
const cors = require("cors");
require("dotenv").config();

const app = express();

// Debug middleware to log all request details
app.use((req, res, next) => {
  console.log('=== Request Details ===');
  console.log(`Method: ${req.method}`);
  console.log(`URL: ${req.url}`);
  console.log('Headers:', req.headers);
  console.log('Origin:', req.headers.origin);
  console.log('=====================');
  next();
});

// CORS configuration
const corsOptions = {
  origin: function (origin, callback) {
    console.log('Checking origin:', origin);
    const allowedOrigins = ['https://ai-generator-cover-letter.netlify.app'];
    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      console.log('Origin not allowed:', origin);
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type'],
  credentials: false,
  preflightContinue: false,
  optionsSuccessStatus: 204
};

// Apply CORS middleware
app.use(cors(corsOptions));

// Handle OPTIONS requests explicitly
app.options('*', (req, res) => {
  console.log('Handling OPTIONS request');
  res.status(204).end();
});

app.use(express.json());

// Debug route
app.get("/", (req, res) => {
  console.log('Root route accessed');
  res.send("CoverLetterGPT backend is live.");
});

app.post("/api/generate", async (req, res) => {
  console.log('Generate endpoint accessed');
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

