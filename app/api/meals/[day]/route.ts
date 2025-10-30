
import { connectDB } from "@/lib/mongodb";
import MealPlan from "@/models/MealPlan";
import { NextRequest } from "next/server";

interface Params {
  params: { day: string };
}

export async function PUT(req: NextRequest, { params }: Params) {
  try {
    await connectDB();
    const { day } = params;
    const updates = await req.json();

    const updatedMeal = await MealPlan.findOneAndUpdate({ day }, updates, {
      new: true,
    });

    if (!updatedMeal) {
      return Response.json({ error: "Meal not found" }, { status: 404 });
    }

    return Response.json(updatedMeal, { status: 200 });
  } catch (error: any) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}