import { Menu } from "@mantine/core";
import { SpotifyUser } from "../types/spotify/types";
import { modals } from "@mantine/modals";
import { Text } from "@mantine/core";
import { showSuccessNotif } from "../helpers/notifs";

interface HeaderProps {
  lbUser: string | null;
  spfyUser: SpotifyUser | null;
  setLbUser: React.Dispatch<React.SetStateAction<string | null>>;
  setSpfyUser: React.Dispatch<React.SetStateAction<SpotifyUser | null>>;
  setGoToMain: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function Header({
  lbUser,
  spfyUser,
  setLbUser,
  setSpfyUser,
  setGoToMain,
}: HeaderProps) {
  const openConfirmDisconnect = (platform: string) =>
    modals.openConfirmModal({
      title: "Are you sure?",
      children: (
        <Text size="sm">
          This will clear your {platform === "lb" ? "ListenBrainz" : "Spotify"}{" "}
          data and you will need to log in again.
        </Text>
      ),
      labels: { confirm: "Confirm", cancel: "Cancel" },
      onCancel: () => console.log("Cancel"),
      onConfirm: () => {
        platform === "lb" ? clearLb() : clearSp();
      },
    });

  const clearLb = () => {
    localStorage.removeItem("lb_user");
    localStorage.removeItem("lb_token");
    setLbUser(null);
    showSuccessNotif("Success", "You have disconnected from ListenBrainz.");
    if (!spfyUser) setGoToMain(false);
  };

  const clearSp = () => {
    localStorage.removeItem("spfy_user");
    localStorage.removeItem("spfy_access_token");
    localStorage.removeItem("spfy_refresh_token");
    localStorage.removeItem("spfy_token_expiry");
    setSpfyUser(null);
    showSuccessNotif("Success", "You have disconnected from Spotify.");
    if (!lbUser) setGoToMain(false);
  };

  return (
    <div className="header">
      <p>Song portal</p>
      <Menu position="bottom-end" offset={1} shadow="md" width={200}>
        <Menu.Target>
          <button>
            {lbUser && spfyUser
              ? `${lbUser} / ${spfyUser.display_name}`
              : lbUser || spfyUser?.display_name}
          </button>
        </Menu.Target>
        <Menu.Dropdown>
          {lbUser && (
            <Menu.Item onClick={() => openConfirmDisconnect("lb")}>
              Disconnect ListenBrainz
            </Menu.Item>
          )}
          {spfyUser && (
            <Menu.Item onClick={() => openConfirmDisconnect("sp")}>
              Disconnect Spotify
            </Menu.Item>
          )}
        </Menu.Dropdown>
      </Menu>
    </div>
  );
}
