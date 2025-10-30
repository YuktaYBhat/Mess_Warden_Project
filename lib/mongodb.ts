

import mongoose from "mongoose";

const MONGODB_URI = "" as string;

if (!MONGODB_URI) {
  throw new Error("Please define MONGODB_URI in .env.local");
}

// For MessMenu database
export const connectMessDB = async (): Promise<void> => {

  if (mongoose.connection.readyState >= 1) {
    // If already connected to a different DB, disconnect first
    await mongoose.disconnect();
  }
  
  await mongoose.connect(MONGODB_URI, {
    dbName: "messmenu", // Changed to lowercase to match your actual database
  });
  console.log("✅ Connected to MessMenu database");

};

// For Students database  
export const connectStudentDB = async (): Promise<void> => {
  if (mongoose.connection.readyState >= 1) {
    // If already connected to a different DB, disconnect first
    await mongoose.disconnect();
  }
  
  await mongoose.connect(MONGODB_URI, {
    dbName: "HostelStudent", // Keep this as is since it matches your database
  });
  console.log("✅ Connected to HostelStudent database");
};

// Alias for backward compatibility
export const connectDB = connectMessDB;
