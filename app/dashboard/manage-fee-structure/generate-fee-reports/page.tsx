// 'use client';
// import { useState } from 'react';
// import { Download, Filter, Printer, FileText, BarChart3, Users, DollarSign, AlertTriangle } from 'lucide-react';

// // Types based on your existing structure
// interface ReportData {
//   id: string;
//   type: string;
//   generatedDate: string;
//   period: string;
//   totalRevenue: number;
//   pendingDues: number;
//   totalStudents: number;
//   defaulters: number;
//   fileFormat: 'PDF' | 'Excel' | 'CSV';
// }

// interface Defaulter {
//   id: string;
//   name: string;
//   roomNumber: string;
//   dueAmount: number;
//   dueSince: string;
//   contact: string;
// }

// export default function GenerateFeeReports() {
//   const [selectedReport, setSelectedReport] = useState<string>('financial-summary');
//   const [dateRange, setDateRange] = useState({ start: '', end: '' });
//   const [format, setFormat] = useState<'PDF' | 'Excel' | 'CSV'>('PDF');

//   const reportTypes = [
//     { id: 'financial-summary', name: 'Financial Summary', icon: BarChart3, description: 'Overall revenue and financial overview' },
//     { id: 'defaulters-list', name: 'Defaulters List', icon: Users, description: 'Students with pending payments' },
//     { id: 'payment-status', name: 'Payment Status', icon: FileText, description: 'Detailed payment status of all students' },
//     { id: 'revenue-analysis', name: 'Revenue Analysis', icon: DollarSign, description: 'Revenue trends and analysis' },
//     { id: 'meal-plan-report', name: 'Meal Plan Report', icon: BarChart3, description: 'Meal plan wise revenue breakdown' },
//     { id: 'room-type-report', name: 'Room Type Report', icon: BarChart3, description: 'Room type wise fee collection' },
//   ];

//   const sampleReports: ReportData[] = [
//     {
//       id: '1',
//       type: 'Financial Summary',
//       generatedDate: '2024-01-15',
//       period: 'Jan 2024',
//       totalRevenue: 185000,
//       pendingDues: 45000,
//       totalStudents: 250,
//       defaulters: 15,
//       fileFormat: 'PDF'
//     },
//     {
//       id: '2',
//       type: 'Defaulters List',
//       generatedDate: '2024-01-14',
//       period: 'Jan 2024',
//       totalRevenue: 0,
//       pendingDues: 45000,
//       totalStudents: 15,
//       defaulters: 15,
//       fileFormat: 'Excel'
//     },
//     {
//       id: '3',
//       type: 'Revenue Analysis',
//       generatedDate: '2024-01-13',
//       period: 'Dec 2023',
//       totalRevenue: 175000,
//       pendingDues: 25000,
//       totalStudents: 245,
//       defaulters: 8,
//       fileFormat: 'PDF'
//     }
//   ];

//   const defaultersData: Defaulter[] = [
//     { id: 'S001', name: 'Aarav Sharma', roomNumber: 'A-101', dueAmount: 3500, dueSince: '2024-01-10', contact: 'aarav@example.com' },
//     { id: 'S002', name: 'Priya Patel', roomNumber: 'B-205', dueAmount: 4200, dueSince: '2024-01-05', contact: 'priya@example.com' },
//     { id: 'S003', name: 'Rohan Kumar', roomNumber: 'C-102', dueAmount: 2800, dueSince: '2024-01-12', contact: 'rohan@example.com' },
//   ];

//   const generateReport = () => {
//     // In real app, this would call your API endpoint
//     console.log('Generating report:', {
//       type: selectedReport,
//       format,
//       dateRange
//     });
    
//     // Simulate API call
//     setTimeout(() => {
//       alert(`${reportTypes.find(r => r.id === selectedReport)?.name} generated successfully in ${format} format!`);
      
//       // In real app, you would:
//       // 1. Call your API route: /api/reports/generate
//       // 2. Return downloadable file or show in preview
//     }, 1000);
//   };

//   const downloadReport = (reportId: string) => {
//     // Simulate download
//     alert(`Downloading report ${reportId}...`);
//   };

