"use client";

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { cn } from '@/lib/utils';
import { CheckCircle, XCircle, Award, RefreshCw, ArrowLeft, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { generateQuizQuestions } from '@/ai/flows/quiz-generator';
import type { QuizQuestion } from '@/ai/schemas/quiz-schema';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '@/lib/firebase';
import { incrementDharmaPoints } from '@/lib/user';
import { useToast } from '@/hooks/use-toast';

export default function QuizPage() {
    const [questions, setQuestions] = useState<QuizQuestion[]>([]);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [score, setScore] = useState(0);
    const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
    const [isAnswered, setIsAnswered] = useState(false);
    const [quizFinished, setQuizFinished] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [user] = useAuthState(auth);
    const { toast } = useToast();

    const loadQuestions = async () => {
        setIsLoading(true);
        setError(null);
        setQuestions([]);
        try {
            const result = await generateQuizQuestions();
            setQuestions(result.questions);
        } catch (err) {
            console.error("Failed to generate questions:", err);
            setError("Could not load new questions. Please try again in a moment.");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        loadQuestions();
    }, []);

    const handleAnswer = (answerIndex: number) => {
        if (isAnswered) return;

        setSelectedAnswer(answerIndex);
        setIsAnswered(true);

        if (answerIndex === questions[currentQuestionIndex].correctAnswerIndex) {
            setScore(score + 1);
            if (user) {
                incrementDharmaPoints(user.uid, 10).then(() => {
                    toast({title: "+10 Dharma Points!", description: "Your wisdom shines brightly."})
                }).catch(e => console.error(e));
            }
        }
    };

    const handleNext = () => {
        if (currentQuestionIndex < questions.length - 1) {
            setCurrentQuestionIndex(currentQuestionIndex + 1);
            setSelectedAnswer(null);
            setIsAnswered(false);
        } else {
            setQuizFinished(true);
        }
    };

    const restartQuiz = () => {
        setCurrentQuestionIndex(0);
        setScore(0);
        setSelectedAnswer(null);
        setIsAnswered(false);
        setQuizFinished(false);
        loadQuestions();
    };

    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen p-4 text-center">
                <Loader2 className="h-12 w-12 animate-spin text-yellow-500 dark:text-yellow-300 mb-4" />
                <p className="text-xl text-foreground dark:text-white">Generating new questions from the cosmos...</p>
            </div>
        );
    }
    
    if (error || questions.length === 0) {
         return (
            <div className="flex flex-col items-center justify-center min-h-screen p-4 text-center">
                <p className="text-xl text-red-500 dark:text-red-400 mb-4">{error || "No questions loaded."}</p>
                 <Button onClick={restartQuiz} className="font-bold bg-yellow-500 hover:bg-yellow-400 text-black">
                    <RefreshCw className="mr-2 h-4 w-4" />
                    Try Again
                </Button>
            </div>
        );
    }

    if (quizFinished) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen p-4">
                <Card className="max-w-lg w-full text-center bg-background dark:bg-black/50 backdrop-blur-sm border-yellow-500/50 dark:border-yellow-400/50 p-6 relative">
                    <Button asChild variant="ghost" size="icon" className="absolute left-2 top-2 bg-black/50 dark:bg-white/20 hover:bg-black/70 dark:hover:bg-white/30 text-white">
                        <Link href="/home">
                            <ArrowLeft />
                        </Link>
                    </Button>
                    <CardHeader>
                        <CardTitle className="font-headline text-4xl text-yellow-600 dark:text-yellow-300">Quiz Complete!</CardTitle>
                    </CardHeader>
                    <CardContent className="flex flex-col items-center gap-4">
                        <Award className="h-24 w-24 text-yellow-500 dark:text-yellow-400" />
                        <p className="text-xl">Your final score is:</p>
                        <p className="font-bold text-5xl text-yellow-600 dark:text-yellow-300">{score} / {questions.length}</p>
                        <p className="text-lg text-foreground/80 dark:text-white/80 mt-2">You have the wisdom of a Pandava! Keep learning!</p>
                        <Button onClick={restartQuiz} className="mt-6 font-bold bg-yellow-500 hover:bg-yellow-400 text-black">
                            <RefreshCw className="mr-2 h-4 w-4" />
                            Play Again
                        </Button>
                    </CardContent>
                </Card>
            </div>
        );
    }
    
    const currentQuestion = questions[currentQuestionIndex];
    const progress = ((currentQuestionIndex) / questions.length) * 100;

    return (
        <div className="flex flex-col items-center justify-center min-h-screen p-4">
            <Card className="max-w-2xl w-full bg-background dark:bg-black/50 backdrop-blur-sm border-yellow-500/50 dark:border-yellow-400/50 relative">
                 <Button asChild variant="ghost" size="icon" className="absolute left-2 top-4 bg-black/50 dark:bg-white/20 hover:bg-black/70 dark:hover:bg-white/30 text-white">
                    <Link href="/home">
                        <ArrowLeft />
                    </Link>
                </Button>
                <CardHeader className="p-6 text-center">
                    <p className="text-sm mb-2 text-muted-foreground dark:text-white/80">Question {currentQuestionIndex + 1} of {questions.length}</p>
                    <Progress value={progress} className="mb-4 bg-muted dark:bg-white/20 [&>div]:bg-yellow-500 dark:[&>div]:bg-yellow-400" />
                    <CardTitle className="font-headline text-2xl lg:text-3xl text-yellow-600 dark:text-yellow-300 leading-tight">
                        {currentQuestion.questionText}
                    </CardTitle>
                </CardHeader>
                <CardContent className="flex flex-col gap-3 p-6 pt-0">
                    {currentQuestion.answers.map((answer, index) => {
                        const isCorrect = index === currentQuestion.correctAnswerIndex;
                        const isSelected = selectedAnswer === index;
                        
                        let buttonClass = 'bg-background dark:bg-white/10 hover:bg-accent dark:hover:bg-white/20 text-foreground dark:text-white border border-yellow-500/50 dark:border-yellow-400/30';
                        let Icon = null;

                        if (isAnswered) {
                            if (isCorrect) {
                                buttonClass = 'bg-green-500 dark:bg-green-600 hover:bg-green-600 dark:hover:bg-green-700 text-white'; // Success state
                                Icon = <CheckCircle />;
                            } else if (isSelected) {
                                buttonClass = 'bg-red-500 dark:bg-red-600 hover:bg-red-600 dark:hover:bg-red-700 text-white'; // Error state
                                Icon = <XCircle />;
                            } else {
                                buttonClass = 'bg-background/80 dark:bg-white/10 text-muted-foreground dark:text-white/60 opacity-60 border-yellow-500/30 dark:border-yellow-400/20';
                            }
                        }

                        return (
                            <Button
                                key={index}
                                onClick={() => handleAnswer(index)}
                                disabled={isAnswered}
                                className={cn("justify-between h-auto py-3 px-4 text-left whitespace-normal transition-all duration-300 font-semibold text-base", buttonClass)}
                            >
                                <span>{answer}</span>
                                {Icon}
                            </Button>
                        );
                    })}
                    {isAnswered && (
                        <Button onClick={handleNext} className="mt-4 font-bold bg-yellow-500 hover:bg-yellow-400 text-black">
                            {currentQuestionIndex < questions.length - 1 ? "Next Question" : "Finish Quiz"}
                        </Button>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
