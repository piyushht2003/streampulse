import { AccessToken } from "livekit-server-sdk";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const room = req.nextUrl.searchParams.get("room");
  const username = req.nextUrl.searchParams.get("username");
  const isHost = req.nextUrl.searchParams.get("isHost") === "true";

  if (!room) {
    return NextResponse.json(
      { error: 'Missing "room" query parameter' },
      { status: 400 }
    );
  } else if (!username) {
    return NextResponse.json(
      { error: 'Missing "username" query parameter' },
      { status: 400 }
    );
  }

  const apiKey = process.env.LIVEKIT_API_KEY;
  const apiSecret = process.env.LIVEKIT_API_SECRET;

  if (!apiKey || !apiSecret) {
    return NextResponse.json(
      { error: "Server misconfigured: Missing LiveKit API Key or Secret" },
      { status: 500 }
    );
  }

  // Generate the token
  const at = new AccessToken(apiKey, apiSecret, {
    identity: username,
    // Add custom metadata like whether this user is the host
    metadata: JSON.stringify({ isHost }),
  });

  at.addGrant({
    roomJoin: true,
    room,
    // Host can publish, viewers can only subscribe
    canPublish: isHost,
    canSubscribe: true,
    canPublishData: true, // For polls/chat via DataChannel
  });

  const token = await at.toJwt();

  return NextResponse.json({ token });
}
