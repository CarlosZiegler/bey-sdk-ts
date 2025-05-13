# Rslib project

## Setup

Install the dependencies:

```bash
pnpm install
```

## Get started

Build the library:

```bash
pnpm build
```

Build the library in watch mode:

```bash
pnpm dev
```

# Beyond Presence SDK

A TypeScript SDK for the Beyond Presence API with schema validation and type safety.

## Installation

```bash
npm install beyond-sdk
```

## Setup

Import the SDK and create a client:

```typescript
import { createBeyondSDK } from "beyond-sdk";

const sdk = createBeyondSDK({
  apiKey: "your-api-key",
});
```

## Usage

### Working with Avatars

List all available avatars:

```typescript
const avatars = await sdk.avatars.list();
```

### Managing Sessions

Create a new session with an avatar:

```typescript
const session = await sdk.sessions.create({
  avatar_id: "avatar-id",
  livekit_url: "wss://<your-domain>.livekit.cloud",
  livekit_token: "<your-livekit-token>",
});
```

List all sessions:

```typescript
const sessions = await sdk.sessions.list();
```

Get a specific session by ID:

```typescript
const session = await sdk.sessions.get("session-uuid");
```

## Configuration Options

The SDK accepts the following configuration options:

```typescript
const sdk = createBeyondSDK({
  apiKey: "your-api-key", // Required: API key for authentication
  baseUrl: "https://api.bey.dev", // Optional: Custom API base URL
  timeout: 30000, // Optional: Request timeout in milliseconds
  logger: {
    // Optional: Logger for debugging
    debug: (msg, ...args) => console.debug(msg, ...args),
    info: (msg, ...args) => console.info(msg, ...args),
    warn: (msg, ...args) => console.warn(msg, ...args),
    error: (msg, ...args) => console.error(msg, ...args),
  },
  fetch: customFetch, // Optional: Custom fetch implementation
});
```

## Error Handling

The SDK throws typed `ApiError` instances for any API errors:

```typescript
try {
  const session = await sdk.sessions.get("invalid-id");
} catch (error) {
  if (error instanceof ApiError) {
    console.error(`API Error (${error.statusCode}): ${error.message}`);

    // Additional error details available in responseBody
    if (error.responseBody) {
      console.error("Response body:", error.responseBody);
    }
  } else {
    console.error("Unexpected error:", error);
  }
}
```

## Updating API Key

You can update the API key by creating a new SDK instance:

```typescript
const newSdk = sdk.setApiKey("new-api-key");
```

## Features

- 🔒 Automatic authentication with API key headers
- 🧩 Strong schema validation for requests and responses using Zod
- 📑 Built-in OpenAPI specification support
- 🔄 Smart retry with exponential backoff
- ⏱️ Request timeout handling
- 📊 Comprehensive logging with @better-fetch/logger
- 💪 Full TypeScript support with accurate types

## Schema Validation

The SDK leverages Zod to validate both request and response data:

```typescript
// Request validation ensures all required fields are present
try {
  await sdk.sessions.create({
    // Required fields with validation
    avatar_id: "invalid-id", // Must be a valid UUID
    livekit_url: "wss://example.livekit.cloud", // Must be a string
    livekit_token: "token123", // Must be a string
  });
} catch (error) {
  console.error("Validation failed:", error);
}

// Response validation ensures API responses match expected schema
const avatars = await sdk.avatars.list();
// Each avatar is guaranteed to have id and name properties
```

## License

MIT
