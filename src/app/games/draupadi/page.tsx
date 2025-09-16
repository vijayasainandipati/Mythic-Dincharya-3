
"use client";

import React, { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ArrowLeft, RefreshCw, Loader2, Award } from "lucide-react";
import Link from "next/link";
import { generateRiddle, type Riddle, type RiddleInput } from "@/ai/flows/riddle-generator";
import { useToast } from "@/hooks/use-toast";

const TOTAL_QUESTIONS = 5;
const CATEGORIES = ["Characters", "Events", "Weapons & Powers", "Places"];

export default function DraupadisDiceDilemma() {
  const [currentRiddle, setCurrentRiddle] = useState<Riddle | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [questionCount, setQuestionCount] = useState(0);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);
  const [isAnswered, setIsAnswered] = useState(false);
  const [askedRiddles, setAskedRiddles] = useState<string[]>([]);
  const { toast } = useToast();

  const fetchNewRiddle = useCallback(async (history: string[]) => {
    setIsLoading(true);
    let attempts = 0;
    const maxAttempts = 3;

    while (attempts < maxAttempts) {
        try {
            const category = CATEGORIES[Math.floor(Math.random() * CATEGORIES.length)];
            const input: RiddleInput = { category, history };
            const riddle = await generateRiddle(input);

            // Fallback duplicate filter
            if (!history.includes(riddle.question)) {
                setCurrentRiddle(riddle);
                setAskedRiddles(prev => [...prev, riddle.question]);
                setIsLoading(false);
                setIsAnswered(false);
                return; // Success
            }
        } catch (e) {
            console.error("Failed to generate riddle on attempt", attempts + 1, e);
        }
        attempts++;
    }

    // If all attempts fail, use a fallback and show an error
    toast({
        title: "Could not fetch a new riddle",
        description: "Falling back to a default question.",
        variant: "destructive",
    });
    setCurrentRiddle({
        question: "Is it wise to gamble with your kingdom?",
        answer: "no",
    });
    setIsLoading(false);
    setIsAnswered(false);

  }, [toast]);

  useEffect(() => {
    fetchNewRiddle(askedRiddles);
  }, []);

  const handleAnswer = (choice: "yes" | "no") => {
    if (!currentRiddle || isAnswered) return;
    setIsAnswered(true);
    let isCorrect = false;

    if (currentRiddle.answer === choice) {
      setScore(score + 1);
      isCorrect = true;
    }

    toast({
        title: isCorrect ? "Correct!" : "Oops!",
        description: isCorrect ? "You have wisely answered." : `The correct answer was "${currentRiddle.answer}".`,
        variant: isCorrect ? "default" : "destructive",
        className: isCorrect ? 'bg-green-500/20 border-green-500' : 'bg-red-500/20 border-red-500'
    })

    if (!isCorrect) {
        setTimeout(() => setFinished(true), 1200);
        return;
    }

    setTimeout(() => {
        if (questionCount + 1 < TOTAL_QUESTIONS) {
            setQuestionCount(questionCount + 1);
            fetchNewRiddle(askedRiddles);
        } else {
            setFinished(true);
        }
    }, 1200);
  };

  const restartGame = () => {
    setScore(0);
    setQuestionCount(0);
    setFinished(false);
    const newHistory: string[] = [];
    setAskedRiddles(newHistory);
    fetchNewRiddle(newHistory);
  };

  const renderContent = () => {
     if (finished) {
        const isWinner = score === TOTAL_QUESTIONS;
        return (
             <Card className="text-center bg-card dark:bg-black/40 backdrop-blur-sm p-4 sm:p-6 rounded-2xl shadow-2xl border border-yellow-500/50 dark:border-yellow-400/30 max-w-lg w-full">
                <CardHeader>
                    <Award className="h-16 w-16 text-yellow-500 dark:text-yellow-400 mx-auto mb-4" />
                    <CardTitle className="text-3xl font-headline text-primary dark:text-yellow-300">Game Over 🎉</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-2xl mb-2">Your score: <span className="font-bold">{score} / {TOTAL_QUESTIONS}</span></p>
                    <p className="text-lg text-foreground/80 dark:text-white/80 mt-2">{isWinner ? "Draupadi has escaped" : "Draupadi had locked"}</p>
                    <Button
                        onClick={restartGame}
                        className="mt-6 bg-yellow-500 hover:bg-yellow-400 text-black px-6 py-2 rounded-xl font-bold"
                    >
                        <RefreshCw className="mr-2 h-4 w-4" />
                        Play Again
                    </Button>
                </CardContent>
            </Card>
        );
     }
     
     return (
         <Card className="bg-card dark:bg-black/40 backdrop-blur-sm p-4 sm:p-6 rounded-2xl shadow-2xl border border-yellow-500/50 dark:border-yellow-400/30 max-w-lg w-full min-h-[350px] flex flex-col justify-between">
            <CardHeader>
                <CardTitle className="text-3xl font-headline text-primary dark:text-yellow-300 text-center">🎲 Draupadi’s Dice Dilemma 🎲</CardTitle>
                 <CardDescription className="text-muted-foreground dark:text-white/70 pt-2 text-center">Answer the riddles to guide Draupadi to freedom.</CardDescription>
            </CardHeader>
            <CardContent className="flex-grow flex flex-col items-center justify-center">
                {isLoading || !currentRiddle ? (
                    <Loader2 className="h-12 w-12 animate-spin text-yellow-500 dark:text-yellow-400" />
                ) : (
                    <>
                        <p className="text-xl sm:text-2xl mb-6 text-center min-h-[60px]">{currentRiddle.question}</p>
                        <div className="flex gap-4 justify-center">
                            <Button
                                onClick={() => handleAnswer("yes")}
                                disabled={isAnswered}
                                className="bg-green-600 hover:bg-green-700 px-6 py-4 sm:px-8 sm:py-6 rounded-xl text-lg font-bold border-2 border-green-400 disabled:opacity-50"
                            >
                                Yes
                            </Button>
                            <Button
                                onClick={() => handleAnswer("no")}
                                disabled={isAnswered}
                                className="bg-red-600 hover:bg-red-700 px-6 py-4 sm:px-8 sm:py-6 rounded-xl text-lg font-bold border-2 border-red-400 disabled:opacity-50"
                            >
                                No
                            </Button>
                        </div>
                    </>
                )}
            </CardContent>
            <div className="text-center mt-4">
                <p className="text-sm text-muted-foreground dark:text-gray-400">
                    Question {questionCount + 1} of {TOTAL_QUESTIONS} | Score: {score}
                </p>
            </div>
        </Card>
     )
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background dark:bg-transparent p-4 text-center">
       <Button asChild variant="ghost" size="icon" className="absolute left-4 top-4 bg-background/50 dark:bg-white/10 hover:bg-accent dark:hover:bg-white/20 text-foreground dark:text-white z-10">
          <Link href="/games">
              <ArrowLeft />
          </Link>
      </Button>
      {renderContent()}
    </div>
  );
}
