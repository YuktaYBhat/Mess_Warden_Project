// app/dashboard/import-students/page.tsx
'use client';
import { useState } from 'react';
import { Upload, FileText, CheckCircle } from 'lucide-react';

export default function ImportStudents() {
  const [importStatus, setImportStatus] = useState<'idle' | 'uploading' | 'success' | 'error'>('idle');
  const [importedCount, setImportedCount] = useState(0);

  const handleExcelImport = async (file: File) => {
    setImportStatus('uploading');
    
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch('/api/students/import', {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();
      
      if (result.success) {
        setImportStatus('success');
        setImportedCount(result.importedCount);
      } else {
        setImportStatus('error');
      }
    } catch (error) {
      setImportStatus('error');
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Import Students from Excel</h1>
      
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
          <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600 mb-4">Upload Excel file with student data</p>
          
          <input
            type="file"
            accept=".xlsx, .xls, .csv"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) handleExcelImport(file);
            }}
            className="hidden"
            id="excel-upload"
          />
          
          <label
            htmlFor="excel-upload"
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 cursor-pointer inline-block"
          >
            <Upload className="h-4 w-4 inline mr-2" />
            Choose Excel File
          </label>
        </div>

        {importStatus === 'uploading' && (
          <div className="mt-4 text-center">
            <div className="text-blue-600">Importing your 200 records...</div>
          </div>
        )}

        {importStatus === 'success' && (
          <div className="mt-4 text-center text-green-600">
            <CheckCircle className="h-6 w-6 inline mr-2" />
            Successfully imported {importedCount} students!
          </div>
        )}
      </div>
    </div>
  );
}