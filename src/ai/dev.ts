import { config } from 'dotenv';
config();

import '@/ai/flows/character-chat.ts';
import '@/ai/flows/quiz-generator.ts';
import '@/ai/schemas/quiz-schema.ts';
import '@/ai/flows/sloka-generator.ts';
import '@/ai/flows/daily-quiz-generator.ts';
import '@/ai/flows/fact-generator.ts';
import '@/ai/flows/riddle-generator.ts';
import '@/ai/flows/crossword-generator.ts';
