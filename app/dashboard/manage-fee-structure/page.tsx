

// // // app/manage-fee-structure/page.tsx
// // 'use client';
// // import { useState, useEffect } from 'react';
// // import * as XLSX from 'xlsx';

// // interface Student {
// //   _id: string;
// //   [key: string]: any;
// //   uploadBatch?: string;
// //   createdAt?: string;
// // }

// // export default function ManageFeeStructure() {
// //   const [students, setStudents] = useState<Student[]>([]);
// //   const [columns, setColumns] = useState<string[]>([]);
// //   const [loading, setLoading] = useState<boolean>(false);
// //   const [uploading, setUploading] = useState<boolean>(false);
// //   const [message, setMessage] = useState<string>('');
// //   const [editingStudent, setEditingStudent] = useState<Student | null>(null);
// //   const [showAddForm, setShowAddForm] = useState<boolean>(false);
// //   const [newStudent, setNewStudent] = useState<{[key: string]: any}>({});
// //   const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

// //   // Fetch students from database
// //   useEffect(() => {
// //     fetchStudents();
// //   }, []);

// //   const fetchStudents = async (): Promise<void> => {
// //     setLoading(true);
// //     try {
// //       const response = await fetch('/api/upload-students');
      
// //       if (!response.ok) {
// //         throw new Error(`HTTP error! status: ${response.status}`);
// //       }
      
// //       const data = await response.json();
      
// //       if (data.success) {
// //         // Ensure SI Number column is first
// //         const orderedColumns = ensureSINumberFirst(data.columns || []);
// //         setColumns(orderedColumns);
        
// //         // Sort students by SI Number
// //         const sortedStudents = sortStudentsBySINumber(data.students || []);
// //         setStudents(sortedStudents);
        
// //         // Initialize new student with empty values
// //         const initialNewStudent: {[key: string]: string} = {};
// //         orderedColumns.forEach((col: string) => {
// //           initialNewStudent[col] = '';
// //         });
// //         setNewStudent(initialNewStudent);
        
// //         console.log('📊 Loaded:', sortedStudents.length, 'students');
// //         console.log('📋 Columns:', orderedColumns);
// //       } else {
// //         setMessage('❌ Error: ' + (data.error || 'Failed to fetch students'));
// //       }
// //     } catch (error: any) {
// //       console.error('Fetch error:', error);
// //       setMessage('❌ Network error: ' + error.message);
// //     } finally {
// //       setLoading(false);
// //     }
// //   };

// //   // Ensure SI Number column is always first
// //   const ensureSINumberFirst = (cols: string[]): string[] => {
// //     const siNumberPatterns = ['SI No', 'SI No.', 'S.No', 'S.No.', 'Serial No', 'Serial No.', 'Sl No', 'Sl No.', 'SI Number'];
    
// //     // Find SI Number column
// //     let siNumberCol = null;
// //     let otherCols = [];
    
// //     for (const col of cols) {
// //       const colUpper = col.toUpperCase();
// //       const isSINumber = siNumberPatterns.some(pattern => 
// //         colUpper.includes(pattern.toUpperCase())
// //       );
      
// //       if (isSINumber) {
// //         siNumberCol = col;
// //       } else {
// //         otherCols.push(col);
// //       }
// //     }
    
// //     // If no SI Number found, check if we need to add one
// //     if (!siNumberCol) {
// //       siNumberCol = 'SI Number';
// //     }
    
// //     return [siNumberCol, ...otherCols];
// //   };

// //   // Sort students by SI Number
// //   const sortStudentsBySINumber = (studentList: Student[]): Student[] => {
// //     if (studentList.length === 0) return studentList;
    
// //     const siNumberCol = columns[0] || 'SI Number';
    
// //     return [...studentList].sort((a, b) => {
// //       const valueA = a[siNumberCol];
// //       const valueB = b[siNumberCol];
      
// //       // Handle numeric sorting for SI Numbers
// //       const numA = parseInt(valueA);
// //       const numB = parseInt(valueB);
      
// //       if (!isNaN(numA) && !isNaN(numB)) {
// //         return sortOrder === 'asc' ? numA - numB : numB - numA;
// //       }
      
// //       // Fallback to string sorting
// //       const strA = String(valueA || '');
// //       const strB = String(valueB || '');
      
// //       return sortOrder === 'asc' 
// //         ? strA.localeCompare(strB)
// //         : strB.localeCompare(strA);
// //     });
// //   };

// //   // Toggle sort order
// //   const toggleSortOrder = () => {
// //     setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc');
// //   };

// //   // Re-sort students when sort order changes
// //   useEffect(() => {
// //     if (students.length > 0) {
// //       const sorted = sortStudentsBySINumber(students);
// //       setStudents(sorted);
// //     }
// //   }, [sortOrder]);

// //   const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>): Promise<void> => {
// //     const file = event.target.files?.[0];
// //     if (!file) return;

// //     setUploading(true);
// //     setMessage('');

// //     const formData = new FormData();
// //     formData.append('file', file);

// //     try {
// //       const response = await fetch('/api/upload-students', {
// //         method: 'POST',
// //         body: formData,
// //       });

// //       const data = await response.json();

// //       if (data.success) {
// //         setMessage(`✅ ${data.message}`);
// //         fetchStudents();
// //       } else {
// //         setMessage('❌ ' + (data.error || 'Upload failed'));
// //       }
// //     } catch (error: any) {
// //       console.error('Upload error:', error);
// //       setMessage('❌ Upload failed: ' + error.message);
// //     } finally {
// //       setUploading(false);
// //       event.target.value = '';
// //     }
// //   };

// //   // EDIT FUNCTIONALITY - Opens modal in front
// //   const handleEdit = (student: Student) => {
// //     setEditingStudent({...student});
// //     setShowAddForm(false);
// //     setMessage('');
// //   };

// //   const handleSaveEdit = async () => {
// //     if (!editingStudent) return;

// //     try {
// //       const response = await fetch('/api/students', {
// //         method: 'PUT',
// //         headers: {
// //           'Content-Type': 'application/json',
// //         },
// //         body: JSON.stringify(editingStudent),
// //       });

// //       if (!response.ok) {
// //         throw new Error(`HTTP error! status: ${response.status}`);
// //       }

// //       const data = await response.json();

// //       if (data.success) {
// //         setMessage('✅ Student updated successfully');
// //         setEditingStudent(null);
// //         fetchStudents();
// //       } else {
// //         setMessage('❌ Error: ' + (data.error || 'Update failed'));
// //       }
// //     } catch (error: any) {
// //       console.error('Update error:', error);
// //       setMessage('❌ Update failed: ' + error.message);
// //     }
// //   };

// //   const cancelEdit = () => {
// //     setEditingStudent(null);
// //     setMessage('Edit cancelled');
// //   };

// //   // DELETE FUNCTIONALITY
// //   const handleDelete = async (studentId: string) => {
// //     if (!confirm('Are you sure you want to delete this student?')) return;

