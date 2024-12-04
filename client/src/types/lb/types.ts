export interface HistoryPayload {
  count: number;
  latest_listen_ts: number;
  listens: Listen[];
  oldest_listen_ts: number;
  user_id: string;
}

export interface Listen {
  inserted_at: number;
  listened_at: number;
  recording_msid: string;
  track_metadata: {
    additional_info: {
      media_player: string;
      recording_msid: string;
      submission_client: string;
      submission_client_version: string;
    };
    artist_name: string;
    track_name: string;
  };
  user_name: string;
}

export interface DeleteListen {
  listened_at: number;
  recording_msid: string;
}
