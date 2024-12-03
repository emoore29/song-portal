import { useState } from "react";
import ListenBrainzToken from "./listenBrainzToken";
import { SpotifyUser } from "../types/spotify/types";

interface LobbyProps {
  setGoToMain: React.Dispatch<React.SetStateAction<boolean>>;
  lbUser: string | null;
  setLbUser: React.Dispatch<React.SetStateAction<string | null>>;
  spfyUser: SpotifyUser | null;
  justConnected: boolean;
  setJustConnected: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function Lobby({
  setGoToMain,
  justConnected,
  lbUser,
  spfyUser,
  setLbUser,
  setJustConnected,
}: LobbyProps) {
  const [connect, setConnect] = useState<boolean>(false);
  return (
    <>
      <h1>song portal</h1>
      {!connect && !justConnected ? (
        <>
          <p>Organise your music listening history by time.</p>
          <p>Created by Emma Moore.</p>
          <button onClick={() => setConnect((prev) => !prev)}>Start</button>
        </>
      ) : (
        <>
          <h2>Connect one or more of your accounts to get started.</h2>
          <ConnectLb
            lbUser={lbUser}
            setLbUser={setLbUser}
            setJustConnected={setJustConnected}
          />
          <ConnectSpfy spfyUser={spfyUser} />
        </>
      )}
      {(lbUser || spfyUser) && (
        <button
          onClick={() => {
            setGoToMain(true);
            sessionStorage.removeItem("justConnected");
          }}
        >
          Continue
        </button>
      )}
    </>
  );
}

interface ConnectLbProps {
  lbUser: string | null;
  setLbUser: React.Dispatch<React.SetStateAction<string | null>>;
  setJustConnected: React.Dispatch<React.SetStateAction<boolean>>;
}

function ConnectLb({ lbUser, setLbUser, setJustConnected }: ConnectLbProps) {
  const [openTokenInput, setOpenTokenInput] = useState<boolean>(false);

  return (
    <>
      {!lbUser ? (
        <button onClick={() => setOpenTokenInput((prev) => !prev)}>
          Connect with ListenBrainz
        </button>
      ) : (
        <p>Connect with ListenBrainz ✓</p>
      )}
      {openTokenInput && (
        <ListenBrainzToken
          setJustConnected={setJustConnected}
          setOpenTokenInput={setOpenTokenInput}
          setLbUser={setLbUser}
        />
      )}
    </>
  );
}

interface ConnectSpfyProps {
  spfyUser: SpotifyUser | null;
}

function ConnectSpfy({ spfyUser }: ConnectSpfyProps) {
  return (
    <>
      {!spfyUser ? (
        <a href="http://localhost:3000/spotify-login">Connect with Spotify</a>
      ) : (
        <p>Connect with Spotify ✓</p>
      )}
    </>
  );
}
