import { createClient } from "@/lib/supabase/server";
import MapView from "@/components/MapView";
import AuthWidget from "@/components/AuthWidget";
import type { Profile, Venue } from "@/lib/types";

export default async function Home() {
  const supabase = await createClient();

  const [{ data: venues, error }, { data: userData }] = await Promise.all([
    supabase.from("venues").select("*"),
    supabase.auth.getUser(),
  ]);

  if (error) {
    return (
      <div className="flex flex-1 items-center justify-center p-8 text-red-600">
        Failed to load venues: {error.message}
      </div>
    );
  }

  const user = userData.user;
  let profile: Profile | null = null;
  if (user) {
    const { data } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .single();
    profile = data;
  }

  return (
    <div className="relative h-screen w-full">
      <AuthWidget user={user} initialProfile={profile} />
      <MapView venues={(venues ?? []) as Venue[]} />
    </div>
  );
}
