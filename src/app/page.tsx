import { createClient } from "@/lib/supabase/server";
import MapView from "@/components/MapView";
import AuthWidget from "@/components/AuthWidget";
import type { Profile, Venue } from "@/lib/types";

export default async function Home() {
  const supabase = await createClient();
  const twoHoursAgo = new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString();

  const [{ data: venues, error }, { data: userData }, { data: checkins }] =
    await Promise.all([
      supabase.from("venues").select("*"),
      supabase.auth.getUser(),
      supabase
        .from("checkins")
        .select("venue_id, created_at")
        .gte("created_at", twoHoursAgo)
        .order("created_at", { ascending: false }),
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

  const lastCheckins: Record<string, string> = {};
  for (const c of checkins ?? []) {
    if (!lastCheckins[c.venue_id]) {
      lastCheckins[c.venue_id] = c.created_at;
    }
  }

  return (
    <div className="relative h-screen w-full">
      <AuthWidget user={user} initialProfile={profile} />
      <MapView
        venues={(venues ?? []) as Venue[]}
        initialLastCheckins={lastCheckins}
        user={user}
      />
    </div>
  );
}
