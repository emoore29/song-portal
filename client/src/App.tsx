import { useEffect, useState } from "react";
import Lobby from "./components/lobby";
import { getItemFromLocalStorage } from "./helpers/localStorage";
import { handleSpotifyLogin, spotifyLoginOccurred } from "./helpers/login";
import { handleTokens } from "./helpers/spotifyTokens";
import { SpotifyUser } from "./types/spotify/types";
import Main from "./components/main";

function App() {
  const [spfyUser, setSpfyUser] = useState<SpotifyUser | null>(null);
  const [lbUser, setLbUser] = useState<string | null>(null);
  const [goToMain, setGoToMain] = useState<boolean>(false);
  const [justConnected, setJustConnected] = useState<boolean>(false);

  useEffect(() => {
    if ((lbUser || spfyUser) && !justConnected) {
      setGoToMain(true);
    }
  }, [lbUser, spfyUser, justConnected]);

  useEffect(() => {
    const jc = sessionStorage.getItem("justConnected");
    if (jc) {
      setJustConnected(true);
      // sessionStorage.removeItem('justConnected');
    }
  }, []);

  useEffect(() => {
    const storedLbUser: string | null = getItemFromLocalStorage("lb_user");

    if (storedLbUser) {
      setLbUser(storedLbUser);
    } else {
      const sessionStoredLbUser: string | null =
        sessionStorage.getItem("lb_user");
      const sessionStoredLbToken: string | null =
        sessionStorage.getItem("lb_token");
      if (sessionStoredLbUser && sessionStoredLbToken) {
        setLbUser(sessionStoredLbUser);
        localStorage.setItem("lb_user", sessionStoredLbUser);
        localStorage.setItem("lb_token", sessionStoredLbToken);
      }
    }

    async function initialize() {
      if (spotifyLoginOccurred()) {
        handleSpotifyLogin(setSpfyUser);
        sessionStorage.setItem("justConnected", "true");
        setJustConnected(true);
      } else {
        const spUser: string | null = getItemFromLocalStorage("spfy_user");
        if (spUser) {
          setSpfyUser(JSON.parse(spUser));
        }

        await handleTokens();
      }

      const interval = setInterval(handleTokens, 3600000 - 60000); // every 59 mins update access token
      return () => {
        clearInterval(interval);
      };
    }

    initialize();
  }, []);

  return (
    <>
      {!goToMain ? (
        <Lobby
          setJustConnected={setJustConnected}
          justConnected={justConnected}
          setGoToMain={setGoToMain}
          setLbUser={setLbUser}
          lbUser={lbUser}
          spfyUser={spfyUser}
        />
      ) : (
        <Main />
      )}
    </>
  );
}

export default App;
