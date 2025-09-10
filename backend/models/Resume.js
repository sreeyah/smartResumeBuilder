const mongoose = require("mongoose");

const ResumeSchema = new mongoose.Schema({
  name: String,
  email: String,
  phone: String,
  targetRole: String,
  summary: String,
  skills: String,
  experience: [String],
  education: [String],
  projects: [String],
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Resume", ResumeSchema);
