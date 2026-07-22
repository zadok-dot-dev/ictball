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
