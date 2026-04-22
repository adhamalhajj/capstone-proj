import { randomBytes } from "node:crypto";
import { NextResponse } from "next/server";
import { getGoogleOAuthClientId } from "../../../../lib/auth/googleOAuth";
import { getGoogleOAuthRedirectUri } from "../../../../lib/auth/origin";
import { shouldUseSecureCookies } from "../../../../lib/auth/session";

const OAUTH_STATE_COOKIE = "lc_google_oauth_state";

// Start the Google OAuth flow and save a state token for security.
export async function GET(req) {
  const clientId = getGoogleOAuthClientId();
  if (!clientId) {
    return NextResponse.json({ error: "Google OAuth is not configured." }, { status: 500 });
  }

  const state = randomBytes(24).toString("base64url");
  const redirectUri = getGoogleOAuthRedirectUri(req);
  const url = new URL("https://accounts.google.com/o/oauth2/v2/auth");
  url.searchParams.set("client_id", clientId);
  url.searchParams.set("redirect_uri", redirectUri);
  url.searchParams.set("response_type", "code");
  url.searchParams.set("scope", "openid email profile");
  url.searchParams.set("state", state);
  url.searchParams.set("prompt", "select_account");

  const res = NextResponse.redirect(url);
  res.cookies.set(OAUTH_STATE_COOKIE, state, {
    httpOnly: true,
    secure: shouldUseSecureCookies(req),
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 10,
  });
  return res;
}

export const runtime = "nodejs";