//   const printReport = (reportId: string) => {
//     // Simulate print
//     window.print();
//   };

//   const PreviewReport = () => {
//     const selectedReportType = reportTypes.find(r => r.id === selectedReport);
    
//     return (
//       <div className="bg-white rounded-lg shadow-md p-6 mt-6">
//         <h3 className="text-lg font-semibold mb-4">Report Preview - {selectedReportType?.name}</h3>
        
//         {selectedReport === 'financial-summary' && (
//           <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
//             <div className="bg-blue-50 p-4 rounded-lg">
//               <p className="text-sm text-blue-600">Total Revenue</p>
//               <p className="text-2xl font-bold">₹1,85,000</p>
//             </div>
//             <div className="bg-green-50 p-4 rounded-lg">
//               <p className="text-sm text-green-600">Collected</p>
//               <p className="text-2xl font-bold">₹1,40,000</p>
//             </div>
//             <div className="bg-red-50 p-4 rounded-lg">
//               <p className="text-sm text-red-600">Pending</p>
//               <p className="text-2xl font-bold">₹45,000</p>
//             </div>
//             <div className="bg-orange-50 p-4 rounded-lg">
//               <p className="text-sm text-orange-600">Defaulters</p>
//               <p className="text-2xl font-bold">15</p>
//             </div>
//           </div>
//         )}

//         {selectedReport === 'defaulters-list' && (
//           <div className="overflow-x-auto">
//             <table className="w-full table-auto">
//               <thead>
//                 <tr className="bg-gray-50">
//                   <th className="px-4 py-2 text-left">Student ID</th>
//                   <th className="px-4 py-2 text-left">Name</th>
//                   <th className="px-4 py-2 text-left">Room No.</th>
//                   <th className="px-4 py-2 text-left">Due Amount</th>
//                   <th className="px-4 py-2 text-left">Due Since</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {defaultersData.map((defaulter) => (
//                   <tr key={defaulter.id} className="border-t">
//                     <td className="px-4 py-3">{defaulter.id}</td>
//                     <td className="px-4 py-3">{defaulter.name}</td>
//                     <td className="px-4 py-3">{defaulter.roomNumber}</td>
//                     <td className="px-4 py-3 text-red-600 font-semibold">₹{defaulter.dueAmount}</td>
//                     <td className="px-4 py-3">{defaulter.dueSince}</td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>
//         )}

//         {selectedReport === 'payment-status' && (
//           <div className="text-center py-8">
//             <FileText className="h-16 w-16 text-gray-400 mx-auto mb-4" />
//             <p className="text-gray-600">Payment status report preview would show here</p>
//           </div>
//         )}
//       </div>
//     );
//   };

//   return (
//     <div className="p-6">
//       <div className="flex justify-between items-center mb-6">
//         <div>
//           <h1 className="text-2xl font-bold text-gray-800">Generate Fee Reports</h1>
//           <p className="text-gray-600">Create and download various financial reports</p>
//         </div>
//       </div>

//       {/* Report Configuration */}
//       <div className="bg-white rounded-lg shadow-md p-6 mb-6">
//         <h2 className="text-lg font-semibold mb-4">Report Configuration</h2>
        
//         <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-2">
//               Report Type
//             </label>
//             <select 
//               value={selectedReport}
//               onChange={(e) => setSelectedReport(e.target.value)}
//               className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//             >
//               {reportTypes.map(type => (
//                 <option key={type.id} value={type.id}>{type.name}</option>
//               ))}
//             </select>
//             <p className="text-sm text-gray-500 mt-1">
//               {reportTypes.find(r => r.id === selectedReport)?.description}
//             </p>
//           </div>

//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-2">
//               Date Range
//             </label>
//             <div className="flex gap-2">
//               <input
//                 type="date"
//                 value={dateRange.start}
//                 onChange={(e) => setDateRange(prev => ({...prev, start: e.target.value}))}
//                 className="flex-1 p-2 border border-gray-300 rounded-md"
//               />
//               <input
//                 type="date"
//                 value={dateRange.end}
//                 onChange={(e) => setDateRange(prev => ({...prev, end: e.target.value}))}
//                 className="flex-1 p-2 border border-gray-300 rounded-md"
//               />
//             </div>
//           </div>

