require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
const resumeRoutes = require("./routes/resume");

const app = express();
app.use(cors());
app.use(express.json());

connectDB();

app.use("/api/resume", resumeRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Backend running on http://localhost:${PORT}`));
