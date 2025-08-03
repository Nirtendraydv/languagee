// This is an AI-powered tutor assistant that answers user questions and can draft emails to tutors.
'use server';

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AiTutorAssistantInputSchema = z.object({
  question: z.string().describe('The user question about the course material.'),
  faq: z.string().describe('Frequently asked questions and answers.'),
});
export type AiTutorAssistantInput = z.infer<typeof AiTutorAssistantInputSchema>;

const AiTutorAssistantOutputSchema = z.object({
  answer: z.string().describe('The answer to the user question.'),
  emailDraft: z.string().optional().describe('An optional email draft to the tutor if the question cannot be answered from the FAQ.'),
});
export type AiTutorAssistantOutput = z.infer<typeof AiTutorAssistantOutputSchema>;

export async function aiTutorAssistant(input: AiTutorAssistantInput): Promise<AiTutorAssistantOutput> {
  return aiTutorAssistantFlow(input);
}

const answerQuestionPrompt = ai.definePrompt({
  name: 'answerQuestionPrompt',
  input: {schema: AiTutorAssistantInputSchema},
  output: {schema: AiTutorAssistantOutputSchema},
  prompt: `You are an AI tutor assistant. Use the following FAQ to answer the user's question.

FAQ:
{{faq}}

Question: {{question}}

If the question cannot be answered from the FAQ, then create an email draft to the tutor asking the question. Otherwise, answer the question directly.`,
});

const aiTutorAssistantFlow = ai.defineFlow(
  {
    name: 'aiTutorAssistantFlow',
    inputSchema: AiTutorAssistantInputSchema,
    outputSchema: AiTutorAssistantOutputSchema,
  },
  async input => {
    const {output} = await answerQuestionPrompt(input);
    return output!;
  }
);
