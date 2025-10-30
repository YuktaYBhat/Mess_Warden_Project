

import { NextRequest, NextResponse } from 'next/server';
import * as XLSX from 'xlsx';
import { connectStudentDB } from '@/lib/mongodb';
import Student from '@/models/Student';

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    await connectStudentDB();

    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json(
        { success: false, error: 'No file uploaded' },
        { status: 400 }
      );
    }

    console.log('📁 Processing file:', file.name);

    const buffer = await file.arrayBuffer();
    
    const workbook = XLSX.read(buffer, { 
      type: 'buffer',
      cellDates: true,
      raw: false
    });
    
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];

    // Get ALL data as array of arrays
    const allData: any[][] = XLSX.utils.sheet_to_json(worksheet, { 
      header: 1,
      defval: '',
      blankrows: false
    });

    console.log('📊 Raw Excel data rows:', allData.length);

    if (allData.length === 0) {
      return NextResponse.json(
        { success: false, error: 'No data found in Excel file' },
        { status: 400 }
      );
    }

    // Find the row that has SI number patterns
    let headerRowIndex = -1;
    let headers: string[] = [];

    for (let i = 0; i < allData.length; i++) {
      const row = allData[i];
      if (!row || !Array.isArray(row)) continue;

      const rowString = row.map(cell => String(cell).toLowerCase().trim()).join(' ');
      
      const hasSIPattern = 
        rowString.includes('sino') ||
        rowString.includes('si.no') ||
        rowString.includes('s.no') ||
        rowString.includes('si no') ||
        rowString.includes('serial no');

      if (hasSIPattern) {
        headerRowIndex = i;
        headers = row.map(cell => String(cell).trim());
        console.log('🎯 Found header row:', headers);
        break;
      }
    }

    if (headerRowIndex === -1) {
      // Use first row as headers if no SI pattern found
      headerRowIndex = 0;
      headers = allData[0].map(cell => String(cell).trim());
      console.log('📝 Using first row as headers:', headers);
    }

    if (headers.length === 0) {
      return NextResponse.json(
        { success: false, error: 'No headers found in Excel file' },
        { status: 400 }
      );
    }

    // Process data rows
    const dataRows = allData.slice(headerRowIndex + 1);
    const studentData = dataRows
      .map((row: any[]) => {
        if (!row || row.length === 0) return null;
        
        const student: any = {};
        let hasData = false;
        
        headers.forEach((header, colIndex) => {
          const value = row[colIndex];
          if (value !== undefined && value !== null && value !== '') {
            student[header] = value;
            hasData = true;
          }
        });
        
        return hasData ? student : null;
      })
      .filter(student => student !== null);

    console.log('✅ Valid student records:', studentData.length);

    if (studentData.length === 0) {
      return NextResponse.json(
        { success: false, error: 'No student data found' },
        { status: 400 }
      );
    }

    // Save to database
    const uploadBatch = `batch_${Date.now()}`;
    
    const studentsToInsert = studentData.map((student) => ({
      excelData: student,
      uploadBatch: uploadBatch,
      createdAt: new Date()
    }));

    const result = await Student.insertMany(studentsToInsert);
    console.log('💾 Records saved:', result.length);

    return NextResponse.json({
      success: true,
      message: `Uploaded ${result.length} student records`,
      count: result.length,
      batchId: uploadBatch,
      columns: headers,
      sampleData: studentData[0]
    });

  } catch (error: any) {
    console.error('❌ Upload error:', error);
    return NextResponse.json(
      { success: false, error: 'Upload failed: ' + error.message },
      { status: 500 }
    );
  }
}

export async function GET(): Promise<NextResponse> {
  try {
    await connectStudentDB();
    
    const students = await Student.find({}).sort({ createdAt: -1 }).limit(1000);

    console.log('📥 Fetched students:', students.length);

    if (students.length === 0) {
      return NextResponse.json({
        success: true,
        students: [],
        columns: [],
        count: 0
      });
    }

    // Extract columns from first student
    const firstStudent = students[0];
    const columns = firstStudent.excelData ? Object.keys(firstStudent.excelData) : [];

    const formattedStudents = students.map(student => ({
      _id: student._id.toString(),
      uploadBatch: student.uploadBatch,
      createdAt: student.createdAt,
      ...student.excelData
    }));

    return NextResponse.json({
      success: true,
      students: formattedStudents,
      columns: columns,
      count: formattedStudents.length
    });

  } catch (error: any) {
    console.error('❌ Fetch error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch students: ' + error.message },
      { status: 500 }
    );
  }
}