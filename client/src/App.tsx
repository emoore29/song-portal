import { useEffect } from "react";
import Welcome from "./components/welcome";
import { spotifyLoginOccurred } from "./helpers/login";

function App() {
  useEffect(() => {
    if (spotifyLoginOccurred()) {
      console.log("User logged into Spotify");
    }
  });

  return (
    <>
      <Welcome />
    </>
  );
}

export default App;
