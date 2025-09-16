
"use client";

import { useState, useEffect } from 'react';
import { generateSloka } from '@/ai/flows/sloka-generator';
import { Loader2 } from 'lucide-react';

const themes = [
    "Dharma (Duty/Righteousness)",
    "Courage and Strength",
    "Devotion and Faith",
    "Karma (Action and Consequence)",
    "Knowledge and Wisdom",
    "The Self and the Divine",
    "Overcoming Adversity",
    "Friendship and Loyalty",
    "Sacrifice",
    "Peace and Inner Calm",
];

export default function SlokaDisplay() {
  const [sloka, setSloka] = useState('');
  const [meaning, setMeaning] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSloka = async () => {
      const today = new Date().toISOString().split('T')[0]; // Get date as YYYY-MM-DD
      const storedSlokaData = localStorage.getItem('dailySloka');

      if (storedSlokaData) {
        try {
          const parsedData = JSON.parse(storedSlokaData);
          if (parsedData.date === today && parsedData.sloka && parsedData.meaning) {
            setSloka(parsedData.sloka);
            setMeaning(parsedData.meaning);
            setIsLoading(false);
            return;
          }
        } catch (error) {
          console.error("Failed to parse stored sloka", error);
          localStorage.removeItem('dailySloka');
        }
      }

      try {
        setIsLoading(true);
        setError(null);

        // Pick a theme based on the day of the month to ensure a new prompt daily
        const dayOfMonth = new Date().getDate();
        const theme = themes[dayOfMonth % themes.length];

        const result = await generateSloka({ theme });
        setSloka(result.sloka);
        setMeaning(result.translation);
        localStorage.setItem('dailySloka', JSON.stringify({
          date: today,
          sloka: result.sloka,
          meaning: result.translation,
        }));
      } catch (e) {
        console.error(e);
        setError("Could not fetch today's sloka. Please try again later.");
        setSloka('कर्मण्येवाधिकारस्ते मा फलेषु कदाचन ।');
        setMeaning('Do your duty without expecting results.');
      } finally {
        setIsLoading(false);
      }
    };
    fetchSloka();
  }, []);


  return (
    <div className="bg-background dark:bg-black/50 backdrop-blur-sm border border-yellow-500/50 dark:border-yellow-400/50 rounded-lg p-4 mb-4 text-center min-h-[150px] flex flex-col justify-center">
      <h2 className="text-2xl text-yellow-600 dark:text-yellow-200">📜 Sloka of the Day</h2>
      {isLoading ? (
        <div className="flex justify-center items-center mt-2">
            <Loader2 className="h-6 w-6 animate-spin text-yellow-400 dark:text-yellow-300" />
        </div>
      ) : error ? (
        <p className="mt-2 text-red-400 text-sm">{error}</p>
      ): (
        <>
            <p className="mt-2 italic text-lg">{sloka}</p>
            <p className="mt-1 text-sm text-muted-foreground dark:text-gray-300">— {meaning}</p>
        </>
      )}
    </div>
  );
}
