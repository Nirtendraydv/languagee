
// This is an AI-powered tutor assistant that answers user questions about English courses.
'use server';

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import {AI_TUTOR_COURSES_CONTEXT} from '@/lib/constants';

const AiTutorAssistantInputSchema = z.object({
  question: z.string().describe('The user question about the course material.'),
});
export type AiTutorAssistantInput = z.infer<typeof AiTutorAssistantInputSchema>;

const AiTutorAssistantOutputSchema = z.object({
  answer: z.string().describe('The answer to the user question based on the course information.'),
});
export type AiTutorAssistantOutput = z.infer<typeof AiTutorAssistantOutputSchema>;

export async function aiTutorAssistant(input: AiTutorAssistantInput): Promise<AiTutorAssistantOutput> {
  return aiTutorAssistantFlow(input);
}

const answerQuestionPrompt = ai.definePrompt({
  name: 'answerQuestionPrompt',
  input: {schema: z.object({ question: z.string(), courses: z.any() })},
  output: {schema: AiTutorAssistantOutputSchema},
  prompt: `You are an AI tutor assistant for a website called "English Excellence". Your goal is to help users by answering their questions about the English courses offered.

Use the following course information to answer the user's question.

Courses:
{{#each courses}}
- Title: {{title}}
  - Description: {{description}}
  - Level: {{level}}
  - Age Group: {{ageGroup}}
  - Goal: {{goal}}
{{/each}}

Question: {{question}}

Answer the question based only on the provided course information. Be helpful and friendly.`,
});

const aiTutorAssistantFlow = ai.defineFlow(
  {
    name: 'aiTutorAssistantFlow',
    inputSchema: AiTutorAssistantInputSchema,
    outputSchema: AiTutorAssistantOutputSchema,
  },
  async (input) => {
    const {output} = await answerQuestionPrompt({question: input.question, courses: AI_TUTOR_COURSES_CONTEXT});
    return output!;
  }
);
