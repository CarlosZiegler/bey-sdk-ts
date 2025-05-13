// /api/chat

import { createBeyondSDK } from "bey-client-js";
import { NextResponse } from "next/server";
import {
  AccessToken,
  AccessTokenOptions,
  VideoGrant,
} from "livekit-server-sdk";

// NOTE: you are expected to define the following environment variables in `.env.local`:
const API_KEY = process.env.LIVEKIT_API_KEY;
const API_SECRET = process.env.LIVEKIT_API_SECRET;
const LIVEKIT_URL = process.env.LIVEKIT_URL;

function createParticipantToken(
  userInfo: AccessTokenOptions,
  roomName: string
) {
  const at = new AccessToken(API_KEY, API_SECRET, {
    ...userInfo,
    ttl: "15m",
  });
  const grant: VideoGrant = {
    room: roomName,
    roomJoin: true,
    canPublish: true,
    canPublishData: true,
    canSubscribe: true,
  };
  at.addGrant(grant);
  return at.toJwt();
}

console.log(process.env.BEY_API_KEY);

export async function GET(req: Request) {
  const sdk = createBeyondSDK({
    apiKey: process.env.BEY_API_KEY!,
    baseUrl: "https://api.bey.dev",
    timeout: 30000,
    logger: {
      debug: (msg, data) => console.debug(`[DEBUG] ${msg}`, data),
      info: (msg, data) => console.info(`[INFO] ${msg}`, data),
      warn: (msg, data) => console.warn(`[WARN] ${msg}`, data),
      error: (msg, data) => console.error(`[ERROR] ${msg}`, data),
    },
  });

  const participantIdentity = `voice_assistant_user_${Math.floor(
    Math.random() * 10_000
  )}`;
  const roomName = `voice_assistant_room_${Math.floor(Math.random() * 10_000)}`;

  const at = await createParticipantToken(
    {
      identity: participantIdentity,
    },
    roomName
  );

  const params = {
    avatar_id: "1c7a7291-ee28-4800-8f34-acfbfc2d07c0",
    livekit_url: process.env.LIVEKIT_URL!,
    livekit_token: at,
  };

  console.log("params", { params });

  // Error 422: Unprocessable Entity WHY ?
  // const session = await sdk.sessions.create(params);
  const sessions = await sdk.sessions.list();
  const avatars = await sdk.avatars.list();

  console.log("listSessions", { sessions, avatars });

  return NextResponse.json({ avatars, sessions });
}
