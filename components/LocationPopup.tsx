"use client";
import { useState } from "react";
import useGuestSession from "@/hooks/useGuestSession";
import { addToast } from "@heroui/react";
import useAction from "@/hooks/useActions";
import { createCard, updateCard } from "../actions/guest/scan";

export default function LocationPopup() {
  const guestSession = useGuestSession();
  const [, createCardAction, isCreatingCard] = useAction(createCard, [
    ,
    (res) =>
      handleActionCompletion(
        res,
        "Card created successfully.",
        "Failed to create card."
      ),
  ]);

  const [response, updateCardAction, isUpdatingCard] = useAction(updateCard, [
    ,
    (res) =>
      handleActionCompletion(
        res,
        "Card updated successfully.",
        "Failed to update card."
      ),
  ]);

  function handleActionCompletion(
    response: unknown,
    successMessage: string,
    errorMessage: string
  ) {
    if (response) {
      addToast({ title: "Success", description: successMessage });
      return true;
    } else {
      addToast({ title: "Error", description: errorMessage });
      return false;
    }
  }
  const [showPopup, setShowPopup] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const handleLocation = async (pos: GeolocationPosition) => {
    const { latitude, longitude, accuracy } = pos.coords;
    const locationData = [latitude, longitude, accuracy].join(",");

    if (guestSession) {
      await updateCardAction(guestSession);
      if (!response?.success) {
        await createCardAction({
          guestId: guestSession,
          location: locationData,
        });
      }
    }

    setShowPopup(false);
    console.log("Location granted ✅", latitude, longitude, accuracy);
    // getLocationName(latitude, longitude); // Remove if not defined
  };

  const requestLocation = () => {
    if (!navigator.geolocation) {
      setError("Geolocation is not supported.");
      return;
    }

    navigator.geolocation.getCurrentPosition(handleLocation, (err) => {
      setError("⚠️ Location access denied or failed.");
      console.error("Error:", err.message);
    });
  };

  return (
    <>
      {showPopup && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          {/* Glassy blurred background */}
          <div className="absolute inset-0 bg-black/40 backdrop-blur-md" />
          {/* Popup Card */}
          <div className="relative z-10 bg-white/80 backdrop-blur-lg rounded-2xl shadow-2xl p-8 max-w-md w-full text-center border border-white/30">
            <div className="flex flex-col items-center">
              <div className="bg-blue-500 rounded-full p-4 mb-4">
                {/* Changed icon to a location marker SVG */}
                <svg width="32" height="32" fill="none" viewBox="0 0 24 24">
                  <circle cx="12" cy="10" r="3" fill="#fff" />
                  <path
                    d="M12 2C7.03 2 3 6.03 3 11c0 5.25 7.05 10.39 8.13 11.17a1 1 0 0 0 1.13 0C13.95 21.39 21 16.25 21 11c0-4.97-4.03-9-9-9zm0 18.88C10.13 19.13 5 15.13 5 11a7 7 0 0 1 14 0c0 4.13-5.13 8.13-7 9.88z"
                    fill="#2563eb"
                  />
                </svg>
              </div>
              <h2 className="text-2xl font-bold mb-2 text-blue-700">
                Allow Location Access
              </h2>
              <p className="mb-6 text-gray-800">
                To continue, please enable location.
                <br />
                Your location helps us provide better service.
              </p>
              <div className="flex gap-4 w-full justify-center">
                <button
                  onClick={() => setShowPopup(false)}
                  className="bg-gray-200 text-gray-700 px-6 py-2 rounded-lg shadow hover:bg-gray-300 transition"
                >
                  Cancel
                </button>
                <button
                  onClick={requestLocation}
                  disabled={isCreatingCard || isUpdatingCard}
                  className="bg-blue-600 text-white px-6 py-2 rounded-lg shadow hover:bg-blue-700 transition disabled:opacity-60"
                >
                  {isCreatingCard || isUpdatingCard
                    ? "Processing..."
                    : "Allow Location"}
                </button>
              </div>
              {error && <p className="mt-4 text-red-600 text-sm">{error}</p>}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
