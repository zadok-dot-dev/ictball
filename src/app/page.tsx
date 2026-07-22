import { supabase } from "@/lib/supabase";
import MapView from "@/components/MapView";
import type { Venue } from "@/lib/types";

export default async function Home() {
  const { data: venues, error } = await supabase.from("venues").select("*");

  if (error) {
    return (
      <div className="flex flex-1 items-center justify-center p-8 text-red-600">
        Failed to load venues: {error.message}
      </div>
    );
  }

  return (
    <div className="h-screen w-full">
      <MapView venues={(venues ?? []) as Venue[]} />
    </div>
  );
}
