import { useEffect } from "react";

const BASE = "Ocial Media";

/** Sets document.title for the current page ("Explore · Ocial Media"). */
export function usePageTitle(title) {
  useEffect(() => {
    document.title = title ? `${title} · ${BASE}` : BASE;
    return () => {
      document.title = BASE;
    };
  }, [title]);
}
