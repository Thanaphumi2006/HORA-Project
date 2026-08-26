# Google Sign-In setup

The code is done. The only thing left is creating OAuth credentials, which has to
happen under your own Google account — it cannot be scripted or done on your behalf.

## Values this app needs

| Field | Value |
|---|---|
| Package name | `com.loginregisterapp` |
| Debug SHA-1 | `19:01:3E:CD:86:34:BC:C4:E3:CA:0F:51:34:88:E2:DD:14:9F:44:A6` |

That SHA-1 comes from `android/app/debug.keystore`. It is **not** a secret. A release
build uses a different key and needs its own SHA-1 registered.

### Why this keystore was regenerated

The React Native template ships an identical `debug.keystore` in every project, whose
SHA-1 is `5E:8F:16:06:2E:A3:CD:2C:4A:0D:54:78:76:BA:A6:F3:8C:AB:F6:25`. Google requires
the **package name + fingerprint pair to be globally unique** across all Cloud projects,
so with the stock key and a common package name, creating the Android client fails with:

> Create failed — The request failed because the Android package name and fingerprint
> are already in use

The fix was to generate a project-specific debug key, which is what the fingerprint above
is. The original stock keystore is backed up at `/tmp/debug.keystore.rn-default.bak`, and
`git checkout android/app/debug.keystore` also restores it.

Consequence: changing the signing key means existing installs must be uninstalled before
reinstalling, or the install fails with `INSTALL_FAILED_UPDATE_INCOMPATIBLE`.

To regenerate it yourself:

```bash
keytool -list -v -keystore android/app/debug.keystore \
  -alias androiddebugkey -storepass android -keypass android | grep SHA1
```

## Steps in Google Cloud Console

All of this is free and never asks for a credit card.

Note: OAuth setup now lives under **Google Auth Platform** (`/auth/...`), not the old
"APIs & Services → Credentials" path. Old links redirect there.

1. **Create a project** — <https://console.cloud.google.com/projectcreate>
   (or reuse one you already have).

2. **Configure the consent screen** — <https://console.cloud.google.com/auth/overview>
   Choose *External*, fill in app name + your email, save.

3. **Add yourself as a test user** — <https://console.cloud.google.com/auth/audience>
   While the app is in *Testing*, only listed accounts can sign in. Add the Google
   account you'll use on the emulator, or you'll get `403: access_denied`.

4. **Create the Android client** — <https://console.cloud.google.com/auth/clients>
   → *Create client* → type **Android**
   - Package name: `com.loginregisterapp`
   - SHA-1: the fingerprint above
   - You never reference this ID in code, but it must exist or you get `DEVELOPER_ERROR`.

5. **Create the Web client** — same page, *Create client* → type **Web application**.
   Name it anything. Copy the client ID — it looks like
   `1234567890-abc123def456.apps.googleusercontent.com`.

6. Paste that Web client ID into `googleAuthConfig.ts`:

   ```ts
   export const GOOGLE_WEB_CLIENT_ID = '1234567890-abc....apps.googleusercontent.com';
   ```

7. Restart the app. A Metro reload is enough — this is a JS-only change:

   ```bash
   npx react-native start
   ```

## Add a Google account to the emulator

The Pixel_7_API_35 AVD is a Google Play image, so real sign-in works. Open
**Settings → Passwords & accounts → Add account → Google** on the emulator and sign
in once. After that the app's account chooser will list it.

## Troubleshooting

- **`DEVELOPER_ERROR`** — the most common failure. It means the Android OAuth client
  doesn't match. Check all three: package name is exactly `com.loginregisterapp`,
  the SHA-1 matches the keystore that signed the build, and the Android *and* Web
  clients are in the **same** Google Cloud project. Note this error only appears
  *after* you finish entering your Google password — Play Services opens the login
  page before it validates the client, so an error-free launch proves nothing.

  To read the fingerprint Google actually sees, inspect the installed APK rather than
  trusting the keystore file:

  ```bash
  adb pull "$(adb shell pm path com.loginregisterapp | sed 's/package://' | tr -d '\r')" /tmp/installed.apk
  "$ANDROID_HOME"/build-tools/*/apksigner verify --print-certs /tmp/installed.apk | grep -i SHA-1
  ```

- **"package name and fingerprint are already in use"** when creating the Android
  client — see the keystore section above.

- **Check the package name character by character.** The actual root cause here was a
  truncated package name on the Android client: `com.login` instead of
  `com.loginregisterapp`. Everything else was correct — right client type, right
  project, right SHA-1 — and neither the client list nor the downloaded JSON shows
  the package name, so it is invisible unless you open the client's edit page.
  `DEVELOPER_ERROR` is raised for a package mismatch exactly as it is for a
  fingerprint mismatch; the error does not distinguish between them.

- **Telling client types apart from the downloaded JSON.** The console's download
  gives no explicit type label, but the shape does:

  | Top-level key | `client_secret` present | Type |
  |---|---|---|
  | `"web"` | yes | Web application |
  | `"installed"` | yes | Desktop app |
  | `"installed"` | **no** | Android |

  Only the Web client ID belongs in `googleAuthConfig.ts`. The Android client must
  exist in the same project but is never referenced in code.

  The download never includes the SHA-1 fingerprint, so a JSON file cannot confirm
  the fingerprint is correct — that has to be read from the client's page in the
  console.

- **Requesting no idToken does NOT avoid the need for an Android client.** Setting
  `REQUEST_ID_TOKEN = false` (dropping `webClientId` from `configure()`) was tested
  and still produced `DEVELOPER_ERROR`. Play Services validates the calling app's
  package + signature regardless, so there is no code-side workaround for a
  missing or mismatched Android client.
- **`403 access_denied`** — the signing-in account isn't on the OAuth consent
  screen's test-user list.
- **`PLAY_SERVICES_NOT_AVAILABLE`** — the AVD isn't a Google Play image. Use
  Pixel_7_API_35, which is.
- **Nothing happens / "Add your Web client ID…" toast** — `googleAuthConfig.ts`
  still has the placeholder value.

## Note on iOS

`GOOGLE_IOS_CLIENT_ID` in `googleAuthConfig.ts` is unused for now. iOS cannot be
built on this machine (see the project notes), and would additionally need an iOS
OAuth client plus a reversed-client-ID URL scheme in `Info.plist`.
