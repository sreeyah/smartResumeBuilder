import React from 'react';
import jsPDF from 'jspdf';

export default function ResumePreview({ resumeData }) {
  const handleExport = () => {
    const doc = new jsPDF();
    doc.text(JSON.stringify(resumeData, null, 2), 10, 10);
    doc.save('resume.pdf');
  };

  return (
    <div className="bg-white p-6 rounded shadow">
      <h2 className="text-xl font-semibold mb-4">Resume Preview</h2>
      <pre className="bg-gray-100 p-3 rounded h-96 overflow-auto">{JSON.stringify(resumeData, null, 2)}</pre>
      <button onClick={handleExport} className="mt-3 bg-green-500 text-white px-4 py-2 rounded">Export PDF</button>
    </div>
  );
}
