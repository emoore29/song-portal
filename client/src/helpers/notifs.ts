import { notifications } from "@mantine/notifications";

export function showErrorNotif(title: string, message: string) {
  notifications.show({
    color: "red",
    title: title,
    message: message,
  });
}

export function showSuccessNotif(title: string, message: string) {
  notifications.show({
    color: "green",
    title: title,
    message: message,
  });
}
