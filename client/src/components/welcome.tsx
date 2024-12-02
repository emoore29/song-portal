import { useState } from "react";

export default function Welcome() {
  const [connect, setConnect] = useState<boolean>(false);
  return (
    <>
      <h1>song portal</h1>
      <p>Organise your music listening history by time.</p>
      <p>Created by Emma Moore.</p>
      <button onClick={() => setConnect((prev) => !prev)}>Start</button>
      {connect && <Connect />}
    </>
  );
}

function Connect() {
  return (
    <>
      <a href="http://localhost:3000/login">Connect with ListenBrainz</a>

      <a href="http://localhost:3000/spotify-login">Connect with Spotify</a>
    </>
  );
}
