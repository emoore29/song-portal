import { TextInput } from "@mantine/core";
import { useForm } from "@mantine/form";
import { checkTokenValid } from "../helpers/fetchers/lb/lbFetchers";
import { showErrorNotif, showSuccessNotif } from "../helpers/notifs";
import { modals } from "@mantine/modals";

interface LbTokenProps {
  setOpenTokenInput?: React.Dispatch<React.SetStateAction<boolean>>;
  setLbUser: React.Dispatch<React.SetStateAction<string | null>>;
  setJustConnected?: React.Dispatch<React.SetStateAction<boolean>>;
  modal?: boolean;
}

export default function ListenBrainzToken({
  setOpenTokenInput,
  setLbUser,
  setJustConnected,
  modal,
}: LbTokenProps) {
  const form = useForm({
    mode: "uncontrolled",
    initialValues: {
      username: "",
      token: "",
    },
  });

  interface FormValues {
    username: string;
    token: string;
  }

  async function checkLbToken(values: FormValues): Promise<void> {
    const authenticated: boolean | null = await checkTokenValid(
      values.token,
      values.username
    );

    if (!authenticated) {
      showErrorNotif("Error", "Invalid token or username mismatch.");
      return;
    }

    if (!modal) {
      sessionStorage.setItem("lb_user", values.username);
      sessionStorage.setItem("lb_token", values.token);
      sessionStorage.setItem("justConnected", "true");
      setOpenTokenInput && setOpenTokenInput(false);
      setJustConnected && setJustConnected(true);
    } else {
      localStorage.setItem("lb_user", values.username);
      localStorage.setItem("lb_token", values.token);
      modals.closeAll(); // used instead of modals.close("id") because id didn't work
    }
    showSuccessNotif("Success", "Connected with your ListenBrainz account");
    setLbUser(values.username);
  }

  return (
    <form onSubmit={form.onSubmit((values) => checkLbToken(values))}>
      <TextInput
        label="Username"
        placeholder="Add your ListenBrainz username here"
        key={form.key("username")}
        {...form.getInputProps("username")}
      />
      <TextInput
        label="User token"
        placeholder="Add your ListenBrainz user token here"
        key={form.key("token")}
        {...form.getInputProps("token")}
      />
      <button>Submit</button>
    </form>
  );
}
