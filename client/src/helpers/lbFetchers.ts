import { TokenResponse } from "../types/lb/types";
import { showErrorNotif } from "./notifs";

export async function getListens(token: string, username: string) {
  try {
    const res = await fetch(
      `https://api.listenbrainz.org/1/user/${username}/listens`,
      {
        method: "GET",
        headers: {
          // Authorization is not required for listen reqs
          // But reqs with auth headers are given relaxed rate limits
          Authorization: `Token ${token}`,
        },
      }
    );

    if (!res.ok) {
      throw new Error(`HTTP error. status ${res.status}`);
    }

    const data = await res.json();
    console.log(data);
  } catch (error) {
    showErrorNotif("Error", "Error getting listens");
  }
}

export async function checkTokenValid(
  token: string,
  username: string
): Promise<boolean | null> {
  try {
    const res = await fetch(`https://api.listenbrainz.org/1/validate-token`, {
      method: "GET",
      headers: {
        Authorization: `Token ${token}`,
      },
    });

    if (!res.ok) {
      throw new Error(`HTTP error. status ${res.status}`);
    }
    const data = await res.json();

    return data.valid && data.user_name == username;
  } catch (error) {
    showErrorNotif("Error", "Error verifying token");
    return null;
  }
}
