import mongoose, { Schema, Document, Model } from "mongoose";

interface Meal {
  Breakfast: string[];
  Lunch: string[];
  Snacks: string[];
  Dinner: string[];
}

export interface IMealPlan extends Document {
  day: string;
  bgColor: string;
  textColor: string;
  meals: Meal;
}

// Nested meal schema
const MealSchema = new Schema<Meal>({
  Breakfast: { type: [String], default: [] },
  Lunch: { type: [String], default: [] },
  Snacks: { type: [String], default: [] },
  Dinner: { type: [String], default: [] },
});

// Main schema
const MealPlanSchema = new Schema<IMealPlan>(
  {
    day: { type: String, required: true, unique: true },
    bgColor: { type: String, required: true },
    textColor: { type: String, default: "text-gray-900" },
    meals: { type: MealSchema, required: true },
  },
  {
    timestamps: true,
    collection: "MessMenu", // <-- IMPORTANT: match your existing collection exactly
  }
);

// Use existing model if it exists
const MealPlan: Model<IMealPlan> =
  mongoose.models.MealPlan || mongoose.model<IMealPlan>("MealPlan", MealPlanSchema);

export default MealPlan;