//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-2">
//               Export Format
//             </label>
//             <select 
//               value={format}
//               onChange={(e) => setFormat(e.target.value as 'PDF' | 'Excel' | 'CSV')}
//               className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//             >
//               <option value="PDF">PDF Document</option>
//               <option value="Excel">Excel Spreadsheet</option>
//               <option value="CSV">CSV File</option>
//             </select>
//           </div>
//         </div>

//         <div className="flex gap-3">
//           <button
//             onClick={generateReport}
//             className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 flex items-center gap-2"
//           >
//             <FileText className="h-4 w-4" />
//             Generate Report
//           </button>
          
//           <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50">
//             <Filter className="h-4 w-4" />
//             Advanced Filters
//           </button>
//         </div>
//       </div>

//       {/* Report Preview */}
//       <PreviewReport />

//       {/* Recent Reports */}
//       <div className="bg-white rounded-lg shadow-md p-6 mt-6">
//         <div className="flex justify-between items-center mb-4">
//           <h2 className="text-lg font-semibold">Recently Generated Reports</h2>
//           <div className="flex gap-2">
//             <button className="flex items-center gap-2 px-3 py-2 border border-gray-300 rounded-md hover:bg-gray-50">
//               <Filter className="h-4 w-4" />
//               Filter
//             </button>
//             <button className="flex items-center gap-2 px-3 py-2 border border-gray-300 rounded-md hover:bg-gray-50">
//               <Printer className="h-4 w-4" />
//               Print All
//             </button>
//           </div>
//         </div>

//         <div className="overflow-x-auto">
//           <table className="w-full table-auto">
//             <thead>
//               <tr className="bg-gray-50">
//                 <th className="px-4 py-2 text-left">Report Type</th>
//                 <th className="px-4 py-2 text-left">Period</th>
//                 <th className="px-4 py-2 text-left">Generated Date</th>
//                 <th className="px-4 py-2 text-left">Total Revenue</th>
//                 <th className="px-4 py-2 text-left">Pending Dues</th>
//                 <th className="px-4 py-2 text-left">Format</th>
//                 <th className="px-4 py-2 text-left">Actions</th>
//               </tr>
//             </thead>
//             <tbody>
//               {sampleReports.map((report) => (
//                 <tr key={report.id} className="border-t hover:bg-gray-50">
//                   <td className="px-4 py-3 font-medium">{report.type}</td>
//                   <td className="px-4 py-3">{report.period}</td>
//                   <td className="px-4 py-3">{report.generatedDate}</td>
//                   <td className="px-4 py-3">
//                     {report.totalRevenue > 0 ? `₹${report.totalRevenue.toLocaleString()}` : '-'}
//                   </td>
//                   <td className="px-4 py-3">
//                     {report.pendingDues > 0 ? `₹${report.pendingDues.toLocaleString()}` : '-'}
//                   </td>
//                   <td className="px-4 py-3">
//                     <span className={`px-2 py-1 rounded-full text-xs ${
//                       report.fileFormat === 'PDF' ? 'bg-red-100 text-red-800' :
//                       report.fileFormat === 'Excel' ? 'bg-green-100 text-green-800' :
//                       'bg-blue-100 text-blue-800'
//                     }`}>
//                       {report.fileFormat}
//                     </span>
//                   </td>
//                   <td className="px-4 py-3">
//                     <div className="flex gap-2">
//                       <button 
//                         onClick={() => downloadReport(report.id)}
//                         className="flex items-center gap-1 px-2 py-1 text-blue-600 hover:bg-blue-50 rounded transition-colors"
//                       >
//                         <Download className="h-4 w-4" />
//                         Download
//                       </button>
//                       <button 
//                         onClick={() => printReport(report.id)}
//                         className="flex items-center gap-1 px-2 py-1 text-green-600 hover:bg-green-50 rounded transition-colors"
//                       >
//                         <Printer className="h-4 w-4" />
//                         Print
//                       </button>
//                     </div>
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//       </div>

