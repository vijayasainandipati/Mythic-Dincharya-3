
"use client";

import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Swords, Puzzle } from "lucide-react";

const games = [
  {
    title: "🏹 Arjuna's Eye Challenge",
    path: "/games/arjuna",
    description: "Hit the fish's eye based on its reflection!",
    icon: <Swords className="h-10 w-10 text-yellow-500 dark:text-yellow-300" />,
    style: "border-green-500/50 dark:border-green-400/50 hover:border-green-500 dark:hover:border-green-400",
    buttonClass: "bg-green-500 hover:bg-green-600 text-white"
  },
  {
    title: "🎲 Draupadi’s Dice Dilemma",
    path: "/games/draupadi",
    description: "Answer yes/no riddles to escape.",
     icon: <div className="text-4xl">🎲</div>,
     style: "border-yellow-500/50 dark:border-yellow-400/50 hover:border-yellow-500 dark:hover:border-yellow-400",
    buttonClass: "bg-yellow-500 hover:bg-yellow-600 text-black"
  },
  {
    title: "🌀 Ghatotkacha's Maze",
    path: "/games/maze",
    description: "Navigate out of the tricky cave!",
     icon: <div className="text-4xl">🌀</div>,
     style: "border-yellow-500/50 dark:border-yellow-400/50 hover:border-yellow-500 dark:hover:border-yellow-400",
    buttonClass: "bg-yellow-500 hover:bg-yellow-600 text-black"
  },
  {
    title: "♞ Mahabharata Chess",
    path: "/games/chess",
    description: "Play classic chess with epic characters.",
    icon: <div className="text-4xl">♞</div>,
    style: "border-green-500/50 dark:border-green-400/50 hover:border-green-500 dark:hover:border-green-400",
    buttonClass: "bg-green-500 hover:bg-green-600 text-white"
  },
];

export default function GamePlace() {
  return (
    <div className="min-h-screen p-4 sm:p-6 md:p-8">
       <header className="text-center mb-8 relative">
           <Button asChild variant="ghost" size="icon" className="absolute left-0 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-yellow-300 dark:bg-white/20 dark:hover:bg-white/30 dark:text-white">
                <Link href="/home">
                    <ArrowLeft />
                </Link>
            </Button>
            <h1 className="font-headline text-4xl sm:text-5xl font-bold text-yellow-500 dark:text-yellow-300">Mythic Game Zone</h1>
            <p className="mt-4 text-md sm:text-lg text-foreground/80 dark:text-white/90 max-w-2xl mx-auto">
                Test your skills and have fun with these legendary challenges!
            </p>
        </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6 max-w-4xl mx-auto">
        {games.map((game) => (
           <Card key={game.path} className={`bg-background dark:bg-black/50 backdrop-blur-sm shadow-lg hover:shadow-yellow-400/20 transition-all duration-300 text-center flex flex-col justify-between ${game.style}`}>
            <CardHeader className="items-center">
              <div>{game.icon}</div>
              <CardTitle className="font-headline text-xl text-yellow-600 dark:text-yellow-200">{game.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-foreground/70 dark:text-white/80 text-sm">{game.description}</p>
            </CardContent>
             <div className="p-4 pt-0">
                 <Button asChild className={`${game.buttonClass} font-bold w-full`}>
                    <Link href={game.path} >Play</Link>
                </Button>
             </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
    
