import React, { useState, useRef } from "react";
import axios from "axios";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

function App() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    targetRole: "",
    summary: "",
    skills: "",
    experience: [],
    education: [],
    projects: []
  });
  const [aiSuggestions, setAiSuggestions] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [matchResult, setMatchResult] = useState("");
  const previewRef = useRef();

  const setField = (k, v) => setFormData(d => ({ ...d, [k]: v }));

  const addItem = (field) => {
    const val = prompt(`Enter ${field}`);
    if (val) {
      setFormData(d => ({ ...d, [field]: [...d[field], val] }));
    }
  };

  const removeItem = (field, idx) => {
    setFormData(d => {
      const copy = [...d[field]];
      copy.splice(idx, 1);
      return { ...d, [field]: copy };
    });
  };

  const handleSave = async () => {
    try {
      await axios.post("http://localhost:5000/api/resume/save", formData);
      alert("✅ Saved");
    } catch (err) {
      console.error(err);
      alert("❌ Save failed");
    }
  };

  const handleImproveAI = async () => {
    const resumeText = [
      `Name: ${formData.name}`,
      `Target Role: ${formData.targetRole}`,
      `Summary: ${formData.summary}`,
      `Skills: ${formData.skills}`,
      `Experience: ${formData.experience.join(" | ")}`,
      `Education: ${formData.education.join(" | ")}`,
      `Projects: ${formData.projects.join(" | ")}`
    ].join("\n");

    try {
      const res = await axios.post("http://localhost:5000/api/resume/ai-suggestions", { resumeText });
      setAiSuggestions(res.data.suggestions || "No suggestions returned");
    } catch (err) {
      console.error("AI Error:", err.response?.data || err.message);
      setAiSuggestions("⚠️ AI service unavailable. See server logs.");
    }
  };

  const handleCheckMatch = async () => {
    const resumeText = [
      `Summary: ${formData.summary}`,
      `Skills: ${formData.skills}`,
      `Experience: ${formData.experience.join(" | ")}`
    ].join("\n");

    try {
      const res = await axios.post("http://localhost:5000/api/resume/check-match", {
        resumeText,
        jobDescription,
        targetRole: formData.targetRole
      });
      setMatchResult(res.data.analysis || "No analysis returned");
    } catch (err) {
      console.error("Match Error:", err.response?.data || err.message);
      setMatchResult("⚠️ Match service unavailable.");
    }
  };

  const handleExportPDF = async () => {
    if (!previewRef.current) return;
    const element = previewRef.current;
    const canvas = await html2canvas(element, { scale: 2 });
    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF({ unit: "px", format: "a4" });
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    // scale image to fit page
    const imgProps = { width: canvas.width, height: canvas.height };
    const ratio = Math.min(pageWidth / imgProps.width, pageHeight / imgProps.height);
    pdf.addImage(imgData, "PNG", 0, 0, imgProps.width * ratio, imgProps.height * ratio);
    pdf.save("resume.pdf");
  };

  return (
    <div className="min-h-screen p-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Left form */}
      <div className="bg-white rounded-2xl p-6 shadow">
        <h1 className="text-2xl font-bold mb-4">Smart Resume Builder</h1>

        <input
          className="w-full border p-2 rounded mb-2"
          placeholder="Target role (e.g., Data Analyst)"
          value={formData.targetRole}
          onChange={(e) => setField("targetRole", e.target.value)}
        />

        <input
          className="w-full border p-2 rounded mb-2"
          placeholder="Full Name"
          value={formData.name}
          onChange={(e) => setField("name", e.target.value)}
        />

        <div className="grid grid-cols-2 gap-2">
          <input
            className="border p-2 rounded mb-2"
            placeholder="Email"
            value={formData.email}
            onChange={(e) => setField("email", e.target.value)}
          />
          <input
            className="border p-2 rounded mb-2"
            placeholder="Phone"
            value={formData.phone}
            onChange={(e) => setField("phone", e.target.value)}
          />
        </div>

        <textarea
          className="w-full border p-2 rounded mb-2"
          placeholder="Professional Summary"
          value={formData.summary}
          onChange={(e) => setField("summary", e.target.value)}
        />

        <button className="text-blue-600 underline mb-2" onClick={handleImproveAI}>Improve with AI</button>

        <input
          className="w-full border p-2 rounded mb-2"
          placeholder="Skills (comma separated)"
          value={formData.skills}
          onChange={(e) => setField("skills", e.target.value)}
        />

        {/* Experience */}
        <div className="mb-4">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold">Experience</h3>
            <button className="text-blue-600" onClick={() => addItem("experience")}>+ Add</button>
          </div>
          <ul className="list-disc ml-5 mt-2">
            {formData.experience.map((it, idx) => (
              <li key={idx} className="flex justify-between">
                <span>{it}</span>
                <button className="text-sm text-red-500" onClick={() => removeItem("experience", idx)}>remove</button>
              </li>
            ))}
          </ul>
        </div>

        {/* Education */}
        <div className="mb-4">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold">Education</h3>
            <button className="text-blue-600" onClick={() => addItem("education")}>+ Add</button>
          </div>
          <ul className="list-disc ml-5 mt-2">
            {formData.education.map((it, idx) => (
              <li key={idx} className="flex justify-between">
                <span>{it}</span>
                <button className="text-sm text-red-500" onClick={() => removeItem("education", idx)}>remove</button>
              </li>
            ))}
          </ul>
        </div>

        {/* Projects */}
        <div className="mb-4">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold">Projects</h3>
            <button className="text-blue-600" onClick={() => addItem("projects")}>+ Add</button>
          </div>
          <ul className="list-disc ml-5 mt-2">
            {formData.projects.map((it, idx) => (
              <li key={idx} className="flex justify-between">
                <span>{it}</span>
                <button className="text-sm text-red-500" onClick={() => removeItem("projects", idx)}>remove</button>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Right preview + actions */}
      <div className="space-y-4">
        <div className="bg-white p-6 rounded-2xl shadow" ref={previewRef}>
          <h2 className="text-xl font-bold">{formData.name || "Your Name"}</h2>
          <p className="text-gray-600">{formData.targetRole || ""}</p>
          <div className="mt-3">
            <h4 className="font-semibold">Summary</h4>
            <p className="text-sm">{formData.summary || "Write a concise professional summary here."}</p>
          </div>

          <div className="mt-3">
            <h4 className="font-semibold">Skills</h4>
            <p className="text-sm">{formData.skills}</p>
          </div>

          <div className="mt-3">
            <h4 className="font-semibold">Experience</h4>
            <ul className="list-disc ml-5 text-sm">
              {formData.experience.map((e, i) => <li key={i}>{e}</li>)}
            </ul>
          </div>

          <div className="mt-3">
            <h4 className="font-semibold">Education</h4>
            <ul className="list-disc ml-5 text-sm">
              {formData.education.map((e, i) => <li key={i}>{e}</li>)}
            </ul>
          </div>

          <div className="mt-3">
            <h4 className="font-semibold">Projects</h4>
            <ul className="list-disc ml-5 text-sm">
              {formData.projects.map((p, i) => <li key={i}>{p}</li>)}
            </ul>
          </div>

          <div className="flex gap-3 mt-5">
            <button onClick={handleSave} className="bg-black text-white px-4 py-2 rounded">Save</button>
            <button onClick={handleExportPDF} className="bg-blue-600 text-white px-4 py-2 rounded">Export PDF</button>
          </div>
        </div>

        {/* AI Suggestions */}
        <div className="bg-white p-4 rounded-2xl shadow">
          <h3 className="font-semibold">AI Suggestions</h3>
          <textarea readOnly className="w-full border p-2 rounded h-32 mt-2" value={aiSuggestions}></textarea>
        </div>

        {/* Job description & match */}
        <div className="bg-white p-4 rounded-2xl shadow">
          <h3 className="font-semibold">Job Description</h3>
          <textarea
            className="w-full border p-2 rounded h-28 mt-2"
            placeholder="Paste Job Description here..."
            value={jobDescription}
            onChange={(e) => setJobDescription(e.target.value)}
          />
          <div className="flex gap-2 mt-2">
            <button onClick={handleCheckMatch} className="bg-purple-600 text-white px-4 py-2 rounded">Check Match</button>
          </div>
          {matchResult && (
            <div className="mt-3 bg-gray-50 p-3 rounded">
              <h4 className="font-semibold">Match Analysis</h4>
              <pre className="whitespace-pre-wrap text-sm">{matchResult}</pre>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
