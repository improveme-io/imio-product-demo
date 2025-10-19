export /**
 * Get the base URL for redirects, etc. based on the Vercel deployment environment.
 *
 * @returns {string}
 */
const getBaseURL = (): string => {
  if (process.env.NODE_ENV === "production") {
    return "https://improveme.io";
  }

  return "http://localhost:1337";
};

/**
 * Ensures a value is not null or undefined.
 * If it is, throws an Error with the provided message.
 *
 * @example
 * const user = assertDefined(await getUser(), "User not found");
 * // user is now strongly typed: User (not User | null | undefined)
 */
export function assertDefined<T>(
  value: T | null | undefined,
  message: string,
): T {
  if (value === null || value === undefined) {
    throw new Error(message);
  }
  return value;
}
