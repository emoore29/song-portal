import { useEffect, useState } from "react";
import Welcome from "./components/welcome";
import { getItemFromLocalStorage } from "./helpers/localStorage";
import { handleSpotifyLogin, spotifyLoginOccurred } from "./helpers/login";
import { handleTokens } from "./helpers/spotifyTokens";
import { User } from "./types/spotify/types";

function App() {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    async function initialize() {
      if (spotifyLoginOccurred()) {
        handleSpotifyLogin(setUser);
      } else {
        const user: string | null = getItemFromLocalStorage("spotify_user");
        if (user) {
          setUser(JSON.parse(user));
        }
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
      <Welcome />
      {user && user.display_name}
    </>
  );
}

export default App;
