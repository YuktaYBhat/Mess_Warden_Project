import { NextRequest, NextResponse } from 'next/server';
import * as XLSX from 'xlsx';
import { connectStudentDB } from '@/lib/mongodb';
import Student from '@/models/Student';

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    // Connect to database
    await connectStudentDB();

    // Get the file from form data
    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json(
        { success: false, error: 'No file uploaded' },
        { status: 400 }
      );
    }

    // Check file type
    if (!file.name.match(/\.(xlsx|xls|csv)$/)) {
      return NextResponse.json(
        { success: false, error: 'Please upload an Excel file (xlsx, xls, csv)' },
        { status: 400 }
      );
    }

    // Read the file
    const buffer = await file.arrayBuffer();
    
    try {
      const workbook = XLSX.read(buffer, { type: 'buffer' });
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];

      // Convert to JSON
      const data: any[] = XLSX.utils.sheet_to_json(worksheet);
      
      console.log('📊 Data rows found:', data.length);

      if (data.length === 0) {
        return NextResponse.json(
          { success: false, error: 'Excel file is empty or contains no data' },
          { status: 400 }
        );
      }

      // Get columns from first row
      const rawColumns = Object.keys(data[0]);
      console.log('📋 Raw columns:', rawColumns);

      // Filter out serial number columns
      const displayColumns = rawColumns.filter(col => {
        const upperCol = col.toUpperCase();
        return !(
          upperCol.includes('SINO') ||
          upperCol.includes('SI.NO') ||
          upperCol.includes('S.NO') ||
          upperCol.includes('SERIAL') ||
          upperCol.includes('SR.NO')
        );
      });

      console.log('✅ Display columns:', displayColumns);

      if (displayColumns.length === 0) {
        return NextResponse.json(
          { success: false, error: 'No valid columns found after filtering serial numbers' },
          { status: 400 }
        );
      }

      // Clean data - remove completely empty rows
      const cleanedData = data.filter(row => {
        return Object.values(row).some(value => 
          value !== undefined && value !== null && value !== ''
        );
      });

      console.log('🧹 Cleaned data rows:', cleanedData.length);

      if (cleanedData.length === 0) {
        return NextResponse.json(
          { success: false, error: 'No valid data rows found' },
          { status: 400 }
        );
      }

      // Save to database
      const uploadBatch = `batch_${Date.now()}`;
      await Student.deleteMany({});

      const studentsToInsert = cleanedData.map(row => ({
        excelData: row,
        uploadBatch: uploadBatch,
        createdAt: new Date()
      }));

      const result = await Student.insertMany(studentsToInsert);

      return NextResponse.json({
        success: true,
        message: `Successfully uploaded ${result.length} student records`,
        count: result.length,
        batchId: uploadBatch,
        columns: displayColumns,
        sampleData: cleanedData[0]
      });

    } catch (excelError: any) {
      console.error('Excel parsing error:', excelError);
      return NextResponse.json(
        { success: false, error: 'Failed to parse Excel file: ' + excelError.message },
        { status: 400 }
      );
    }

  } catch (error: any) {
    console.error('❌ Upload error:', error);
    return NextResponse.json(
      { success: false, error: 'Server error: ' + error.message },
      { status: 500 }
    );
  }
}