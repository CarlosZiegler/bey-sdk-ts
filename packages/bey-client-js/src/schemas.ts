import { z } from "zod";

/**
 * Define the Zod schemas for our entities
 */
export const schemas = {
  // Avatar schema
  avatar: z.object({
    id: z.string().describe("Unique identifier for the avatar"),
    name: z.string().describe("Name of the avatar"),
  }),

  // Session schema
  session: z.object({
    id: z.string().describe("Unique identifier for the session"),
    created_at: z
      .string()
      .datetime()
      .describe("Timestamp when the session was created"),
    status: z.string().describe("Current status of the session"),
    avatar_id: z.string().describe("ID of the avatar used in this session"),
    livekit_url: z.string().describe("LiveKit URL for the WebRTC session"),
    livekit_token: z.string().describe("LiveKit token for authentication"),
  }),

  // Create session request
  createSessionRequest: z.object({
    avatar_id: z.string().describe("ID of the avatar to use for this session"),
    livekit_url: z.string().describe("LiveKit URL for the WebRTC room"),
    livekit_token: z.string().describe("LiveKit token for room authentication"),
  }),
};