// //     try {
// //       const response = await fetch('/api/students', {
// //         method: 'DELETE',
// //         headers: {
// //           'Content-Type': 'application/json',
// //         },
// //         body: JSON.stringify({ studentId }),
// //       });

// //       if (!response.ok) {
// //         throw new Error(`HTTP error! status: ${response.status}`);
// //       }

// //       const data = await response.json();

// //       if (data.success) {
// //         setMessage('✅ Student deleted successfully');
// //         fetchStudents();
// //       } else {
// //         setMessage('❌ Error: ' + (data.error || 'Delete failed'));
// //       }
// //     } catch (error: any) {
// //       console.error('Delete error:', error);
// //       setMessage('❌ Delete failed: ' + error.message);
// //     }
// //   };

// //   // ADD STUDENT FUNCTIONALITY
// // const handleAddStudent = async () => {
// //   // Auto-generate next SI Number
// //   const siNumberCol = columns[0] || 'SI Number';
  
// //   // Find the highest SI Number and increment
// //   let nextSINumber = 1;
// //   if (students.length > 0) {
// //     const siNumbers = students.map(s => {
// //       const siValue = s[siNumberCol];
// //       return parseInt(siValue) || 0;
// //     }).filter(num => !isNaN(num));
    
// //     if (siNumbers.length > 0) {
// //       nextSINumber = Math.max(...siNumbers) + 1;
// //     }
// //   }

// //   const studentToAdd = {
// //     ...newStudent,
// //     [siNumberCol]: nextSINumber.toString() // Convert to string
// //   };

// //   // Check if any field has value (excluding SI Number)
// //   const hasData = Object.entries(studentToAdd).some(([key, value]) => 
// //     key !== siNumberCol && value && value.toString().trim() !== ''
// //   );

// //   if (!hasData) {
// //     setMessage('❌ Please fill at least one field (excluding SI Number)');
// //     return;
// //   }

// //   console.log('🔄 Adding student:', studentToAdd);

// //   try {
// //     // Use the add-students API route
// //     const response = await fetch('/api/add-students', {
// //       method: 'POST',
// //       headers: {
// //         'Content-Type': 'application/json',
// //       },
// //       body: JSON.stringify(studentToAdd),
// //     });

// //     const data = await response.json();
// //     console.log('API Response:', data);

// //     if (!response.ok) {
// //       throw new Error(data.error || `HTTP error! status: ${response.status}`);
// //     }

// //     if (data.success) {
// //       setMessage(`✅ Student added successfully with ${siNumberCol}: ${nextSINumber}`);
// //       setShowAddForm(false);
      
// //       // Reset form
// //       const resetStudent: {[key: string]: string} = {};
// //       columns.forEach(col => {
// //         resetStudent[col] = '';
// //       });
// //       setNewStudent(resetStudent);
      
// //       // Refresh the student list immediately
// //       await fetchStudents();
// //     } else {
// //       setMessage('❌ Error: ' + (data.error || 'Add failed'));
// //     }
// //   } catch (error: any) {
// //     console.error('Add student error:', error);
// //     setMessage('❌ Add failed: ' + error.message);
// //   }
// // };
// //   const cancelAdd = () => {
// //     setShowAddForm(false);
// //     setMessage('Add student cancelled');
// //   };

// //   const downloadExcel = () => {
// //     if (students.length === 0) {
// //       setMessage('❌ No student data available to download');
// //       return;
// //     }

// //     try {
// //       // Prepare data for Excel
// //       const excelData = students.map(student => {
// //         const { _id, uploadBatch, createdAt, __v, ...cleanData } = student;
// //         return cleanData;
// //       });

// //       // Create worksheet and workbook
// //       const worksheet = XLSX.utils.json_to_sheet(excelData);
// //       const workbook = XLSX.utils.book_new();
// //       XLSX.utils.book_append_sheet(workbook, worksheet, 'Students Data');
      
// //       const timestamp = new Date().toISOString().split('T')[0];
// //       const filename = `students_data_${timestamp}.xlsx`;
      
// //       XLSX.writeFile(workbook, filename);
      
// //       setMessage(`✅ Excel file downloaded: ${filename}`);
// //     } catch (error: any) {
// //       console.error('Download error:', error);
// //       setMessage('❌ Download failed: ' + error.message);
// //     }
// //   };

// //   return (
// //     <div className="container mx-auto p-6">
// //       <h1 className="text-3xl font-bold mb-6 text-blue-800">Student Management System</h1>
      
// //       {/* Upload Section */}
// //       <div className="bg-white p-6 rounded-lg shadow-md mb-6 border border-blue-200">
// //         <h2 className="text-xl font-semibold mb-4 text-blue-700">Upload Student Excel File</h2>
        
// //         <div className="mb-4 p-4 bg-yellow-50 border border-yellow-200 rounded">
// //           <p className="text-sm text-yellow-800">
// //             <strong>Tip:</strong> Make sure your Excel file has a header row with column names. 
// //             SI Number column will always be displayed first.
// //           </p>
// //         </div>
        
// //         <div className="flex items-center gap-4 mb-4">
// //           <label className="block flex-1">
// //             <input
// //               type="file"
// //               accept=".xlsx,.xls,.csv"
// //               onChange={handleFileUpload}
// //               disabled={uploading}
// //               className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
// //             />
// //           </label>
// //           {uploading && <span className="text-blue-600 animate-pulse">Uploading...</span>}
// //         </div>

// //         {message && (
// //           <div className={`mt-4 p-3 rounded ${
// //             message.includes('❌') 
// //               ? 'bg-red-100 text-red-700 border border-red-300' 
// //               : 'bg-green-100 text-green-700 border border-green-300'
// //           }`}>
// //             {message}
// //           </div>
// //         )}
// //       </div>

// //       {/* Stats and Actions */}
// //       <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
// //         <div className="bg-blue-50 p-4 rounded-lg border border-blue-200 text-center">
// //           <div className="text-2xl font-bold text-blue-800">{students.length}</div>
// //           <div className="text-blue-600 text-sm">Total Students</div>
// //         </div>
        
// //         <div className="bg-white p-4 rounded-lg shadow-md border text-center">
// //           <button
// //             onClick={fetchStudents}
// //             disabled={loading}
// //             className="w-full px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm disabled:bg-gray-400"
// //           >
// //             {loading ? '🔄 Loading...' : '🔄 Refresh Data'}
// //           </button>
// //         </div>
        
// //         <div className="bg-white p-4 rounded-lg shadow-md border text-center">
// //           <button
// //             onClick={downloadExcel}
// //             disabled={students.length === 0}
// //             className="w-full px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 text-sm disabled:bg-gray-400"
// //           >
// //             📥 Export Excel
// //           </button>
// //         </div>

