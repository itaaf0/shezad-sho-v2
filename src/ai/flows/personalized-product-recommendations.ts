// src/ai/flows/personalized-product-recommendations.ts
'use server';

/**
 * @fileOverview Provides personalized product recommendations based on user history and trends.
 *
 * - getPersonalizedRecommendations - A function that generates personalized product recommendations.
 * - PersonalizedRecommendationsInput - The input type for the getPersonalizedRecommendations function.
 * - PersonalizedRecommendationsOutput - The return type for the getPersonalizedRecommendations function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const PersonalizedRecommendationsInputSchema = z.object({
  viewingHistory: z.array(z.string()).describe('List of product IDs the user has viewed.'),
  purchaseHistory: z.array(z.string()).describe('List of product IDs the user has purchased.'),
  currentTrends: z.string().describe('Current trending products or categories.'),
  customerInterest: z.string().describe('The customer interest'),
  popularity: z.string().describe('The popularity of the product'),
  inventoryStatus: z.string().describe('The status of the inventory'),
  seasonalSalesData: z.string().describe('Seasonal sales data'),
});
export type PersonalizedRecommendationsInput = z.infer<typeof PersonalizedRecommendationsInputSchema>;

const PersonalizedRecommendationsOutputSchema = z.object({
  recommendedProducts: z.array(z.string()).describe('List of product IDs recommended for the user.'),
});
export type PersonalizedRecommendationsOutput = z.infer<typeof PersonalizedRecommendationsOutputSchema>;

export async function getPersonalizedRecommendations(input: PersonalizedRecommendationsInput): Promise<PersonalizedRecommendationsOutput> {
  return personalizedRecommendationsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'personalizedRecommendationsPrompt',
  input: {schema: PersonalizedRecommendationsInputSchema},
  output: {schema: PersonalizedRecommendationsOutputSchema},
  prompt: `You are an expert e-commerce product recommendation engine.

  Based on the user's viewing history, purchase history, current trends, customer interest, popularity, inventory status and seasonal sales data, recommend a list of product IDs that the user might be interested in.

  Viewing History: {{{viewingHistory}}}
  Purchase History: {{{purchaseHistory}}}
  Current Trends: {{{currentTrends}}}
  Customer Interest: {{{customerInterest}}}
  Popularity: {{{popularity}}}
  Inventory Status: {{{inventoryStatus}}}
  Seasonal Sales Data: {{{seasonalSalesData}}}

  Recommended Products:`,
});

const personalizedRecommendationsFlow = ai.defineFlow(
  {
    name: 'personalizedRecommendationsFlow',
    inputSchema: PersonalizedRecommendationsInputSchema,
    outputSchema: PersonalizedRecommendationsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
