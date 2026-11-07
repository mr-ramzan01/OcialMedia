// Base URL of the API / Socket.IO server.
// Configure per environment with REACT_APP_API_URL (see .env.example).
export const root_url = (
  process.env.REACT_APP_API_URL || "http://localhost:8080"
).replace(/\/+$/, "");

// Where the client itself is served from; used to build OAuth / email links.
export const client_url = window.location.origin;

// Google OAuth client id (public) – optional, Google sign-in is hidden when missing.
export const google_client_id = process.env.REACT_APP_GOOGLE_CLIENT_ID || "";

// EmailJS (public keys) used by the forgot-password flow – optional.
export const emailjs_config = {
  serviceId: process.env.REACT_APP_EMAILJS_SERVICE_ID || "",
  templateId: process.env.REACT_APP_EMAILJS_TEMPLATE_ID || "",
  publicKey: process.env.REACT_APP_EMAILJS_PUBLIC_KEY || "",
};

export const TOKEN_COOKIE = "ocialMedia_token";