// //         <div className="bg-white p-4 rounded-lg shadow-md border text-center">
// //           <button
// //             onClick={() => {
// //               setShowAddForm(true);
// //               setEditingStudent(null);
// //               setMessage('');
// //             }}
// //             className="w-full px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm"
// //           >
// //             ➕ Add Student
// //           </button>
// //         </div>
// //       </div>

// //       {/* Add Student Form - MODAL STYLE */}
// //       {showAddForm && (
// //         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
// //           <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
// //             <div className="p-6">
// //               <div className="flex justify-between items-center mb-4">
// //                 <h3 className="text-xl font-semibold text-blue-800">Add New Student</h3>
// //                 <button
// //                   onClick={cancelAdd}
// //                   className="text-gray-500 hover:text-gray-700 text-2xl"
// //                 >
// //                   ×
// //                 </button>
// //               </div>
// //               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
// //                 {columns.map(column => (
// //                   <div key={column}>
// //                     <label className="block text-sm font-medium text-gray-700 mb-1">
// //                       {column}:
// //                     </label>
// //                     <input
// //                       type="text"
// //                       value={newStudent[column] || ''}
// //                       onChange={(e) => setNewStudent({
// //                         ...newStudent,
// //                         [column]: e.target.value
// //                       })}
// //                       className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
// //                       placeholder={`Enter ${column.toLowerCase()}`}
// //                     />
// //                   </div>
// //                 ))}
// //               </div>
// //               <div className="flex gap-2 justify-end">
// //                 <button
// //                   onClick={cancelAdd}
// //                   className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
// //                 >
// //                   ❌ Cancel
// //                 </button>
// //                 <button
// //                   onClick={handleAddStudent}
// //                   className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
// //                 >
// //                   💾 Save Student
// //                 </button>
// //               </div>
// //             </div>
// //           </div>
// //         </div>
// //       )}

// //       {/* Edit Student Form - MODAL STYLE */}
// //       {editingStudent && (
// //         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
// //           <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
// //             <div className="p-6">
// //               <div className="flex justify-between items-center mb-4">
// //                 <h3 className="text-xl font-semibold text-yellow-800">Edit Student</h3>
// //                 <button
// //                   onClick={cancelEdit}
// //                   className="text-gray-500 hover:text-gray-700 text-2xl"
// //                 >
// //                   ×
// //                 </button>
// //               </div>
// //               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
// //                 {columns.map(column => (
// //                   <div key={column}>
// //                     <label className="block text-sm font-medium text-gray-700 mb-1">
// //                       {column}:
// //                     </label>
// //                     <input
// //                       type="text"
// //                       value={editingStudent[column] || ''}
// //                       onChange={(e) => setEditingStudent({
// //                         ...editingStudent,
// //                         [column]: e.target.value
// //                       })}
// //                       className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
// //                     />
// //                   </div>
// //                 ))}
// //               </div>
// //               <div className="flex gap-2 justify-end">
// //                 <button
// //                   onClick={cancelEdit}
// //                   className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
// //                 >
// //                   ❌ Cancel
// //                 </button>
// //                 <button
// //                   onClick={handleSaveEdit}
// //                   className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
// //                 >
// //                   💾 Save Changes
// //                 </button>
// //               </div>
// //             </div>
// //           </div>
// //         </div>
// //       )}

// //       {/* Students Table */}
// //       <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
// //         <div className="flex justify-between items-center mb-4">
// //           <h2 className="text-xl font-semibold text-gray-800">
// //             Student Data {students.length > 0 && `(${students.length} students)`}
// //           </h2>
          
// //           <div className="flex items-center gap-4">
// //             {columns.length > 0 && (
// //               <div className="text-sm text-gray-600">
// //                 📋 {columns.length} columns
// //               </div>
// //             )}
            
// //             {students.length > 0 && (
// //               <button
// //                 onClick={toggleSortOrder}
// //                 className="px-3 py-1 bg-gray-600 text-white rounded hover:bg-gray-700 text-sm"
// //               >
// //                 {sortOrder === 'asc' ? '⬆️ Ascending' : '⬇️ Descending'}
// //               </button>
// //             )}
// //           </div>
// //         </div>

// //         {loading ? (
// //           <div className="text-center py-8 text-gray-500">
// //             <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
// //             Loading student data...
// //           </div>
// //         ) : students.length > 0 ? (
// //           <div className="overflow-x-auto">
// //             <table className="min-w-full table-auto border-collapse border border-gray-300">
// //               <thead className="bg-gray-100">
// //                 <tr>
// //                   {columns.map((column) => (
// //                     <th 
// //                       key={column} 
// //                       className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider border border-gray-300"
// //                     >
// //                       {column}
// //                     </th>
// //                   ))}
// //                   <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider border border-gray-300">
// //                     Actions
// //                   </th>
// //                 </tr>
// //               </thead>
// //               <tbody>
// //                 {students.map((student, index) => (
// //                   <tr 
// //                     key={student._id} 
// //                     className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50 hover:bg-gray-100'}
// //                   >
// //                     {columns.map((column) => (
// //                       <td 
// //                         key={`${student._id}-${column}`} 
// //                         className="px-4 py-3 text-sm text-gray-900 border border-gray-300"
// //                       >
// //                         {student[column]?.toString() || '-'}
// //                       </td>
// //                     ))}
// //                     <td className="px-4 py-3 text-sm font-medium border border-gray-300">
// //                       <div className="flex gap-2">
// //                         <button
// //                           onClick={() => handleEdit(student)}
// //                           className="px-3 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600 text-xs"
// //                         >
// //                           ✏️ Edit
// //                         </button>
// //                         <button
// //                           onClick={() => handleDelete(student._id)}
// //                           className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 text-xs"
// //                         >
// //                           🗑️ Delete
// //                         </button>
// //                       </div>
// //                     </td>
// //                   </tr>
// //                 ))}
// //               </tbody>
// //             </table>
// //           </div>
// //         ) : (
// //           <div className="text-center py-12 text-gray-500">
// //             <div className="text-4xl mb-4">📊</div>
// //             <p className="text-lg mb-2">No student data available</p>
// //             <p className="text-sm">Upload an Excel file to get started</p>
// //           </div>
// //         )}
// //       </div>
// //     </div>
// //   );
// // }

// // app/manage-fee-structure/page.tsx
// 'use client';
// import { useState, useEffect } from 'react';
// import * as XLSX from 'xlsx';

// interface Student {
//   _id: string;
//   [key: string]: any;
//   uploadBatch?: string;
//   createdAt?: string;
// }

// export default function ManageFeeStructure() {
//   const [students, setStudents] = useState<Student[]>([]);
//   const [columns, setColumns] = useState<string[]>([]);
//   const [loading, setLoading] = useState<boolean>(false);
//   const [uploading, setUploading] = useState<boolean>(false);
//   const [message, setMessage] = useState<string>('');
//   const [editingStudent, setEditingStudent] = useState<Student | null>(null);
//   const [showAddForm, setShowAddForm] = useState<boolean>(false);
//   const [newStudent, setNewStudent] = useState<{[key: string]: any}>({});
//   const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
//   const [searchTerm, setSearchTerm] = useState<string>('');
 
