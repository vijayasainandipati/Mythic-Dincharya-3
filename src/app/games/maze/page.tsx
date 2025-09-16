
"use client";

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { ArrowLeft, Award, RefreshCw, ArrowUp, ArrowDown, ArrowLeft as ArrowLeftIcon, ArrowRight as ArrowRightIcon, Clock, XCircle } from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';

// --- Maze Generation ---
const generateMaze = (size: number) => {
    // Ensure size is odd
    const oddSize = size % 2 === 0 ? size + 1 : size;
    const grid = Array(oddSize).fill(null).map(() => Array(oddSize).fill(1)); // 1 for wall, 0 for path

    const carvePassages = (cx: number, cy: number) => {
        const directions = [[0, -2], [0, 2], [-2, 0], [2, 0]];
        directions.sort(() => Math.random() - 0.5);

        for (const [dx, dy] of directions) {
            const nx = cx + dx;
            const ny = cy + dy;

            if (nx > 0 && nx < oddSize -1 && ny > 0 && ny < oddSize -1 && grid[ny][nx] === 1) {
                grid[cy + dy / 2][cx + dx / 2] = 0; // Carve wall
                grid[ny][nx] = 0; // Carve path
                carvePassages(nx, ny);
            }
        }
    };
    
    // Start in the middle to create more complex mazes
    const startX = Math.floor(Math.random() * (oddSize / 2)) * 2 + 1;
    const startY = Math.floor(Math.random() * (oddSize / 2)) * 2 + 1;
    grid[startY][startX] = 0;
    carvePassages(startX, startY);

    // Create a guaranteed entry and exit
    grid[1][0] = 0;
    grid[1][1] = 0;
    grid[oddSize - 2][oddSize - 1] = 0;
    grid[oddSize - 2][oddSize - 2] = 0;

    return grid;
};

const MAZE_SIZE = 15;
const GAME_DURATION = 45; // seconds

const GhatotkachaIcon = () => (
    <div className="text-2xl animate-bounce">👹</div>
);

const PortalIcon = () => (
    <div className="text-2xl animate-pulse">🌀</div>
);


