// Normalize env URL values that may have been copied with quotes or trailing slashes.
function clean(value) {
  return String(value || "").trim().replace(/^"(.*)"$/, "$1");
}

function parseOrigin(value) {
  const raw = clean(value);
  if (!raw) return "";

  try {
    return new URL(raw).origin;
  } catch {
    return "";
  }
}

function firstHeaderValue(value) {
  return String(value || "").split(",")[0].trim();
}

function getForwardedProtocol(req) {
  const forwardedProto = firstHeaderValue(req?.headers?.get?.("x-forwarded-proto"));
  if (forwardedProto) return forwardedProto;

  const cloudFrontProto = firstHeaderValue(req?.headers?.get?.("cloudfront-forwarded-proto"));
  if (cloudFrontProto) return cloudFrontProto;

  if (req?.url) {
    try {
      return new URL(req.url).protocol.replace(":", "");
    } catch {
      // Fall through to the safe default.
    }
  }

  return "https";
}

function getForwardedHost(req) {
  return (
    firstHeaderValue(req?.headers?.get?.("x-forwarded-host")) ||
    firstHeaderValue(req?.headers?.get?.("x-original-host")) ||
    firstHeaderValue(req?.headers?.get?.("host"))
  );
}

function isInternalHost(host) {
  const name = String(host || "").split(":")[0].toLowerCase();
  return name === "0.0.0.0" || name === "127.0.0.1" || name === "::" || name === "";
}

// Build the externally visible app origin instead of leaking the local bind address.
export function getPublicOrigin(req) {
  const configuredOrigin =
    parseOrigin(process.env.NEXT_PUBLIC_SITE_URL) || parseOrigin(process.env.SITE_URL);
  if (configuredOrigin) return configuredOrigin;

  const host = getForwardedHost(req);
  if (host && !isInternalHost(host)) {
    return `${getForwardedProtocol(req)}://${host}`;
  }

  if (req?.url) {
    try {
      return new URL(req.url).origin;
    } catch {
      // Fall through to localhost for local development edge cases.
    }
  }

  return "http://localhost:3000";
}

export function getGoogleOAuthRedirectUri(req) {
  const configuredRedirect = clean(process.env.GOOGLE_OAUTH_REDIRECT_URI);
  if (configuredRedirect) return configuredRedirect;

  return `${getPublicOrigin(req)}/api/auth/google/callback`;
}
