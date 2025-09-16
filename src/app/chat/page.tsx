
"use client";

import { useState, useRef, useEffect, type FormEvent } from 'react';
import { Send, User, Loader2 } from 'lucide-react';
import Image from 'next/image';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { characters, type Character } from '@/lib/characters';
import { characterChat, type CharacterChatInput } from '@/ai/flows/character-chat';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

type Message = {
    role: 'user' | 'assistant';
    content: string;
};

export default function ChatPage() {
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState('');
    const [selectedCharacter, setSelectedCharacter] = useState<Character>(characters[0]);
    const [isLoading, setIsLoading] = useState(false);
    const scrollAreaViewportRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (scrollAreaViewportRef.current) {
            scrollAreaViewportRef.current.scrollTop = scrollAreaViewportRef.current.scrollHeight;
        }
    }, [messages]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setInput(e.target.value);
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        if (!input.trim() || !selectedCharacter) return;
        
        const userMessage: Message = { role: 'user', content: input };
        setMessages(prev => [...prev, userMessage]);
        setInput('');
        setIsLoading(true);

        try {
            const chatInput: CharacterChatInput = {
                characterName: selectedCharacter.name,
                question: input,
            };
            const result = await characterChat(chatInput);
            const assistantMessage: Message = { role: 'assistant', content: result.answer };
            setMessages(prev => [...prev, assistantMessage]);
        } catch (error) {
            console.error("Error chatting with character:", error);
            const errorMessage: Message = { role: 'assistant', content: "I seem to be lost for words at the moment. Please try again later." };
            setMessages(prev => [...prev, errorMessage]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="container mx-auto p-2 sm:p-4 flex flex-col h-screen max-h-screen">
             <header className="flex items-center mb-4">
                <Button asChild variant="ghost" size="icon" className="mr-2 bg-white/20 hover:bg-white/30 text-white">
                    <Link href="/home">
                        <ArrowLeft />
                    </Link>
                </Button>
                <div className='text-center flex-1'>
                    <h1 className="font-headline text-3xl sm:text-4xl font-bold text-yellow-500 dark:text-yellow-300">Chat with Legends</h1>
                    <p className="text-sm sm:text-base text-foreground/80 dark:text-white/90 max-w-2xl mx-auto">
                        Ask questions to the heroes of the Mahabharata.
                    </p>
                </div>
                <div className="w-10"></div>
            </header>

            <Card className="flex-1 flex flex-col bg-card dark:bg-black/50 backdrop-blur-sm border-yellow-500/50 dark:border-yellow-400/50 text-card-foreground dark:text-white overflow-hidden">
                <CardHeader className="flex-row items-center justify-between border-b border-yellow-500/30 dark:border-yellow-400/30 p-4">
                    <div className="flex items-center gap-3">
                        <Avatar>
                            <AvatarImage src={selectedCharacter.image} alt={selectedCharacter.name} data-ai-hint={selectedCharacter['data-ai-hint']}/>
                            <AvatarFallback>{selectedCharacter.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div>
                            <CardTitle className="font-headline text-yellow-600 dark:text-yellow-300 text-lg">
                                {selectedCharacter.name}
                            </CardTitle>
                            <CardDescription className="text-xs text-muted-foreground dark:text-white/70">{selectedCharacter.traits}</CardDescription>
                        </div>
                    </div>
                    <Select
                        defaultValue={selectedCharacter.name}
                        onValueChange={(value) => {
                            setSelectedCharacter(characters.find(c => c.name === value) || characters[0]);
                            setMessages([]);
                        }}
                    >
                        <SelectTrigger className="w-[150px] sm:w-[180px] bg-background dark:bg-white/10 border-yellow-500 dark:border-yellow-400 text-foreground dark:text-white">
                            <SelectValue placeholder="Select Character" />
                        </SelectTrigger>
                        <SelectContent className="bg-popover dark:bg-black/80 text-popover-foreground dark:text-white border-yellow-500 dark:border-yellow-400">
                            {characters.map(char => (
                                <SelectItem key={char.id} value={char.name} className="focus:bg-yellow-400/20">
                                    <div className="flex items-center gap-2">
                                        <Avatar className="h-6 w-6">
                                            <AvatarImage src={char.image} alt={char.name} data-ai-hint={char['data-ai-hint']} />
                                            <AvatarFallback>{char.name.charAt(0)}</AvatarFallback>
                                        </Avatar>
                                        <span>{char.name}</span>
                                    </div>
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </CardHeader>
                <CardContent className="flex-1 p-0 flex flex-col overflow-hidden">
                    <ScrollArea className="flex-1" viewportRef={scrollAreaViewportRef}>
                       <div className="p-4 space-y-4">
                            {messages.map((message, index) => (
                                <div key={index} className={`flex items-end gap-3 ${message.role === 'user' ? 'justify-end' : ''}`}>
                                    {message.role === 'assistant' && (
                                        <Avatar className="h-8 w-8">
                                            <AvatarImage src={selectedCharacter.image} alt={selectedCharacter.name} data-ai-hint={selectedCharacter['data-ai-hint']} />
                                            <AvatarFallback>{selectedCharacter.name.charAt(0)}</AvatarFallback>
                                        </Avatar>
                                    )}
                                    <div className={`p-3 rounded-xl max-w-xs sm:max-w-sm lg:max-w-md shadow-sm ${message.role === 'user' ? 'bg-yellow-500 text-black rounded-br-none' : 'bg-muted dark:bg-white/20 rounded-bl-none'}`}>
                                        <p className="text-sm leading-relaxed">{message.content}</p>
                                    </div>
                                    {message.role === 'user' && (
                                        <Avatar className="h-8 w-8">
                                            <AvatarFallback><User className="h-5 w-5"/></AvatarFallback>
                                        </Avatar>
                                    )}
                                </div>
                            ))}
                            {isLoading && (
                                <div className="flex items-end gap-3">
                                    <Avatar className="h-8 w-8">
                                        <AvatarImage src={selectedCharacter.image} alt={selectedCharacter.name} data-ai-hint={selectedCharacter['data-ai-hint']} />
                                        <AvatarFallback>{selectedCharacter.name.charAt(0)}</AvatarFallback>
                                    </Avatar>
                                    <div className="p-3 rounded-xl bg-muted dark:bg-white/20 rounded-bl-none flex items-center">
                                        <Loader2 className="h-5 w-5 animate-spin text-muted-foreground dark:text-white/70" />
                                    </div>
                                </div>
                            )}
                        </div>
                    </ScrollArea>
                    <div className="p-4 border-t border-yellow-500/30 dark:border-yellow-400/30 bg-card dark:bg-black/50">
                        <form onSubmit={handleSubmit} className="flex gap-2">
                            <Input
                                value={input}
                                onChange={handleInputChange}
                                placeholder={`Ask ${selectedCharacter.name}...`}
                                disabled={isLoading}
                                className="text-base bg-background dark:bg-white/10 border-yellow-500 dark:border-yellow-400 text-foreground dark:text-white placeholder:text-muted-foreground dark:placeholder:text-white/60"
                            />
                            <Button type="submit" disabled={isLoading || !input.trim()} size="icon" aria-label="Send Message" className="bg-yellow-500 hover:bg-yellow-400 text-black">
                                <Send className="h-5 w-5" />
                            </Button>
                        </form>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}

    
