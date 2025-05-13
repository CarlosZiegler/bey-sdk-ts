/**
 * Configuration for the SDK
 */
type Config = {
  apiKey: string;
  baseUrl?: string;
  timeout?: number;
  logger?: {
    debug?: (message: string, ...args: any[]) => void;
    info?: (message: string, ...args: any[]) => void;
    warn?: (message: string, ...args: any[]) => void;
    error?: (message: string, ...args: any[]) => void;
  };
  fetch?: typeof fetch;
};

/**
 * Avatar returned by the API
 */
type Avatar = {
  id: string;
  name: string;
};

/**
 * Session returned by the API
 */
type Session = {
  id: string;
  created_at: string;
  status: string;
  avatar_id: string;
  livekit_url: string;
  livekit_token: string;
};

/**
 * Create session request parameters
 */
type CreateSessionRequest = {
  avatar_id: string;
  livekit_url: string;
  livekit_token: string;
};

export { Config, Avatar, CreateSessionRequest, Session };
