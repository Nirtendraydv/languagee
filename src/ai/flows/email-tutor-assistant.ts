'use server';
/**
 * @fileOverview AI tool to draft an email to the tutor with specific questions that the AI couldn't answer.
 *
 * - emailTutorAssistant - A function that handles drafting the email to the tutor.
 * - EmailTutorAssistantInput - The input type for the emailTutorAssistant function.
 * - EmailTutorAssistantOutput - The return type for the emailTutorAssistant function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const EmailTutorAssistantInputSchema = z.object({
  studentName: z.string().describe('The name of the student.'),
  tutorName: z.string().describe('The name of the tutor.'),
  courseName: z.string().describe('The name of the course.'),
  aiUnansweredQuestions: z
    .string()
    .describe('Specific questions that the AI Tutor Assistant could not answer.'),
});
export type EmailTutorAssistantInput = z.infer<typeof EmailTutorAssistantInputSchema>;

const EmailTutorAssistantOutputSchema = z.object({
  emailDraft: z.string().describe('The draft of the email to the tutor.'),
});
export type EmailTutorAssistantOutput = z.infer<typeof EmailTutorAssistantOutputSchema>;

export async function emailTutorAssistant(input: EmailTutorAssistantInput): Promise<EmailTutorAssistantOutput> {
  return emailTutorAssistantFlow(input);
}

const prompt = ai.definePrompt({
  name: 'emailTutorAssistantPrompt',
  input: {schema: EmailTutorAssistantInputSchema},
  output: {schema: EmailTutorAssistantOutputSchema},
  prompt: `You are an AI assistant helping students draft emails to their tutors.

  Draft an email to the tutor with the questions that the AI Tutor Assistant could not answer. Make sure the email is polite and clearly states the questions.

  Student Name: {{{studentName}}}
  Tutor Name: {{{tutorName}}}
  Course Name: {{{courseName}}}
  AI Unanswered Questions: {{{aiUnansweredQuestions}}}
  `,
});

const emailTutorAssistantFlow = ai.defineFlow(
  {
    name: 'emailTutorAssistantFlow',
    inputSchema: EmailTutorAssistantInputSchema,
    outputSchema: EmailTutorAssistantOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