//       {/* Quick Stats */}
//       <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
//         <div className="bg-white rounded-lg shadow-md p-6">
//           <div className="flex items-center">
//             <div className="p-3 bg-green-100 rounded-lg">
//               <DollarSign className="h-6 w-6 text-green-600" />
//             </div>
//             <div className="ml-4">
//               <p className="text-sm font-medium text-gray-600">Total Revenue This Month</p>
//               <p className="text-2xl font-bold text-gray-900">₹1,85,000</p>
//             </div>
//           </div>
//         </div>

//         <div className="bg-white rounded-lg shadow-md p-6">
//           <div className="flex items-center">
//             <div className="p-3 bg-red-100 rounded-lg">
//               <AlertTriangle className="h-6 w-6 text-red-600" />
//             </div>
//             <div className="ml-4">
//               <p className="text-sm font-medium text-gray-600">Pending Dues</p>
//               <p className="text-2xl font-bold text-gray-900">₹45,000</p>
//             </div>
//           </div>
//         </div>

//         <div className="bg-white rounded-lg shadow-md p-6">
//           <div className="flex items-center">
//             <div className="p-3 bg-orange-100 rounded-lg">
//               <Users className="h-6 w-6 text-orange-600" />
//             </div>
//             <div className="ml-4">
//               <p className="text-sm font-medium text-gray-600">Current Defaulters</p>
//               <p className="text-2xl font-bold text-gray-900">15 Students</p>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }


'use client';
import { useState, useRef } from 'react';
import { Download, Filter, Printer, FileText, BarChart3, Users, DollarSign, AlertTriangle, Upload, FileSpreadsheet, X, CheckCircle } from 'lucide-react';

// Types
interface ReportData {
  id: string;
  type: string;
  generatedDate: string;
  period: string;
  totalRevenue: number;
  pendingDues: number;
  totalStudents: number;
  defaulters: number;
  fileFormat: 'PDF' | 'Excel' | 'CSV';
}

interface Defaulter {
  id: string;
  name: string;
  roomNumber: string;
  dueAmount: number;
  dueSince: string;
  contact: string;
}

interface StudentImport {
  studentId: string;
  name: string;
  roomNumber: string;
  roomType: 'AC' | 'Non-AC';
  mealPlan: string;
  totalFees: number;
  paidAmount: number;
  dueAmount: number;
  status: 'Paid' | 'Pending' | 'Overdue';
}

