import { TextInput } from "@mantine/core";
import { useForm } from "@mantine/form";
import { checkTokenValid } from "../helpers/lbFetchers";
import { showErrorNotif, showSuccessNotif } from "../helpers/notifs";

interface LbTokenProps {
  setOpenTokenInput: React.Dispatch<React.SetStateAction<boolean>>;
  setLbUser: React.Dispatch<React.SetStateAction<string | null>>;
  setJustConnected: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function ListenBrainzToken({
  setOpenTokenInput,
  setLbUser,
  setJustConnected,
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

    sessionStorage.setItem("lb_user", values.username);
    sessionStorage.setItem("lb_token", values.token);
    showSuccessNotif("Success", "Connected with your ListenBrainz account");
    setOpenTokenInput(false);
    sessionStorage.setItem("justConnected", "true");
    setJustConnected(true);
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
