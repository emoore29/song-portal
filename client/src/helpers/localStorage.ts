import { showErrorNotif } from "./notifs";

export function storeSpotifyTokens(
  access: string,
  refresh: string,
  expiresIn: string
): void {
  const expiryTime = Date.now() + Number(expiresIn) * 1000;
  localStorage.setItem("access_token", access);
  localStorage.setItem("refresh_token", refresh);
  localStorage.setItem("token_expiry", expiryTime.toString());
}

export function getItemFromLocalStorage(item: string): string | null {
  const itemValue = localStorage.getItem(item);
  if (itemValue) {
    return itemValue;
  } else {
    showErrorNotif("Error", `Couldn't locate ${item} in browser storage.`);
    return null;
  }
}

export function storeDataInLocalStorage(key: string, data: any): void {
  localStorage.setItem(key, JSON.stringify(data));
}
