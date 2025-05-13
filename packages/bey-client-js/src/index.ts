import { Avatar, Config, CreateSessionRequest, Session } from "./types";
import { createAvatarApi, createSessionApi } from "./client";
import { createApiClient } from "./client";

/**
 * Create Beyond Presence SDK client
 *
 * @example
 * ```typescript
 * const sdk = createBeyondSDK({
 *   apiKey: "your-api-key",
 *   logger: console
 * });
 *
 * // List avatars
 * const avatars = await sdk.avatars.list();
 *
 * // Create a session
 * const session = await sdk.sessions.create({
 *   avatar_id: "uuid",
 *   livekit_url: "wss://<your-domain>.livekit.cloud",
 *   livekit_token: "<your-livekit-token>"
 * });
 * ```
 */
export function createBeyondSDK(config: Config) {
  // Create the API client
  const apiClient = createApiClient(config);

  // Create domain-specific APIs
  const avatars = createAvatarApi(apiClient);
  const sessions = createSessionApi(apiClient);

  // Return the SDK object
  return {
    // API resources
    avatars,
    sessions,
    // Core client functions
    setApiKey: apiClient.setApiKey,
  };
}

export { ApiError } from "./client";
