import React from "react";

interface GuestMapProps {
  from?: { lat: number; lng: number };
  to?: { lat: number; lng: number };
}

const GuestMap: React.FC<GuestMapProps> = ({ from, to }) => {
  // Placeholder map rendering
  return (
    <div className="flex items-center justify-center h-full bg-gray-100 text-gray-500">
      Map placeholder: {from ? `From (${from.lat}, ${from.lng})` : "No origin"}{" "}
      → {to ? `To (${to.lat}, ${to.lng})` : "No destination"}
    </div>
  );
};

export default GuestMap;
