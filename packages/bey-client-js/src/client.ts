import { createFetch, createSchema } from "@better-fetch/fetch";
import { logger as betterLogger } from "@better-fetch/logger";
import { z } from "zod";
import { schemas } from "./schemas";
import { Avatar, Config, CreateSessionRequest, Session } from "./types";
import { DEFAULT_BASE_URL, DEFAULT_TIMEOUT } from "./config";

/**
 * Create API schemas for validation
 */
function createApiSchemas() {
  return createSchema(
    {
      // Avatar endpoints
      "/v1/avatar": {
        output: z.array(schemas.avatar),
      },

      // Session list endpoint (GET)
      "/v1/session": {
        // GET response
        output: z.array(schemas.session),
      },

      // Session create endpoint (POST)
      "@post/v1/session": {
        // POST request
        input: schemas.createSessionRequest,
        // POST response
        output: schemas.session,
      },

      // Session by ID endpoint (GET)
      "/v1/session/:sessionId": {
        output: schemas.session,
      },
    },
    {
      // Enabling strict mode ensures only defined routes can be used
      strict: true,
    }
  );
}

/**
 * Create an API client for the Beyond Presence API
 */
export function createApiClient(config: Config) {
  // Validate config
  const {
    apiKey,
    baseUrl = DEFAULT_BASE_URL,
    timeout = DEFAULT_TIMEOUT,
    logger,
    fetch: customFetch,
  } = config;

  // Set up plugins array
  const plugins = [];

  // Add logger plugin if debugging is enabled
  if (logger) {
    plugins.push(
      betterLogger({
        enabled: true,
        verbose: true,
        // Use custom logger if provided
        console: {
          log: (...args: unknown[]) => {
            const message = String(args[0]);
            const rest = args.slice(1);
            logger.debug?.(message, rest.length ? rest : undefined);
          },
          error: (...args: unknown[]) => {
            const message = String(args[0]);
            const rest = args.slice(1);
            logger.error?.(message, rest.length ? rest : undefined);
          },
          warn: (...args: unknown[]) => {
            const message = String(args[0]);
            const rest = args.slice(1);
            logger.warn?.(message, rest.length ? rest : undefined);
          },
        },
      })
    );
  }

  // Create API schemas
  const apiSchema = createApiSchemas();

  // Create better-fetch instance with configuration
  const fetchClient = createFetch({
    baseURL: baseUrl,
    timeout,
    headers: {
      "Content-Type": "application/json",
      "x-api-key": apiKey, // API key is required for all requests
    },
    // Add retry with exponential backoff
    retry: {
      type: "exponential",
      attempts: 3,
      baseDelay: 1000,
      maxDelay: 10000,
      // Only retry on network errors or 5xx server errors
      shouldRetry: (response) => {
        if (!response) return true; // Network error
        return response.status >= 500; // Server error
      },
    },
    // Inject custom fetch implementation if provided
    fetch: customFetch,
    // Add plugins
    plugins,
    // Add schema validation
    schema: apiSchema,
    // Transform errors to our ApiError format
    errorHandler: (error: any) => {
      if (error.response) {
        let message = `API request failed with status ${error.response.status}`;
        let responseBody = error.data;

        // Try to extract a more meaningful message if available
        if (error.data && typeof error.data === "object") {
          if (error.data.message) {
            message = error.data.message;
          } else if (error.data.error) {
            message = error.data.error;
          }
        }

        return new ApiError(message, error.response.status, responseBody);
      }

      if (error.message?.includes("timeout")) {
        return new ApiError("Request timeout", 408);
      }

      return new ApiError(
        `Request failed: ${error.message || "Unknown error"}`,
        500
      );
    },
  });

  /**
   * Update the API key used for authentication
   */
  const setApiKey = (newApiKey: string) => {
    // Create a new client with updated API key
    return createApiClient({
      ...config,
      apiKey: newApiKey,
    });
  };

  // Return the client API
  return {
    setApiKey,
    fetch: fetchClient,
  };
}

/**
 * API Error class
 */
export class ApiError extends Error {
  statusCode: number;
  responseBody?: any;

  constructor(message: string, statusCode: number, responseBody?: any) {
    super(message);
    this.name = "ApiError";
    this.statusCode = statusCode;
    this.responseBody = responseBody;
  }
}

/**
 * Create session API functions
 */
export function createSessionApi(client: ReturnType<typeof createApiClient>) {
  /**
   * Create a new real-time session
   *
   * POST /v1/session
   *
   * @param params - Session creation parameters with avatar_id, livekit_url, and livekit_token
   * @returns Promise resolving to the created Session
   */
  const create = async (params: CreateSessionRequest): Promise<Session> => {
    // Body will be validated against the schema automatically
    const { data, error } = await client.fetch("@post/v1/session", {
      method: "POST",
      body: params,
    });

    console.log("create", { data, error });

    if (error) throw error;
    return data;
  };

  /**
   * List all sessions associated with the API key
   *
   * GET /v1/session
   *
   * @returns Promise resolving to an array of Sessions
   */
  const list = async (): Promise<Session[]> => {
    const { data, error } = await client.fetch("/v1/session");

    if (error) throw error;
    return data as Session[];
  };

  /**
   * Get details of a specific session by ID
   *
   * GET /v1/session/{session_id}
   *
   * @param sessionId - The unique identifier of the session
   * @returns Promise resolving to a Session
   */
  const get = async (sessionId: string): Promise<Session> => {
    const { data, error } = await client.fetch("/v1/session/:sessionId", {
      params: { sessionId },
    });

    if (error) throw error;
    return data;
  };

  return {
    create,
    list,
    get,
  };
}

/**
 * Create avatar API functions
 */
export function createAvatarApi(client: ReturnType<typeof createApiClient>) {
  /**
   * List all avatars accessible with the provided API key
   *
   * GET /v1/avatar
   *
   * @returns Promise resolving to an array of avatars
   */
  const list = async (): Promise<Avatar[]> => {
    // Using fetch-schema, validation happens automatically
    const { data, error } = await client.fetch("/v1/avatar");

    if (error) throw error;
    return data;
  };

  return {
    list,
  };
}
