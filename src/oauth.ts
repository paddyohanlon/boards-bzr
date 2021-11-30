import ClientOAuth2 from "client-oauth2";

export const oauthClient = new ClientOAuth2({
  clientId: process.env.VUE_APP_OAUTH_CLIENT_ID,
  accessTokenUri: process.env.VUE_APP_OAUTH_TOKEN_URI,
  authorizationUri: process.env.VUE_APP_OAUTH_AUTH_URI,
  redirectUri: process.env.VUE_APP_OAUTH_REDIRECT_URI,
  scopes: ["openid", "name", "email"],
});

// PKCE HELPER FUNCTIONS
// https://github.com/aaronpk/pkce-vanilla-js/blob/master/index.html

// Generate a secure random string using the browser crypto functions
export function generateRandomString(): string {
  const array = new Uint32Array(28);
  window.crypto.getRandomValues(array);
  return Array.from(array, (dec) => ("0" + dec.toString(16)).substr(-2)).join("");
}

// Calculate the SHA256 hash of the input text.
// Returns a promise that resolves to an ArrayBuffer
function sha256(plain: string) {
  const encoder = new TextEncoder();
  const data = encoder.encode(plain);
  return window.crypto.subtle.digest("SHA-256", data);
}

// Base64-urlencodes the input string
function base64urlencode(str: ArrayBuffer) {
  // Convert the ArrayBuffer to string using Uint8 array to conver to what btoa accepts.
  // btoa accepts chars only within ascii 0-255 and base64 encodes them.
  // Then convert the base64 encoded to base64url encoded
  //   (replace + with -, replace / with _, trim trailing =)
  // @ts-ignore
  return btoa(String.fromCharCode.apply(null, new Uint8Array(str)))
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
}

// Return the base64-urlencoded sha256 hash for the PKCE challenge
export async function pkceChallengeFromVerifier(v: string): Promise<string> {
  const hashed = await sha256(v);
  return base64urlencode(hashed);
}
