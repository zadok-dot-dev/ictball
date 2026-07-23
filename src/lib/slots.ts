const SLOT_MINUTES = 30;

export function upcomingSlots(count = 4, from = new Date()): Date[] {
  const start = new Date(from);
  start.setSeconds(0, 0);
  const minutes = start.getMinutes();
  const roundUpBy = minutes % SLOT_MINUTES === 0 ? SLOT_MINUTES : SLOT_MINUTES - (minutes % SLOT_MINUTES);
  start.setMinutes(minutes + roundUpBy);

  return Array.from({ length: count }, (_, i) => new Date(start.getTime() + i * SLOT_MINUTES * 60000));
}

export function formatSlotLabel(date: Date): string {
  const hours24 = date.getHours();
  const hours = hours24 % 12 || 12;
  const minutes = date.getMinutes().toString().padStart(2, "0");
  const ampm = hours24 >= 12 ? "pm" : "am";
  return `${hours}:${minutes}${ampm}`;
}
