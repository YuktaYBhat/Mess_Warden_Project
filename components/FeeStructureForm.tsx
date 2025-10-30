
'use client';

import { useState, useEffect } from 'react';

interface FeeRecord {
  id: string;
  [key: string]: any;
}

interface FeeStructureFormProps {
  record?: FeeRecord | null;
  columns: string[];
  onClose: () => void;
  onSave: (record: Omit<FeeRecord, 'id'>) => void;
}

export default function FeeStructureForm({ record, columns, onClose, onSave }: FeeStructureFormProps) {
  const [formData, setFormData] = useState<Omit<FeeRecord, 'id'>>({});

  useEffect(() => {
    if (record) {
      const { id, ...recordData } = record;
      setFormData(recordData);
    } else {
      const emptyForm: Omit<FeeRecord, 'id'> = {};
      columns.forEach(column => {
        emptyForm[column] = '';
      });
      setFormData(emptyForm);
    }
  }, [record, columns]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  const handleChange = (column: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [column]: value,
    }));
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-gray-800">
              {record ? 'Edit Record' : 'Add New Record'}
            </h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 text-2xl"
            >
              ✕
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {columns.map((column) => (
                <div key={column}>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {column}
                  </label>
                  <input
                    type="text"
                    value={formData[column] || ''}
                    onChange={(e) => handleChange(column, e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              ))}
            </div>

            <div className="flex gap-3 pt-4 border-t border-gray-200">
              <button
                type="submit"
                className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
              >
                {record ? 'Update' : 'Create'} Record
              </button>
              <button
                type="button"
                onClick={onClose}
                className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-400 transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}