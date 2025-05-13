import { createBeyondSDK, ApiError } from "../src/index";

// Initialize the SDK with configuration
const sdk = createBeyondSDK({
  apiKey: "your-api-key",
  baseUrl: "https://api.bey.dev",
  timeout: 30000,
  logger: {
    debug: (msg, data) => console.debug(`[DEBUG] ${msg}`, data),
    info: (msg, data) => console.info(`[INFO] ${msg}`, data),
    warn: (msg, data) => console.warn(`[WARN] ${msg}`, data),
    error: (msg, data) => console.error(`[ERROR] ${msg}`, data),
  },
});

// Example: List avatars
async function listAvatars() {
  try {
    const avatars = await sdk.avatars.list();
    console.log("Available avatars:", avatars);
    return avatars;
  } catch (error) {
    if (error instanceof ApiError) {
      console.error(`API Error (${error.statusCode}): ${error.message}`);
    } else {
      console.error("Unexpected error:", error);
    }
    throw error;
  }
}

// Example: Create a session
async function createSession(avatarId: string) {
  try {
    const session = await sdk.sessions.create({
      avatar_id: avatarId,
      livekit_url: "wss://your-domain.livekit.cloud",
      livekit_token: "your-livekit-token",
    });
    console.log("Created session:", session);
    return session;
  } catch (error) {
    if (error instanceof ApiError) {
      console.error(`API Error (${error.statusCode}): ${error.message}`);
    } else {
      console.error("Unexpected error:", error);
    }
    throw error;
  }
}

// Example: Get session by ID
async function getSession(sessionId: string) {
  try {
    const session = await sdk.sessions.get(sessionId);
    console.log("Session details:", session);
    return session;
  } catch (error) {
    if (error instanceof ApiError) {
      console.error(`API Error (${error.statusCode}): ${error.message}`);
    } else {
      console.error("Unexpected error:", error);
    }
    throw error;
  }
}

// Example: List all sessions
async function listSessions() {
  try {
    const sessions = await sdk.sessions.list();
    console.log("All sessions:", sessions);
    return sessions;
  } catch (error) {
    if (error instanceof ApiError) {
      console.error(`API Error (${error.statusCode}): ${error.message}`);
    } else {
      console.error("Unexpected error:", error);
    }
    throw error;
  }
}

// Example: Update API key
function updateApiKey() {
  const newSdk = sdk.setApiKey("new-api-key");
  console.log("API key updated, new SDK instance created");
  return newSdk;
}

// Example workflow
async function runExample() {
  try {
    // List available avatars
    const avatars = await listAvatars();

    if (avatars.length > 0) {
      // Create a session with the first avatar
      const session = await createSession(avatars[0].id);

      // Get session details
      await getSession(session.id);

      // List all sessions
      await listSessions();
    }

    // Update API key (creates new SDK instance)
    const newSdk = updateApiKey();
  } catch (error) {
    console.error("Example workflow failed:", error);
  }
}

// Run the example
runExample().then(() => console.log("Example completed"));
