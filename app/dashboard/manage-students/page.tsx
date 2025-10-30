'use client';
import { useState, useEffect } from 'react';

interface ImportedData {
  _id: string;
  import_index: number;
  imported_at: string;
  [key: string]: any;
}

export default function ManageStudents() {
  const [data, setData] = useState<ImportedData[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      const response = await fetch('/api/students');
      const result = await response.json();
      
      if (result.success) {
        setData(result.data);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Get column names safely
  const getColumns = () => {
    if (data.length === 0) return [];
    const firstItem = data[0];
    return Object.keys(firstItem).filter(key => 
      !['_id', 'import_index', 'imported_at'].includes(key)
    );
  };

  const columns = getColumns();

  if (loading) {
    return (
      <div className="p-6">
        <div className="text-center py-12">
          <div className="text-gray-600">Loading data...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Imported Data</h1>
          <p className="text-gray-600">
            {data.length} records • {columns.length} columns
          </p>
        </div>
        <a
          href="/dashboard/upload-students"
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
        >
          Upload New Excel
        </a>
      </div>

      {data.length > 0 ? (
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">#</th>
                  {columns.map((column) => (
                    <th key={column} className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      {column}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {data.map((item, index) => (
                  <tr key={item._id} className="hover:bg-gray-50">
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">{index + 1}</td>
                    {columns.map((column) => (
                      <td key={column} className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                        {item[column] !== undefined ? String(item[column]) : '-'}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="text-center py-12">
          <div className="text-gray-500 mb-4">No data imported yet</div>
          <a
            href="/dashboard/upload-students"
            className="text-blue-600 hover:text-blue-700"
          >
            Upload Excel file
          </a>
        </div>
      )}
    </div>
  );
}