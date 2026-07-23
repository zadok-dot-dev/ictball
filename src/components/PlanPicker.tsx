"use client";

import { useState } from "react";
import type { User } from "@supabase/supabase-js";
import type { PlannedVisit } from "@/lib/types";
import { createClient } from "@/lib/supabase/client";
import { formatSlotLabel, upcomingSlots } from "@/lib/slots";

export default function PlanPicker({
  venueId,
  plannedVisits,
  user,
  onPlan,
}: {
  venueId: string;
  plannedVisits: PlannedVisit[];
  user: User | null;
  onPlan: (visit: PlannedVisit) => void;
}) {
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const supabase = createClient();
  const slots = upcomingSlots(6);

  const venuePlans = plannedVisits.filter((v) => v.venue_id === venueId);
  const counts = slots.map(
    (slot) =>
      venuePlans.filter(
        (v) => new Date(v.target_time).getTime() === slot.getTime(),
      ).length,
  );
  const maxCount = Math.max(...counts);
  const headlineIndex = maxCount > 0 ? counts.indexOf(maxCount) : 0;
  const myPlan = user
    ? venuePlans.find((v) => v.user_id === user.id)
    : undefined;

  const myPlanSlotIndex = myPlan
    ? slots.findIndex(
        (s) => s.getTime() === new Date(myPlan.target_time).getTime(),
      )
    : -1;
  const selectedIso =
    myPlanSlotIndex !== -1
      ? slots[myPlanSlotIndex].toISOString()
      : slots[headlineIndex].toISOString();

  async function pick(iso: string) {
    if (!user) {
      window.location.href = "/login";
      return;
    }

    setSaving(true);
    setError(null);
    const { data, error } = await supabase
      .from("planned_visits")
      .upsert(
        { user_id: user.id, venue_id: venueId, target_time: iso },
        { onConflict: "user_id,venue_id" },
      )
      .select()
      .single();
    setSaving(false);

    if (error) {
      setError(error.message);
    } else if (data) {
      onPlan(data as PlannedVisit);
    }
  }

  return (
    <div className="mt-3">
      <p className="text-sm font-medium">
        {maxCount > 0
          ? `${maxCount} ${maxCount === 1 ? "person" : "people"} going at ${formatSlotLabel(slots[headlineIndex])}`
          : "No one's signed up yet"}
      </p>

      <label className="mt-2 flex items-center gap-2 text-sm">
        I&apos;m going at
        <select
          value={selectedIso}
          onChange={(e) => pick(e.target.value)}
          disabled={saving}
          className="rounded border border-zinc-300 px-2 py-1 text-sm disabled:opacity-50 dark:border-zinc-700 dark:bg-zinc-800"
        >
          {slots.map((slot, i) => (
            <option key={slot.toISOString()} value={slot.toISOString()}>
              {formatSlotLabel(slot)}
              {counts[i] > 0 ? ` (${counts[i]})` : ""}
            </option>
          ))}
        </select>
      </label>

      {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
    </div>
  );
}
