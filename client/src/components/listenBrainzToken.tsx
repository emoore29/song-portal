import { TextInput } from "@mantine/core";
import { useForm } from "@mantine/form";
import { checkTokenValid } from "../helpers/lbFetchers";
import { showErrorNotif, showSuccessNotif } from "../helpers/notifs";
import { storeDataInLocalStorage } from "../helpers/localStorage";

export default function ListenBrainzToken() {
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

    storeDataInLocalStorage("lb_user", values.username);
    storeDataInLocalStorage("lb_token", values.token);
    showSuccessNotif("Success", "Authenticated");
  }

  return (
    <form onSubmit={form.onSubmit((values) => checkLbToken(values))}>
      <TextInput
        label="Username"
        placeholder="Add your ListenBrainz username here."
        key={form.key("username")}
        {...form.getInputProps("username")}
      />
      <TextInput
        label="User token"
        placeholder="Add your ListenBrainz user token here."
        key={form.key("token")}
        {...form.getInputProps("token")}
      />
      <button>Submit</button>
    </form>
  );
}
