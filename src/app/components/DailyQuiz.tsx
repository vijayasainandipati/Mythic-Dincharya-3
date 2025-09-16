
"use client";
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { generateDailyQuiz } from '@/ai/flows/daily-quiz-generator';
import type { QuizQuestion } from '@/ai/schemas/quiz-schema';
import { Loader2 } from 'lucide-react';

export default function DailyQuiz() {
  const [question, setQuestion] = useState<QuizQuestion | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selected, setSelected] = useState<number | null>(null);
  const [result, setResult] = useState('');

  useEffect(() => {
    const fetchQuiz = async () => {
      const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
      const storedQuizData = localStorage.getItem('dailyQuiz');

      if (storedQuizData) {
        try {
          const parsedData = JSON.parse(storedQuizData);
          if (parsedData.date === today && parsedData.question) {
            setQuestion(parsedData.question);
            setIsLoading(false);
            return;
          }
        } catch (e) {
          console.error("Failed to parse stored quiz data", e);
          localStorage.removeItem('dailyQuiz');
        }
      }

      try {
        setIsLoading(true);
        setError(null);
        const dailyQuiz = await generateDailyQuiz();
        setQuestion(dailyQuiz.question);
        localStorage.setItem('dailyQuiz', JSON.stringify({
            date: today,
            question: dailyQuiz.question,
        }));
      } catch (e) {
        console.error(e);
        setError("Could not fetch today's quiz. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchQuiz();
  }, []);

  const submit = () => {
    if (selected === null || !question) {
      setResult("Please select an answer!");
      return;
    }
    if (selected === question.correctAnswerIndex) {
      setResult('✅ Correct! +1 Dharma Point!');
    } else {
      setResult('❌ Oops! Try again tomorrow.');
    }
  };

  if (isLoading) {
    return (
        <div className="bg-background dark:bg-black/50 backdrop-blur-sm border border-yellow-500/50 dark:border-yellow-400/50 rounded-lg p-4 text-center min-h-[250px] flex flex-col justify-center items-center">
            <Loader2 className="h-8 w-8 animate-spin text-yellow-400 dark:text-yellow-300 mb-2" />
            <p>Brewing a new question...</p>
        </div>
    );
  }

  if (error || !question) {
    return (
        <div className="bg-background dark:bg-black/50 backdrop-blur-sm border border-yellow-500/50 dark:border-yellow-400/50 rounded-lg p-4 text-center min-h-[250px] flex flex-col justify-center items-center">
            <p className="text-red-400">{error || 'Something went wrong.'}</p>
        </div>
    );
  }


  return (
    <div className="bg-background dark:bg-black/50 backdrop-blur-sm border border-yellow-500/50 dark:border-yellow-400/50 rounded-lg p-4 text-center min-h-[250px] flex flex-col">
      <h2 className="text-xl text-yellow-600 dark:text-yellow-200 mb-2">🧠 Daily Dharma Quiz</h2>
      <div className="flex-grow flex flex-col justify-center">
        <p className="mb-2">{question.questionText}</p>
        <RadioGroup onValueChange={(val) => setSelected(parseInt(val, 10))} className="space-y-2 items-start text-left w-fit mx-auto">
          {question.answers.map((opt, idx) => (
            <div key={idx} className='flex items-center space-x-2'>
              <RadioGroupItem value={idx.toString()} id={`quiz-opt-${idx}`} className="border-primary text-primary focus:ring-primary" />
              <Label htmlFor={`quiz-opt-${idx}`}>{opt}</Label>
            </div>
          ))}
        </RadioGroup>
      </div>
      <Button
        className="mt-3 bg-yellow-500 text-black px-4 py-1 rounded hover:bg-yellow-400"
        onClick={submit}
        disabled={!!result}
      >
        Submit
      </Button>
      {result && <p className="mt-2 font-bold">{result}</p>}
    </div>
  );
}
