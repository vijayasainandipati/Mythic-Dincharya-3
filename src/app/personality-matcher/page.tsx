"use client";

import { useState } from 'react';
import { Calendar as CalendarIcon, ArrowLeft, User } from "lucide-react";
import { format } from "date-fns";
import Image from "next/image";
import Link from 'next/link';

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { characters, Character } from '@/lib/characters';

export default function PersonalityMatcherPage() {
    const [date, setDate] = useState<Date | undefined>();
    const [matchedCharacter, setMatchedCharacter] = useState<Character | null>(null);
    const [imageError, setImageError] = useState(false);

    const handleMatch = () => {
        if (date) {
            const month = date.getMonth();
            const characterIndex = month % characters.length;
            setMatchedCharacter(characters[characterIndex]);
            setImageError(false); // Reset image error for new character
        }
    };

    const handleImageError = () => {
        setImageError(true);
    };

    return (
        <div className="container mx-auto p-4 sm:p-6 md:p-8 min-h-screen">
            <header className="text-center mb-12 relative">
                <Button asChild variant="ghost" size="icon" className="absolute left-0 top-1/2 -translate-y-1/2 bg-black/50 dark:bg-white/20 hover:bg-black/70 dark:hover:bg-white/30 text-white">
                    <Link href="/">
                        <ArrowLeft />
                    </Link>
                </Button>
                <h1 className="font-headline text-5xl font-bold text-yellow-500 dark:text-yellow-300">Find Your Inner Hero</h1>
                <p className="mt-4 text-lg text-foreground/80 dark:text-white/90 max-w-2xl mx-auto">
                    Your birth date holds a cosmic connection to the heroes of the Mahabharata. Pick your date of birth to reveal your mythological twin!
                </p>
            </header>

            <Card className="max-w-sm mx-auto mb-12 bg-background dark:bg-black/50 backdrop-blur-sm border-yellow-500/50 dark:border-yellow-400/50">
                <CardHeader className="pb-3">
                    <CardTitle className="font-headline text-yellow-600 dark:text-yellow-300 text-lg">Enter Your Birth Date</CardTitle>
                </CardHeader>
                <CardContent className="flex flex-col gap-3 px-4 pb-4">
                    <Popover>
                        <PopoverTrigger asChild>
                            <Button
                                variant={"outline"}
                                className={cn(
                                    "w-full justify-start text-left font-normal bg-background dark:bg-white/10 border-yellow-500 dark:border-yellow-400 hover:bg-accent dark:hover:bg-white/20",
                                    !date && "text-muted-foreground"
                                )}
                            >
                                <CalendarIcon className="mr-2 h-4 w-4" />
                                {date ? format(date, "PPP") : <span>Pick a date</span>}
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0 bg-popover dark:bg-black/80 border-yellow-500 dark:border-yellow-400 text-popover-foreground dark:text-white">
                            <Calendar
                                mode="single"
                                selected={date}
                                onSelect={setDate}
                                initialFocus
                                captionLayout="dropdown-buttons"
                                fromYear={1950}
                                toYear={new Date().getFullYear()}
                                className="text-popover-foreground dark:text-white scale-75"
                                classNames={{
                                    caption_label: "text-popover-foreground dark:text-white text-xs",
                                    day: "text-popover-foreground dark:text-white hover:bg-accent dark:hover:bg-yellow-400/20 h-6 w-6 text-xs",
                                    day_selected: "bg-primary text-primary-foreground dark:bg-yellow-500 dark:text-black hover:bg-primary/90 dark:hover:bg-yellow-400",
                                    day_today: "bg-accent text-accent-foreground dark:bg-yellow-400/30 dark:text-white",
                                    day_outside: "text-muted-foreground dark:text-white/40",
                                    head_cell: "text-muted-foreground dark:text-white/60 text-xs",
                                    nav_button: "text-popover-foreground dark:text-white hover:bg-accent dark:hover:bg-white/20 h-5 w-5",
                                    table: "p-1",
                                    nav: "p-1",
                                }}
                            />
                        </PopoverContent>
                    </Popover>
                    <Button onClick={handleMatch} disabled={!date} className="font-bold bg-yellow-500 hover:bg-yellow-400 text-black">Reveal My Character</Button>
                </CardContent>
            </Card>

            {matchedCharacter && (
                <Card className="max-w-sm mx-auto bg-background dark:bg-black/50 backdrop-blur-sm shadow-xl transform transition-all duration-500 animate-in fade-in zoom-in-95 border-yellow-500/50 dark:border-yellow-400/50">
                    <CardHeader className="items-center text-center p-4">
                        <div className="relative mb-3">
                            {!imageError ? (
                                <Image
                                    src={matchedCharacter.image}
                                    alt={matchedCharacter.name}
                                    width={120}
                                    height={120}
                                    className="rounded-full border-4 border-yellow-500 dark:border-yellow-400"
                                    data-ai-hint={matchedCharacter['data-ai-hint']}
                                    onError={handleImageError}
                                />
                            ) : (
                                <div className="w-[120px] h-[120px] rounded-full border-4 border-yellow-500 dark:border-yellow-400 bg-yellow-100 dark:bg-yellow-900/30 flex items-center justify-center">
                                    <User className="w-12 h-12 text-yellow-600 dark:text-yellow-400" />
                                </div>
                            )}
                        </div>
                        <CardTitle className="font-headline text-3xl text-yellow-600 dark:text-yellow-300">{matchedCharacter.name}</CardTitle>
                        <CardDescription className="text-yellow-500 dark:text-yellow-400 font-bold">{matchedCharacter.traits}</CardDescription>
                    </CardHeader>
                    <CardContent className="text-center p-4 pt-0">
                        <blockquote className="border-l-4 border-yellow-500 dark:border-yellow-300 pl-4 italic text-foreground/80 dark:text-white/80">
                            "{matchedCharacter.quote}"
                        </blockquote>
                        {imageError && (
                            <p className="text-xs text-muted-foreground dark:text-white/60 mt-2">
                                Character image not available
                            </p>
                        )}
                    </CardContent>
                </Card>
            )}
        </div>
    );
}
