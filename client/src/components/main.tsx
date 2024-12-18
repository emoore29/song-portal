import { useEffect, useState } from "react";
import {
  fetchExtendedHistory,
  fetchListenCount,
  fetchListens,
} from "../helpers/fetchers/lb/lbFetchers";
import { HistoryPayload, Listen } from "../types/lb/types";
import { SpotifyUser } from "../types/spotify/types";
import Header from "./header";
import { estimateTime } from "../helpers/time";

interface MainProps {
  lbUser: string | null;
  spfyUser: SpotifyUser | null;
  setLbUser: React.Dispatch<React.SetStateAction<string | null>>;
  setSpfyUser: React.Dispatch<React.SetStateAction<SpotifyUser | null>>;
  setGoToMain: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function Main({
  lbUser,
  spfyUser,
  setLbUser,
  setSpfyUser,
  setGoToMain,
}: MainProps) {
  const [extendedHistory, setExtendedHistory] = useState<Listen[]>([]);

  async function getExtendedListenHistory() {
    const history: HistoryPayload | null = await fetchListens();
    if (!history) return;

    const listenCount: number | null = await fetchListenCount();
    if (!listenCount) return;

    const estimatedTime: string = estimateTime(listenCount);

    console.log(
      `Fetching extended listen history will take approximately ${estimatedTime}`
    );

    const newestListen: number = history.latest_listen_ts;
    const oldestListen: number = history.oldest_listen_ts;

    const listens: Listen[] | null = await fetchExtendedHistory(
      newestListen,
      oldestListen
    );

    if (!listens) return;

    setExtendedHistory(listens);
  }

  async function serverTest() {
    try {
      const res = await fetch("http://localhost:3000/server-test");

      if (!res.ok) {
        throw new Error(`HTTP error`);
      }

      const data = await res.json();
      console.log(data);
    } catch (error) {
      console.error("Error with server test");
    }
  }

  return (
    <>
      <Header
        lbUser={lbUser}
        spfyUser={spfyUser}
        setLbUser={setLbUser}
        setSpfyUser={setSpfyUser}
        setGoToMain={setGoToMain}
      />
      {/* <button onClick={getExtendedListenHistory}>
        Fetch extended LB listen history
      </button> */}
      <button onClick={serverTest}>Server test</button>
    </>
  );
}
