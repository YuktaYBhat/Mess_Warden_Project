// import { connectDB } from "@/lib/mongodb";
// import { NextRequest } from "next/server";

// export async function POST(req: NextRequest) {
//   try {
//     await connectDB();
//     const body = await req.json();
    
//     // Here you can save timings to your database if needed
//     // For now, we'll just return success
//     console.log('Received timings update:', body);
    
//     return Response.json({ 
//       message: 'Timings updated successfully',
//       timings: body 
//     }, { status: 201 });
//   } catch (error: any) {
//     return Response.json({ error: error.message }, { status: 500 });
//   }
// }



import { connectDB } from "@/lib/mongodb";
import { NextRequest } from "next/server";

// Simple in-memory storage (replace with database in production)
let currentTimings = {
  breakfast: "8:00 AM - 9:30 AM",
  lunch: "12:30 PM - 2:00 PM", 
  snacks: "5:00 PM - 6:00 PM",
  dinner: "8:00 PM - 9:30 PM"
};

export async function GET() {
  try {
    await connectDB();
    // In a real app, you would fetch from database:
    // const timings = await TimingsModel.findOne();
    return Response.json(currentTimings, { status: 200 });
  } catch (error: any) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const body = await req.json();
    
    // Update the timings
    currentTimings = body;
    
    // In a real app, you would save to database:
    // await TimingsModel.findOneAndUpdate({}, body, { upsert: true, new: true });
    
    console.log('Updated timings:', currentTimings);
    
    return Response.json({ 
      message: 'Timings updated successfully',
      timings: currentTimings 
    }, { status: 201 });
  } catch (error: any) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}