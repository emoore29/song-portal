import { storeTokens } from "./localStorage";
import { showErrorNotif } from "./notifs";

// Returns true if token is invalid
export function checkTokenValidity(): boolean {
  const storedAccessToken: string | null = localStorage.getItem("access_token");
  const storedExpiry: string | null = localStorage.getItem("token_expiry");
  if (
    !storedAccessToken ||
    storedAccessToken === "undefined" ||
    !storedExpiry ||
    storedExpiry === "undefined" ||
    storedExpiry === "NaN"
  ) {
    // Either user has not logged in, or there is an error
    showErrorNotif(
      "Error",
      "Couldn't find stored access token or expiry. Please log in again."
    );
  }

  const now = Date.now();
  const expiryTime = parseInt(storedExpiry!, 10);
  return now > expiryTime - 3000;
}

// Create Singleton promise
// Never more than one instance of tokenPromise
// Multiple calls of handleTokens will not create multiple API calls
let tokenPromise: Promise<void> | null = null;

// If the current access token has expired, fetches and stores new tokens
export async function handleTokens(): Promise<void> {
  if (!tokenPromise) {
    tokenPromise = (async () => {
      const isTokenInvalid = checkTokenValidity();
      if (isTokenInvalid) {
        const tokens: string[] | null = await getNewTokens();
        if (tokens) {
          const [accessToken, newRefreshToken, expiresIn] = tokens;
          storeTokens(accessToken, newRefreshToken, expiresIn);
        }
      }
    })();
  }
  return tokenPromise;
}

// Fetches new tokens from backend /refresh_token API endpoint
export async function getNewTokens(): Promise<string[] | null> {
  // Sends request to backend for new access token
  const refreshToken: string | null = localStorage.getItem("refresh_token");
  if (!refreshToken) {
    showErrorNotif("", "Your session has expired. Please log in again.");
    return null;
  }

  try {
    const res = await fetch(
      `http://localhost:3000/refresh_token?refresh_token=${encodeURIComponent(
        refreshToken
      )}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    );

    const data = await res.json();

    const {
      access_token: accessToken,
      refresh_token: newRefreshToken,
      expires_in: expiresIn,
    } = data;

    return [accessToken, newRefreshToken, expiresIn];
  } catch (error) {
    console.error("Something went wrong continuing login:", error);
    return null;
  }
}
