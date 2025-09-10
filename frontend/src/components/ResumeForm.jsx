import React, { useState } from "react";
import axios from "axios";

export default function ResumeForm() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    github: "",
    linkedin: "",
    codingProfiles: "",
    experience: [],
    education: [],
    projects: [],
    certificates: []
  });

  // Dynamic add section
  const addSection = (section, template) => {
    setFormData({
      ...formData,
      [section]: [...formData[section], template],
    });
  };

  // Update section
  const updateSection = (section, index, field, value) => {
    const updated = [...formData[section]];
    updated[index][field] = value;
    setFormData({ ...formData, [section]: updated });
  };

  // AI Improve handler
  const handleImprove = async (section, index) => {
    try {
      const response = await axios.post("http://localhost:5000/api/resume/improve", {
        section,
        content: formData[section][index],
      });
      updateSection(section, index, "description", response.data.suggestion);
    } catch (err) {
      alert("AI Suggestion Error. Check backend.");
    }
  };

  // Save resume
  const handleSave = async () => {
    try {
      await axios.post("http://localhost:5000/api/resume/save", formData);
      alert("Resume saved successfully!");
    } catch (err) {
      alert("Error saving resume.");
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow-lg rounded-xl space-y-6">
      <h1 className="text-2xl font-bold text-center">Smart Resume Builder</h1>

      {/* Personal Info */}
      <div className="grid grid-cols-2 gap-4">
        <input placeholder="Full Name" className="input" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} />
        <input placeholder="Email" className="input" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} />
        <input placeholder="Phone" className="input" value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} />
        <input placeholder="GitHub" className="input" value={formData.github} onChange={(e) => setFormData({ ...formData, github: e.target.value })} />
        <input placeholder="LinkedIn" className="input" value={formData.linkedin} onChange={(e) => setFormData({ ...formData, linkedin: e.target.value })} />
        <input placeholder="Coding Profiles (LeetCode, Codeforces)" className="input" value={formData.codingProfiles} onChange={(e) => setFormData({ ...formData, codingProfiles: e.target.value })} />
      </div>

      {/* Experience */}
      <section>
        <h2 className="text-xl font-semibold">Experience</h2>
        {formData.experience.map((exp, i) => (
          <div key={i} className="border p-3 rounded mb-2">
            <input placeholder="Job Title" className="input" value={exp.title} onChange={(e) => updateSection("experience", i, "title", e.target.value)} />
            <input placeholder="Company" className="input" value={exp.company} onChange={(e) => updateSection("experience", i, "company", e.target.value)} />
            <div className="grid grid-cols-2 gap-2">
              <input type="date" className="input" value={exp.startDate} onChange={(e) => updateSection("experience", i, "startDate", e.target.value)} />
              <input type="date" className="input" value={exp.endDate} onChange={(e) => updateSection("experience", i, "endDate", e.target.value)} />
            </div>
            <textarea placeholder="Description / Achievements" className="input" value={exp.description} onChange={(e) => updateSection("experience", i, "description", e.target.value)} />
            <button className="btn" onClick={() => handleImprove("experience", i)}>✨ Improve with AI</button>
          </div>
        ))}
        <button className="btn-outline" onClick={() => addSection("experience", { title: "", company: "", startDate: "", endDate: "", description: "" })}>+ Add Experience</button>
      </section>

      {/* Education */}
      <section>
        <h2 className="text-xl font-semibold">Education</h2>
        {formData.education.map((edu, i) => (
          <div key={i} className="border p-3 rounded mb-2">
            <input placeholder="Degree" className="input" value={edu.degree} onChange={(e) => updateSection("education", i, "degree", e.target.value)} />
            <input placeholder="Institution" className="input" value={edu.institution} onChange={(e) => updateSection("education", i, "institution", e.target.value)} />
            <div className="grid grid-cols-2 gap-2">
              <input type="date" className="input" value={edu.startDate} onChange={(e) => updateSection("education", i, "startDate", e.target.value)} />
              <input type="date" className="input" value={edu.endDate} onChange={(e) => updateSection("education", i, "endDate", e.target.value)} />
            </div>
            <textarea placeholder="Highlights / Achievements" className="input" value={edu.description} onChange={(e) => updateSection("education", i, "description", e.target.value)} />
            <button className="btn" onClick={() => handleImprove("education", i)}>✨ Improve with AI</button>
          </div>
        ))}
        <button className="btn-outline" onClick={() => addSection("education", { degree: "", institution: "", startDate: "", endDate: "", description: "" })}>+ Add Education</button>
      </section>

      {/* Projects */}
      <section>
        <h2 className="text-xl font-semibold">Projects</h2>
        {formData.projects.map((proj, i) => (
          <div key={i} className="border p-3 rounded mb-2">
            <input placeholder="Project Name" className="input" value={proj.name} onChange={(e) => updateSection("projects", i, "name", e.target.value)} />
            <textarea placeholder="Description" className="input" value={proj.description} onChange={(e) => updateSection("projects", i, "description", e.target.value)} />
            <div className="grid grid-cols-2 gap-2">
              <input type="date" className="input" value={proj.startDate} onChange={(e) => updateSection("projects", i, "startDate", e.target.value)} />
              <input type="date" className="input" value={proj.endDate} onChange={(e) => updateSection("projects", i, "endDate", e.target.value)} />
            </div>
            <button className="btn" onClick={() => handleImprove("projects", i)}>✨ Improve with AI</button>
          </div>
        ))}
        <button className="btn-outline" onClick={() => addSection("projects", { name: "", description: "", startDate: "", endDate: "" })}>+ Add Project</button>
      </section>

      {/* Certificates */}
      <section>
        <h2 className="text-xl font-semibold">Certificates</h2>
        {formData.certificates.map((cert, i) => (
          <div key={i} className="border p-3 rounded mb-2">
            <input placeholder="Certificate Name" className="input" value={cert.name} onChange={(e) => updateSection("certificates", i, "name", e.target.value)} />
            <input placeholder="Issuer" className="input" value={cert.issuer} onChange={(e) => updateSection("certificates", i, "issuer", e.target.value)} />
            <input type="date" className="input" value={cert.date} onChange={(e) => updateSection("certificates", i, "date", e.target.value)} />
          </div>
        ))}
        <button className="btn-outline" onClick={() => addSection("certificates", { name: "", issuer: "", date: "" })}>+ Add Certificate</button>
      </section>

      {/* Save */}
      <button className="btn-primary w-full" onClick={handleSave}>💾 Save Resume</button>
    </div>
  );
}
