require("dotenv").config();
const axios = require("axios");
const Resume = require("../models/Resume");

// Helper: attempt OpenRouter first (free), fallback to OpenAI if provided
async function getAISuggestionsFromProvider(prompt) {
  // OpenRouter (recommended free)
  if (process.env.OPENROUTER_API_KEY) {
    const url = "https://openrouter.ai/api/v1/chat/completions";
    try {
      const resp = await axios.post(
        url,
        {
          model: "openai/gpt-3.5-turbo",
          messages: [{ role: "user", content: prompt }],
          max_tokens: 600
        },
        {
          headers: {
            Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
            "Content-Type": "application/json"
          }
        }
      );
      return resp.data.choices[0].message.content;
    } catch (err) {
      // bubble up error to caller
      throw err;
    }
  }

  // Fallback: OpenAI SDK (if OPENAI_API_KEY present)
  if (process.env.OPENAI_API_KEY) {
    const OpenAI = require("openai");
    const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
    try {
      const completion = await client.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [{ role: "user", content: prompt }],
        max_tokens: 600
      });
      return completion.choices[0].message.content;
    } catch (err) {
      throw err;
    }
  }

  throw new Error("No AI provider configured (OPENROUTER_API_KEY or OPENAI_API_KEY missing)");
}

// Save resume
exports.saveResume = async (req, res) => {
  try {
    const r = new Resume(req.body);
    await r.save();
    res.status(201).json({ message: "Resume saved", id: r._id });
  } catch (err) {
    console.error("Mongo Save Error:", err.message);
    res.status(500).json({ error: "Failed to save resume" });
  }
};

// Get saved resume by id
exports.getResume = async (req, res) => {
  try {
    const r = await Resume.findById(req.params.id).lean();
    if (!r) return res.status(404).json({ error: "Resume not found" });
    res.json(r);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch resume" });
  }
};

// AI suggestions for improving resume
exports.generateAISuggestions = async (req, res) => {
  try {
    const { resumeText } = req.body;
    if (!resumeText || !resumeText.trim()) {
      return res.status(400).json({ error: "resumeText is required" });
    }

    const prompt = `
You are an expert career advisor. Analyze the resume below and provide:
1) Specific suggestions to highlight soft skills (leadership, creativity, problem-solving).
2) Industry-specific keyword recommendations without keyword-stuffing.
3) Formatting and readability tips.
4) Advice on how to make project/experience descriptions show measurable impact.
Respond in short bullet points where possible.

RESUME:
${resumeText}
    `;

    const suggestions = await getAISuggestionsFromProvider(prompt);
    res.json({ suggestions });
  } catch (err) {
    console.error("AI Suggestion Error:", (err.response && err.response.data) || err.message);
    // If provider returned structured error, forward a friendly message and include fallback tips
    res.status(500).json({
      error: "AI service unavailable. See server logs for details.",
      fallback: [
        "Add numbers to describe impact (%, revenue, users).",
        "Start bullets with action verbs (Led, Designed, Implemented).",
        "Mention tools & technologies in Skills section.",
        "Keep Professional Summary to 2-3 lines focused on role you're targeting."
      ]
    });
  }
};

// Check match between resume and job description
exports.checkMatch = async (req, res) => {
  try {
    const { resumeText, jobDescription, targetRole } = req.body;
    if (!resumeText || !jobDescription) {
      return res.status(400).json({ error: "resumeText and jobDescription are required" });
    }

    const prompt = `
You are a hiring coach. Given the resume and the following job description, provide:
1) A short match score (poor / fair / good / excellent) with one-line reason.
2) Top 5 keywords the candidate is missing.
3) Top 3 concrete suggestions to increase match (phrasing to add or skills to emphasize).
Resume:
${resumeText}

Job description:
${jobDescription}

Target role: ${targetRole || "Not specified"}
    `;

    const analysis = await getAISuggestionsFromProvider(prompt);
    res.json({ analysis });
  } catch (err) {
    console.error("AI Check Match Error:", (err.response && err.response.data) || err.message);
    res.status(500).json({ error: "AI match service unavailable." });
  }
};
