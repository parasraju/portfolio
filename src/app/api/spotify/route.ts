import { NextResponse } from "next/server";
import type { LastPlayedTrack } from "@/components/spotify/SpotifyLastPlayed";

export const revalidate = 1800;

type SpotifyImage = { url: string; width: number | null };
type SpotifyRecentlyPlayed = {
  items?: {
    played_at: string;
    track: {
      name: string;
      external_urls: { spotify: string };
      artists: { name: string }[];
      album: { name: string; images: SpotifyImage[] };
    };
  }[];
};

async function accessToken(clientId: string, clientSecret: string, refreshToken: string) {
  const res = await fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    headers: {
      Authorization: `Basic ${Buffer.from(`${clientId}:${clientSecret}`).toString("base64")}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({ grant_type: "refresh_token", refresh_token: refreshToken }),
  });
  if (!res.ok) throw new Error(`Spotify token ${res.status}`);
  const data = (await res.json()) as { access_token: string };
  return data.access_token;
}

async function lastPlayed(token: string): Promise<LastPlayedTrack | null> {
  const res = await fetch("https://api.spotify.com/v1/me/player/recently-played?limit=1", {
    headers: { Authorization: `Bearer ${token}` },
    next: { revalidate: 1800 },
  });
  if (!res.ok) throw new Error(`Spotify recently-played ${res.status}`);
  const data = (await res.json()) as SpotifyRecentlyPlayed;
  const item = data.items?.[0];
  if (!item) return null;
  const images = [...item.track.album.images].sort((a, b) => (a.width ?? 0) - (b.width ?? 0));
  return {
    title: item.track.name,
    artists: item.track.artists.map((a) => a.name).join(", "),
    album: item.track.album.name,
    image: (images.find((img) => (img.width ?? 0) >= 64) ?? images[0])?.url ?? null,
    url: item.track.external_urls.spotify,
    playedAt: item.played_at,
  };
}

export async function GET() {
  const { SPOTIFY_CLIENT_ID, SPOTIFY_CLIENT_SECRET, SPOTIFY_REFRESH_TOKEN } = process.env;
  if (!SPOTIFY_CLIENT_ID || !SPOTIFY_CLIENT_SECRET || !SPOTIFY_REFRESH_TOKEN) {
    return NextResponse.json({ track: null });
  }
  try {
    const token = await accessToken(SPOTIFY_CLIENT_ID, SPOTIFY_CLIENT_SECRET, SPOTIFY_REFRESH_TOKEN);
    return NextResponse.json({ track: await lastPlayed(token) });
  } catch (error) {
    console.warn("[spotify]", error instanceof Error ? error.message : error);
    return NextResponse.json({ track: null });
  }
}
