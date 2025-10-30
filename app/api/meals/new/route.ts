import { connectDB } from "@/lib/mongodb";
import MealPlan from "@/models/MealPlan";
import { NextRequest } from "next/server";

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const body = await req.json();
    const newMeal = await MealPlan.create(body);
    return Response.json(newMeal, { status: 201 });
  } catch (error: any) {
    return Response.json({ error: error.message + "hy" }, { status: 500 });
  }
}
