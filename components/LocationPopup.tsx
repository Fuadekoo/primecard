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
      // Try to update card first
      await updateCardAction(guestSession);
      if (!response?.success) {
        // If update failed (e.g., card doesn't exist), create a new card
        await createCardAction({
          guestId: guestSession,
          location: locationData,
        });
      }
    }

    setShowPopup(false);
    console.log("Location granted ✅", latitude, longitude, accuracy);
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
        <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-8 max-w-md w-full text-center">
            <h2 className="text-2xl font-bold mb-4">📍 Location Permission</h2>
            <p className="mb-6">
              We need your location to continue. Please allow location access.
            </p>
            <button
              onClick={requestLocation}
              className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
            >
              Allow Location
            </button>
            {error && <p className="mt-4 text-red-600">{error}</p>}
          </div>
        </div>
      )}
    </>
  );
}
