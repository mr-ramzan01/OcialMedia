/**
 * Origins allowed to call the API / connect over Socket.IO.
 * Set CLIENT_URL to a comma separated list, e.g.
 *   CLIENT_URL=http://localhost:3000,https://ocialmedia.netlify.app
 */
const defaults = ['http://localhost:3000', 'http://127.0.0.1:3000', 'https://ocialmedia.netlify.app'];

const configured = (process.env.CLIENT_URL || '')
  .split(',')
  .map((s) => s.trim())
  .filter(Boolean);

const allowedOrigins = configured.length > 0 ? configured : defaults;

/** The URL the client is served from; used for OAuth redirects. */
const clientUrl = allowedOrigins[0];

module.exports = { allowedOrigins, clientUrl };
