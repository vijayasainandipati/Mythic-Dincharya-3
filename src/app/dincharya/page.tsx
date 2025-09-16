
"use client";

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Sunrise, Droplets, Wind, Heart, ShowerHead, Apple, Utensils, Sunset, Users, BookOpen, Bed, Sun } from "lucide-react";
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

const routineData = [
    { time: "5:00 AM", name: "Brahma Muhurta", activity: "Wake up, offer prayers, and meditate in this auspicious period.", icon: <Sunrise className="h-6 w-6 text-yellow-500 dark:text-yellow-300" /> },
    { time: "5:30 AM", name: "Usha Paana", activity: "Drink a glass of warm water to cleanse the system.", icon: <Droplets className="h-6 w-6 text-yellow-500 dark:text-yellow-300" /> },
    { time: "6:00 AM", name: "Danta Dhavana", activity: "Cleanse your senses: brush teeth and scrape your tongue.", icon: <Wind className="h-6 w-6 text-yellow-500 dark:text-yellow-300" /> },
    { time: "6:30 AM", name: "Vyayama", activity: "Engage in physical exercise like yoga or surya namaskar.", icon: <Heart className="h-6 w-6 text-yellow-500 dark:text-yellow-300" /> },
    { time: "7:30 AM", name: "Snana (Bath)", activity: "Take a bath to purify the body and mind.", icon: <ShowerHead className="h-6 w-6 text-yellow-500 dark:text-yellow-300" /> },
    { time: "8:30 AM", name: "Light Breakfast", activity: "A light and nourishing meal to start your day.", icon: <Apple className="h-6 w-6 text-yellow-500 dark:text-yellow-300" /> },
    { time: "12:30 PM", name: "Midday Meal", activity: "Eat your largest meal when digestive fire is strongest.", icon: <Utensils className="h-6 w-6 text-yellow-500 dark:text-yellow-300" /> },
    { time: "4:00 PM", name: "Service (Seva)", activity: "Help others, practice charity, or community service.", icon: <Users className="h-6 w-6 text-yellow-500 dark:text-yellow-300" /> },
    { time: "6:00 PM", name: "Evening Prayer", activity: "Evening prayer and gratitude for the day's blessings.", icon: <Sunset className="h-6 w-6 text-yellow-500 dark:text-yellow-300" /> },
    { time: "7:00 PM", name: "Light Dinner", activity: "A simple, light dinner that's easy to digest.", icon: <Sun className="h-6 w-6 text-yellow-500 dark:text-yellow-300" /> },
    { time: "9:00 PM", name: "Self-Reflection", activity: "Review the day, practice gratitude, and read scriptures.", icon: <BookOpen className="h-6 w-6 text-yellow-500 dark:text-yellow-300" /> },
    { time: "10:00 PM", name: "Peaceful Sleep", activity: "Early sleep for natural body rhythms and health.", icon: <Bed className="h-6 w-6 text-yellow-500 dark:text-yellow-300" /> },
];

export default function DincharyaPage() {
    return (
        <div className="container mx-auto p-4 sm:p-6 md:p-8 min-h-screen">
            <header className="text-center mb-8 relative">
                <Button asChild variant="ghost" size="icon" className="absolute left-0 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-yellow-300 dark:bg-white/20 dark:hover:bg-white/30 dark:text-white">
                    <Link href="/home">
                        <ArrowLeft />
                    </Link>
                </Button>
                <h1 className="font-headline text-4xl sm:text-5xl font-bold text-yellow-500 dark:text-yellow-300">Dincharya - The Vedic Routine</h1>
                <p className="mt-4 text-md sm:text-lg text-foreground/80 dark:text-white/90 max-w-3xl mx-auto">
                    Align your day with the rhythms of nature. This schedule is a guide to a balanced life, inspired by ancient wisdom.
                </p>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
                {routineData.map((item, index) => (
                    <Card key={index} className="bg-background dark:bg-black/40 backdrop-blur-sm shadow-lg hover:shadow-yellow-400/20 transition-all duration-300 border-yellow-500/30 dark:border-yellow-400/30 group hover:border-yellow-500/60 dark:hover:border-yellow-400/60 flex flex-col">
                        <CardHeader className="flex-row items-start justify-between gap-4 p-4">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-yellow-400/10 rounded-lg">
                                    {item.icon}
                                </div>
                                <div>
                                    <p className="text-sm font-semibold text-yellow-600 dark:text-yellow-400 bg-yellow-900/50 px-2 py-0.5 rounded-full inline-block">{item.time}</p>
                                    <CardTitle className="font-headline text-lg text-yellow-700 dark:text-yellow-200 mt-1">{item.name}</CardTitle>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className="p-4 pt-0 flex-grow">
                            <p className="text-sm text-foreground/70 dark:text-white/80">{item.activity}</p>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
}
