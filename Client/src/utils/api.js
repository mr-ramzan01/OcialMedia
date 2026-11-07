import Cookies from "universal-cookie";
import { root_url, TOKEN_COOKIE } from "./url";

const cookies = new Cookies();

export const getToken = () => cookies.get(TOKEN_COOKIE);
export const setToken = (token) =>
  cookies.set(TOKEN_COOKIE, token, {
    path: "/",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 30,
  });
export const clearToken = () => cookies.remove(TOKEN_COOKIE, { path: "/" });

/**
 * Thin wrapper around fetch for the API.
 *  - prefixes root_url
 *  - adds the bearer token when present
 *  - JSON-encodes plain object bodies (FormData is sent as-is)
 *  - resolves with the parsed JSON body, even for non-2xx responses
 */
export async function api(
  path,
  { method = "GET", body, headers = {}, token } = {},
) {
  const authToken = token !== undefined ? token : getToken();
  const finalHeaders = { ...headers };
  if (authToken) finalHeaders.authorization = `Bearer ${authToken}`;

  let finalBody = body;
  if (body && !(body instanceof FormData)) {
    finalHeaders["Content-Type"] = "application/json";
    finalBody = JSON.stringify(body);
  }

  const res = await fetch(`${root_url}${path}`, {
    method,
    headers: finalHeaders,
    body: finalBody,
  });
  const text = await res.text();
  try {
    return text ? JSON.parse(text) : { success: res.ok };
  } catch (error) {
    return { success: false, message: text || res.statusText };
  }
}
