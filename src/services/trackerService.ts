import { useState, useEffect } from 'react';

export default function OfflineTracker() {
  const [missedLessons, setMissedLessons] = useState<string[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem('missed_lessons');
    if (saved) setMissedLessons(JSON.parse(saved));
  }, []);

  const addMissed = (lesson: string) => {
    const next = [...missedLessons, lesson];
    setMissedLessons(next);
    localStorage.setItem('missed_lessons', JSON.stringify(next));
  };

  const removeMissed = (index: number) => {
    const next = missedLessons.filter((_, i) => i !== index);
    setMissedLessons(next);
    localStorage.setItem('missed_lessons', JSON.stringify(next));
  };

  return { missedLessons, addMissed, removeMissed };
}
