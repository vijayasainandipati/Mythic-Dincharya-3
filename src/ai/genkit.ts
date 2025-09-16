import {genkit, type ModelReference} from 'genkit';
import {googleAI} from '@genkit-ai/googleai';

export const geminiPro: ModelReference = googleAI.model('gemini-1.5-pro-latest');
export const geminiFlash: ModelReference = googleAI.model('gemini-1.5-flash-latest');


export const ai = genkit({
  plugins: [googleAI()],
});
