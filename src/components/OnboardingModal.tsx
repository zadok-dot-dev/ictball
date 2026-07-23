"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import type { Profile } from "@/lib/types";

const AVATARS = ["⚽", "🥅", "🧤", "🔥", "🐐", "⭐"];

export default function OnboardingModal({
  userId,
  onDone,
}: {
  userId: string;
  onDone: (profile: Profile) => void;
}) {
  const [nickname, setNickname] = useState("");
  const [avatar, setAvatar] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const supabase = createClient();

  async function save(skip: boolean) {
    setSaving(true);
    const { data } = await supabase
      .from("profiles")
      .update({
        nickname: skip ? null : nickname || null,
        avatar: skip ? null : avatar,
        onboarded: true,
      })
      .eq("id", userId)
      .select()
      .single();
    setSaving(false);
    if (data) onDone(data as Profile);
  }

  return (
    <div className="fixed inset-0 z-20 flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-sm rounded-2xl bg-white p-6 text-black shadow-xl dark:bg-zinc-900 dark:text-white">
        <h2 className="text-lg font-semibold">Welcome!</h2>
        <p className="mt-1 text-sm text-zinc-500">
          Pick a nickname and avatar — totally optional, you can skip this.
        </p>

        <input
          type="text"
          value={nickname}
          onChange={(e) => setNickname(e.target.value)}
          placeholder="Nickname"
          maxLength={20}
          className="mt-4 w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-800"
        />

        <div className="mt-4 grid grid-cols-6 gap-2">
          {AVATARS.map((a) => (
            <button
              key={a}
              type="button"
              onClick={() => setAvatar(a)}
              className={`rounded-lg border p-2 text-xl ${
                avatar === a
                  ? "border-blue-500 bg-blue-50 dark:bg-blue-950"
                  : "border-zinc-300 dark:border-zinc-700"
              }`}
            >
              {a}
            </button>
          ))}
        </div>

        <div className="mt-6 flex justify-end gap-2">
          <button
            type="button"
            onClick={() => save(true)}
            disabled={saving}
            className="rounded-full px-4 py-2 text-sm text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-300"
          >
            Skip
          </button>
          <button
            type="button"
            onClick={() => save(false)}
            disabled={saving}
            className="rounded-full bg-black px-4 py-2 text-sm font-medium text-white disabled:opacity-50 dark:bg-white dark:text-black"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}
