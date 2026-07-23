export type Venue = {
  id: string;
  name: string;
  lat: number;
  lng: number;
  surface_type: string;
  indoor_outdoor: "indoor" | "outdoor";
  amenities: string[];
  created_at: string;
};

export type Profile = {
  id: string;
  nickname: string | null;
  avatar: string | null;
  onboarded: boolean;
  created_at: string;
};

export type Checkin = {
  id: string;
  user_id: string;
  venue_id: string;
  created_at: string;
};

export type PlannedVisit = {
  id: string;
  user_id: string;
  venue_id: string;
  target_time: string;
};
