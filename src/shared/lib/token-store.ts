/**
 * In-memory access-token store. The access token is deliberately NOT persisted
 * to localStorage or cookies — it lives only for the lifetime of the tab. On a
 * reload it is re-obtained by calling the refresh endpoint (the refresh token is
 * an httpOnly cookie managed by the backend).
 */
let accessToken: string | null = null;

export function getAccessToken(): string | null {
  return accessToken;
}

export function setAccessToken(token: string | null): void {
  accessToken = token;
}
