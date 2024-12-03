import { SpotifyUser } from "../types/spotify/types";
import Header from "./header";

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
  return (
    <>
      <Header
        lbUser={lbUser}
        spfyUser={spfyUser}
        setLbUser={setLbUser}
        setSpfyUser={setSpfyUser}
        setGoToMain={setGoToMain}
      />
    </>
  );
}