export default function GenerateFeeReports() {
  const [selectedReport, setSelectedReport] = useState<string>('financial-summary');
  const [dateRange, setDateRange] = useState({ start: '', end: '' });
  const [format, setFormat] = useState<'PDF' | 'Excel' | 'CSV'>('PDF');
  const [uploadStatus, setUploadStatus] = useState<'idle' | 'uploading' | 'success' | 'error'>('idle');
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [importedStudents, setImportedStudents] = useState<StudentImport[]>([]);
  const [uploadProgress, setUploadProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const reportTypes = [
    { id: 'financial-summary', name: 'Financial Summary', icon: BarChart3, description: 'Overall revenue and financial overview' },
    { id: 'defaulters-list', name: 'Defaulters List', icon: Users, description: 'Students with pending payments' },
    { id: 'payment-status', name: 'Payment Status', icon: FileText, description: 'Detailed payment status of all students' },
    { id: 'revenue-analysis', name: 'Revenue Analysis', icon: DollarSign, description: 'Revenue trends and analysis' },
    { id: 'meal-plan-report', name: 'Meal Plan Report', icon: BarChart3, description: 'Meal plan wise revenue breakdown' },
    { id: 'room-type-report', name: 'Room Type Report', icon: BarChart3, description: 'Room type wise fee collection' },
    { id: 'import-students', name: 'Import Student Data', icon: Upload, description: 'Upload Excel file with student fee data' },
  ];

  // Handle file upload
  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.name.endsWith('.xlsx') && !file.name.endsWith('.xls') && !file.name.endsWith('.csv')) {
      alert('Please upload only Excel (.xlsx, .xls) or CSV files');
      return;
    }

    setUploadedFile(file);
    setUploadStatus('uploading');
    setUploadProgress(0);

    // Simulate upload progress
    const progressInterval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 90) {
          clearInterval(progressInterval);
          return 90;
        }
        return prev + 10;
      });
    }, 200);

    try {
      // In real app, you would send to your API endpoint
      await simulateFileProcessing(file);
      
      clearInterval(progressInterval);
      setUploadProgress(100);
      setUploadStatus('success');
      
      // Simulate parsed data - in real app, this would come from your API
      setTimeout(() => {
        setImportedStudents(generateSampleImportedData());
      }, 500);

    } catch (error) {
      clearInterval(progressInterval);
      setUploadStatus('error');
      alert('Error processing file. Please try again.');
    }
  };

  const simulateFileProcessing = (file: File): Promise<void> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        console.log('Processing file:', file.name);
        resolve();
      }, 2000);
    });
  };

  const generateSampleImportedData = (): StudentImport[] => {
    return [
      { studentId: 'S001', name: 'Aarav Sharma', roomNumber: 'A-101', roomType: 'AC', mealPlan: 'Premium', totalFees: 15000, paidAmount: 15000, dueAmount: 0, status: 'Paid' },
      { studentId: 'S002', name: 'Priya Patel', roomNumber: 'B-205', roomType: 'Non-AC', mealPlan: 'Standard', totalFees: 12000, paidAmount: 8000, dueAmount: 4000, status: 'Pending' },
      { studentId: 'S003', name: 'Rohan Kumar', roomNumber: 'C-102', roomType: 'AC', mealPlan: 'Premium', totalFees: 15000, paidAmount: 12000, dueAmount: 3000, status: 'Overdue' },
      { studentId: 'S004', name: 'Neha Gupta', roomNumber: 'D-301', roomType: 'Non-AC', mealPlan: 'Basic', totalFees: 10000, paidAmount: 10000, dueAmount: 0, status: 'Paid' },
      { studentId: 'S005', name: 'Karan Singh', roomNumber: 'A-204', roomType: 'AC', mealPlan: 'Standard', totalFees: 13000, paidAmount: 9000, dueAmount: 4000, status: 'Pending' },
    ];
  };

  const handleRemoveFile = () => {
    setUploadedFile(null);
    setUploadStatus('idle');
    setUploadProgress(0);
    setImportedStudents([]);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const processImportedData = () => {
    // In real app, send to your API to update database
    alert(`Processing ${importedStudents.length} student records...`);
    
    // Simulate API call
    setTimeout(() => {
      alert('Student data imported successfully!');
      handleRemoveFile();
    }, 1500);
  };

  const downloadTemplate = () => {
    // In real app, serve an actual Excel template file
    alert('Downloading Excel template...');
    
    // Create and download template
    const templateData = [
      ['Student ID', 'Name', 'Room Number', 'Room Type', 'Meal Plan', 'Total Fees', 'Paid Amount', 'Due Amount', 'Status'],
      ['S001', 'John Doe', 'A-101', 'AC', 'Premium', '15000', '15000', '0', 'Paid'],
      ['S002', 'Jane Smith', 'B-205', 'Non-AC', 'Standard', '12000', '8000', '4000', 'Pending']
    ];
    
    // For now, just show alert. In real implementation, generate and download Excel file
    console.log('Template data:', templateData);
  };

  const sampleReports: ReportData[] = [
    {
      id: '1',
      type: 'Financial Summary',
      generatedDate: '2024-01-15',
      period: 'Jan 2024',
      totalRevenue: 185000,
      pendingDues: 45000,
      totalStudents: 250,
      defaulters: 15,
      fileFormat: 'PDF'
    },
    {
      id: '2',
      type: 'Defaulters List',
      generatedDate: '2024-01-14',
      period: 'Jan 2024',
      totalRevenue: 0,
      pendingDues: 45000,
      totalStudents: 15,
      defaulters: 15,
      fileFormat: 'Excel'
    }
  ];

  const defaultersData: Defaulter[] = [
    { id: 'S001', name: 'Aarav Sharma', roomNumber: 'A-101', dueAmount: 3500, dueSince: '2024-01-10', contact: 'aarav@example.com' },
    { id: 'S002', name: 'Priya Patel', roomNumber: 'B-205', dueAmount: 4200, dueSince: '2024-01-05', contact: 'priya@example.com' },
  ];

  const generateReport = () => {
    if (selectedReport === 'import-students') {
      fileInputRef.current?.click();
      return;
    }

    console.log('Generating report:', { type: selectedReport, format, dateRange });
    setTimeout(() => {
      alert(`${reportTypes.find(r => r.id === selectedReport)?.name} generated successfully in ${format} format!`);
    }, 1000);
  };

  const PreviewReport = () => {
    const selectedReportType = reportTypes.find(r => r.id === selectedReport);
    
    if (selectedReport === 'import-students') {
      return (
        <div className="bg-white rounded-lg shadow-md p-6 mt-6">
          <h3 className="text-lg font-semibold mb-4">Import Student Data from Excel</h3>
          
          {/* File Upload Area */}
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center mb-6">
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileUpload}
              accept=".xlsx,.xls,.csv"
              className="hidden"
            />
            
            {uploadStatus === 'idle' && (
              <div>
                <FileSpreadsheet className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 mb-2">Upload Excel file with student fee data</p>
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 flex items-center gap-2 mx-auto"
                >
                  <Upload className="h-4 w-4" />
                  Choose Excel File
                </button>
                <p className="text-sm text-gray-500 mt-2">Supports .xlsx, .xls, .csv files</p>
              </div>
            )}

            {uploadStatus === 'uploading' && (
              <div>
                <FileSpreadsheet className="h-12 w-12 text-blue-500 mx-auto mb-4" />
                <p className="text-gray-600 mb-2">Processing {uploadedFile?.name}</p>
                <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                  <div 
                    className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${uploadProgress}%` }}
                  ></div>
                </div>
                <p className="text-sm text-gray-500">{uploadProgress}%</p>
              </div>
            )}

            {uploadStatus === 'success' && uploadedFile && (
              <div className="text-center">
                <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
                <p className="text-green-600 font-semibold mb-2">File uploaded successfully!</p>
                <p className="text-gray-600">{uploadedFile.name}</p>
                <p className="text-sm text-gray-500 mt-1">
                  {importedStudents.length} student records found
                </p>
                <button
                  onClick={handleRemoveFile}
                  className="mt-4 text-red-600 hover:text-red-700 flex items-center gap-1 mx-auto"
                >
                  <X className="h-4 w-4" />
                  Remove File
                </button>
              </div>
            )}
          </div>

          {/* Template Download */}
          <div className="bg-blue-50 rounded-lg p-4 mb-6">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-semibold text-blue-800">Need a template?</h4>
                <p className="text-blue-600 text-sm">Download our Excel template with proper formatting</p>
              </div>
              <button
                onClick={downloadTemplate}
                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 flex items-center gap-2"
              >
                <Download className="h-4 w-4" />
                Download Template
              </button>
            </div>
          </div>

          {/* Imported Data Preview */}
          {importedStudents.length > 0 && (
            <div>
              <div className="flex justify-between items-center mb-4">
                <h4 className="font-semibold">Imported Student Data ({importedStudents.length} records)</h4>
                <button
                  onClick={processImportedData}
                  className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 flex items-center gap-2"
                >
                  <CheckCircle className="h-4 w-4" />
                  Process Import
                </button>
              </div>
              
              <div className="overflow-x-auto">
                <table className="w-full table-auto text-sm">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="px-3 py-2 text-left">Student ID</th>
                      <th className="px-3 py-2 text-left">Name</th>
                      <th className="px-3 py-2 text-left">Room</th>
                      <th className="px-3 py-2 text-left">Room Type</th>
                      <th className="px-3 py-2 text-left">Meal Plan</th>
                      <th className="px-3 py-2 text-left">Total Fees</th>
                      <th className="px-3 py-2 text-left">Paid</th>
                      <th className="px-3 py-2 text-left">Due</th>
                      <th className="px-3 py-2 text-left">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {importedStudents.map((student, index) => (
                      <tr key={index} className="border-t hover:bg-gray-50">
                        <td className="px-3 py-2">{student.studentId}</td>
                        <td className="px-3 py-2">{student.name}</td>
                        <td className="px-3 py-2">{student.roomNumber}</td>
                        <td className="px-3 py-2">
                          <span className={`px-2 py-1 rounded-full text-xs ${
                            student.roomType === 'AC' ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'
                          }`}>
                            {student.roomType}
                          </span>
                        </td>
                        <td className="px-3 py-2">{student.mealPlan}</td>
                        <td className="px-3 py-2">₹{student.totalFees}</td>
                        <td className="px-3 py-2 text-green-600">₹{student.paidAmount}</td>
                        <td className="px-3 py-2 text-red-600">₹{student.dueAmount}</td>
                        <td className="px-3 py-2">
                          <span className={`px-2 py-1 rounded-full text-xs ${
                            student.status === 'Paid' ? 'bg-green-100 text-green-800' :
                            student.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-red-100 text-red-800'
                          }`}>
                            {student.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      );
    }

    // ... (keep the existing preview components for other report types)
    return (
      <div className="bg-white rounded-lg shadow-md p-6 mt-6">
        <h3 className="text-lg font-semibold mb-4">Report Preview - {selectedReportType?.name}</h3>
        {/* ... existing preview content */}
      </div>
    );
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Generate Fee Reports</h1>
          <p className="text-gray-600">Create and download various financial reports</p>
        </div>
      </div>

      {/* Report Configuration */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h2 className="text-lg font-semibold mb-4">Report Configuration</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Report Type
            </label>
            <select 
              value={selectedReport}
              onChange={(e) => setSelectedReport(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              {reportTypes.map(type => (
                <option key={type.id} value={type.id}>{type.name}</option>
              ))}
            </select>
            <p className="text-sm text-gray-500 mt-1">
              {reportTypes.find(r => r.id === selectedReport)?.description}
            </p>
          </div>

          {selectedReport !== 'import-students' && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Date Range
                </label>
                <div className="flex gap-2">
                  <input
                    type="date"
                    value={dateRange.start}
                    onChange={(e) => setDateRange(prev => ({...prev, start: e.target.value}))}
                    className="flex-1 p-2 border border-gray-300 rounded-md"
                  />
                  <input
                    type="date"
                    value={dateRange.end}
                    onChange={(e) => setDateRange(prev => ({...prev, end: e.target.value}))}
                    className="flex-1 p-2 border border-gray-300 rounded-md"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Export Format
                </label>
                <select 
                  value={format}
                  onChange={(e) => setFormat(e.target.value as 'PDF' | 'Excel' | 'CSV')}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="PDF">PDF Document</option>
                  <option value="Excel">Excel Spreadsheet</option>
                  <option value="CSV">CSV File</option>
                </select>
              </div>
            </>
          )}
        </div>

        <button
          onClick={generateReport}
          className={`px-6 py-2 rounded-md flex items-center gap-2 ${
            selectedReport === 'import-students' 
              ? 'bg-green-600 text-white hover:bg-green-700' 
              : 'bg-blue-600 text-white hover:bg-blue-700'
          }`}
        >
          {selectedReport === 'import-students' ? (
            <>
              <Upload className="h-4 w-4" />
              Upload Excel File
            </>
          ) : (
            <>
              <FileText className="h-4 w-4" />
              Generate Report
            </>
          )}
        </button>
      </div>

      {/* Report Preview */}
      <PreviewReport />

      {/* Recent Reports (hide for import section) */}
      {selectedReport !== 'import-students' && (
        <div className="bg-white rounded-lg shadow-md p-6 mt-6">
          {/* ... existing recent reports table */}
        </div>
      )}
    </div>
  );
}