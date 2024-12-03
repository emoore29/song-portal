import { notifications } from "@mantine/notifications";

export function showErrorNotif(title: string, message: string) {
  notifications.show({
    color: "red",
    title: title,
    message: message,
  });
}
