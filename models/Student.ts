import mongoose, { Document, Schema } from 'mongoose';

export interface IStudent extends Document {
  [key: string]: any; // Flexible to store any field from Excel
  excelData: Record<string, any>;
  uploadBatch: string;
  createdAt: Date;
}

const StudentSchema: Schema = new Schema({
  excelData: {
    type: Schema.Types.Mixed,
    required: true
  },
  uploadBatch: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Index for better query performance
StudentSchema.index({ uploadBatch: 1 });
StudentSchema.index({ createdAt: 1 });

export default mongoose.models.Student || mongoose.model<IStudent>('Student', StudentSchema);