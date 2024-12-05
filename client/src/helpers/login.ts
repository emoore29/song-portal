import { SpotifyUser } from "../types/spotify/types";
import { storeDataInLocalStorage, storeSpotifyTokens } from "./localStorage";
import { showSuccessNotif } from "./notifs";
import { fetchUserData } from "./fetchers/spotify/spotifyFetchers";

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

export async function handleSpotifyLogin(
  setSpfyUser: React.Dispatch<React.SetStateAction<SpotifyUser | null>>
): Promise<void> {
  const { accessToken, refreshToken, expiresIn } = getSpotifyTokens();

  if (accessToken && refreshToken && expiresIn) {
    storeSpotifyTokens(accessToken, refreshToken, expiresIn);
    window.location.hash = "";

    // Fetch and store user's data
    const user: SpotifyUser | null = await fetchUserData();
    if (user) {
      storeDataInLocalStorage("spfy_user", user);
      setSpfyUser(user);
      showSuccessNotif("Success", "Connected with your Spotify account");
    }
  }
}
