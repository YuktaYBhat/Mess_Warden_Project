"use client";

import React, { useState } from "react";

interface Meal {
  Breakfast: string[];
  Lunch: string[];
  Snacks: string[];
  Dinner: string[];
}

export default function WardenMealForm() {
  const [day, setDay] = useState("");
  const [bgColor, setBgColor] = useState("#ffffff");
  const [textColor, setTextColor] = useState("text-gray-900");
  const [meals, setMeals] = useState<Meal>({
    Breakfast: [],
    Lunch: [],
    Snacks: [],
    Dinner: [],
  });
  const [loading, setLoading] = useState(false);

  const handleMealChange = (mealType: keyof Meal, value: string) => {
    setMeals({
      ...meals,
      [mealType]: value.split(",").map((item) => item.trim()),
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const newMeal = { day, bgColor, textColor, meals };

    try {
      const res = await fetch("/api/meals/new", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newMeal),
      });

      if (res) {
        alert("✅ Meal added successfully!");
        setDay("");
        setMeals({ Breakfast: [], Lunch: [], Snacks: [], Dinner: [] });
      } else {
        alert("❌ Error adding meal.");
      }
    } catch (err) {
      console.error(err);
      alert("❌ Something went wrong!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto p-8 bg-white rounded-2xl shadow-lg mt-10">
      <h2 className="text-2xl font-bold mb-6 text-center text-indigo-700">
        🧑‍🍳 Warden Meal Input Form
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <label className="block">
          <span className="font-semibold">Day</span>
          <input
            type="text"
            value={day}
            onChange={(e) => setDay(e.target.value)}
            required
            className="w-full p-2 border rounded mt-1"
            placeholder="e.g. Monday"
          />
        </label>

        {["Breakfast", "Lunch", "Snacks", "Dinner"].map((mealType) => (
          <label key={mealType} className="block">
            <span className="font-semibold">{mealType}</span>
            <input
              type="text"
              onChange={(e) =>
                handleMealChange(mealType as keyof Meal, e.target.value)
              }
              value={(meals[mealType as keyof Meal] || []).join(", ")}
              className="w-full p-2 border rounded mt-1"
              placeholder={`Enter ${mealType} items separated by commas`}
            />
          </label>
        ))}

        <label className="block">
          <span className="font-semibold">Card Background Color</span>
          <input
            type="color"
            value={bgColor}
            onChange={(e) => setBgColor(e.target.value)}
            className="w-20 h-10 border rounded mt-1"
          />
        </label>

        <label className="block">
          <span className="font-semibold">Text Color</span>
          <select
            value={textColor}
            onChange={(e) => setTextColor(e.target.value)}
            className="w-full p-2 border rounded mt-1"
          >
            <option value="text-gray-900">Black</option>
            <option value="text-white">White</option>
            <option value="text-indigo-900">Indigo</option>
            <option value="text-green-900">Green</option>
          </select>
        </label>

        <button
          type="submit"
          disabled={loading}
          className={`w-full py-3 rounded-lg text-white font-semibold transition ${
            loading ? "bg-gray-400" : "bg-indigo-600 hover:bg-indigo-700"
          }`}
        >
          {loading ? "Saving..." : "Save Meal Plan"}
        </button>
      </form>
    </div>
  );
}
