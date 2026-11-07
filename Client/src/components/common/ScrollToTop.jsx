import { useEffect } from "react";
import { useLocation } from "react-router-dom";

/** Scrolls to the top whenever the route changes (client-side navigation keeps scroll otherwise). */
export const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior:
        "instant" in document.documentElement.style ? "instant" : "auto",
    });
  }, [pathname]);
  return null;
};
