"use client";

import { useState } from "react";
import type { User } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/client";
import type { Profile } from "@/lib/types";
import OnboardingModal from "@/components/OnboardingModal";

export default function AuthWidget({
  user,
  initialProfile,
}: {
  user: User | null;
  initialProfile: Profile | null;
}) {
  const [profile, setProfile] = useState(initialProfile);
  const supabase = createClient();

  async function handleLogout() {
    await supabase.auth.signOut();
    window.location.reload();
  }

  return (
    <>
      <div className="absolute top-4 right-4 z-10 flex items-center gap-2 rounded-full bg-white/90 px-3 py-2 text-black shadow-md backdrop-blur dark:bg-black/80 dark:text-white">
        {user ? (
          <>
            <span className="text-xl">{profile?.avatar ?? "🙂"}</span>
            <span className="text-sm font-medium">
              {profile?.nickname || user.email}
            </span>
            <button
              onClick={handleLogout}
              className="text-xs text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-300"
            >
              Log out
            </button>
          </>
        ) : (
          <a href="/login" className="text-sm font-medium">
            Log in
          </a>
        )}
      </div>

      {user && profile && !profile.onboarded && (
        <OnboardingModal userId={user.id} onDone={setProfile} />
      )}
    </>
  );
}
