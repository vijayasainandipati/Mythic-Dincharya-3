"use client";
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const characters = [
  { name: 'Arjuna', trait: 'Focused & Disciplined' },
  { name: 'Krishna', trait: 'Wise & Strategic' },
  { name: 'Bhima', trait: 'Strong & Loyal' },
  { name: 'Draupadi', trait: 'Bold & Intelligent' },
  { name: 'Karna', trait: 'Brave & Generous' },
];

export default function CharacterMatch() {
  const [dob, setDob] = useState('');
  const [character, setCharacter] = useState<{ name: string; trait: string } | null>(null);

  const matchCharacter = () => {
    if (!dob) return;
    const index = new Date(dob).getDate() % characters.length;
    setCharacter(characters[index]);
  };

  return (
    <div className="bg-background dark:bg-black/50 backdrop-blur-sm border border-yellow-500/50 dark:border-yellow-400/50 rounded-lg p-4 mb-4 text-center">
      <h2 className="text-xl text-yellow-600 dark:text-yellow-200 mb-2">🔮 Who are you from Mahabharata?</h2>
      <div className='flex justify-center items-center gap-2'>
        <Input
            type="date"
            className="text-foreground p-1 rounded mb-2 w-auto bg-transparent dark:bg-white/20 border-yellow-500 dark:border-yellow-400 dark:text-white"
            value={dob}
            onChange={(e) => setDob(e.target.value)}
        />
        <Button
            onClick={matchCharacter}
            className="bg-yellow-500 text-black px-2 py-1 rounded mb-2 hover:bg-yellow-400"
        >
            Reveal
        </Button>
      </div>
      {character && (
        <p className="mt-2 text-lg">You are like <strong>{character.name}</strong> – {character.trait}!</p>
      )}
    </div>
  );
}
