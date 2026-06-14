import { auth } from "../../../../auth";
import { redirect } from "next/navigation";
import { CreatorStudio } from "@/components/studio/CreatorStudio";
import { getStreamData } from "@/app/actions/stream";

export default async function CreatorDashboard() {
  // 1. Fetch the extremely secure NextAuth session
  const session = await auth();

  // 2. Double-check protection (even though middleware handles it)
  if (!session?.user) {
    redirect("/login");
  }

  // 3. Fallback name if OAuth doesn't provide one
  const username = session.user.name || session.user.email?.split('@')[0] || "Anonymous_Creator";
  const userId = session.user.id || "unknown";

  const streamData = await getStreamData(userId);
  const initialTitle = streamData?.title || "My Awesome Broadcast";

  return (
    <CreatorStudio userId={userId} username={username} initialStreamTitle={initialTitle} />
  );
}
