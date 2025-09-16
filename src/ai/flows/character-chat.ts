// This file holds the Genkit flow for chatting with Mahabharata characters.

'use server';

/**
 * @fileOverview Implements the character chat feature, allowing users to ask questions to Mahabharata characters.
 *
 * - characterChat -  A function that enables users to ask questions to Mahabharata characters and receive answers based on their stories and values.
 * - CharacterChatInput - The input type for the characterChat function.
 * - CharacterChatOutput - The return type for the characterChat function.
 */

import {ai, geminiPro} from '@/ai/genkit';
import {z} from 'genkit';

const CharacterChatInputSchema = z.object({
  characterName: z.string().describe('The name of the Mahabharata character to chat with (e.g., Krishna, Arjuna).'),
  question: z.string().describe('The question to ask the Mahabharata character.'),
});
export type CharacterChatInput = z.infer<typeof CharacterChatInputSchema>;

const CharacterChatOutputSchema = z.object({
  answer: z.string().describe('The answer from the Mahabharata character, based on their stories and values.'),
});
export type CharacterChatOutput = z.infer<typeof CharacterChatOutputSchema>;

export async function characterChat(input: CharacterChatInput): Promise<CharacterChatOutput> {
  return characterChatFlow(input);
}

const characterChatPrompt = ai.definePrompt({
  name: 'characterChatPrompt',
  model: geminiPro,
  input: {schema: CharacterChatInputSchema},
  output: {schema: CharacterChatOutputSchema},
  prompt: `You are acting as {{characterName}}, a character from the Mahabharata. Answer the following question as if you were that character, drawing upon your knowledge of their stories and values:

Question: {{{question}}}`, 
});

const characterChatFlow = ai.defineFlow(
  {
    name: 'characterChatFlow',
    inputSchema: CharacterChatInputSchema,
    outputSchema: CharacterChatOutputSchema,
  },
  async input => {
    const {output} = await characterChatPrompt(input);
    return output!;
  }
);
