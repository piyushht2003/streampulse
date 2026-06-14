import { EgressClient, EncodedFileOutput, EncodedFileType } from "livekit-server-sdk";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { roomName } = await req.json();

    if (!roomName) {
      return NextResponse.json({ error: "Room name is required" }, { status: 400 });
    }

    // Initialize the Egress Client to trigger LiveKit's recording pipeline
    const egressClient = new EgressClient(
      process.env.NEXT_PUBLIC_LIVEKIT_URL || "",
      process.env.LIVEKIT_API_KEY,
      process.env.LIVEKIT_API_SECRET
    );

    // LiveKit Egress will automatically output to the S3 credentials 
    // (Cloudflare R2) configured in your LiveKit Cloud project settings.
    const fileOutput = new EncodedFileOutput({
      filepath: `recordings/${roomName}-${Date.now()}.mp4`,
      fileType: EncodedFileType.MP4,
    });

    const info = await egressClient.startRoomCompositeEgress(roomName, {
      file: fileOutput,
    });

    return NextResponse.json({ success: true, egressId: info.egressId });
  } catch (error) {
    console.error("Recording Error:", error);
    return NextResponse.json({ error: "Failed to start recording" }, { status: 500 });
  }
}
