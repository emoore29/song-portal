import { storeSpotifyTokens } from "./localStorage";
import { showErrorNotif } from "./notifs";

// Returns true if token is invalid
export function checkTokenValidity(): boolean {
  const storedAccessToken: string | null =
    localStorage.getItem("spfy_access_token");
  const storedExpiry: string | null = localStorage.getItem("spfy_token_expiry");
  if (
    !storedAccessToken ||
    storedAccessToken === "undefined" ||
    !storedExpiry ||
    storedExpiry === "undefined" ||
    storedExpiry === "NaN"
  ) {
    console.warn("No tokens found, please log in.");
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
          storeSpotifyTokens(accessToken, newRefreshToken, expiresIn);
        }
      }
    })();
  }
  return tokenPromise;
}

// Fetches new tokens from backend /refresh_token API endpoint
export async function getNewTokens(): Promise<string[] | null> {
  // Sends request to backend for new access token
  const refreshToken: string | null =
    localStorage.getItem("spfy_refresh_token");
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

    if (!res.ok) {
      throw new Error(`HTTP error. status ${res.status}`);
    }

    const {
      access_token: accessToken,
      refresh_token: newRefreshToken,
      expires_in: expiresIn,
    } = data;

    return [accessToken, newRefreshToken, expiresIn];
  } catch (error) {
    showErrorNotif("Network error", "See console for details.");
    console.error("Login error:", error);
    return null;
  }
}
