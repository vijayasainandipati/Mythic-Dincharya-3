
"use client";

import { useState, useMemo, useEffect, useCallback } from 'react';
import { Chess } from 'chess.js';
import { Chessboard } from 'react-chessboard';
import { Button } from '@/components/ui/button';
import { ArrowLeft, RefreshCw } from 'lucide-react';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { Square } from 'react-chessboard/dist/chessboard/types';

const legendData = [
    { piece: 'King', white: 'Yudhishthira', black: 'Duryodhana' },
    { piece: 'Queen', white: 'Krishna', black: 'Shakuni' },
    { piece: 'Rook', white: 'Bhima', black: 'Kumbhakarna' },
    { piece: 'Bishop', white: 'Arjuna', black: 'Shalya' },
    { piece: 'Knight', white: 'Karna', black: 'Ashwatthama' },
    { piece: 'Pawn', white: 'Pandava Soldier', black: 'Kuru Soldier' },
];


export default function MahabharataChessPage() {
    const game = useMemo(() => new Chess(), []);
    const [fen, setFen] = useState(game.fen());
    const [status, setStatus] = useState("White's Turn (Pandavas)");
    const [gameOver, setGameOver] = useState(false);
    const [moveFrom, setMoveFrom] = useState<Square | null>(null);
    const [optionSquares, setOptionSquares] = useState({});
    const [lastMoveSquares, setLastMoveSquares] = useState({});

    const updateStatus = useCallback(() => {
        let newStatus = '';
        const turn = game.turn() === 'w' ? "White's Turn (Pandavas)" : "Black's Turn (Kauravas)";

        if (game.isCheckmate()) {
            newStatus = `Checkmate! ${game.turn() === 'w' ? 'Black (Kauravas)' : 'White (Pandavas)'} wins.`;
            setGameOver(true);
        } else if (game.isDraw()) {
            newStatus = 'Draw!';
            setGameOver(true);
        } else {
            newStatus = turn;
            if (game.inCheck()) {
                newStatus += ' - Check!';
            }
        }
        setStatus(newStatus);
    }, [game]);
    
    useEffect(() => {
        updateStatus();
    }, [fen, updateStatus]);

    function getLegalMoves(square: Square) {
        const moves = game.moves({ square: square, verbose: true });
        const newOptionSquares: { [key: string]: any } = {};
        if (moves.length === 0) {
            return false;
        }
        moves.forEach(move => {
            newOptionSquares[move.to] = {
                background: 'rgba(255, 255, 0, 0.4)',
            };
        });
         newOptionSquares[square] = {
            background: 'rgba(255, 255, 0, 0.4)',
        };
        setOptionSquares(newOptionSquares);
        return true;
    }


    function onSquareClick(square: Square) {
        if (gameOver) return;

        // if it is a new move
        if (!moveFrom) {
            if (getLegalMoves(square)) {
                setMoveFrom(square);
            }
            return;
        }

        // if it is the second click of a move
        try {
            const moveResult = game.move({
                from: moveFrom,
                to: square,
                promotion: 'q' // auto-promote to queen for simplicity
            });

            // if invalid move, clear selection
            if (moveResult === null) {
                if (getLegalMoves(square)) {
                    setMoveFrom(square);
                } else {
                    setMoveFrom(null);
                    setOptionSquares({});
                }
                return;
            }
            
            setFen(game.fen());
            setLastMoveSquares({
                [moveResult.from]: { background: 'rgba(255, 165, 0, 0.4)' },
                [moveResult.to]: { background: 'rgba(255, 165, 0, 0.4)' }
            });
            updateStatus();
            setMoveFrom(null);
            setOptionSquares({});

        } catch(e) {
            console.log(e)
            setMoveFrom(null);
            setOptionSquares({});
        }
    }

    function restartGame() {
        game.reset();
        setFen(game.fen());
        setGameOver(false);
        setMoveFrom(null);
        setOptionSquares({});
        setLastMoveSquares({});
        updateStatus();
    }

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-background dark:bg-transparent p-4">
            <header className="mb-4 relative w-full max-w-lg text-center">
                <Button asChild variant="ghost" size="icon" className="absolute left-0 top-1/2 -translate-y-1/2 bg-background/50 dark:bg-white/10 hover:bg-accent dark:hover:bg-white/20 text-foreground dark:text-white z-10">
                    <Link href="/games">
                        <ArrowLeft />
                    </Link>
                </Button>
                <h1 className="font-headline text-3xl sm:text-4xl text-yellow-600 dark:text-yellow-300">♞ Mahabharata Chess</h1>
            </header>

            <div className="w-full max-w-[400px] md:max-w-[600px] lg:max-w-[700px] aspect-square mb-4">
                 <Chessboard
                    position={fen}
                    onSquareClick={onSquareClick}
                    customSquareStyles={{ ...optionSquares, ...lastMoveSquares }}
                    arePiecesDraggable={false}
                    boardWidth={700}
                    customBoardStyle={{
                        borderRadius: '8px',
                        boxShadow: '0 5px 15px rgba(0, 0, 0, 0.5)',
                    }}
                    customDarkSquareStyle={{ backgroundColor: '#B58863' }}
                    customLightSquareStyle={{ backgroundColor: '#F0D9B5' }}
                />
            </div>
            
            <Card className="mb-4 w-full max-w-md bg-card dark:bg-black/50 backdrop-blur-sm border-yellow-500/50 dark:border-yellow-400/50">
                <CardHeader className='p-3 text-center'>
                    <CardTitle className="font-headline text-xl text-yellow-600 dark:text-yellow-300">Game Status</CardTitle>
                </CardHeader>
                <CardContent className='p-3 pt-0 text-center'>
                    <p className="text-base text-muted-foreground dark:text-white/80">{status}</p>
                </CardContent>
            </Card>

             {gameOver && (
                <div className="mb-4">
                    <Button onClick={restartGame} className="font-bold bg-yellow-500 hover:bg-yellow-400 text-black">
                        <RefreshCw className="mr-2 h-4 w-4" />
                        Play Again
                    </Button>
                </div>
            )}

            <Card className="w-full max-w-md bg-card dark:bg-black/50 backdrop-blur-sm border-yellow-500/50 dark:border-yellow-400/50">
                <CardHeader>
                    <CardTitle className="font-headline text-xl text-yellow-600 dark:text-yellow-300">Character Legend</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-2 gap-x-4 text-sm text-left">
                        <div>
                            <h4 className="font-bold text-yellow-500 dark:text-yellow-200 mb-2">White (Pandavas)</h4>
                            <ul>
                                {legendData.map(item => <li key={item.white}><strong>{item.white}</strong> ({item.piece})</li>)}
                            </ul>
                        </div>
                        <div>
                           <h4 className="font-bold text-yellow-500 dark:text-yellow-200 mb-2">Black (Kauravas)</h4>
                             <ul>
                                {legendData.map(item => <li key={item.black}><strong>{item.black}</strong> ({item.piece})</li>)}
                            </ul>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