//   // Fetch students from database
//   useEffect(() => {
//     fetchStudents();
//   }, []);

//   const fetchStudents = async (): Promise<void> => {
//     setLoading(true);
//     try {
//       const response = await fetch('/api/upload-students');
      
//       if (!response.ok) {
//         throw new Error(`HTTP error! status: ${response.status}`);
//       }
      
//       const data = await response.json();
      
//       if (data.success) {
//         // Ensure SI Number column is first
//         const orderedColumns = ensureSINumberFirst(data.columns || []);
//         setColumns(orderedColumns);
        
//         // Sort students by SI Number
//         const sortedStudents = sortStudentsBySINumber(data.students || []);
//         setStudents(sortedStudents);
        
//         // Initialize new student with empty values
//         const initialNewStudent: {[key: string]: string} = {};
//         orderedColumns.forEach((col: string) => {
//           initialNewStudent[col] = '';
//         });
//         setNewStudent(initialNewStudent);
        
//         console.log('📊 Loaded:', sortedStudents.length, 'students');
//         console.log('📋 Columns:', orderedColumns);
//       } else {
//         setMessage('❌ Error: ' + (data.error || 'Failed to fetch students'));
//       }
//     } catch (error: any) {
//       console.error('Fetch error:', error);
//       setMessage('❌ Network error: ' + error.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Ensure SI Number column is always first
//   const ensureSINumberFirst = (cols: string[]): string[] => {
//     const siNumberPatterns = ['SI No', 'SI No.', 'S.No', 'S.No.', 'Serial No', 'Serial No.', 'Sl No', 'Sl No.', 'SI Number'];
    
//     // Find SI Number column
//     let siNumberCol = null;
//     let otherCols = [];
    
//     for (const col of cols) {
//       const colUpper = col.toUpperCase();
//       const isSINumber = siNumberPatterns.some(pattern => 
//         colUpper.includes(pattern.toUpperCase())
//       );
      
//       if (isSINumber) {
//         siNumberCol = col;
//       } else {
//         otherCols.push(col);
//       }
//     }
    
//     // If no SI Number found, check if we need to add one
//     if (!siNumberCol) {
//       siNumberCol = 'SI Number';
//     }
    
//     return [siNumberCol, ...otherCols];
//   };

//   // Sort students by SI Number
//   const sortStudentsBySINumber = (studentList: Student[]): Student[] => {
//     if (studentList.length === 0) return studentList;
    
//     const siNumberCol = columns[0] || 'SI Number';
    
//     return [...studentList].sort((a, b) => {
//       const valueA = a[siNumberCol];
//       const valueB = b[siNumberCol];
      
//       // Handle numeric sorting for SI Numbers
//       const numA = parseInt(valueA);
//       const numB = parseInt(valueB);
      
//       if (!isNaN(numA) && !isNaN(numB)) {
//         return sortOrder === 'asc' ? numA - numB : numB - numA;
//       }
      
//       // Fallback to string sorting
//       const strA = String(valueA || '');
//       const strB = String(valueB || '');
      
//       return sortOrder === 'asc' 
//         ? strA.localeCompare(strB)
//         : strB.localeCompare(strA);
//     });
//   };

//   // Toggle sort order
//   const toggleSortOrder = () => {
//     setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc');
//   };

//   // Re-sort students when sort order changes
//   useEffect(() => {
//     if (students.length > 0) {
//       const sorted = sortStudentsBySINumber(students);
//       setStudents(sorted);
//     }
//   }, [sortOrder]);

//   // Search functionality
//   const filteredStudents = students.filter(student => {
//     if (!searchTerm) return true;
    
//     const searchLower = searchTerm.toLowerCase();
//     return columns.some(column => {
//       const value = student[column]?.toString().toLowerCase();
//       return value && value.includes(searchLower);
//     });
//   });

//   const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>): Promise<void> => {
//     const file = event.target.files?.[0];
//     if (!file) return;

//     setUploading(true);
//     setMessage('');

//     const formData = new FormData();
//     formData.append('file', file);

//     try {
//       const response = await fetch('/api/upload-students', {
//         method: 'POST',
//         body: formData,
//       });

//       const data = await response.json();

//       if (data.success) {
//         setMessage(`✅ ${data.message}`);
//         fetchStudents();
//       } else {
//         setMessage('❌ ' + (data.error || 'Upload failed'));
//       }
//     } catch (error: any) {
//       console.error('Upload error:', error);
//       setMessage('❌ Upload failed: ' + error.message);
//     } finally {
//       setUploading(false);
//       event.target.value = '';
//     }
//   };

//   // EDIT FUNCTIONALITY - Opens modal in front
//   const handleEdit = (student: Student) => {
//     setEditingStudent({...student});
//     setShowAddForm(false);
//     setMessage('');
//   };

//   const handleSaveEdit = async () => {
//     if (!editingStudent) return;

//     try {
//       const response = await fetch('/api/students', {
//         method: 'PUT',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify(editingStudent),
//       });

//       if (!response.ok) {
//         throw new Error(`HTTP error! status: ${response.status}`);
//       }

//       const data = await response.json();

//       if (data.success) {
//         setMessage('✅ Student updated successfully');
//         setEditingStudent(null);
//         fetchStudents();
//       } else {
//         setMessage('❌ Error: ' + (data.error || 'Update failed'));
//       }
//     } catch (error: any) {
//       console.error('Update error:', error);
//       setMessage('❌ Update failed: ' + error.message);
//     }
//   };

//   const cancelEdit = () => {
//     setEditingStudent(null);
//     setMessage('Edit cancelled');
//   };

//   // DELETE FUNCTIONALITY
//   const handleDelete = async (studentId: string) => {
//     if (!confirm('Are you sure you want to delete this student?')) return;

//     try {
//       const response = await fetch('/api/students', {
//         method: 'DELETE',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({ studentId }),
//       });

//       if (!response.ok) {
//         throw new Error(`HTTP error! status: ${response.status}`);
//       }

//       const data = await response.json();

//       if (data.success) {
//         setMessage('✅ Student deleted successfully');
//         fetchStudents();
//       } else {
//         setMessage('❌ Error: ' + (data.error || 'Delete failed'));
//       }
//     } catch (error: any) {
//       console.error('Delete error:', error);
//       setMessage('❌ Delete failed: ' + error.message);
//     }
//   };

//   // ADD STUDENT FUNCTIONALITY
// const handleAddStudent = async () => {
//   // Auto-generate next SI Number
//   const siNumberCol = columns[0] || 'SI Number';
  
