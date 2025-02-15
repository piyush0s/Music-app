"use server"


import { Card } from '@/components/ui/card';
import { clerkClient } from '@clerk/nextjs/server';
import { z } from 'zod';  // Corrected import for zod

// Define an interface for storing card details
interface CardDetails {
  cardno: string;
  expiry: string;
  cvv: number;
}

interface Password {
  website: string,
  username: string,
  password: string
}
export async function addCardServer(cardno: string, expiry: string, cvv: number, userId: string) {
  const client = await clerkClient();
  const user = await client.users.getUser(userId);

  // Initialize Card as an empty array if it doesn't exist
  let cards: CardDetails[] = Array.isArray(user.privateMetadata.cards) ? user.privateMetadata.cards : [];

  // Push the new card details
  cards.push({ cardno, expiry, cvv });

  // Update the user's private metadata
  await client.users.updateUserMetadata(userId, {
    privateMetadata: {
      cards: cards, // Ensure the key matches what you are checking
    },
  })
}


export async function addPasswordServer(website: string, username: string, password: string, userId: string) {
  const client = await clerkClient();
  const user = await client.users.getUser(userId);

  // Initialize passwords array if it doesn't exist
  let passwords: { website: string; username: string; password: string }[] =
    Array.isArray(user.privateMetadata.passwords) ? user.privateMetadata.passwords : [];

  // Add new password details
  passwords.push({ website, username, password });

  // Update user's private metadata
  await client.users.updateUserMetadata(userId, {
    privateMetadata: {
      passwords: passwords, // Use correct key
    },
  });
}
