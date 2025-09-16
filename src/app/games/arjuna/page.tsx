
"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { db, auth } from "@/lib/firebase";
import { doc, updateDoc, increment } from "firebase/firestore";
import { useAuthState } from "react-firebase-hooks/auth";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import Link from 'next/link';
import { ArrowLeft, Clock, Heart, RefreshCw, Trophy, Loader2 } from 'lucide-react';
import { generateFact, type FactOutput } from "@/ai/flows/fact-generator";

type Arrow = { x: number; y: number; vy: number };
type HitEffect = { x: number; y: number; alpha: number };

const GAME_DURATION = 60; // 60 seconds
const STORAGE_KEY = 'dharmaquest_shown_facts';

export default function ArjunaGamePage() {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [user] = useAuthState(auth);
    const { toast } = useToast();

    // Game state that triggers re-renders
    const [score, setScore] = useState(0);
    const [lives, setLives] = useState(3);
    const [timeLeft, setTimeLeft] = useState(GAME_DURATION);
    const [gameOver, setGameOver] = useState(false);
    const [victory, setVictory] = useState(false);
    const [eyeHits, setEyeHits] = useState(0);
    const [funFact, setFunFact] = useState<FactOutput | null>(null);
    const [isFactLoading, setIsFactLoading] = useState(false);
    const [shownFacts, setShownFacts] = useState<string[]>([]);

    // Game state for animation loop, stored in refs to prevent re-renders
    const angleRef = useRef(0);
    const fishSpeedRef = useRef(2);
    const arrowRef = useRef<Arrow | null>(null);
    const rippleOffsetRef = useRef(0);
    const fishHitRef = useRef(false);
    const hitEffectRef = useRef<HitEffect | null>(null);
    
    const fishDetails = {
        orbitX: 250,
        orbitY: 100,
        radius: 120,
        bodyWidth: 40,
        bodyHeight: 20,
        eyeOffsetX: 25,
        eyeOffsetY: -2,
        eyeRadius: 4,
    };
    
    useEffect(() => {
        // Load shown facts from localStorage on component mount
        const storedFacts = localStorage.getItem(STORAGE_KEY);
        if (storedFacts) {
            try {
                setShownFacts(JSON.parse(storedFacts));
            } catch(e) {
                localStorage.removeItem(STORAGE_KEY);
            }
        }
    }, []);

    // Countdown Timer and Difficulty Increase
    useEffect(() => {
        if (gameOver || victory) return;

        const timerId = setInterval(() => {
            setTimeLeft(prev => {
                const newTime = prev - 1;
                if (newTime <= 0) {
                    setGameOver(true);
                    return 0;
                }
                // Increase difficulty every 15 seconds
                if (newTime > 0 && newTime % 15 === 0 && fishSpeedRef.current < 6) {
                    fishSpeedRef.current += 1;
                }
                return newTime;
            });
        }, 1000);

        return () => clearInterval(timerId);
    }, [gameOver, victory]);

    // Effect for showing "Faster!" toast when fishSpeed changes
    useEffect(() => {
        const currentSpeed = fishSpeedRef.current;
        if (currentSpeed > 2) {
             toast({ title: "Faster!", description: "The fish is getting faster!" });
        }
    }, [fishSpeedRef.current, toast]);


    const checkCollision = useCallback((arrowPos: {x: number, y: number}) => {
        const { orbitX, orbitY, radius, eyeOffsetX, eyeOffsetY, eyeRadius } = fishDetails;
        const fishAngleRad = (angleRef.current * Math.PI) / 180;
        const fishX = orbitX + radius * Math.cos(fishAngleRad);
        const fishY = orbitY + radius * Math.sin(fishAngleRad);
        
        const eyeWorldX = fishX + eyeOffsetX * Math.cos(fishAngleRad) - eyeOffsetY * Math.sin(fishAngleRad);
        const eyeWorldY = fishX + eyeOffsetX * Math.sin(fishAngleRad) + eyeOffsetY * Math.cos(fishAngleRad);

        const distanceToEye = Math.sqrt(Math.pow(arrowPos.x - eyeWorldX, 2) + Math.pow(arrowPos.y - eyeWorldY, 2));
        
        if (distanceToEye < eyeRadius + 10) { // Hit the eye (larger hitbox for fun)
            toast({ title: "🏆 Bullseye!", description: "Arjuna, you have struck true! +10 points." });
            setScore(prev => prev + 10);
            setEyeHits(prev => prev + 1);

            fishHitRef.current = true;
            hitEffectRef.current = { x: eyeWorldX, y: eyeWorldY, alpha: 1.0 };
            setTimeout(() => { fishHitRef.current = false; }, 1000);
            
            if (user) {
                updateDoc(doc(db, "users", user.uid), { dharmaPoints: increment(10) }).catch(e => console.error("Failed to update points", e));
            }
            return true;
        }
        return false;
    }, [user, toast]);


    const gameLoop = useCallback(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        // --- UPDATE LOGIC ---
        if (!fishHitRef.current) {
            angleRef.current = (angleRef.current + fishSpeedRef.current) % 360; 
        }
        rippleOffsetRef.current += 0.05;

        if (arrowRef.current) {
            const prev = arrowRef.current;
            const newY = prev.y - prev.vy;
            const newArrowState = { ...prev, y: newY };
            
            if (checkCollision({ x: newArrowState.x, y: newArrowState.y })) {
                 arrowRef.current = null; // Arrow hit, remove it
            } else if (newArrowState.y < 0) { // Arrow missed and went off screen
                toast({ title: "❌ Missed!", description: "The arrow went astray. You lose a life.", variant: "destructive" });
                setLives(prev => Math.max(0, prev - 1));
                arrowRef.current = null;
            } else {
                 arrowRef.current = newArrowState;
            }
        }
        
        if (hitEffectRef.current) {
            hitEffectRef.current.alpha -= 0.05;
            if (hitEffectRef.current.alpha <= 0) {
                hitEffectRef.current = null;
            }
        }

        // --- DRAWING LOGIC ---
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // 1. Draw reflection bowl
        ctx.fillStyle = "rgba(173, 216, 230, 0.5)";
        ctx.strokeStyle = "#FFD700";
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.ellipse(canvas.width / 2, 420, 180, 70, 0, 0, 2 * Math.PI);
        ctx.fill();
        ctx.stroke();

        // 2. Draw water ripples
        for (let i = 0; i < 5; i++) {
            ctx.strokeStyle = `rgba(255, 255, 255, ${0.1 * (1 - i/5)})`;
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.ellipse(
              canvas.width / 2,
              420,
              180 - i * 20 + Math.sin(rippleOffsetRef.current + i) * 3,
              70 - i * 8 + Math.cos(rippleOffsetRef.current + i) * 2,
              0, 0, 2 * Math.PI
            );
            ctx.stroke();
        }
        
        // 3. Calculate fish position
        const { orbitX, orbitY, radius } = fishDetails;
        const fishAngleRad = (angleRef.current * Math.PI) / 180;
        const fishX = orbitX + radius * Math.cos(fishAngleRad);
        const fishY = orbitY + radius * Math.sin(fishAngleRad);

        // 4. Draw actual fish and its reflection
        drawFish(ctx, fishX, fishY, fishAngleRad, false);
        const reflectionX = fishX;
        const reflectionY = 420 + (fishY - 250) * 0.1;
        drawFish(ctx, reflectionX, reflectionY, fishAngleRad, true);
        
        // 5. Draw flying arrow
        if (arrowRef.current) {
            const arrow = arrowRef.current;
            ctx.fillStyle = "#8B4513";
            ctx.save();
            ctx.translate(arrow.x, arrow.y);
            ctx.beginPath();
            ctx.moveTo(0, -15); // Tip
            ctx.lineTo(5, 10);  // Right tail
            ctx.lineTo(0, 5);   // Middle
            ctx.lineTo(-5, 10); // Left tail
            ctx.closePath();
            ctx.fill();
            ctx.restore();
        }
        
        // 6. Draw hit effect
        if (hitEffectRef.current) {
            const effect = hitEffectRef.current;
            ctx.fillStyle = `rgba(255, 255, 0, ${effect.alpha})`;
            ctx.beginPath();
            ctx.arc(effect.x, effect.y, 20 * (1.0 - effect.alpha), 0, Math.PI * 2);
            ctx.fill();
        }

        if (!gameOver && !victory) {
          window.requestAnimationFrame(gameLoop);
        }
    }, [checkCollision, gameOver, victory, toast]);

     const drawFish = (ctx: CanvasRenderingContext2D, x: number, y: number, rotation: number, isReflection: boolean) => {
        ctx.save();
        ctx.translate(x, y);
        
        if (isReflection) {
             ctx.scale(1, 0.5); // Flatten for reflection
        } else {
             ctx.rotate(rotation);
        }
        
        let bodyFill = isReflection ? "rgba(255, 165, 0, 0.4)" : "#FFA500";
        if (fishHitRef.current && !isReflection) {
            bodyFill = `rgba(255, 0, 0, ${Math.sin(performance.now() / 100) * 0.5 + 0.5})`;
        }

        ctx.fillStyle = bodyFill;
        ctx.strokeStyle = isReflection ? "rgba(255, 215, 0, 0.4)" : "#FFD700";
        ctx.lineWidth = 1;

        // Fish Body
        ctx.beginPath();
        ctx.ellipse(0, 0, fishDetails.bodyWidth, fishDetails.bodyHeight, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
        
        // Fish Tail
        ctx.beginPath();
        ctx.moveTo(-fishDetails.bodyWidth, 0);
        ctx.lineTo(-fishDetails.bodyWidth-15, -10);
        ctx.lineTo(-fishDetails.bodyWidth-15, 10);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();

        // Fish Eye
        ctx.fillStyle = isReflection ? "rgba(255, 0, 0, 0.4)" : "red";
        ctx.beginPath();
        ctx.arc(fishDetails.eyeOffsetX, fishDetails.eyeOffsetY, fishDetails.eyeRadius, 0, Math.PI * 2);
        ctx.fill();

        ctx.restore();
    }

     useEffect(() => {
        if (!gameOver && !victory) {
            const animationFrameId = window.requestAnimationFrame(gameLoop);
            return () => window.cancelAnimationFrame(animationFrameId);
        }
    }, [gameOver, gameLoop, victory]);
    
    const fetchUniqueFact = async (attempts = 3): Promise<FactOutput> => {
        for (let i = 0; i < attempts; i++) {
            const result = await generateFact();
            if (!shownFacts.includes(result.fact)) {
                const updatedFacts = [...shownFacts, result.fact];
                setShownFacts(updatedFacts);
                localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedFacts));
                return result;
            }
        }
        // If all attempts fail, return a default message or the last fact
        return { title: "A Known Truth", fact: "You've unlocked many secrets of the Mahabharata! Keep playing to learn more."};
    };
    
    useEffect(() => {
        if (lives <= 0) {
            setGameOver(true);
        }
        if (eyeHits >= 3) {
            setVictory(true);
            setIsFactLoading(true);
            fetchUniqueFact()
                .then(result => setFunFact(result))
                .catch(err => {
                    console.error("Failed to generate fact:", err);
                    setFunFact({title: "An Unexpected Turn", fact: "Could not load a fun fact. But congratulations on your victory!"});
                })
                .finally(() => setIsFactLoading(false));
        }
    }, [lives, eyeHits, shownFacts]);
    
    const handleShoot = () => {
        if (arrowRef.current || gameOver || victory) return;
        arrowRef.current = { x: 250, y: 350, vy: 10 };
    };

    const handleRestart = () => {
        setScore(0);
        setLives(3);
        setTimeLeft(GAME_DURATION);
        fishSpeedRef.current = 2;
        arrowRef.current = null;
        setEyeHits(0);
        setGameOver(false);
        setVictory(false);
        setFunFact(null);
        setIsFactLoading(false);
    }
    
    if (victory) {
        return (
             <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-yellow-300 via-green-300 to-blue-300 dark:from-yellow-800 dark:to-green-900 p-4 text-center">
                 <Trophy className="h-24 w-24 text-yellow-500 dark:text-yellow-300 mb-4" />
                 <h1 className="text-4xl font-bold mb-2 text-slate-800 dark:text-yellow-300 font-headline">Victory!</h1>
                 <p className="text-2xl text-slate-700 dark:text-white/90">You hit the eye 3 times! Final Score: {score}</p>

                 {isFactLoading ? (
                    <div className="mt-4 p-4 bg-yellow-100/20 dark:bg-yellow-900/30 border border-yellow-400 rounded-lg shadow min-h-[100px] flex items-center justify-center">
                       <Loader2 className="h-6 w-6 animate-spin text-yellow-400"/>
                    </div>
                 ) : funFact && (
                    <div className="mt-4 p-4 bg-yellow-100 dark:bg-yellow-900/50 border border-yellow-400 rounded-lg shadow">
                        <h2 className="text-xl font-semibold text-yellow-800 dark:text-yellow-200">🪔 {funFact.title}</h2>
                        <p className="mt-2 text-lg text-yellow-900 dark:text-yellow-100">{funFact.fact}</p>
                    </div>
                 )}

                 <div className="mt-8 flex gap-4">
                     <Button onClick={handleRestart} className="font-bold text-lg px-8 py-6 bg-green-600 hover:bg-green-700 text-white">
                        <RefreshCw className="mr-2"/> Play Again
                    </Button>
                    <Button asChild variant="outline" className="font-bold text-lg px-8 py-6 bg-white/20 hover:bg-white/40 text-slate-800 dark:text-white border-slate-400">
                        <Link href="/home">
                            <ArrowLeft className="mr-2"/> Back to Home
                        </Link>
                    </Button>
                 </div>
             </div>
        )
    }

    if (gameOver) {
        return (
             <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-orange-200 via-yellow-300 to-blue-200 dark:from-gray-800 dark:to-slate-900 p-4 text-center">
                 <h1 className="text-4xl font-bold mb-2 text-slate-800 dark:text-yellow-300 font-headline">Game Over!</h1>
                 <p className="text-2xl text-slate-700 dark:text-white/90">Final Score: {score}</p>
                 <div className="mt-8 flex gap-4">
                     <Button onClick={handleRestart} className="font-bold text-lg px-8 py-6 bg-green-600 hover:bg-green-700 text-white">
                        <RefreshCw className="mr-2"/> Play Again
                    </Button>
                    <Button asChild variant="outline" className="font-bold text-lg px-8 py-6 bg-white/20 hover:bg-white/40 text-slate-800 dark:text-white border-slate-400">
                        <Link href="/home">
                            <ArrowLeft className="mr-2"/> Back to Home
                        </Link>
                    </Button>
                 </div>
             </div>
        )
    }

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-orange-200 via-yellow-300 to-blue-200 dark:from-gray-800 dark:to-slate-900 p-4 text-center">
             <Button asChild variant="ghost" size="icon" className="absolute left-4 top-4 bg-black/20 hover:bg-black/40 text-white">
                <Link href="/home">
                    <ArrowLeft />
                </Link>
            </Button>
            <h1 className="text-4xl font-bold mb-2 text-slate-800 dark:text-yellow-300 font-headline">🏹 Arjuna’s Eye Challenge</h1>
             <p className="text-slate-600 dark:text-white/80 mb-4 max-w-md">Look at the reflection in the water and tap the screen to shoot!</p>
            
            <div className="flex justify-between w-full max-w-lg mb-2 text-slate-700 dark:text-white font-bold text-lg">
                <div className="flex items-center gap-2">
                    <Heart className="text-red-500"/> <span>{lives}</span>
                </div>
                 <p>Score: {score}</p>
                 <p>Eye Hits: {eyeHits}/3</p>
                 <div className="flex items-center gap-2">
                    <Clock className="text-blue-500"/> <span>{timeLeft}s</span>
                </div>
            </div>

            <canvas 
                ref={canvasRef} 
                width={500} 
                height={500} 
                className="border-4 border-yellow-600/50 dark:border-yellow-400/50 rounded-lg shadow-2xl bg-white/20 dark:bg-black/20 cursor-pointer"
                onClick={handleShoot}
            />
            
            <div className="mt-4 font-bold text-lg px-8 py-4 bg-yellow-500 text-black rounded-lg">
                Fish Speed: {fishSpeedRef.current}x
            </div>
        </div>
    );
}
