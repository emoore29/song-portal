import { useState } from "react";
import { deleteListens, fetchToTarget } from "../helpers/lbFetchers";
import { showErrorNotif } from "../helpers/notifs";
import { Listen } from "../types/lb/types";

// Created to remove unwanted "listens" that were recorded by LB android app unintentionally linked to Twitch
// TODO: Allow input of track name and artist name user wants to batch delete

export default function BatchDelete() {
  const [dataToDelete, setDataToDelete] = useState<Listen[] | null>(null);

  async function getTargetedListens() {
    const listens: Listen[] | null = await fetchToTarget(0);

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
      <button onClick={getTargetedListens}>Fetch LB listen history</button>
      <button onClick={() => batchDelete("DanielFenner", "Overwatch 2")}>
        Delete Daniel Fenner "listens"
      </button>
    </>
  );
}
