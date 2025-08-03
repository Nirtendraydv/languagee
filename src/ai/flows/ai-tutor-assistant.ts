
'use server';

/**
 * @fileOverview A conversational AI assistant for the LingoSphere platform.
 *
 * - getAiTutorResponse - A function that provides an AI-powered response to user queries.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';
import {TUTOR_FAQ, AI_TUTOR_COURSES_CONTEXT} from '@/lib/constants';

// We don't need a specific Zod schema for input/output as it's a simple string conversation.

const tutorAssistantPrompt = ai.definePrompt({
    name: 'tutorAssistantPrompt',
    input: { schema: z.string() },
    output: { schema: z.string() },
    prompt: `You are a friendly and helpful AI assistant for LingoSphere, an online English tutoring platform.
    Your goal is to answer user questions accurately and concisely based on the provided context.
    If the user's question is outside of the provided context, politely state that you cannot answer it and suggest they use the contact form for more specific inquiries.

    Keep your answers brief and to the point.

    CONTEXT:
    ---
    Frequently Asked Questions (FAQ):
    ${TUTOR_FAQ}
    ---
    Available Courses:
    ${JSON.stringify(AI_TUTOR_COURSES_CONTEXT, null, 2)}
    ---

    User's Question: {{{input}}}
    `,
});

const tutorAssistantFlow = ai.defineFlow(
  {
    name: 'tutorAssistantFlow',
    inputSchema: z.string(),
    outputSchema: z.string(),
  },
  async (input) => {
    const { output } = await tutorAssistantPrompt(input);
    return output!;
  }
);


export async function getAiTutorResponse(query: string): Promise<string> {
    return tutorAssistantFlow(query);
}
