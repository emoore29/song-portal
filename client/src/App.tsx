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

  // Determines whether to show main or connect lobby
  useEffect(() => {
    // If one or more accounts is connected and they haven't justConnected, show main
    if ((lbUser || spfyUser) && !justConnected) {
      setGoToMain(true);
    }
  }, [lbUser, spfyUser, justConnected]);

  // Checks if user has just connected and updates state to reflect that
  useEffect(() => {
    const jc = sessionStorage.getItem("justConnected");
    if (jc) {
      setJustConnected(true);
    }
  }, []);

  // Handles user state on initial page visit
  useEffect(() => {
    const storedLbUser: string | null = getItemFromLocalStorage("lb_user");

    // Check for stored lb user in local and session storage
    if (storedLbUser) {
      setLbUser(storedLbUser);
    } else {
      const sessionStoredLbUser: string | null =
        sessionStorage.getItem("lb_user");
      const sessionStoredLbToken: string | null =
        sessionStorage.getItem("lb_token");
      if (sessionStoredLbUser && sessionStoredLbToken) {
        setLbUser(sessionStoredLbUser);

        // Move lb user data to local storage for persistence
        localStorage.setItem("lb_user", sessionStoredLbUser);
        localStorage.setItem("lb_token", sessionStoredLbToken);
      }
    }

    async function initialize() {
      if (spotifyLoginOccurred()) {
        handleSpotifyLogin(setSpfyUser);
        !sessionStorage.getItem("connectingFromMain") &&
          sessionStorage.setItem("justConnected", "true");
        !sessionStorage.getItem("connectingFromMain") && setJustConnected(true);
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
        <Main
          lbUser={lbUser}
          spfyUser={spfyUser}
          setLbUser={setLbUser}
          setSpfyUser={setSpfyUser}
          setGoToMain={setGoToMain}
        />
      )}
    </>
  );
}

export default App;
