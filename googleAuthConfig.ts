/**
 * Google Sign-In credentials.
 *
 * Replace GOOGLE_WEB_CLIENT_ID below with the **Web application** OAuth client ID
 * from Google Cloud Console (APIs & Services > Credentials). It must be the *Web*
 * client, not the Android one, even though this is an Android app — Android uses
 * the web client ID to obtain an idToken.
 *
 * The Android OAuth client must also exist in the same Google Cloud project,
 * registered with package name `com.loginregisterapp` and the debug SHA-1
 * fingerprint, but its ID is never referenced in code.
 */

export const GOOGLE_WEB_CLIENT_ID =
  '264234234095-ls9jucs7qneg9nlahbqu1c4se5ct9a6o.apps.googleusercontent.com';

/**
 * Whether to request an idToken (a signed JWT proving identity to a backend).
 *
 * `false` — sign-in returns name / email / photo only. Needs NO OAuth client
 * setup at all, so it cannot fail with DEVELOPER_ERROR. This app only ever
 * displays those three fields, so this is all it currently needs.
 *
 * `true` — additionally returns `idToken`, which requires a correctly registered
 * **Android** OAuth client (package `com.loginregisterapp` + the debug SHA-1)
 * in the same Google Cloud project as GOOGLE_WEB_CLIENT_ID. Turn this on when
 * you add a backend that must verify who the user is.
 */
export const REQUEST_ID_TOKEN = true;

/** Only needed if this app is ever built for iOS. */
export const GOOGLE_IOS_CLIENT_ID = '';

/**
 * Whether sign-in has everything it needs. Without an idToken request there is
 * nothing to configure, so it is always ready.
 */
export const isGoogleConfigured = () =>
  !REQUEST_ID_TOKEN ||
  (!GOOGLE_WEB_CLIENT_ID.startsWith('PASTE_') &&
    GOOGLE_WEB_CLIENT_ID.endsWith('.apps.googleusercontent.com'));