//   // Find the highest SI Number and increment
//   let nextSINumber = 1;
//   if (students.length > 0) {
//     const siNumbers = students.map(s => {
//       const siValue = s[siNumberCol];
//       return parseInt(siValue) || 0;
//     }).filter(num => !isNaN(num));
    
//     if (siNumbers.length > 0) {
//       nextSINumber = Math.max(...siNumbers) + 1;
//     }
//   }

//   const studentToAdd = {
//     ...newStudent,
//     [siNumberCol]: nextSINumber.toString() // Convert to string
//   };

//   // Check if any field has value (excluding SI Number)
//   const hasData = Object.entries(studentToAdd).some(([key, value]) => 
//     key !== siNumberCol && value && value.toString().trim() !== ''
//   );

//   if (!hasData) {
//     setMessage('❌ Please fill at least one field (excluding SI Number)');
//     return;
//   }

//   console.log('🔄 Adding student:', studentToAdd);

//   try {
//     // Use the add-students API route
//     const response = await fetch('/api/add-students', {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json',
//       },
//       body: JSON.stringify(studentToAdd),
//     });

//     const data = await response.json();
//     console.log('API Response:', data);

//     if (!response.ok) {
//       throw new Error(data.error || `HTTP error! status: ${response.status}`);
//     }

//     if (data.success) {
//       setMessage(`✅ Student added successfully with ${siNumberCol}: ${nextSINumber}`);
//       setShowAddForm(false);
      
//       // Reset form
//       const resetStudent: {[key: string]: string} = {};
//       columns.forEach(col => {
//         resetStudent[col] = '';
//       });
//       setNewStudent(resetStudent);
      
//       // Refresh the student list immediately
//       await fetchStudents();
//     } else {
//       setMessage('❌ Error: ' + (data.error || 'Add failed'));
//     }
//   } catch (error: any) {
//     console.error('Add student error:', error);
//     setMessage('❌ Add failed: ' + error.message);
//   }
// };
//   const cancelAdd = () => {
//     setShowAddForm(false);
//     setMessage('Add student cancelled');
//   };

//   const downloadExcel = () => {
//     if (students.length === 0) {
//       setMessage('❌ No student data available to download');
//       return;
//     }

//     try {
//       // Prepare data for Excel
//       const excelData = students.map(student => {
//         const { _id, uploadBatch, createdAt, __v, ...cleanData } = student;
//         return cleanData;
//       });

//       // Create worksheet and workbook
//       const worksheet = XLSX.utils.json_to_sheet(excelData);
//       const workbook = XLSX.utils.book_new();
//       XLSX.utils.book_append_sheet(workbook, worksheet, 'Students Data');
      
//       const timestamp = new Date().toISOString().split('T')[0];
//       const filename = `students_data_${timestamp}.xlsx`;
      
//       XLSX.writeFile(workbook, filename);
      
//       setMessage(`✅ Excel file downloaded: ${filename}`);
//     } catch (error: any) {
//       console.error('Download error:', error);
//       setMessage('❌ Download failed: ' + error.message);
//     }
//   };

//   return (
//     <div className="container mx-auto p-6">
//       <h1 className="text-3xl font-bold mb-6 text-blue-800">Student Management System</h1>
      
//       {/* Upload Section */}
//       <div className="bg-white p-6 rounded-lg shadow-md mb-6 border border-blue-200">
//         <h2 className="text-xl font-semibold mb-4 text-blue-700">Upload Student Excel File</h2>
        
//         <div className="mb-4 p-4 bg-yellow-50 border border-yellow-200 rounded">
//           <p className="text-sm text-yellow-800">
//             <strong>Tip:</strong> Make sure your Excel file has a header row with column names. 
//             SI Number column will always be displayed first.
//           </p>
//         </div>
        
//         <div className="flex items-center gap-4 mb-4">
//           <label className="block flex-1">
//             <input
//               type="file"
//               accept=".xlsx,.xls,.csv"
//               onChange={handleFileUpload}
//               disabled={uploading}
//               className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
//             />
//           </label>
//           {uploading && <span className="text-blue-600 animate-pulse">Uploading...</span>}
//         </div>

//         {message && (
//           <div className={`mt-4 p-3 rounded ${
//             message.includes('❌') 
//               ? 'bg-red-100 text-red-700 border border-red-300' 
//               : 'bg-green-100 text-green-700 border border-green-300'
//           }`}>
//             {message}
//           </div>
//         )}
//       </div>

//       {/* Stats and Actions */}
//       <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
//         <div className="bg-blue-50 p-4 rounded-lg border border-blue-200 text-center">
//           <div className="text-2xl font-bold text-blue-800">{students.length}</div>
//           <div className="text-blue-600 text-sm">Total Students</div>
//         </div>
        
//         <div className="bg-white p-4 rounded-lg shadow-md border text-center">
//           <button
//             onClick={fetchStudents}
//             disabled={loading}
//             className="w-full px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm disabled:bg-gray-400"
//           >
//             {loading ? '🔄 Loading...' : '🔄 Refresh Data'}
//           </button>
//         </div>
        
//         <div className="bg-white p-4 rounded-lg shadow-md border text-center">
//           <button
//             onClick={downloadExcel}
//             disabled={students.length === 0}
//             className="w-full px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 text-sm disabled:bg-gray-400"
//           >
//             📥 Export Excel
//           </button>
//         </div>

//         <div className="bg-white p-4 rounded-lg shadow-md border text-center">
//           <button
//             onClick={() => {
//               setShowAddForm(true);
//               setEditingStudent(null);
//               setMessage('');
//             }}
//             className="w-full px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm"
//           >
//             ➕ Add Student
//           </button>
//         </div>
//       </div>

