"use client";

import { useState } from "react";
import Map, { Marker, Popup } from "react-map-gl/mapbox";
import "mapbox-gl/dist/mapbox-gl.css";
import type { User } from "@supabase/supabase-js";
import type { PlannedVisit, Venue } from "@/lib/types";
import { createClient } from "@/lib/supabase/client";
import { venueStatusLabel } from "@/lib/status";
import PlanPicker from "@/components/PlanPicker";

const MAPBOX_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;

export default function MapView({
  venues,
  initialLastCheckins,
  initialPlannedVisits,
  user,
}: {
  venues: Venue[];
  initialLastCheckins: Record<string, string>;
  initialPlannedVisits: PlannedVisit[];
  user: User | null;
}) {
  const [selected, setSelected] = useState<Venue | null>(null);
  const [lastCheckins, setLastCheckins] = useState(initialLastCheckins);
  const [checkingIn, setCheckingIn] = useState(false);
  const [plannedVisits, setPlannedVisits] = useState(initialPlannedVisits);
  const supabase = createClient();

  function handlePlan(visit: PlannedVisit) {
    setPlannedVisits((prev) => [
      ...prev.filter(
        (v) => !(v.user_id === visit.user_id && v.venue_id === visit.venue_id),
      ),
      visit,
    ]);
  }

  async function handleCheckIn(venueId: string) {
    if (!user) {
      window.location.href = "/login";
      return;
    }

    setCheckingIn(true);
    const { error } = await supabase
      .from("checkins")
      .insert({ user_id: user.id, venue_id: venueId });
    setCheckingIn(false);

    if (!error) {
      setLastCheckins((prev) => ({
        ...prev,
        [venueId]: new Date().toISOString(),
      }));
    }
  }

  return (
    <Map
      mapboxAccessToken={MAPBOX_TOKEN}
      initialViewState={{
        longitude: -97.3301,
        latitude: 37.6872,
        zoom: 11,
      }}
      style={{ width: "100%", height: "100%" }}
      mapStyle="mapbox://styles/mapbox/streets-v12"
    >
      {venues.map((venue) => (
        <Marker
          key={venue.id}
          longitude={venue.lng}
          latitude={venue.lat}
          anchor="bottom"
          onClick={(e) => {
            e.originalEvent.stopPropagation();
            setSelected(venue);
          }}
        >
          <div className="cursor-pointer text-3xl leading-none">📍</div>
        </Marker>
      ))}

      {selected && (
        <Popup
          longitude={selected.lng}
          latitude={selected.lat}
          anchor="top"
          onClose={() => setSelected(null)}
          closeOnClick={false}
        >
          <div className="min-w-[180px] p-1">
            <h3 className="font-semibold">{selected.name}</h3>
            <p className="text-sm capitalize text-zinc-600">
              {selected.surface_type} &middot; {selected.indoor_outdoor}
            </p>
            {selected.amenities.length > 0 && (
              <p className="mt-1 text-sm text-zinc-600">
                {selected.amenities.join(", ")}
              </p>
            )}
            <p className="mt-2 text-sm font-medium">
              {venueStatusLabel(lastCheckins[selected.id] ?? null)}
            </p>
            <button
              type="button"
              onClick={() => handleCheckIn(selected.id)}
              disabled={checkingIn}
              className="mt-2 w-full rounded-full bg-black px-3 py-1.5 text-sm font-medium text-white disabled:opacity-50 dark:bg-white dark:text-black"
            >
              {checkingIn ? "Checking in..." : "I'm here now"}
            </button>

            <PlanPicker
              venueId={selected.id}
              plannedVisits={plannedVisits}
              user={user}
              onPlan={handlePlan}
            />
          </div>
        </Popup>
      )}
    </Map>
  );
}
