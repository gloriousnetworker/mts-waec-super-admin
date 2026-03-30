// src/app/api/proxy/[...path]/route.js
//
// Same-origin proxy for iOS Safari ITP compatibility.
//
// iOS Safari's Intelligent Tracking Prevention (ITP) blocks cross-origin
// cookies even when the backend correctly sets SameSite=None; Secure; HttpOnly.
// This proxy makes ALL API traffic same-origin:
//
//   Browser → /api/proxy/auth/me (same origin, cookies always sent)
//   Server  → https://cbt-simulator-backend.vercel.app/api/auth/me (server-to-server)
//   Server  ← backend response with Set-Cookie headers
//   Browser ← Set-Cookie from OUR origin → iOS accepts it unconditionally
//
// Because the browser only ever talks to its own origin, ITP never fires.

import { NextResponse } from 'next/server';

const BACKEND = 'https://cbt-simulator-backend.vercel.app';

async function handleRequest(request, context) {
  // In Next.js 15, params is a Promise
  const { path } = await context.params;

  const backendPath = Array.isArray(path) ? path.join('/') : path;
  const { search } = new URL(request.url);
  const targetUrl = `${BACKEND}/api/${backendPath}${search}`;

  // ── Build headers to forward to the backend ──────────────────────────────
  const forwardHeaders = new Headers();
  forwardHeaders.set('accept', 'application/json');

  // Forward the original Content-Type so multipart/form-data (file uploads)
  // arrive at the backend with the correct boundary — never hardcode JSON here.
  const incomingContentType = request.headers.get('content-type');
  if (incomingContentType) {
    forwardHeaders.set('content-type', incomingContentType);
  } else if (request.method !== 'GET' && request.method !== 'HEAD') {
    forwardHeaders.set('content-type', 'application/json');
  }

  // Forward the browser's cookies so the backend can read the session
  const cookie = request.headers.get('cookie');
  if (cookie) forwardHeaders.set('cookie', cookie);

  // Forward Authorization header if present (Bearer tokens, etc.)
  const auth = request.headers.get('authorization');
  if (auth) forwardHeaders.set('authorization', auth);

  // Forward real IP for backend logging/rate-limiting
  const ip = request.headers.get('x-forwarded-for') ??
              request.headers.get('x-real-ip');
  if (ip) forwardHeaders.set('x-forwarded-for', ip);

  // ── Read request body for non-GET requests ───────────────────────────────
  // Use arrayBuffer for binary-safe forwarding (multipart file uploads).
  let body;
  if (request.method !== 'GET' && request.method !== 'HEAD') {
    body = await request.arrayBuffer();
  }

  // ── Call the real backend (server-to-server — no browser ITP) ───────────
  let backendRes;
  try {
    backendRes = await fetch(targetUrl, {
      method: request.method,
      headers: forwardHeaders,
      body: body ?? undefined,
      // Disable Next.js data cache — always hit the live backend
      cache: 'no-store',
    });
  } catch (err) {
    console.error('[proxy] backend unreachable:', err);
    return NextResponse.json(
      { message: 'Backend unreachable. Please try again.' },
      { status: 502 }
    );
  }

  // ── Build the browser response ────────────────────────────────────────────
  const responseText = await backendRes.text();

  const res = new NextResponse(responseText, {
    status: backendRes.status,
    statusText: backendRes.statusText,
  });

  // Always return JSON
  res.headers.set('content-type', 'application/json; charset=utf-8');

  // ── Forward Set-Cookie headers from backend → browser ────────────────────
  // The browser receives these cookies as set by OUR origin, not the backend.
  // iOS Safari accepts all same-origin cookies without any ITP interference.
  const setCookies = backendRes.headers.getSetCookie
    ? backendRes.headers.getSetCookie()
    : [];

  for (const raw of setCookies) {
    res.headers.append('set-cookie', raw);
  }

  return res;
}

export const GET    = handleRequest;
export const POST   = handleRequest;
export const PUT    = handleRequest;
export const PATCH  = handleRequest;
export const DELETE = handleRequest;
