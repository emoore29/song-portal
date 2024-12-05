import { DeleteListen, HistoryPayload, Listen } from "../../../types/lb/types";
import { showErrorNotif } from "../../notifs";

let username: string | null = null;
let token: string | null = null;

function getCredentials() {
  username = localStorage.getItem("lb_user");
  token = localStorage.getItem("lb_token");
  if (!username || !token) {
    return null;
  }
}

// Delay function to await rate limit reset
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export async function fetchListens(): Promise<HistoryPayload | null> {
  getCredentials();

  if (!username || !token) {
    console.error("Missing username or token");
    return null;
  }

  try {
    const res = await fetch(
      `https://api.listenbrainz.org/1/user/${username}/listens?count=1`,
      {
        method: "GET",
        headers: {
          Authorization: `Token ${token}`, // send token for relaxed rate limits
        },
      }
    );

    if (!res.ok) {
      throw new Error(`HTTP error. status ${res.status}`);
    }

    // const headersObj = Object.fromEntries(res.headers);
    // const reset = headersObj["x-ratelimit-reset-in"];
    // const remaining = headersObj["x-ratelimit-remaining"];

    // console.log("ratelimit resets in", reset);
    // console.log("remaining", remaining);
    const data = await res.json();
    const { payload } = data;
    return payload;
    // console.log(data);
  } catch (error) {
    showErrorNotif("Error", "Error getting listens");
    return null;
  }
}

export async function fetchListenCount(): Promise<number | null> {
  getCredentials();

  if (!username || !token) {
    console.error("Missing username or token");
    return null;
  }

  try {
    const res = await fetch(
      `https://api.listenbrainz.org/1/user/${username}/listen-count`,
      {
        method: "GET",
        headers: {
          Authorization: `Token ${token}`,
        },
      }
    );

    if (!res.ok) {
      throw new Error(`HTTP error. status ${res.status}`);
    }

    const data = await res.json();
    const { payload }: { payload: { count: number } } = data;
    return payload.count;
  } catch (error) {
    showErrorNotif("Error", "Error getting listen count");
    return null;
  }
}

export async function fetchExtendedHistory(
  newestListen: number,
  oldestListen: number
): Promise<Listen[] | null> {
  getCredentials();

  if (!username || !token) {
    console.error("Missing username or token");
    return null;
  }

  let maxTs: number = newestListen; // init to most recent listen
  let listens = [];
  let count = 0;
  let requests = 0;

  while (maxTs != oldestListen) {
    // Get tracks listened before maxTs

    try {
      const res = await fetch(
        `https://api.listenbrainz.org/1/user/${username}/listens?count=1000&max_ts=${maxTs}`,
        {
          method: "GET",
          headers: {
            Authorization: `Token ${token}`,
          },
        }
      );
      requests += 1;

      if (!res.ok) {
        throw new Error(`HTTP error. status ${res.status}`);
      }

      const headersObj = Object.fromEntries(res.headers);
      const remaining = headersObj["x-ratelimit-remaining"];
      const resetIn = headersObj["x-ratelimit-reset"];

      const data = await res.json();
      const { payload }: { payload: HistoryPayload } = data;

      // Update maxTs to last song in result
      maxTs = payload.listens[payload.listens.length - 1].listened_at;
      listens.push(...payload.listens);
      count += payload.listens.length;
      console.log("Listens:", listens);
      console.log(`Fetched ${count} listens so far`);
      console.log(`Number requests: ${requests}`);

      if (Number(remaining) === 0) {
        console.log(`Awaiting rate limit reset in ${Number(resetIn)} seconds`);
        await delay(Number(resetIn) * 1000);
      }
    } catch (error) {
      showErrorNotif("Error", "Error getting listens");
      return null;
    }
  }
  return listens;
}

export async function deleteListens(token: string, batch: DeleteListen[]) {
  getCredentials();

  if (!username || !token) {
    console.error("Missing username or token");
    return null;
  }

  for (const listen of batch) {
    try {
      const res = await fetch(`https://api.listenbrainz.org/1/delete-listen`, {
        method: "POST",
        headers: {
          Authorization: `Token ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(listen),
      });

      if (!res.ok) {
        throw new Error(`HTTP error. status ${res.status}`);
      } else {
        console.log("res ok, deleted track");
      }

      const headersObj = Object.fromEntries(res.headers);
      const remaining = headersObj["x-ratelimit-remaining"];

      if (Number(remaining) < 10) {
        console.log("Awaiting rate limit reset");
        await delay(8000);
      }
    } catch (error) {
      showErrorNotif("Error", "Error deleting data");
    }
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
    showErrorNotif("Error", "Error verifying credentials");
    return null;
  }
}

// Used for a specific batch delete - needs generifying
export async function fetchToTarget(minTs?: number): Promise<Listen[] | null> {
  getCredentials();

  if (!username || !token) {
    console.error("Missing username or token");
    return null;
  }

  let target: string = "DanielFenner";
  let mts: number | undefined = minTs;
  let maxTs: number = 1733246334;
  let listens = [];
  while (target === "DanielFenner") {
    try {
      const res = await fetch(
        `https://api.listenbrainz.org/1/user/${username}/listens?count=1000${
          mts ? `&min_ts=${mts}` : ""
        }&max_ts=${maxTs}`,
        {
          method: "GET",
          headers: {
            Authorization: `Token ${token}`,
          },
        }
      );

      if (!res.ok) {
        throw new Error(`HTTP error. status ${res.status}`);
      }

      const headersObj = Object.fromEntries(res.headers);
      const remaining = headersObj["x-ratelimit-remaining"];

      const data = await res.json();
      const { payload }: { payload: HistoryPayload } = data;

      console.log(
        "last item returned track name",
        payload.listens[payload.listens.length - 1].track_metadata.track_name
      );

      target =
        payload.listens[payload.listens.length - 1].track_metadata.track_name;
      maxTs = payload.listens[payload.listens.length - 1].listened_at;

      console.log("target updated", target);
      console.log("maxTs updated. will only get songs before maxts", maxTs);

      listens.push(...payload.listens);

      if (Number(remaining) < 10) {
        console.log("Awaiting rate limit reset");
        await delay(8000);
      }
    } catch (error) {
      showErrorNotif("Error", "Error getting listens");
      return null;
    }
  }
  return listens;
}
