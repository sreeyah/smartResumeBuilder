import React, { useState } from 'react';
import axios from 'axios';

export default function AISuggestions({ resumeData, setSuggestions, suggestions }) {
  const handleGenerate = async () => {
    const text = Object.values(resumeData).join(' ');
    const response = await axios.post('http://localhost:5000/api/resume/ai-suggestions', { resumeText: text });
    setSuggestions(response.data.suggestions);
  };

  return (
    <div className="mt-6 bg-white p-6 rounded shadow">
      <h2 className="text-xl font-semibold mb-4">AI Suggestions</h2>
      <button onClick={handleGenerate} className="bg-purple-500 text-white px-4 py-2 rounded mb-4">Generate Suggestions</button>
      <div className="whitespace-pre-wrap bg-gray-100 p-3 rounded h-64 overflow-auto">{suggestions}</div>
    </div>
  );
}