//       {/* Add Student Form - MODAL STYLE */}
//       {showAddForm && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
//           <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
//             <div className="p-6">
//               <div className="flex justify-between items-center mb-4">
//                 <h3 className="text-xl font-semibold text-blue-800">Add New Student</h3>
//                 <button
//                   onClick={cancelAdd}
//                   className="text-gray-500 hover:text-gray-700 text-2xl"
//                 >
//                   ×
//                 </button>
//               </div>
//               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
//                 {columns.map(column => (
//                   <div key={column}>
//                     <label className="block text-sm font-medium text-gray-700 mb-1">
//                       {column}:
//                     </label>
//                     <input
//                       type="text"
//                       value={newStudent[column] || ''}
//                       onChange={(e) => setNewStudent({
//                         ...newStudent,
//                         [column]: e.target.value
//                       })}
//                       className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//                       placeholder={`Enter ${column.toLowerCase()}`}
//                     />
//                   </div>
//                 ))}
//               </div>
//               <div className="flex gap-2 justify-end">
//                 <button
//                   onClick={cancelAdd}
//                   className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
//                 >
//                   ❌ Cancel
//                 </button>
//                 <button
//                   onClick={handleAddStudent}
//                   className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
//                 >
//                   💾 Save Student
//                 </button>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Edit Student Form - MODAL STYLE */}
//       {editingStudent && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
//           <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
//             <div className="p-6">
//               <div className="flex justify-between items-center mb-4">
//                 <h3 className="text-xl font-semibold text-yellow-800">Edit Student</h3>
//                 <button
//                   onClick={cancelEdit}
//                   className="text-gray-500 hover:text-gray-700 text-2xl"
//                 >
//                   ×
//                 </button>
//               </div>
//               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
//                 {columns.map(column => (
//                   <div key={column}>
//                     <label className="block text-sm font-medium text-gray-700 mb-1">
//                       {column}:
//                     </label>
//                     <input
//                       type="text"
//                       value={editingStudent[column] || ''}
//                       onChange={(e) => setEditingStudent({
//                         ...editingStudent,
//                         [column]: e.target.value
//                       })}
//                       className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//                     />
//                   </div>
//                 ))}
//               </div>
//               <div className="flex gap-2 justify-end">
//                 <button
//                   onClick={cancelEdit}
//                   className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
//                 >
//                   ❌ Cancel
//                 </button>
//                 <button
//                   onClick={handleSaveEdit}
//                   className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
//                 >
//                   💾 Save Changes
//                 </button>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Students Table */}
//       <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
//         <div className="flex justify-between items-center mb-4">
//           <h2 className="text-xl font-semibold text-gray-800">
//             Student Data {students.length > 0 && `(${students.length} students)`}
//           </h2>
          
//           <div className="flex items-center gap-4">
//             {/* Search Bar */}
//             <div className="relative">
//               <input
//                 type="text"
//                 placeholder="Search students..."
//                 value={searchTerm}
//                 onChange={(e) => setSearchTerm(e.target.value)}
//                 className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-64"
//               />
//               <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//                 <span className="text-gray-400">🔍</span>
//               </div>
//             </div>
            
//             {columns.length > 0 && (
//               <div className="text-sm text-gray-600">
//                 📋 {columns.length} columns
//               </div>
//             )}
            
//             {students.length > 0 && (
//               <button
//                 onClick={toggleSortOrder}
//                 className="px-3 py-1 bg-gray-600 text-white rounded hover:bg-gray-700 text-sm"
//               >
//                 {sortOrder === 'asc' ? '⬆️ Ascending' : '⬇️ Descending'}
//               </button>
//             )}
//           </div>
//         </div>

//         {loading ? (
//           <div className="text-center py-8 text-gray-500">
//             <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
//             Loading student data...
//           </div>
//         ) : filteredStudents.length > 0 ? (
//           <div className="overflow-x-auto">
//             <table className="min-w-full table-auto border-collapse border border-gray-300">
//               <thead className="bg-gray-100">
//                 <tr>
//                   {columns.map((column) => (
//                     <th 
//                       key={column} 
//                       className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider border border-gray-300"
//                     >
//                       {column}
//                     </th>
//                   ))}
//                   <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider border border-gray-300">
//                     Actions
//                   </th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {filteredStudents.map((student, index) => (
//                   <tr 
//                     key={student._id} 
//                     className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50 hover:bg-gray-100'}
//                   >
//                     {columns.map((column) => (
//                       <td 
//                         key={`${student._id}-${column}`} 
//                         className="px-4 py-3 text-sm text-gray-900 border border-gray-300"
//                       >
//                         {student[column]?.toString() || '-'}
//                       </td>
//                     ))}
//                     <td className="px-4 py-3 text-sm font-medium border border-gray-300">
//                       <div className="flex gap-2">
//                         <button
//                           onClick={() => handleEdit(student)}
//                           className="px-3 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600 text-xs"
//                         >
//                           ✏️ Edit
//                         </button>
//                         <button
//                           onClick={() => handleDelete(student._id)}
//                           className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 text-xs"
//                         >
//                           🗑️ Delete
//                         </button>
//                       </div>
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>
//         ) : (
//           <div className="text-center py-12 text-gray-500">
//             <div className="text-4xl mb-4">📊</div>
//             <p className="text-lg mb-2">
//               {searchTerm ? 'No students found matching your search' : 'No student data available'}
//             </p>
//             <p className="text-sm">
//               {searchTerm ? 'Try a different search term' : 'Upload an Excel file to get started'}
//             </p>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }

// app/manage-fee-structure/page.tsx
'use client';
import { useState, useEffect } from 'react';
import * as XLSX from 'xlsx';

interface Student {
  _id: string;
  [key: string]: any;
  uploadBatch?: string;
  createdAt?: string;
}

