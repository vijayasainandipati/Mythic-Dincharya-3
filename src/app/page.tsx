
"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { createUserInFirestore } from '@/lib/user';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';

export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const router = useRouter();
    const { toast } = useToast();

    const handleSignUp = async (e: React.FormEvent) => {
        e.preventDefault();
        if (password.length < 6) {
            toast({ title: "Password is too short", description: "Please choose a password with at least 6 characters.", variant: "destructive" });
            return;
        }
        setLoading(true);

        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;
            
            // Derive username from email
            const username = email.split('@')[0];
            await createUserInFirestore(user, username);
            
            toast({ title: "Successfully Registered!", description: `Your account has been created and your email (${email}) is now registered.` });
            router.push('/home');
        } catch (error: any) {
             if (error.code === 'auth/email-already-in-use') {
                toast({ title: "Email in use", description: "This email is already registered. Please log in.", variant: "destructive" });
            } else {
                toast({ title: "Error signing up", description: error.message, variant: "destructive" });
            }
        } finally {
            setLoading(false);
        }
    };

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            await signInWithEmailAndPassword(auth, email, password);
            toast({ title: "Logged in successfully!" });
            router.push('/home');
        } catch (error: any) {
             if (error.code === 'auth/invalid-credential') {
                toast({ title: "Error logging in", description: "Invalid email or password.", variant: "destructive" });
             } else {
                toast({ title: "Error logging in", description: "An unexpected error occurred. Please try again.", variant: "destructive" });
             }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen p-4">
            <Tabs defaultValue="login" className="w-full max-w-md">
                <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="login">Login</TabsTrigger>
                    <TabsTrigger value="signup">Sign Up</TabsTrigger>
                </TabsList>
                <TabsContent value="login">
                    <Card className="bg-background dark:bg-black/50 backdrop-blur-sm border-yellow-500/50 dark:border-yellow-400/50">
                        <CardHeader>
                            <CardTitle className="font-headline text-yellow-600 dark:text-yellow-300">Welcome Back</CardTitle>
                            <CardDescription>Enter your email to continue your journey.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleLogin} className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="login-email">Email</Label>
                                    <Input id="login-email" type="email" placeholder="arjuna@dharmaquest.app" value={email} onChange={(e) => setEmail(e.target.value)} required className="bg-background dark:bg-white/10 border-yellow-500 dark:border-yellow-400" />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="login-password">Password</Label>
                                    <Input id="login-password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required className="bg-background dark:bg-white/10 border-yellow-500 dark:border-yellow-400" />
                                </div>
                                <Button type="submit" className="w-full bg-yellow-500 hover:bg-yellow-400 text-black" disabled={loading}>
                                    {loading ? <Loader2 className="animate-spin" /> : 'Login'}
                                </Button>
                            </form>
                        </CardContent>
                    </Card>
                </TabsContent>
                <TabsContent value="signup">
                    <Card className="bg-background dark:bg-black/50 backdrop-blur-sm border-yellow-500/50 dark:border-yellow-400/50">
                        <CardHeader>
                            <CardTitle className="font-headline text-yellow-600 dark:text-yellow-300">Begin Your Legend</CardTitle>
                            <CardDescription>Create a new account to start your mythic journey.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleSignUp} className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="signup-email">Email</Label>
                                    <Input id="signup-email" type="email" placeholder="your.email@example.com" value={email} onChange={(e) => setEmail(e.target.value)} required className="bg-background dark:bg-white/10 border-yellow-500 dark:border-yellow-400" />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="signup-password">Password</Label>
                                    <Input id="signup-password" type="password" placeholder="Must be at least 6 characters" value={password} onChange={(e) => setPassword(e.target.value)} required className="bg-background dark:bg-white/10 border-yellow-500 dark:border-yellow-400" />
                                </div>
                                <Button type="submit" className="w-full bg-yellow-500 hover:bg-yellow-400 text-black" disabled={loading}>
                                    {loading ? <Loader2 className="animate-spin" /> : 'Sign Up'}
                                </Button>
                            </form>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
}
