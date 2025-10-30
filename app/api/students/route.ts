
// import { NextRequest, NextResponse } from 'next/server';
// import { connectStudentDB } from '@/lib/mongodb';
// import Student from '@/models/Student';

// export async function GET(): Promise<NextResponse> {
//   try {
//     await connectStudentDB();
    
//     const students = await Student.find({})
//       .sort({ createdAt: -1 })
//       .limit(1000);

//     console.log('📥 Fetched students from DB:', students.length);

//     // Extract columns from student data
//     const allColumns = new Set<string>();
//     const formattedStudents = students.map(student => {
//       const studentData = {
//         _id: student._id.toString(),
//         uploadBatch: student.uploadBatch,
//         createdAt: student.createdAt,
//         ...student.excelData
//       };

//       // Collect all column names
//       Object.keys(student.excelData || {}).forEach(key => {
//         if (key && key.trim() !== '') {
//           allColumns.add(key);
//         }
//       });

//       return studentData;
//     });

//     const columns = Array.from(allColumns);

//     return NextResponse.json({
//       success: true,
//       students: formattedStudents,
//       columns: columns,
//       count: formattedStudents.length
//     });

//   } catch (error: any) {
//     console.error('❌ Fetch error:', error);
//     return NextResponse.json(
//       { 
//         success: false, 
//         error: 'Failed to fetch students: ' + error.message 
//       },
//       { status: 500 }
//     );
//   }
// }

// // export async function POST(request: NextRequest): Promise<NextResponse> {
// //   try {
// //     await connectStudentDB();

// //     const body = await request.json();
// //     console.log('📝 Adding new student:', body);

// //     // Validate required fields
// //     if (!body || Object.keys(body).length === 0) {
// //       return NextResponse.json(
// //         { success: false, error: 'No student data provided' },
// //         { status: 400 }
// //       );
// //     }

// //     const newStudent = new Student({
// //       excelData: body,
// //       uploadBatch: `manual_${Date.now()}`,
// //       createdAt: new Date()
// //     });

// //     const savedStudent = await newStudent.save();

// //     return NextResponse.json({
// //       success: true,
// //       message: 'Student added successfully',
// //       student: {
// //         _id: savedStudent._id,
// //         ...savedStudent.excelData,
// //         uploadBatch: savedStudent.uploadBatch,
// //         createdAt: savedStudent.createdAt
// //       }
// //     });

// //   } catch (error: any) {
// //     console.error('❌ Add student error:', error);
// //     return NextResponse.json(
// //       { 
// //         success: false, 
// //         error: 'Failed to add student: ' + error.message 
// //       },
// //       { status: 500 }
// //     );
// //   }
// // }


// export async function POST(request: NextRequest) {
//   try {
//     await connectStudentDB();

//     const body = await request.json();
//     console.log('📝 Adding new student:', body);

//     // Validate required fields
//     if (!body || Object.keys(body).length === 0) {
//       return NextResponse.json(
//         { success: false, error: 'No student data provided' },
//         { status: 400 }
//       );
//     }

//     // ✅ SAFE: Only creates new student, no deletion
//     const newStudent = new Student({
//       excelData: body,
//       uploadBatch: `manual_${Date.now()}`,
//       createdAt: new Date()
//        });

//     const savedStudent = await newStudent.save();

//     console.log('✅ Student added successfully:', savedStudent._id);

//     return NextResponse.json({
//       success: true,
//       message: 'Student added successfully',
//       student: {
//         _id: savedStudent._id,
//         ...savedStudent.excelData,
//         uploadBatch: savedStudent.uploadBatch,
//         createdAt: savedStudent.createdAt
//       }
//     });

//   } catch (error: any) {
//     console.error('❌ Add student error:', error);
//     return NextResponse.json(
//     { 
//         success: false, 
//         error: 'Failed to add student: ' + error.message 
//       },
//       { status: 500 }
//     );
//   }
// }

// export async function PUT(request: NextRequest): Promise<NextResponse> {
//   try {
//     await connectStudentDB();

//     const body = await request.json();
//     console.log('✏️ Updating student:', body);

//     if (!body._id) {
//       return NextResponse.json(
//         { success: false, error: 'Student ID is required' },
//         { status: 400 }
//       );
//     }

//     const { _id, uploadBatch, createdAt, ...excelData } = body;

//     const updatedStudent = await Student.findByIdAndUpdate(
//       _id,
//       { 
//         excelData: excelData,
//         uploadBatch: uploadBatch || `updated_${Date.now()}`
//       },
//       { new: true }
//     );

//     if (!updatedStudent) {
//       return NextResponse.json(
//         { success: false, error: 'Student not found' },
//         { status: 404 }
//       );
//     }

//     return NextResponse.json({
//       success: true,
//       message: 'Student updated successfully',
//       student: {
//         _id: updatedStudent._id,
//         ...updatedStudent.excelData,
//         uploadBatch: updatedStudent.uploadBatch,
//         createdAt: updatedStudent.createdAt
//       }
//     });

