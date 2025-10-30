'use client';
import { useState } from 'react';

export default function UploadStudents() {
  const [uploadStatus, setUploadStatus] = useState<'idle' | 'uploading' | 'success' | 'error'>('idle');
  const [importResult, setImportResult] = useState<any>(null);

  const handleFileUpload = async (file: File) => {
    setUploadStatus('uploading');
    
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch('/api/students/upload', {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();
      
      if (result.success) {
        setUploadStatus('success');
        setImportResult(result);
      } else {
        setUploadStatus('error');
      }
    } catch (error) {
      console.error('Upload error:', error);
      setUploadStatus('error');
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-2">Upload Excel Data</h1>
      <p className="text-gray-600 mb-6">Upload ANY Excel file - no specific format required</p>
      
      <div className="bg-white rounded-lg shadow-md p-6 max-w-2xl">
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
          <div className="text-4xl mb-4">📊</div>
          <p className="text-lg font-semibold text-gray-700 mb-2">Upload Any Excel File</p>
          <p className="text-gray-500 mb-4">.xlsx, .xls, .csv files supported</p>
          
          <input
            type="file"
            accept=".xlsx, .xls, .csv"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) handleFileUpload(file);
            }}
            className="hidden"
            id="excel-upload"
          />
          
          <label
            htmlFor="excel-upload"
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 cursor-pointer inline-block"
          >
            Choose Excel File
          </label>
        </div>

        {uploadStatus === 'uploading' && (
          <div className="mt-6 p-4 bg-blue-50 rounded-lg text-center">
            <div className="text-blue-600 font-medium">Processing Excel file...</div>
          </div>
        )}

        {uploadStatus === 'success' && importResult && (
          <div className="mt-6 p-4 bg-green-50 rounded-lg text-center">
            <div className="text-green-600 font-medium mb-2">
              ✅ Successfully imported {importResult.importedCount} records!
            </div>
            <a
              href="/dashboard/manage-students"
              className="text-blue-600 hover:text-blue-700 underline"
            >
              View imported data
            </a>
          </div>
        )}

        {uploadStatus === 'error' && (
          <div className="mt-6 p-4 bg-red-50 rounded-lg text-center">
            <div className="text-red-600 font-medium">Error importing data</div>
          </div>
        )}
      </div>
    </div>
  );
}