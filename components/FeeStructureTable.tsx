

'use client';

interface FeeRecord {
  id: string;
  [key: string]: any;
}

interface FeeStructureTableProps {
  data: FeeRecord[];
  columns: string[];
  getPaymentStatus: (record: FeeRecord) => 'paid' | 'unpaid';
  onEdit: (record: FeeRecord) => void;
  onDelete: (id: string) => void;
  onUpdatePayment: (id: string, status: 'paid' | 'unpaid') => void;
  currentFilter: 'all' | 'paid' | 'unpaid';
}

export default function FeeStructureTable({ 
  data, 
  columns, 
  getPaymentStatus,
  onEdit,
  onDelete,
  onUpdatePayment,
  currentFilter
}: FeeStructureTableProps) {
  const formatValue = (value: any): string => {
    if (value === null || value === undefined || value === '') return '';
    if (typeof value === 'number') return value.toLocaleString();
    return String(value);
  };

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">#</th>
            {columns.map((column) => (
              <th key={column} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                {column}
              </th>
            ))}
            {currentFilter === 'all' && (
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Payment Status
              </th>
            )}
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {data.map((record, index) => {
            const paymentStatus = getPaymentStatus(record);
            return (
              <tr key={record.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {index + 1}
                </td>
                
                {columns.map((column) => (
                  <td key={`${record.id}-${column}`} className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {formatValue(record[column])}
                  </td>
                ))}
                
                {/* Only show payment status column when viewing "All Students" */}
                {currentFilter === 'all' && (
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <span
                        className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                          paymentStatus === 'paid' 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {paymentStatus === 'paid' ? 'PAID' : 'UNPAID'}
                      </span>
                      <div className="flex gap-1">
                        <button
                          onClick={() => onUpdatePayment(record.id, 'paid')}
                          className="text-green-600 hover:text-green-800 text-xs"
                          title="Mark as Paid"
                        >
                          ✓
                        </button>
                        <button
                          onClick={() => onUpdatePayment(record.id, 'unpaid')}
                          className="text-red-600 hover:text-red-800 text-xs"
                          title="Mark as Unpaid"
                        >
                          ✗
                        </button>
                      </div>
                    </div>
                  </td>
                )}
                
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                  <button
                    onClick={() => onEdit(record)}
                    className="text-blue-600 hover:text-blue-900 px-2 py-1 rounded hover:bg-blue-50"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => onDelete(record.id)}
                    className="text-red-600 hover:text-red-900 px-2 py-1 rounded hover:bg-red-50"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}