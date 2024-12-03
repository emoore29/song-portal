export function storeSpotifyTokens(
  access: string,
  refresh: string,
  expiresIn: string
): void {
  const expiryTime = Date.now() + Number(expiresIn) * 1000;
  localStorage.setItem("spfy_access_token", access);
  localStorage.setItem("spfy_refresh_token", refresh);
  localStorage.setItem("spfy_token_expiry", expiryTime.toString());
}

export function getItemFromLocalStorage(item: string): string | null {
  const itemValue = localStorage.getItem(item);
  if (itemValue) {
    return itemValue;
  } else {
    return null;
  }
}

export function storeDataInLocalStorage(key: string, data: any): void {
  localStorage.setItem(key, JSON.stringify(data));
}
