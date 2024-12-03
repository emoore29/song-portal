import { User } from "../types/spotify/types";
import { getItemFromLocalStorage } from "./localStorage";
import { showErrorNotif } from "./notifs";

// Fetches user data, returns User or null on failure
export async function fetchUserData(): Promise<User | null> {
  const accessToken: string | null = getItemFromLocalStorage("access_token");
  if (!accessToken) return null;
  try {
    const res = await fetch("https://api.spotify.com/v1/me", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (!res.ok) {
      throw new Error(`HTTP error. status ${res.status}`);
    }

    const data = await res.json();
    console.log(data);

    return data;
  } catch (error) {
    showErrorNotif("Error", "There was an error fetching your user data.");
    return null;
  }
}
