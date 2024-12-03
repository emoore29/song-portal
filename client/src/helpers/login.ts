import { User } from "../types/spotify/types";
import { storeDataInLocalStorage, storeSpotifyTokens } from "./localStorage";
import { fetchUserData } from "./spotifyFetchers";

interface SpotifyTokens {
  accessToken: string | null;
  refreshToken: string | null;
  expiresIn: string | null;
}

function getSpotifyTokens(): SpotifyTokens {
  const hash = window.location.hash;
  const accessToken: string | null = new URLSearchParams(
    hash.replace("#", "?")
  ).get("access_token");
  const refreshToken: string | null = new URLSearchParams(
    hash.replace("#", "?")
  ).get("refresh_token");
  const expiresIn: string | null = new URLSearchParams(
    hash.replace("#", "?")
  ).get("expires_in");

  return { accessToken, refreshToken, expiresIn };
}

export function spotifyLoginOccurred(): boolean {
  const { accessToken, refreshToken, expiresIn } = getSpotifyTokens();
  return accessToken !== null && refreshToken !== null && expiresIn !== null;
}

export async function handleSpotifyLogin(): Promise<void> {
  const { accessToken, refreshToken, expiresIn } = getSpotifyTokens();

  if (accessToken && refreshToken && expiresIn) {
    storeSpotifyTokens(accessToken, refreshToken, expiresIn);
    window.location.hash = "";

    // Fetch and store user's data
    const user: User | null = await fetchUserData();
    if (user) {
      storeDataInLocalStorage("user_data", user);
      // setUser(user);
    }
  }
}
