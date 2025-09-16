
'use server';

/**
 * @fileOverview A Genkit flow that generates a Yes/No riddle about the Mahabharata.
 *
 * - generateRiddle - A function that returns one riddle.
 * - Riddle - The return type for the generateRiddle function.
 */

import {ai, geminiFlash} from '@/ai/genkit';
import {z} from 'genkit';

const RiddleSchema = z.object({
  question: z.string().describe('The text of the Yes/No riddle.'),
  answer: z.enum(['yes', 'no']).describe('The correct answer to the riddle, either "yes" or "no".'),
});

export type Riddle = z.infer<typeof RiddleSchema>;


const RiddlePromptInputSchema = z.object({
    category: z.string().describe("The category for the riddle (e.g., 'Characters', 'Events')."),
    history: z.array(z.string()).describe('A list of questions that have already been asked to avoid repetition.'),
});

export type RiddleInput = z.infer<typeof RiddlePromptInputSchema>;


export async function generateRiddle(input: RiddleInput): Promise<Riddle> {
  return riddleGeneratorFlow(input);
}


const riddleGeneratorPrompt = ai.definePrompt({
  name: 'riddleGeneratorPrompt',
  model: geminiFlash,
  input: { schema: RiddlePromptInputSchema },
  output: {schema: RiddleSchema},
  prompt: `Generate a single, simple Yes/No riddle about the Mahabharata from the category: {{{category}}}.

The riddle can cover any character, event, or place (e.g., Krishna, Arjuna, Kurukshetra, Bhima, Karna, Draupadi, the Pandavas, the Kauravas, the Bhagavad Gita).

The riddle should be suitable for a child. The answer must be strictly "yes" or "no" in lowercase.

Do not repeat any of these previous questions:
{{#each history}}
- {{{this}}}
{{/each}}

Example:
Question: Was Arjuna a skilled archer?
Answer: yes

Example:
Question: Did Duryodhana willingly share the kingdom with the Pandavas?
Answer: no
`,
});

const riddleGeneratorFlow = ai.defineFlow(
  {
    name: 'riddleGeneratorFlow',
    inputSchema: RiddlePromptInputSchema,
    outputSchema: RiddleSchema,
  },
  async (input) => {
    const {output} = await riddleGeneratorPrompt(input);
    return output!;
  }
);
