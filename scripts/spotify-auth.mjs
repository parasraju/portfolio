import { createServer } from "node:http";

const clientId = process.env.SPOTIFY_CLIENT_ID;
const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;
const port = 8888;
const redirectUri = `http://127.0.0.1:${port}/callback`;

if (!clientId || !clientSecret) {
  console.error("Set SPOTIFY_CLIENT_ID and SPOTIFY_CLIENT_SECRET first.");
  process.exit(1);
}

const authorizeUrl = new URL("https://accounts.spotify.com/authorize");
authorizeUrl.search = new URLSearchParams({
  client_id: clientId,
  response_type: "code",
  redirect_uri: redirectUri,
  scope: "user-read-recently-played",
}).toString();

const server = createServer(async (req, res) => {
  const url = new URL(req.url ?? "/", redirectUri);
  if (url.pathname !== "/callback") {
    res.writeHead(404).end();
    return;
  }
  const code = url.searchParams.get("code");
  if (!code) {
    res.writeHead(400).end(`Authorization failed: ${url.searchParams.get("error") ?? "no code"}`);
    server.close();
    return;
  }
  const tokenRes = await fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    headers: {
      Authorization: `Basic ${Buffer.from(`${clientId}:${clientSecret}`).toString("base64")}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({ grant_type: "authorization_code", code, redirect_uri: redirectUri }),
  });
  const data = await tokenRes.json();
  if (!tokenRes.ok || !data.refresh_token) {
    res.writeHead(500).end("Token exchange failed — see terminal.");
    console.error(data);
  } else {
    res.writeHead(200, { "Content-Type": "text/plain" }).end("Done. You can close this tab and return to the terminal.");
    console.log("\nSPOTIFY_REFRESH_TOKEN=" + data.refresh_token + "\n");
  }
  server.close();
});

server.listen(port, "127.0.0.1", () => {
  console.log(`Add ${redirectUri} as a Redirect URI in your Spotify app, then open:\n\n${authorizeUrl}\n`);
});
