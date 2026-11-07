import { Alert, Slide, Snackbar } from "@mui/material";
import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";

const ToastContext = createContext(null);

/**
 * App-wide toast notifications. Usage:
 *   const toast = useToast();
 *   toast.success("Saved"); toast.error("Something went wrong"); toast.info("...")
 */
export const ToastProvider = ({ children }) => {
  const [queue, setQueue] = useState([]);
  const current = queue[0];

  const push = useCallback((message, severity = "info", duration = 3500) => {
    if (!message) return;
    setQueue((q) => [
      ...q,
      {
        id: Date.now() + Math.random(),
        message: String(message),
        severity,
        duration,
      },
    ]);
  }, []);

  const close = useCallback((_, reason) => {
    if (reason === "clickaway") return;
    setQueue((q) => q.slice(1));
  }, []);

  const api = useMemo(
    () => ({
      show: push,
      success: (m, d) => push(m, "success", d),
      error: (m, d) => push(m, "error", d ?? 5000),
      info: (m, d) => push(m, "info", d),
      warning: (m, d) => push(m, "warning", d),
    }),
    [push],
  );

  return (
    <ToastContext.Provider value={api}>
      {children}
      <Snackbar
        key={current ? current.id : "none"}
        open={Boolean(current)}
        autoHideDuration={current ? current.duration : null}
        onClose={close}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
        slots={{ transition: Slide }}
        sx={{ top: { xs: 72, sm: 24 } }}
      >
        {current ? (
          <Alert
            onClose={close}
            severity={current.severity}
            variant="filled"
            sx={{ boxShadow: 4, minWidth: 260 }}
          >
            {current.message}
          </Alert>
        ) : undefined}
      </Snackbar>
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used within ToastProvider");
  return ctx;
};
