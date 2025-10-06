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