export default function MazeGamePage() {
    const [maze, setMaze] = useState<number[][]>([]);
    const [playerPos, setPlayerPos] = useState({ x: 1, y: 1 });
    const [gameState, setGameState] = useState<'playing' | 'won' | 'lost'>('playing');
    const [timeLeft, setTimeLeft] = useState(GAME_DURATION);
    
    const exitPos = useMemo(() => ({ x: MAZE_SIZE - 2, y: MAZE_SIZE - 2 }), []);

    const restartGame = useCallback(() => {
        setMaze(generateMaze(MAZE_SIZE));
        setPlayerPos({ x: 1, y: 1 });
        setTimeLeft(GAME_DURATION);
        setGameState('playing');
    }, []);

    useEffect(() => {
        restartGame();
    }, [restartGame]);
    
    // Timer effect
    useEffect(() => {
        if (gameState !== 'playing') return;

        if (timeLeft <= 0) {
            setGameState('lost');
            return;
        }

        const timerId = setInterval(() => {
            setTimeLeft(prev => prev - 1);
        }, 1000);

        return () => clearInterval(timerId);
    }, [gameState, timeLeft]);


    const handleMove = useCallback((dx: number, dy: number) => {
        if (gameState !== 'playing') return;

        const newPos = { x: playerPos.x + dx, y: playerPos.y + dy };

        // Check boundaries and walls
        if (
            newPos.y >= 0 && newPos.y < MAZE_SIZE &&
            newPos.x >= 0 && newPos.x < MAZE_SIZE &&
            maze[newPos.y] && maze[newPos.y][newPos.x] === 0
        ) {
            setPlayerPos(newPos);
        }
    }, [playerPos, maze, gameState]);


    useEffect(() => {
        // Check for win condition
        if (playerPos.y === exitPos.y && playerPos.x === exitPos.x) {
            setGameState('won');
        }
    }, [playerPos, exitPos]);


    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            e.preventDefault();
            switch (e.key) {
                case 'ArrowUp':
                case 'w':
                    handleMove(0, -1);
                    break;
                case 'ArrowDown':
                case 's':
                    handleMove(0, 1);
                    break;
                case 'ArrowLeft':
                case 'a':
                    handleMove(-1, 0);
                    break;
                case 'ArrowRight':
                case 'd':
                    handleMove(1, 0);
                    break;
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [handleMove]);

    if (gameState === 'won') {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-background dark:bg-transparent">
                <Card className="max-w-lg w-full text-center bg-card dark:bg-black/50 backdrop-blur-sm border-yellow-500/50 dark:border-yellow-400/50 p-6">
                    <CardHeader>
                        <Award className="h-16 w-16 text-yellow-500 dark:text-yellow-400 mx-auto mb-4" />
                        <CardTitle className="font-headline text-4xl text-yellow-600 dark:text-yellow-300">You Escaped!</CardTitle>
                        <CardDescription className="text-lg text-foreground/80 dark:text-white/80">
                            Ghatotkacha found his way out of the tricky cave!
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="flex flex-col gap-4">
                        <Button onClick={restartGame} className="font-bold bg-yellow-500 hover:bg-yellow-400 text-black">
                            <RefreshCw className="mr-2 h-4 w-4" />
                            Play Again
                        </Button>
                        <Button asChild variant="outline" className="font-bold bg-white/10 dark:bg-black/20 border-yellow-500 dark:border-yellow-400">
                             <Link href="/games">
                                <ArrowLeft className="mr-2 h-4 w-4" />
                                Back to Games
                            </Link>
                        </Button>
                    </CardContent>
                </Card>
            </div>
        );
    }
    
     if (gameState === 'lost') {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-background dark:bg-transparent">
                <Card className="max-w-lg w-full text-center bg-card dark:bg-black/50 backdrop-blur-sm border-red-500/50 dark:border-red-400/50 p-6">
                    <CardHeader>
                        <XCircle className="h-16 w-16 text-red-500 dark:text-red-400 mx-auto mb-4" />
                        <CardTitle className="font-headline text-4xl text-red-600 dark:text-red-400">Time's Up!</CardTitle>
                        <CardDescription className="text-lg text-foreground/80 dark:text-white/80">
                            The cave was too tricky this time. Try again!
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="flex flex-col gap-4">
                        <Button onClick={restartGame} className="font-bold bg-yellow-500 hover:bg-yellow-400 text-black">
                            <RefreshCw className="mr-2 h-4 w-4" />
                            Try Again
                        </Button>
                        <Button asChild variant="outline" className="font-bold bg-white/10 dark:bg-black/20 border-yellow-500 dark:border-yellow-400">
                             <Link href="/games">
                                <ArrowLeft className="mr-2 h-4 w-4" />
                                Back to Games
                            </Link>
                        </Button>
                    </CardContent>
                </Card>
            </div>
        );
    }
    
    if (maze.length === 0) {
        return null; // Don't render anything until the maze is generated
    }

    return (
        <div className="flex flex-col items-center justify-center min-h-screen p-2 sm:p-4 text-foreground dark:text-white">
            <header className="text-center mb-4 relative w-full max-w-lg">
                 <Button asChild variant="ghost" size="icon" className="absolute left-0 top-1/2 -translate-y-1/2 bg-background/50 dark:bg-white/10 hover:bg-accent dark:hover:bg-white/20 text-foreground dark:text-white z-10">
                    <Link href="/games">
                        <ArrowLeft />
                    </Link>
                </Button>
                <h1 className="font-headline text-3xl sm:text-4xl text-yellow-600 dark:text-yellow-300">🌀 Ghatotkacha's Maze</h1>
                <p className="text-sm sm:text-base text-muted-foreground dark:text-white/80">Guide him to the portal!</p>
            </header>
            
            <div className="flex items-center gap-4 mb-2 font-bold text-lg">
                <div className={cn("flex items-center gap-2 p-2 rounded-md", timeLeft <= 10 && "text-red-500 animate-pulse")}>
                    <Clock />
                    <span>{String(Math.floor(timeLeft / 60)).padStart(2, '0')}:{String(timeLeft % 60).padStart(2, '0')}</span>
                </div>
            </div>

            <div className="bg-card dark:bg-black/50 backdrop-blur-sm border border-yellow-500/50 dark:border-yellow-400/50 p-2 sm:p-4 rounded-lg shadow-2xl">
                 <div className="grid gap-0.5" style={{ gridTemplateColumns: `repeat(${MAZE_SIZE}, 1fr)` }}>
                    {maze.map((row, y) =>
                        row.map((cell, x) => (
                            <div
                                key={`${y}-${x}`}
                                className={cn(
                                    'aspect-square flex items-center justify-center transition-colors duration-300 w-5 h-5 sm:w-6 sm:h-6 md:w-8 md:h-8',
                                    cell === 1 ? 'bg-stone-700 dark:bg-stone-800' : 'bg-stone-300 dark:bg-stone-600',
                                )}
                            >
                                {playerPos.y === y && playerPos.x === x && <GhatotkachaIcon />}
                                {y === exitPos.y && x === exitPos.x && <PortalIcon />}
                            </div>
                        ))
                    )}
                </div>
            </div>

             <div className="mt-4 flex flex-col items-center gap-2 sm:hidden">
                <Button onClick={() => handleMove(0, -1)} size="icon" className="bg-yellow-500 hover:bg-yellow-400 text-black"><ArrowUp/></Button>
                <div className="flex gap-2">
                    <Button onClick={() => handleMove(-1, 0)} size="icon" className="bg-yellow-500 hover:bg-yellow-400 text-black"><ArrowLeftIcon/></Button>
                    <Button onClick={() => handleMove(0, 1)} size="icon" className="bg-yellow-500 hover:bg-yellow-400 text-black"><ArrowDown/></Button>
                    <Button onClick={() => handleMove(1, 0)} size="icon" className="bg-yellow-500 hover:bg-yellow-400 text-black"><ArrowRightIcon/></Button>
                </div>
                <p className="text-xs text-muted-foreground mt-1">Use arrow keys on desktop</p>
            </div>
             <p className="hidden sm:block text-sm text-muted-foreground mt-2">Use W/A/S/D or Arrow Keys to move.</p>
        </div>
    );
}
