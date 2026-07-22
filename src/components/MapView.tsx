"use client";

import { useState } from "react";
import Map, { Marker, Popup } from "react-map-gl/mapbox";
import "mapbox-gl/dist/mapbox-gl.css";
import type { Venue } from "@/lib/types";

const MAPBOX_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;

export default function MapView({ venues }: { venues: Venue[] }) {
  const [selected, setSelected] = useState<Venue | null>(null);

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
          <div className="p-1">
            <h3 className="font-semibold">{selected.name}</h3>
            <p className="text-sm capitalize text-zinc-600">
              {selected.surface_type} &middot; {selected.indoor_outdoor}
            </p>
            {selected.amenities.length > 0 && (
              <p className="mt-1 text-sm text-zinc-600">
                {selected.amenities.join(", ")}
              </p>
            )}
          </div>
        </Popup>
      )}
    </Map>
  );
}
