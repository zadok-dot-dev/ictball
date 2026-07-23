function timeAgo(dateIso: string): string {
  const minutes = Math.floor((Date.now() - new Date(dateIso).getTime()) / 60000);
  if (minutes < 1) return "just now";
  if (minutes < 60) return `${minutes}m ago`;
  return `${Math.floor(minutes / 60)}h ago`;
}

export function venueStatusLabel(lastCheckinAt: string | null): string {
  if (!lastCheckinAt) return "No recent check-ins";

  const minutesAgo = (Date.now() - new Date(lastCheckinAt).getTime()) / 60000;

  if (minutesAgo > 90) return "No recent check-ins";
  if (minutesAgo <= 30) return `Busy · updated ${timeAgo(lastCheckinAt)}`;
  return `Quiet · last check-in ${timeAgo(lastCheckinAt)}`;
}
