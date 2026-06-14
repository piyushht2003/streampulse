"use client";

import { useState, useTransition } from "react";
import { motion } from "framer-motion";
import { Camera, Save, User as UserIcon, Loader2, CheckCircle2 } from "lucide-react";
import { updateUserProfile } from "@/app/actions/user";
import { useRouter } from "next/navigation";

export function SettingsForm({ user }: { user: any }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  
  // Local state for instant UI updates during editing
  const [previewImage, setPreviewImage] = useState(user.image || "");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);
    
    const formData = new FormData(e.currentTarget);
    
    startTransition(async () => {
      try {
        await updateUserProfile(formData);
        setSuccess(true);
        router.refresh();
      } catch (err: any) {
        setError(err.message || "Failed to update profile");
      }
    });
  };

  return (
    <motion.form 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      onSubmit={handleSubmit} 
      className="space-y-8 bg-foreground/5 border border-foreground/10 rounded-3xl p-8 backdrop-blur-xl"
    >
      {error && (
        <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm font-medium">
          {error}
        </div>
      )}

      {success && (
        <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm font-medium flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5" /> Profile updated successfully!
        </div>
      )}

      {/* Avatar Section */}
      <div className="flex flex-col md:flex-row items-center gap-8 pb-8 border-b border-foreground/10">
        <label htmlFor="avatar-upload" className="relative group cursor-pointer block">
          <div className="w-32 h-32 rounded-full border-2 border-foreground/20 bg-background/80 overflow-hidden flex items-center justify-center relative">
            {previewImage ? (
              <img src={previewImage} alt="Avatar" className="w-full h-full object-cover" />
            ) : (
              <UserIcon className="w-12 h-12 text-foreground/30" />
            )}
            <div className="absolute inset-0 bg-background/80 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
              <Camera className="w-8 h-8 text-foreground" />
            </div>
          </div>
        </label>
        
        <div className="flex-1 w-full space-y-2">
          <label className="text-sm font-semibold text-foreground/80">Profile Picture</label>
          <p className="text-xs text-foreground/50 mb-3">Click the avatar to upload a new image from your device.</p>
          <input 
            type="file" 
            id="avatar-upload" 
            accept="image/*" 
            className="hidden" 
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) {
                // 2MB limit
                if (file.size > 2 * 1024 * 1024) {
                  setError("Image must be less than 2MB");
                  return;
                }
                const reader = new FileReader();
                reader.onloadend = () => {
                  setPreviewImage(reader.result as string);
                };
                reader.readAsDataURL(file);
              }
            }} 
          />
          <input type="hidden" name="image" value={previewImage} />
        </div>
      </div>

      {/* Details Section */}
      <div className="space-y-6">
        <div className="space-y-2">
          <label className="text-sm font-semibold text-foreground/80">Display Name</label>
          <input 
            name="name"
            type="text"
            required
            defaultValue={user.name || ""}
            className="w-full bg-background/80 border border-foreground/10 rounded-xl px-4 py-3 text-foreground focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-semibold text-foreground/80">Email Address</label>
          <input 
            type="email"
            disabled
            value={user.email || ""}
            className="w-full bg-foreground/5 border border-foreground/5 rounded-xl px-4 py-3 text-foreground/50 cursor-not-allowed"
          />
          <p className="text-xs text-foreground/40 mt-1">Your email cannot be changed.</p>
        </div>
      </div>

      {/* Submit */}
      <div className="pt-4 flex justify-end">
        <button 
          type="submit" 
          disabled={isPending}
          className="bg-primary hover:bg-primary/90 text-foreground px-8 py-3 rounded-full font-bold shadow-[0_0_20px_rgba(157,78,221,0.3)] hover:shadow-[0_0_30px_rgba(157,78,221,0.5)] transition-all flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isPending ? (
            <><Loader2 className="w-5 h-5 animate-spin" /> Saving Changes...</>
          ) : (
            <><Save className="w-5 h-5" /> Save Profile</>
          )}
        </button>
      </div>

    </motion.form>
  );
}
