import { SpotifyUser } from "../types/spotify/types";

interface HeaderProps {
  lbUser: string | null;
  spfyUser: SpotifyUser | null;
}

export default function Header({ lbUser, spfyUser }: HeaderProps) {
  return (
    <div className="header">
      <p>Song portal</p>
      <p>
        {lbUser} / {spfyUser?.display_name}
      </p>
    </div>
  );
}
