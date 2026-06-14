import { auth } from "../../../auth";
import { redirect } from "next/navigation";
import { SettingsForm } from "@/components/settings/SettingsForm";

export default async function SettingsPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  return (
    <div className="min-h-screen bg-background text-foreground p-8 md:p-12 relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-primary/10 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-600/10 rounded-full blur-[100px] pointer-events-none" />
      
      <div className="max-w-2xl mx-auto relative z-10">
        <h1 className="text-4xl font-bold tracking-tight mb-2">Profile Settings</h1>
        <p className="text-foreground/50 mb-12">Update your channel branding and personal details.</p>
        
        <SettingsForm user={session.user} />
      </div>
    </div>
  );
}
