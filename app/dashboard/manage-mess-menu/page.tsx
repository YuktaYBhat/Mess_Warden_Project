

"use client"
import React, { useState, useCallback, useRef, useEffect, useMemo } from 'react';

interface Meal {
  Breakfast: string[];
  Lunch: string[];
  Snacks: string[];
  Dinner: string[];
}

interface DayItem {
  id: string;
  day: string;
  bgColor: string; 
  textColor: string; 
  meals: Meal;
}

interface MessTimings {
  breakfast: string;
  lunch: string;
  snacks: string;
  dinner: string;
}

const CARD_WIDTH = 250;
const CARD_HEIGHT = 350;
const RADIUS = 250;
const SENSITIVITY = 150;

const defaultTimings: MessTimings = {
  breakfast: "8:00 AM - 9:30 AM",
  lunch: "12:30 PM - 2:00 PM",
  snacks: "5:00 PM - 6:00 PM",
  dinner: "8:00 PM - 9:30 PM"
};

const MessMenuCarousel = () => {
  const [menu, setMenu] = useState<DayItem[]>([]);
  const [snappedItem, setSnappedItem] = useState(0);
  const [draggingItem, setDraggingItem] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showTimingsModal, setShowTimingsModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [timings, setTimings] = useState<MessTimings>(defaultTimings);
  const [newTimings, setNewTimings] = useState<MessTimings>(defaultTimings);
  const [editingDay, setEditingDay] = useState<DayItem | null>(null);
  const [editedMeals, setEditedMeals] = useState<Meal | null>(null);
  const dragStartRef = useRef<{ x: number, dragItem: number } | null>(null);

  useEffect(() => {
    const loadTimings = async () => {
      try {
        const savedTimings = localStorage.getItem('messTimings');
        if (savedTimings) {
          setTimings(JSON.parse(savedTimings));
          setNewTimings(JSON.parse(savedTimings));
        } else {
          const response = await fetch('/api/timings');
          if (response.ok) {
            const data = await response.json();
            setTimings(data);
            setNewTimings(data);
            localStorage.setItem('messTimings', JSON.stringify(data));
          }
        }
      } catch (error) {
        console.error('Error loading timings:', error);
      }
    };

    loadTimings();
  }, []);

  useEffect(() => {
    const fetchMenu = async () => {
      try {
        const res = await fetch('/api/meals');
        const data = await res.json();

        const normalizedMenu: DayItem[] = data.map((item: any, index: number) => ({
          id: item.id || `day-${index}`,
          day: item.day || `Day ${index + 1}`,
          bgColor: item.bgColor || 'linear-gradient(to top, #ccc, #eee)',
          textColor: item.textColor || 'text-gray-900',
          meals: {
            Breakfast: Array.isArray(item.meals?.Breakfast) ? item.meals.Breakfast : [],
            Lunch: Array.isArray(item.meals?.Lunch) ? item.meals.Lunch : [],
            Snacks: Array.isArray(item.meals?.Snacks) ? item.meals.Snacks : [],
            Dinner: Array.isArray(item.meals?.Dinner) ? item.meals.Dinner : [],
          }
        }));

        setMenu(normalizedMenu);
        setSnappedItem(0);
        setDraggingItem(0);

      } catch (err) {
        console.error('Failed to fetch menu:', err);
      }
    };
    fetchMenu();
  }, []);

  // Carousel functions
  const count = menu.length;
  
  const distance = useCallback((itemIndex: number): number => {
    let dist = draggingItem - itemIndex;
    if (dist > count / 2) dist -= count;
    if (dist < -count / 2) dist += count;
    return dist;
  }, [draggingItem, count]);

  const myXOffset = useCallback((itemIndex: number): number => {
    const dist = distance(itemIndex);
    const angle = (Math.PI * 2 / count) * dist;
    return Math.sin(angle) * RADIUS;
  }, [distance, count]);

  const getScale = useCallback((itemIndex: number): number => {
    const dist = distance(itemIndex);
    return Math.max(0.6, 1.0 - Math.abs(dist) * 0.2);
  }, [distance]);

  const getOpacity = useCallback((itemIndex: number): number => {
    const dist = distance(itemIndex);
    return Math.max(0.3, 1.0 - Math.abs(dist) * 0.35);
  }, [distance]);

  const getZIndex = useCallback((itemIndex: number): number => {
    const dist = distance(itemIndex);
    return Math.max(0, 1.0 - Math.abs(dist) * 0.1);
  }, [distance]);

  const startDrag = useCallback((clientX: number) => {
    setIsDragging(true);
    dragStartRef.current = { x: clientX, dragItem: draggingItem };
  }, [draggingItem]);

  const onDrag = useCallback((clientX: number) => {
    if (!isDragging || !dragStartRef.current) return;
    const deltaX = clientX - dragStartRef.current.x;
    setDraggingItem(dragStartRef.current.dragItem - (deltaX / SENSITIVITY));
  }, [isDragging]);

  const endDrag = useCallback(() => {
    if (!isDragging || !dragStartRef.current) return;
    setIsDragging(false);
    let newSnappedItem = Math.round(draggingItem);
    newSnappedItem = (newSnappedItem % count + count) % count;
    setSnappedItem(newSnappedItem);
    setDraggingItem(newSnappedItem);
    dragStartRef.current = null;
  }, [isDragging, draggingItem, count]);

  const handleMouseDown = (e: React.MouseEvent) => startDrag(e.clientX);
  const handleMouseMove = (e: React.MouseEvent) => onDrag(e.clientX);
  const handleMouseUp = () => endDrag();
  const handleTouchStart = (e: React.TouchEvent) => startDrag(e.touches[0].clientX);
  const handleTouchMove = (e: React.TouchEvent) => onDrag(e.touches[0].clientX);
  const handleTouchEnd = () => endDrag();

  useEffect(() => {
    window.addEventListener('mouseup', handleMouseUp);
    window.addEventListener('touchend', handleTouchEnd);
    return () => {
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('touchend', handleTouchEnd);
    };
  }, [handleMouseUp, handleTouchEnd]);

  const goToItem = (index: number) => {
    const currentSnapped = (Math.round(snappedItem) % count + count) % count;
    let diff = index - currentSnapped;
    if (diff > count / 2) diff -= count;
    if (diff < -count / 2) diff += count;
    setSnappedItem(prev => prev + diff);
    setDraggingItem(prev => prev + diff);
  };

  const moveCarousel = useCallback((direction: 1 | -1) => {
    const newSnappedItem = snappedItem + direction;
    setSnappedItem(newSnappedItem);
    setDraggingItem(newSnappedItem);
  }, [snappedItem]);

  const activeIndex = useMemo(() => {
    return (Math.round(snappedItem) % count + count) % count;
  }, [snappedItem, count]);

  const activeDay = menu[activeIndex];

  const getDishesDisplay = (dishes: any): string => {
    if (Array.isArray(dishes)) {
      return dishes.join(', ');
    }
    if (typeof dishes === 'string') {
      return dishes;
    }
    return 'No items';
  };

  const handleUpdateTimings = () => {
    setNewTimings(timings);
    setShowTimingsModal(true);
  };

  const saveTimings = async () => {
    setIsLoading(true);
    try {
      localStorage.setItem('messTimings', JSON.stringify(newTimings));
      
      const response = await fetch('/api/timings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newTimings),
      });

      if (response.ok) {
        const savedTimings = await response.json();
        setTimings(savedTimings.timings);
        alert('Mess timings updated successfully!');
      } else {
        alert('Failed to update timings');
      }
      
      setShowTimingsModal(false);
    } catch (error) {
      console.error('Error updating timings:', error);
      setTimings(newTimings);
      alert('Timings saved locally!');
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditMenu = () => {
    if (!activeDay) return;
    
    setEditingDay(activeDay);
    setEditedMeals({...activeDay.meals});
    setShowEditModal(true);
  };

  const saveEditedMenu = async () => {
    if (!editingDay || !editedMeals) return;
    
    setIsLoading(true);
    try {
      console.log('Saving menu for:', editingDay);
      
      // Try multiple endpoint approaches
      let response;
      let success = false;

      // Method 1: Try with day name
      try {
        response = await fetch(`/api/meals/${editingDay.day}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            meals: editedMeals,
            day: editingDay.day
          }),
        });
        if (response.ok) success = true;
      } catch (error) {
        console.log('Method 1 failed:', error);
      }

      // Method 2: Try with ID
      if (!success) {
        try {
          response = await fetch(`/api/meals/${editingDay.id}`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              meals: editedMeals,
              id: editingDay.id,
              day: editingDay.day
            }),
          });
          if (response.ok) success = true;
        } catch (error) {
          console.log('Method 2 failed:', error);
        }
      }

      // Method 3: Try generic endpoint
      if (!success) {
        try {
          response = await fetch('/api/meals', {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              id: editingDay.id,
              day: editingDay.day,
              meals: editedMeals
            }),
          });
          if (response.ok) success = true;
        } catch (error) {
          console.log('Method 3 failed:', error);
        }
      }

      // Method 4: Try POST instead of PUT
      if (!success) {
        try {
          response = await fetch('/api/meals', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              action: 'update',
              id: editingDay.id,
              day: editingDay.day,
              meals: editedMeals
            }),
          });
          if (response.ok) success = true;
        } catch (error) {
          console.log('Method 4 failed:', error);
        }
      }

      if (success && response) {
        const result = await response.json();
        console.log('Update successful:', result);
        
        // Update local state
        setMenu(prev => prev.map(item => 
          item.id === editingDay.id ? { ...item, meals: editedMeals } : item
        ));
        
        alert(`✅ ${editingDay.day} menu updated successfully!`);
        setShowEditModal(false);
        setEditingDay(null);
        setEditedMeals(null);
      } else {
        // Fallback: Update locally
        setMenu(prev => prev.map(item => 
          item.id === editingDay.id ? { ...item, meals: editedMeals } : item
        ));
        
        alert('⚠️ Menu updated locally (server communication failed)');
        setShowEditModal(false);
        setEditingDay(null);
        setEditedMeals(null);
      }
    } catch (error) {
      console.error('Error editing menu:', error);
      
      // Final fallback
      setMenu(prev => prev.map(item => 
        item.id === editingDay.id ? { ...item, meals: editedMeals } : item
      ));
      
      alert('⚠️ Menu updated locally (unexpected error)');
      setShowEditModal(false);
      setEditingDay(null);
      setEditedMeals(null);
    } finally {
      setIsLoading(false);
    }
  };

  const updateMealItem = (mealType: keyof Meal, index: number, value: string) => {
    if (!editedMeals) return;
    
    const updatedMeals = { ...editedMeals };
    updatedMeals[mealType] = [...updatedMeals[mealType]];
    updatedMeals[mealType][index] = value;
    
    setEditedMeals(updatedMeals);
  };

  const addMealItem = (mealType: keyof Meal) => {
    if (!editedMeals) return;
    
    const updatedMeals = { ...editedMeals };
    updatedMeals[mealType] = [...updatedMeals[mealType], ""];
    
    setEditedMeals(updatedMeals);
  };

  const removeMealItem = (mealType: keyof Meal, index: number) => {
    if (!editedMeals) return;
    
    const updatedMeals = { ...editedMeals };
    updatedMeals[mealType] = updatedMeals[mealType].filter((_, i) => i !== index);
    
    setEditedMeals(updatedMeals);
  };

  const handleSendNotifications = async () => {
    setIsLoading(true);
    try {
      const notificationData = {
        message: `Weekly mess menu has been updated! Check out the new dishes for ${activeDay?.day}. Current timings: Breakfast ${timings.breakfast}, Lunch ${timings.lunch}, Snacks ${timings.snacks}, Dinner ${timings.dinner}`,
        day: activeDay?.day,
        timings: timings
      };

      const response = await fetch('/api/notifications', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(notificationData),
      });

      if (response.ok) {
        alert('Notifications sent successfully!');
      } else {
        alert('Failed to send notifications');
      }
    } catch (error) {
      console.error('Error sending notifications:', error);
      alert('Error sending notifications');
    } finally {
      setIsLoading(false);
    }
  };

  if (!menu.length) {
    return <div className="min-h-screen flex justify-center items-center text-gray-500">Loading menu...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center pt-10 pb-20 font-sans">
      <header className="text-center mb-10 max-w-xl px-4">
        <h1 className="text-4xl font-extrabold text-gray-900">Weekly Mess Menu</h1>
        <p className="mt-2 text-xl text-indigo-600">
          <span className='font-bold'>{activeDay?.day}</span> Menu is currently focused.
        </p>
        <p className="mt-4 text-gray-500">
          <span className='font-semibold'>Drag left or right</span> on the menu cards or use the arrows below.
        </p>
        
        <div className="mt-6 bg-white p-4 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold text-gray-800 mb-3">🕐 Current Mess Timings</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
            <div className="text-center">
              <div className="font-medium text-indigo-600">Breakfast</div>
              <div className="text-gray-600">{timings.breakfast}</div>
            </div>
            <div className="text-center">
              <div className="font-medium text-green-600">Lunch</div>
              <div className="text-gray-600">{timings.lunch}</div>
            </div>
            <div className="text-center">
              <div className="font-medium text-yellow-600">Snacks</div>
              <div className="text-gray-600">{timings.snacks}</div>
            </div>
            <div className="text-center">
              <div className="font-medium text-purple-600">Dinner</div>
              <div className="text-gray-600">{timings.dinner}</div>
            </div>
          </div>
        </div>
      </header>

      <div className="relative flex justify-center items-center w-full max-w-5xl" style={{ height: `${CARD_HEIGHT + 100}px` }}>
        {menu.map((item, index) => {
          const xOffset = myXOffset(index);
          const scale = getScale(index);
          const opacity = getOpacity(index);
          const zIndex = getZIndex(index);
          const isCenter = Math.abs(distance(index)) < 0.1; 
          const isGradient = item.bgColor.includes('gradient');

          return (
            <div
              key={item.id}
              onMouseDown={handleMouseDown}
              onTouchStart={handleTouchStart}
              onClick={() => goToItem(index)}
              className={`absolute cursor-grab active:cursor-grabbing transform origin-center shadow-2xl rounded-2xl p-4 flex flex-col justify-between 
                transition-all duration-300 ease-out 
                ${isCenter ? 'ring-8 ring-white/50 ring-offset-4 ring-offset-gray-100' : ''} ${item.textColor}`}
              style={{
                width: `${CARD_WIDTH}px`,
                height: `${CARD_HEIGHT}px`,
                background: isGradient ? item.bgColor : undefined,
                transform: `translateX(${xOffset}px) scale(${scale})`,
                opacity: opacity,
                zIndex: Math.floor(zIndex * 100),
                transition: isDragging ? 'none' : 'transform 0.4s ease-out, opacity 0.4s ease-out, box-shadow 0.4s ease-out',
                boxShadow: isCenter ? `0 0 30px rgba(255, 255, 255, 0.8), 0 10px 40px rgba(0, 0, 0, 0.6)` : '0 5px 20px rgba(0, 0, 0, 0.2)',
              }}
            >
              <div className="flex justify-between items-start border-b border-white/50 pb-2 mb-3">
                <h3 className="text-3xl font-extrabold">{item.day}</h3>
                {isCenter && <span className="text-xs font-semibold px-2 py-1 rounded-full bg-white text-gray-800 shadow-md">FOCUSED</span>}
              </div>
              <div className="space-y-3 flex-grow">
                {Object.entries(item.meals).map(([mealTime, dishes]: [string, any]) => (
                  <div key={mealTime} className="p-2 rounded-lg bg-white/10 backdrop-blur-sm">
                    <p className="font-semibold text-sm mb-1">{mealTime}</p>
                    <p className="text-xs font-light tracking-wide">{getDishesDisplay(dishes)}</p>
                  </div>
                ))}
              </div>
            </div>
          );
        })}

        <div className="absolute top-1/2 -translate-y-1/2 flex justify-between w-full max-w-lg z-40 px-4 pointer-events-none sm:max-w-xl">
          <button onClick={() => moveCarousel(-1)} className="p-3 rounded-full bg-white text-indigo-600 shadow-xl hover:bg-gray-100 transition duration-150 transform hover:scale-110 border border-indigo-200 pointer-events-auto">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" /></svg>
          </button>
          <button onClick={() => moveCarousel(1)} className="p-3 rounded-full bg-white text-indigo-600 shadow-xl hover:bg-gray-100 transition duration-150 transform hover:scale-110 border border-indigo-200 pointer-events-auto">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg>
          </button>
        </div>
      </div>

      <div className="mt-16 w-full max-w-3xl px-4">
        <h2 className="text-3xl font-bold text-gray-800 border-b pb-2 mb-6">Full Details: {activeDay?.day}</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {activeDay && Object.entries(activeDay.meals).map(([mealTime, dishes]) => (
            <div key={mealTime} className="bg-white p-6 rounded-xl shadow-lg border-t-4 border-indigo-400">
              <h3 className="text-xl font-bold text-gray-900 mb-3">{mealTime}</h3>
              <ul className="list-disc list-inside space-y-1 text-gray-600">
                {(Array.isArray(dishes) ? dishes : [dishes]).map((dish: string, index: any) => (
                  <li key={index} className="flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-indigo-500 mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                    {dish}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-10 p-6 bg-indigo-50 rounded-xl shadow-inner text-center w-full max-w-2xl">
        <p className="text-lg font-semibold text-indigo-800 mb-4">🍽️ Mess Menu Management</p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button 
            onClick={handleUpdateTimings}
            disabled={isLoading}
            className="p-4 bg-white border border-indigo-200 rounded-lg shadow-md hover:shadow-lg transition duration-150 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <div className="text-indigo-600 font-semibold">⏰ Update Timings</div>
            <div className="text-xs text-gray-500 mt-1">Set meal serving times</div>
          </button>

          <button 
            onClick={handleEditMenu}
            disabled={isLoading || !activeDay}
            className="p-4 bg-white border border-yellow-200 rounded-lg shadow-md hover:shadow-lg transition duration-150 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <div className="text-yellow-600 font-semibold">✏️ Edit {activeDay?.day} Menu</div>
            <div className="text-xs text-gray-500 mt-1">Modify dishes for today</div>
          </button>

          <button 
            onClick={handleSendNotifications}
            disabled={isLoading}
            className="p-4 bg-white border border-blue-200 rounded-lg shadow-md hover:shadow-lg transition duration-150 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <div className="text-blue-600 font-semibold">🔔 Send Notifications</div>
            <div className="text-xs text-gray-500 mt-1">Alert students</div>
          </button>
        </div>

        {/* Debug button */}
        <button 
          onClick={async () => {
            console.log('Testing API endpoints...');
            try {
              const testResponse = await fetch('/api/meals');
              const testData = await testResponse.json();
              console.log('Current meals data:', testData);
              alert('Check console for API response');
            } catch (error) {
              console.error('API test failed:', error);
              alert('API test failed - check console');
            }
          }}
          className="p-2 bg-red-100 text-red-700 rounded text-xs mt-4"
        >
          🐛 Debug API
        </button>
      </div>

      {showTimingsModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md">
            <h3 className="text-xl font-bold text-gray-800 mb-4">Update Mess Timings</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Breakfast Time</label>
                <input
                  type="text"
                  value={newTimings.breakfast}
                  onChange={(e) => setNewTimings(prev => ({...prev, breakfast: e.target.value}))}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="e.g., 8:00 AM - 9:30 AM"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Lunch Time</label>
                <input
                  type="text"
                  value={newTimings.lunch}
                  onChange={(e) => setNewTimings(prev => ({...prev, lunch: e.target.value}))}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="e.g., 12:30 PM - 2:00 PM"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Snacks Time</label>
                <input
                  type="text"
                  value={newTimings.snacks}
                  onChange={(e) => setNewTimings(prev => ({...prev, snacks: e.target.value}))}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="e.g., 5:00 PM - 6:00 PM"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Dinner Time</label>
                <input
                  type="text"
                  value={newTimings.dinner}
                  onChange={(e) => setNewTimings(prev => ({...prev, dinner: e.target.value}))}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="e.g., 8:00 PM - 9:30 PM"
                />
              </div>
            </div>
            
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowTimingsModal(false)}
                className="flex-1 py-2 px-4 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition duration-150"
              >
                Cancel
              </button>
              <button
                onClick={saveTimings}
                disabled={isLoading}
                className="flex-1 py-2 px-4 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition duration-150 disabled:opacity-50"
              >
                {isLoading ? 'Saving...' : 'Save Timings'}
              </button>
            </div>
          </div>
        </div>
      )}

      {showEditModal && editingDay && editedMeals && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <h3 className="text-xl font-bold text-gray-800 mb-4">Edit {editingDay.day} Menu</h3>
            
            <div className="space-y-6">
              {Object.entries(editedMeals).map(([mealType, dishes]) => (
                <div key={mealType} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex justify-between items-center mb-3">
                    <h4 className="text-lg font-semibold text-gray-700 capitalize">{mealType}</h4>
                    <button
                      onClick={() => addMealItem(mealType as keyof Meal)}
                      className="px-3 py-1 bg-green-500 text-white rounded-lg text-sm hover:bg-green-600 transition duration-150"
                    >
                      + Add Item
                    </button>
                  </div>
                  
                  <div className="space-y-2">
                    {(Array.isArray(dishes) ? dishes : [dishes]).map((dish: string, index: number) => (
                      <div key={index} className="flex gap-2 items-center">
                        <input
                          type="text"
                          value={dish}
                          onChange={(e) => updateMealItem(mealType as keyof Meal, index, e.target.value)}
                          className="flex-1 p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                          placeholder={`Enter ${mealType.toLowerCase()} item...`}
                        />
                        <button
                          onClick={() => removeMealItem(mealType as keyof Meal, index)}
                          className="px-3 py-2 bg-red-500 text-white rounded-lg text-sm hover:bg-red-600 transition duration-150"
                        >
                          Remove
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
            
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => {
                  setShowEditModal(false);
                  setEditingDay(null);
                  setEditedMeals(null);
                }}
                className="flex-1 py-2 px-4 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition duration-150"
              >
                Cancel
              </button>
              <button
                onClick={saveEditedMenu}
                disabled={isLoading}
                className="flex-1 py-2 px-4 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition duration-150 disabled:opacity-50"
              >
                {isLoading ? 'Saving to Database...' : 'Save to Database'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MessMenuCarousel;