export default function ManageFeeStructure() {
  const [students, setStudents] = useState<Student[]>([]);
  const [columns, setColumns] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [uploading, setUploading] = useState<boolean>(false);
  const [message, setMessage] = useState<string>('');
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);
  const [showAddForm, setShowAddForm] = useState<boolean>(false);
  const [newStudent, setNewStudent] = useState<{[key: string]: any}>({});
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [paymentFilter, setPaymentFilter] = useState<string>('all');

  // Fetch students from database
  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async (): Promise<void> => {
    setLoading(true);
    try {
      const response = await fetch('/api/upload-students');
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (data.success) {
        // Ensure SI Number column is first
        const orderedColumns = ensureSINumberFirst(data.columns || []);
        setColumns(orderedColumns);
        
        // Sort students by SI Number
        const sortedStudents = sortStudentsBySINumber(data.students || []);
        setStudents(sortedStudents);
        
        // Initialize new student with empty values
        const initialNewStudent: {[key: string]: string} = {};
        orderedColumns.forEach((col: string) => {
          initialNewStudent[col] = '';
        });
        setNewStudent(initialNewStudent);
        
        console.log('📊 Loaded:', sortedStudents.length, 'students');
        console.log('📋 Columns:', orderedColumns);
      } else {
        setMessage('❌ Error: ' + (data.error || 'Failed to fetch students'));
      }
    } catch (error: any) {
      console.error('Fetch error:', error);
      setMessage('❌ Network error: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  // Ensure SI Number column is always first
  const ensureSINumberFirst = (cols: string[]): string[] => {
    const siNumberPatterns = ['SI No', 'SI No.', 'S.No', 'S.No.', 'Serial No', 'Serial No.', 'Sl No', 'Sl No.', 'SI Number'];
    
    // Find SI Number column
    let siNumberCol = null;
    let otherCols = [];
    
    for (const col of cols) {
      const colUpper = col.toUpperCase();
      const isSINumber = siNumberPatterns.some(pattern => 
        colUpper.includes(pattern.toUpperCase())
      );
      
      if (isSINumber) {
        siNumberCol = col;
      } else {
        otherCols.push(col);
      }
    }
    
    // If no SI Number found, check if we need to add one
    if (!siNumberCol) {
      siNumberCol = 'SI Number';
    }
    
    return [siNumberCol, ...otherCols];
  };

  // Sort students by SI Number
  const sortStudentsBySINumber = (studentList: Student[]): Student[] => {
    if (studentList.length === 0) return studentList;
    
    const siNumberCol = columns[0] || 'SI Number';
    
    return [...studentList].sort((a, b) => {
      const valueA = a[siNumberCol];
      const valueB = b[siNumberCol];
      
      // Handle numeric sorting for SI Numbers
      const numA = parseInt(valueA);
      const numB = parseInt(valueB);
      
      if (!isNaN(numA) && !isNaN(numB)) {
        return sortOrder === 'asc' ? numA - numB : numB - numA;
      }
      
      // Fallback to string sorting
      const strA = String(valueA || '');
      const strB = String(valueB || '');
      
      return sortOrder === 'asc' 
        ? strA.localeCompare(strB)
        : strB.localeCompare(strA);
    });
  };

  // Toggle sort order
  const toggleSortOrder = () => {
    setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc');
  };

  // Re-sort students when sort order changes
  useEffect(() => {
    if (students.length > 0) {
      const sorted = sortStudentsBySINumber(students);
      setStudents(sorted);
    }
  }, [sortOrder]);

  // Find payment column name
  const findPaymentColumn = (): string => {
    if (students.length === 0) return '';
    
    const paymentKeywords = ['payment', 'paid', 'status'];
    for (const column of columns) {
      const colLower = column.toLowerCase();
      if (paymentKeywords.some(keyword => colLower.includes(keyword))) {
        return column;
      }
    }
    return '';
  };

  // Get payment status from student
  const getPaymentStatus = (student: Student): string => {
    const paymentColumn = findPaymentColumn();
    
    if (paymentColumn && student[paymentColumn] !== undefined && student[paymentColumn] !== null) {
      const status = student[paymentColumn].toString().toLowerCase().trim();
      
      // Direct matching
      if (status === 'paid') return 'paid';
      if (status === 'unpaid' || status === 'not paid') return 'unpaid';
      
      // Partial matching
      if (status.includes('paid') && !status.includes('unpaid')) return 'paid';
      if (status.includes('unpaid') || status.includes('not paid')) return 'unpaid';
    }
    
    return 'unknown';
  };

  // Search and filter functionality
  const filteredStudents = students.filter(student => {
    // Search filter
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      const hasSearchMatch = columns.some(column => {
        const value = student[column]?.toString().toLowerCase();
        return value && value.includes(searchLower);
      });
      if (!hasSearchMatch) return false;
    }
    
    // Payment status filter
    if (paymentFilter !== 'all') {
      const paymentStatus = getPaymentStatus(student);
      if (paymentStatus !== paymentFilter) return false;
    }
    
    return true;
  });

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>): Promise<void> => {
    const file = event.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setMessage('');

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch('/api/upload-students', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (data.success) {
        setMessage(`✅ ${data.message}`);
        fetchStudents();
      } else {
        setMessage('❌ ' + (data.error || 'Upload failed'));
      }
    } catch (error: any) {
      console.error('Upload error:', error);
      setMessage('❌ Upload failed: ' + error.message);
    } finally {
      setUploading(false);
      event.target.value = '';
    }
  };

  // EDIT FUNCTIONALITY
  const handleEdit = (student: Student) => {
    setEditingStudent({...student});
    setShowAddForm(false);
    setMessage('');
  };

  const handleSaveEdit = async () => {
    if (!editingStudent) return;

    try {
      const response = await fetch('/api/students', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(editingStudent),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      if (data.success) {
        setMessage('✅ Student updated successfully');
        setEditingStudent(null);
        fetchStudents();
      } else {
        setMessage('❌ Error: ' + (data.error || 'Update failed'));
      }
    } catch (error: any) {
      console.error('Update error:', error);
      setMessage('❌ Update failed: ' + error.message);
    }
  };

  const cancelEdit = () => {
    setEditingStudent(null);
    setMessage('Edit cancelled');
  };

  // DELETE FUNCTIONALITY
  const handleDelete = async (studentId: string) => {
    if (!confirm('Are you sure you want to delete this student?')) return;

    try {
      const response = await fetch('/api/students', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ studentId }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      if (data.success) {
        setMessage('✅ Student deleted successfully');
        fetchStudents();
      } else {
        setMessage('❌ Error: ' + (data.error || 'Delete failed'));
      }
    } catch (error: any) {
      console.error('Delete error:', error);
      setMessage('❌ Delete failed: ' + error.message);
    }
  };

  // ADD STUDENT FUNCTIONALITY
  const handleAddStudent = async () => {
    // Auto-generate next SI Number
    const siNumberCol = columns[0] || 'SI Number';
    
    // Find the highest SI Number and increment
    let nextSINumber = 1;
    if (students.length > 0) {
      const siNumbers = students.map(s => {
        const siValue = s[siNumberCol];
        return parseInt(siValue) || 0;
      }).filter(num => !isNaN(num));
      
      if (siNumbers.length > 0) {
        nextSINumber = Math.max(...siNumbers) + 1;
      }
    }

    const studentToAdd = {
      ...newStudent,
      [siNumberCol]: nextSINumber.toString() // Convert to string
    };

    // Check if any field has value (excluding SI Number)
    const hasData = Object.entries(studentToAdd).some(([key, value]) => 
      key !== siNumberCol && value && value.toString().trim() !== ''
    );

    if (!hasData) {
      setMessage('❌ Please fill at least one field (excluding SI Number)');
      return;
    }

    console.log('🔄 Adding student:', studentToAdd);

    try {
      // Use the add-students API route
      const response = await fetch('/api/students', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(studentToAdd),
      });

      const data = await response.json();
      console.log('API Response:', data);

      if (!response.ok) {
        throw new Error(data.error || `HTTP error! status: ${response.status}`);
      }

      if (data.success) {
        setMessage(`✅ Student added successfully with ${siNumberCol}: ${nextSINumber}`);
        setShowAddForm(false);
        
        // Reset form
        const resetStudent: {[key: string]: string} = {};
        columns.forEach(col => {
          resetStudent[col] = '';
        });
        setNewStudent(resetStudent);
        
        // Refresh the student list immediately
        await fetchStudents();
      } else {
        setMessage('❌ Error: ' + (data.error || 'Add failed'));
      }
    } catch (error: any) {
      console.error('Add student error:', error);
      setMessage('❌ Add failed: ' + error.message);
    }
  };

  const cancelAdd = () => {
    setShowAddForm(false);
    setMessage('Add student cancelled');
  };

  const downloadExcel = () => {
    if (students.length === 0) {
      setMessage('❌ No student data available to download');
      return;
    }

    try {
      // Prepare data for Excel
      const excelData = students.map(student => {
        const { _id, uploadBatch, createdAt, __v, ...cleanData } = student;
        return cleanData;
      });

      // Create worksheet and workbook
      const worksheet = XLSX.utils.json_to_sheet(excelData);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Students Data');
      
      const timestamp = new Date().toISOString().split('T')[0];
      const filename = `students_data_${timestamp}.xlsx`;
      
      XLSX.writeFile(workbook, filename);
      
      setMessage(`✅ Excel file downloaded: ${filename}`);
    } catch (error: any) {
      console.error('Download error:', error);
      setMessage('❌ Download failed: ' + error.message);
    }
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6 text-blue-800">Student Management System</h1>
      
      {/* Upload Section */}
      <div className="bg-white p-6 rounded-lg shadow-md mb-6 border border-blue-200">
        <h2 className="text-xl font-semibold mb-4 text-blue-700">Upload Student Excel File</h2>
        
        <div className="mb-4 p-4 bg-yellow-50 border border-yellow-200 rounded">
          <p className="text-sm text-yellow-800">
            <strong>Tip:</strong> Make sure your Excel file has a header row with column names. 
            SI Number column will always be displayed first.
          </p>
        </div>
        
        <div className="flex items-center gap-4 mb-4">
          <label className="block flex-1">
            <input
              type="file"
              accept=".xlsx,.xls,.csv"
              onChange={handleFileUpload}
              disabled={uploading}
              className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
            />
          </label>
          {uploading && <span className="text-blue-600 animate-pulse">Uploading...</span>}
        </div>

        {message && (
          <div className={`mt-4 p-3 rounded ${
            message.includes('❌') 
              ? 'bg-red-100 text-red-700 border border-red-300' 
              : 'bg-green-100 text-green-700 border border-green-300'
          }`}>
            {message}
          </div>
        )}
      </div>

      {/* Stats and Actions */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-blue-50 p-4 rounded-lg border border-blue-200 text-center">
          <div className="text-2xl font-bold text-blue-800">{students.length}</div>
          <div className="text-blue-600 text-sm">Total Students</div>
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow-md border text-center">
          <button
            onClick={fetchStudents}
            disabled={loading}
            className="w-full px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm disabled:bg-gray-400"
          >
            {loading ? '🔄 Loading...' : '🔄 Refresh Data'}
          </button>
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow-md border text-center">
          <button
            onClick={downloadExcel}
            disabled={students.length === 0}
            className="w-full px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 text-sm disabled:bg-gray-400"
          >
            📥 Export Excel
          </button>
        </div>

        <div className="bg-white p-4 rounded-lg shadow-md border text-center">
          <button
            onClick={() => {
              setShowAddForm(true);
              setEditingStudent(null);
              setMessage('');
            }}
            className="w-full px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm"
          >
            ➕ Add Student
          </button>
        </div>
      </div>

      {/* Add Student Form - MODAL STYLE */}
      {showAddForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-semibold text-blue-800">Add New Student</h3>
                <button
                  onClick={cancelAdd}
                  className="text-gray-500 hover:text-gray-700 text-2xl"
                >
                  ×
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                {columns.map(column => (
                  <div key={column}>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {column}:
                    </label>
                    <input
                      type="text"
                      value={newStudent[column] || ''}
                      onChange={(e) => setNewStudent({
                        ...newStudent,
                        [column]: e.target.value
                      })}
                      className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder={`Enter ${column.toLowerCase()}`}
                    />
                  </div>
                ))}
              </div>
              <div className="flex gap-2 justify-end">
                <button
                  onClick={cancelAdd}
                  className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
                >
                  ❌ Cancel
                </button>
                <button
                  onClick={handleAddStudent}
                  className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                >
                  💾 Save Student
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Student Form - MODAL STYLE */}
      {editingStudent && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-semibold text-yellow-800">Edit Student</h3>
                <button
                  onClick={cancelEdit}
                  className="text-gray-500 hover:text-gray-700 text-2xl"
                >
                  ×
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                {columns.map(column => (
                  <div key={column}>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {column}:
                    </label>
                    <input
                      type="text"
                      value={editingStudent[column] || ''}
                      onChange={(e) => setEditingStudent({
                        ...editingStudent,
                        [column]: e.target.value
                      })}
                      className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                ))}
              </div>
              <div className="flex gap-2 justify-end">
                <button
                  onClick={cancelEdit}
                  className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
                >
                  ❌ Cancel
                </button>
                <button
                  onClick={handleSaveEdit}
                  className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                >
                  💾 Save Changes
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Students Table */}
      <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-800">
            Student Data {students.length > 0 && `(${filteredStudents.length} of ${students.length} students)`}
          </h2>
          
          <div className="flex items-center gap-4">
            {/* Payment Status Filter */}
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">Payment:</span>
              <select
                value={paymentFilter}
                onChange={(e) => setPaymentFilter(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="all">All</option>
                <option value="paid">Paid</option>
                <option value="unpaid">Not Paid</option>
              </select>
            </div>
            
            {/* Search Bar */}
            <div className="relative">
              <input
                type="text"
                placeholder="Search students..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-64"
              />
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <span className="text-gray-400">🔍</span>
              </div>
            </div>
            
            {columns.length > 0 && (
              <div className="text-sm text-gray-600">
                📋 {columns.length} columns
              </div>
            )}
            
            {students.length > 0 && (
              <button
                onClick={toggleSortOrder}
                className="px-3 py-1 bg-gray-600 text-white rounded hover:bg-gray-700 text-sm"
              >
                {sortOrder === 'asc' ? '⬆️ Ascending' : '⬇️ Descending'}
              </button>
            )}
          </div>
        </div>

        {loading ? (
          <div className="text-center py-8 text-gray-500">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
            Loading student data...
          </div>
        ) : filteredStudents.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full table-auto border-collapse border border-gray-300">
              <thead className="bg-gray-100">
                <tr>
                  {columns.map((column) => (
                    <th 
                      key={column} 
                      className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider border border-gray-300"
                    >
                      {column}
                    </th>
                  ))}
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider border border-gray-300">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredStudents.map((student, index) => (
                  <tr 
                    key={student._id} 
                    className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50 hover:bg-gray-100'}
                  >
                    {columns.map((column) => (
                      <td 
                        key={`${student._id}-${column}`} 
                        className="px-4 py-3 text-sm text-gray-900 border border-gray-300"
                      >
                        {student[column]?.toString() || '-'}
                      </td>
                    ))}
                    <td className="px-4 py-3 text-sm font-medium border border-gray-300">
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleEdit(student)}
                          className="px-3 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600 text-xs"
                        >
                          ✏️ Edit
                        </button>
                        <button
                          onClick={() => handleDelete(student._id)}
                          className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 text-xs"
                        >
                          🗑️ Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-12 text-gray-500">
            <div className="text-4xl mb-4">📊</div>
            <p className="text-lg mb-2">
              {searchTerm || paymentFilter !== 'all' ? 'No students found matching your filters' : 'No student data available'}
            </p>
            <p className="text-sm">
              {searchTerm || paymentFilter !== 'all' ? 'Try adjusting your search or filters' : 'Upload an Excel file to get started'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}