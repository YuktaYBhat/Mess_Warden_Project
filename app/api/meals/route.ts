import { connectDB } from "@/lib/mongodb";
import MealPlan from "@/models/MealPlan";

export async function GET() {
  try {
    await connectDB();
    const meals = await MealPlan.find();
    return Response.json(meals, { status: 200 });
  } catch (error: any) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}
