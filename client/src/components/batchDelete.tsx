import { useState } from "react";
import { showErrorNotif } from "../helpers/notifs";
import { Listen } from "../types/lb/types";
import { deleteListens, fetchHistory } from "../helpers/lbFetchers";

export default function BatchDelete() {
  const [dataToDelete, setDataToDelete] = useState<Listen[] | null>(null);

  async function getListens() {
    const listens: Listen[] | null = await fetchHistory(0);

    if (listens) {
      console.log(listens);
      setDataToDelete(listens);
    }
  }

  async function batchDelete(trackName: string, artistName: string) {
    const lbUn: string | null = localStorage.getItem("lb_user");
    const lbTkn: string | null = localStorage.getItem("lb_token");
    if (!lbUn || !lbTkn) {
      showErrorNotif("Error", "Error getting LB auth. Try logging in again.");
      return;
    }

    if (!dataToDelete) return;

    console.log(
      `Filtering data for track name ${trackName} and artist name ${artistName}`
    );

    console.log("data to filter", dataToDelete);

    const df = dataToDelete.filter(
      (listen) =>
        listen.track_metadata.track_name === trackName &&
        listen.track_metadata.artist_name === artistName
    );

    const batch = [];

    for (const dfListen of df) {
      console.log("Adding df listen to batch");
      batch.push({
        listened_at: dfListen.listened_at,
        recording_msid: dfListen.recording_msid,
      });
    }

    console.log(batch);

    const result = await deleteListens(lbTkn, batch);
    console.log("result", result);
  }

  return (
    <>
      <button onClick={getListens}>Fetch LB listen history</button>
      <button onClick={() => batchDelete("DanielFenner", "Overwatch 2")}>
        Delete Daniel Fenner "listens"
      </button>
    </>
  );
}
