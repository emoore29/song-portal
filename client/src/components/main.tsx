import { SpotifyUser } from "../types/spotify/types";
import Header from "./header";

interface MainProps {
  lbUser: string | null;
  spfyUser: SpotifyUser | null;
}

export default function Main({ lbUser, spfyUser }: MainProps) {
  return (
    <>
      <Header lbUser={lbUser} spfyUser={spfyUser} />
    </>
  );
}
