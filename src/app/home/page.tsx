
"use client";
import dynamic from 'next/dynamic';
import SlokaDisplay from '../components/SlokaDisplay';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { User, MessageSquare, Activity, Shield, LogIn, Trophy, LogOut, Swords, Gamepad, Paintbrush } from 'lucide-react';
import { ThemeToggle } from '../components/ThemeToggle';
import { auth } from '@/lib/firebase';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useRouter } from 'next/navigation';

const BackgroundAudio = dynamic(() => import('../components/BackgroundAudio'), { ssr: false });
const DailyQuiz = dynamic(() => import('../components/DailyQuiz'), { ssr: false });

export default function HomePage() {
  const [user, loading] = useAuthState(auth);
  const router = useRouter();

  const handleSignOut = () => {
    auth.signOut();
    router.push('/');
  }

  return (
    <main className="min-h-screen p-4 font-serif">
      <div className="absolute top-4 right-4 z-50 flex items-center gap-2">
        {!loading && !user && (
           <Button asChild variant="outline" size="sm" className="bg-black/50 border-yellow-400/50 text-white hover:bg-black/70 hover:text-white">
              <Link href="/">
                  <LogIn className="mr-2 h-4 w-4"/> Login
              </Link>
           </Button>
        )}
        {!loading && user && (
            <Button onClick={handleSignOut} variant="outline" size="sm" className="bg-black/50 border-yellow-400/50 text-white hover:bg-black/70 hover:text-white">
                <LogOut className="mr-2 h-4 w-4"/> Sign Out
            </Button>
        )}
        <ThemeToggle />
      </div>

      <h1 className="text-4xl text-yellow-500 dark:text-yellow-300 font-bold mb-6 text-center">🕉️ Mythic Dincharya 🐒</h1>
      
      <div className="max-w-4xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <SlokaDisplay />
          <DailyQuiz />

          <div className="md:col-span-2 bg-background dark:bg-black/50 backdrop-blur-sm border border-yellow-500/50 dark:border-yellow-400/50 rounded-lg p-4 text-center flex flex-col justify-center">
             <h2 className="text-xl text-yellow-600 dark:text-yellow-200 mb-2">Explore More</h2>
             <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mt-2">
                <Button asChild variant="outline" className="bg-white/10 text-foreground dark:text-white hover:bg-white/20 border-yellow-500 dark:border-yellow-400">
                    <Link href="/dincharya" className="flex flex-col h-20 justify-center items-center text-center">
                        <Activity className="h-6 w-6 mb-1"/>
                        <span>Full Routine</span>
                    </Link>
                </Button>
                <Button asChild variant="outline" className="bg-white/10 text-foreground dark:text-white hover:bg-white/20 border-yellow-500 dark:border-yellow-400">
                    <Link href="/personality-matcher" className="flex flex-col h-20 justify-center items-center text-center">
                        <User className="h-6 w-6 mb-1"/>
                        <span>Find Hero</span>
                    </Link>
                </Button>
                 <Button asChild variant="outline" className="bg-white/10 text-foreground dark:text-white hover:bg-white/20 border-yellow-500 dark:border-yellow-400">
                    <Link href="/quiz" className="flex flex-col h-20 justify-center items-center text-center">
                        <Shield className="h-6 w-6 mb-1"/>
                        <span>Dharma Quiz</span>
                    </Link>
                </Button>
                 <Button asChild variant="outline" className="bg-white/10 text-foreground dark:text-white hover:bg-white/20 border-yellow-500 dark:border-yellow-400">
                    <Link href="/games" className="flex flex-col h-20 justify-center items-center text-center">
                        <Gamepad className="h-6 w-6 mb-1"/>
                        <span>Game Zone</span>
                    </Link>
                </Button>
             </div>
              <Button asChild variant="default" className="mt-4 bg-yellow-500 text-black hover:bg-yellow-400">
                  <Link href="/chat">
                      <MessageSquare className="mr-2 h-5 w-5"/> Chat with Legends
                  </Link>
              </Button>
          </div>
        </div>
      </div>

      <BackgroundAudio />
    </main>
  );
}
