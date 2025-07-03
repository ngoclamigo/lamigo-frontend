/**
 * Error thrown when a request times out
 */
export class TimeoutError extends Error {
  constructor(timeout: number) {
    super(`Request timed out after ${timeout}ms`);
    this.name = "TimeoutError";
  }
}

/**
 * Error thrown when the API returns an error
 */
export class ApiError extends Error {
  status: number;
  data: unknown;

  constructor(status: number, message: string, data?: unknown) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.data = data;
  }
}

/**
 * Options for fetch requests
 */
export interface FetchOptions extends RequestInit {
  timeout?: number;
  baseUrl?: string;
}

/**
 * Default options for fetch requests
 */
const defaultOptions: FetchOptions = {
  timeout: 5000, // 10 seconds
  headers: {
    "Content-Type": "application/json",
  },
};

/**
 * Fetches data with timeout and error handling
 */
export async function fetchWithTimeout<T>(url: string, options: FetchOptions = {}): Promise<T> {
  const { timeout, baseUrl, ...fetchOptions } = { ...defaultOptions, ...options };
  const fullUrl = baseUrl ? `${baseUrl}${url}` : url;

  // Create abort controller for timeout
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);

  try {
    const response = await fetch(fullUrl, {
      ...fetchOptions,
      signal: controller.signal,
    });

    // Clear timeout
    clearTimeout(timeoutId);

    // Handle HTTP errors
    if (!response.ok) {
      let errorData;
      try {
        errorData = await response.json();
      } catch {
        // If JSON parsing fails, use text
        errorData = await response.text();
      }

      throw new ApiError(response.status, `API error: ${response.statusText}`, errorData);
    }

    // Parse JSON response
    return (await response.json()) as T;
  } catch (error) {
    // Clear timeout to prevent memory leaks
    clearTimeout(timeoutId);

    // Handle abort error (timeout)
    if (error instanceof DOMException && error.name === "AbortError") {
      throw new TimeoutError(timeout!);
    }

    // Re-throw other errors
    throw error;
  }
}

/**
 * API client builder
 */
export function createApiClient(baseUrl: string) {
  return {
    /**
     * GET request
     */
    get<T>(url: string, options?: Omit<FetchOptions, "method" | "body">) {
      return fetchData<T>("GET", url, undefined, { ...options, baseUrl });
    },

    /**
     * POST request
     */
    post<T, D = unknown>(url: string, data: D, options?: Omit<FetchOptions, "method">) {
      return fetchData<T>("POST", url, data, { ...options, baseUrl });
    },

    /**
     * PUT request
     */
    put<T, D = unknown>(url: string, data: D, options?: Omit<FetchOptions, "method">) {
      return fetchData<T>("PUT", url, data, { ...options, baseUrl });
    },

    /**
     * DELETE request
     */
    delete<T>(url: string, options?: Omit<FetchOptions, "method" | "body">) {
      return fetchData<T>("DELETE", url, undefined, { ...options, baseUrl });
    },

    /**
     * PATCH request
     */
    patch<T, D = unknown>(url: string, data: D, options?: Omit<FetchOptions, "method">) {
      return fetchData<T>("PATCH", url, data, { ...options, baseUrl });
    },
  };
}

/**
 * Generic fetch function
 */
async function fetchData<T>(
  method: string,
  url: string,
  data?: unknown,
  options: FetchOptions = {}
): Promise<T> {
  const fetchOptions: FetchOptions = {
    ...options,
    method,
  };

  // Add body if data is provided
  if (data !== undefined) {
    fetchOptions.body = JSON.stringify(data);
  }

  return await fetchWithTimeout<T>(url, fetchOptions);
}
