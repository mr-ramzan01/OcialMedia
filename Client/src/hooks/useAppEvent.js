import { useEffect } from "react";
import { subscribe } from "../utils/events";

/** Subscribe to an app event for the lifetime of the component. */
export function useAppEvent(name, handler) {
  useEffect(() => subscribe(name, handler), [name, handler]);
}
