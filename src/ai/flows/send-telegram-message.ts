
'use server';

/**
 * @fileOverview Sends a Telegram message with new order details.
 *
 * - sendTelegramOrderMessage - A function that sends a formatted message to a Telegram chat.
 * - OrderNotificationInput - The input type for the sendTelegramOrderMessage function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';

const ProductSchema = z.object({
    id: z.string(),
    name: z.string(),
    price: z.number(),
    quantity: z.number(),
    imageUrl: z.string().url(),
    size: z.string().optional(),
    colorName: z.string().optional(),
});

const ShippingInfoSchema = z.object({
    name: z.string(),
    address: z.string(),
    city: z.string(),
    zip: z.string(),
    email: z.string(),
    paymentMethod: z.string(),
});

const OrderNotificationInputSchema = z.object({
  orderId: z.string().describe('The unique ID of the order.'),
  customerDetails: ShippingInfoSchema.describe('The customer\'s shipping and contact information.'),
  productDetails: z.array(ProductSchema).describe('A list of products in the order.'),
  total: z.number().describe('The total amount of the order.'),
});
export type OrderNotificationInput = z.infer<typeof OrderNotificationInputSchema>;

export async function sendTelegramOrderMessage(input: OrderNotificationInput): Promise<void> {
  await sendTelegramMessageFlow(input);
}

const sendTelegramMessageFlow = ai.defineFlow(
  {
    name: 'sendTelegramMessageFlow',
    inputSchema: OrderNotificationInputSchema,
    outputSchema: z.void(),
  },
  async (input) => {
    const botToken = process.env.TELEGRAM_BOT_TOKEN;
    const chatId = process.env.TELEGRAM_CHAT_ID;

    if (!botToken || !chatId) {
      console.error('Telegram bot token or chat ID is not configured.');
      return;
    }

    const { orderId, customerDetails, productDetails, total } = input;

    const formatPrice = (price: number) => {
        return price.toLocaleString('en-US', {
            minimumFractionDigits: 0,
            maximumFractionDigits: 2,
        });
    }
    
    // Main message with all details
    let messageText = `*🎉 New Order Received! 🎉*\n\n`;
    messageText += `*Order ID:* \`${orderId}\`\n\n`;
    
    messageText += `*Customer Details:*\n`;
    messageText += `  - *Name:* ${customerDetails.name}\n`;
    messageText += `  - *Email:* ${customerDetails.email}\n`;
    messageText += `  - *Address:* ${customerDetails.address}, ${customerDetails.city}, ${customerDetails.zip}\n`;
    messageText += `  - *Payment:* ${customerDetails.paymentMethod === 'cod' ? 'Cash on Delivery' : 'Online Payment'}\n\n`;

    messageText += `*Order Items:*\n`;
    productDetails.forEach(product => {
        messageText += `  - *${product.name}*`;
        if (product.colorName) {
            messageText += ` (${product.colorName})`;
        }
        if (product.size) {
            messageText += ` (Size: ${product.size})`;
        }
        messageText += `\n    _Qty: ${product.quantity} x ${formatPrice(product.price)} BDT_\n`;
    });

    messageText += `\n*Total Amount:* *${formatPrice(total)} BDT*`;

    const messageUrl = `https://api.telegram.org/bot${botToken}/sendMessage`;
    try {
      const response = await fetch(messageUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: chatId,
          text: messageText,
          parse_mode: 'Markdown',
        }),
      });
      const result = await response.json();
      if (!result.ok) {
        console.error('Failed to send Telegram message:', result.description);
      }
    } catch (error) {
      console.error('Error sending Telegram message:', error);
    }
    
    // Optionally send a photo of the first product for a quick visual
    if (productDetails.length > 0) {
        const firstProduct = productDetails[0];
        const photoUrl = `https://api.telegram.org/bot${botToken}/sendPhoto`;
        try {
            await fetch(photoUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    chat_id: chatId,
                    photo: firstProduct.imageUrl,
                    caption: `Primary item: *${firstProduct.name}*`,
                    parse_mode: 'Markdown',
                }),
            });
        } catch (error) {
            console.error('Error sending Telegram photo:', error);
        }
    }
  }
);