//   } catch (error: any) {
//     console.error('❌ Update student error:', error);
//     return NextResponse.json(
//       { 
//         success: false, 
//         error: 'Failed to update student: ' + error.message 
//       },
//       { status: 500 }
//     );
//   }
// }

// export async function DELETE(request: NextRequest): Promise<NextResponse> {
//   try {
//     await connectStudentDB();

//     const body = await request.json();
//     const { studentId } = body;

//     if (!studentId) {
//       return NextResponse.json(
//         { success: false, error: 'Student ID is required' },
//         { status: 400 }
//       );
//     }

//     const deletedStudent = await Student.findByIdAndDelete(studentId);

//     if (!deletedStudent) {
//       return NextResponse.json(
//         { success: false, error: 'Student not found' },
//         { status: 404 }
//       );
//     }

//     return NextResponse.json({
//       success: true,
//       message: 'Student deleted successfully'
//     });

//   } catch (error: any) {
//     console.error('❌ Delete student error:', error);
//     return NextResponse.json(
//       { 
//         success: false, 
//         error: 'Failed to delete student: ' + error.message 
//       },
//       { status: 500 }
//     );
//   }
// }

import { NextRequest, NextResponse } from 'next/server';
import { connectStudentDB } from '@/lib/mongodb';
import Student from '@/models/Student';

// GET - Fetch all students
export async function GET() {
  try {
    await connectStudentDB();
    
    const students = await Student.find({}).limit(1000);

    console.log('📥 Fetched students from DB:', students.length);

    // Extract columns from student data
    const allColumns = new Set<string>();
    const formattedStudents = students.map(student => {
      const studentData = {
        _id: student._id.toString(),
        uploadBatch: student.uploadBatch,
        createdAt: student.createdAt,
        ...student.excelData
      };

      // Collect all column names
      Object.keys(student.excelData || {}).forEach(key => {
        if (key && key.trim() !== '') {
          allColumns.add(key);
        }
      });

      return studentData;
    });

    const columns = Array.from(allColumns);

    return NextResponse.json({
      success: true,
      students: formattedStudents,
      columns: columns,
      count: formattedStudents.length
    });

  } catch (error: any) {
    console.error('❌ Fetch error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to fetch students: ' + error.message 
      },
      { status: 500 }
    );
  }
}

// POST - Add new student (SAFE - doesn't delete existing data)
export async function POST(request: NextRequest) {
  try {
    await connectStudentDB();

    const body = await request.json();
    console.log('📝 Adding new student:', body);

    // Validate required fields
    if (!body || Object.keys(body).length === 0) {
      return NextResponse.json(
        { success: false, error: 'No student data provided' },
        { status: 400 }
      );
    }

    // ✅ SAFE: Only creates new student, no deletion
    const newStudent = new Student({
      excelData: body,
      uploadBatch: `manual_${Date.now()}`,
      createdAt: new Date()
    });

    const savedStudent = await newStudent.save();

    console.log('✅ Student added successfully:', savedStudent._id);

    return NextResponse.json({
      success: true,
      message: 'Student added successfully',
      student: {
        _id: savedStudent._id,
        ...savedStudent.excelData,
        uploadBatch: savedStudent.uploadBatch,
        createdAt: savedStudent.createdAt
      }
    });

  } catch (error: any) {
    console.error('❌ Add student error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to add student: ' + error.message 
      },
      { status: 500 }
    );
  }
}

// PUT - Update student
export async function PUT(request: NextRequest) {
  try {
    await connectStudentDB();

    const body = await request.json();
    console.log('✏️ Updating student:', body);

    if (!body._id) {
      return NextResponse.json(
        { success: false, error: 'Student ID is required' },
        { status: 400 }
      );
    }

    const { _id, uploadBatch, createdAt, ...excelData } = body;

    const updatedStudent = await Student.findByIdAndUpdate(
      _id,
      { 
        excelData: excelData,
        uploadBatch: uploadBatch || `updated_${Date.now()}`
      },
      { new: true }
    );

    if (!updatedStudent) {
      return NextResponse.json(
        { success: false, error: 'Student not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Student updated successfully',
      student: {
        _id: updatedStudent._id,
        ...updatedStudent.excelData,
        uploadBatch: updatedStudent.uploadBatch,
        createdAt: updatedStudent.createdAt
      }
    });

  } catch (error: any) {
    console.error('❌ Update student error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to update student: ' + error.message 
      },
      { status: 500 }
    );
  }
}

// DELETE - Delete student
export async function DELETE(request: NextRequest) {
  try {
    await connectStudentDB();

    const body = await request.json();
    const { studentId } = body;

    if (!studentId) {
      return NextResponse.json(
        { success: false, error: 'Student ID is required' },
        { status: 400 }
      );
    }

    const deletedStudent = await Student.findByIdAndDelete(studentId);

    if (!deletedStudent) {
      return NextResponse.json(
        { success: false, error: 'Student not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Student deleted successfully'
    });

  } catch (error: any) {
    console.error('❌ Delete student error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to delete student: ' + error.message 
      },
      { status: 500 }
    );
  }
}