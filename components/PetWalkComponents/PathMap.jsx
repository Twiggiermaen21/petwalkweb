/**
 * Komponent PathMap
 *
 * Renderuje statyczną mapę Google z zaznaczoną trasą (Polyline) na podstawie przekazanych współrzędnych.
 * Używa biblioteki @react-google-maps/api.
 */

import React from "react";
import { GoogleMap, Polyline, useJsApiLoader } from "@react-google-maps/api";

// Styl kontenera mapy (Tailwind-like style)
const containerStyle = {
    width: "100%",
    height: "200px",
    borderRadius: "0.75rem",
};

// Domyślne centrum mapy (jeśli brak trasy) — Kraków
const defaultCenter = { lat: 50.0619474, lng: 19.9368564 };

/**
 * Komponent ścieżki na mapie
 * 
 * @param {Array<{lat: number, lng: number}>} path - Tablica punktów trasy
 * @param {object} options - Opcjonalne opcje Polyline (np. kolor, grubość)
 * @param {number} zoom - Zoom mapy (domyślnie 13)
 */
export default function PathMap({ path = [], options = {}, zoom = 13 }) {
    // Ładowanie biblioteki Google Maps API
    const { isLoaded } = useJsApiLoader({
        id: "google-map-script",
        googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY,
    });

    /**
     * Konwertuje punkty z formatu {latitude, longitude} do {lat, lng}
     */
    function convertPath(path) {
        return path.map((point) => ({
            lat: Number(point.latitude),
            lng: Number(point.longitude),
        }));
    }

    /**
     * Oblicza środek ścieżki, by ustawić mapę w odpowiednim centrum
     */
    function getCenterOfPath(path) {
        if (!path.length) return { lat: 0, lng: 0 };

        const sum = path.reduce(
            (acc, point) => ({
                lat: acc.lat + point.lat,
                lng: acc.lng + point.lng,
            }),
            { lat: 0, lng: 0 }
        );

        return {
            lat: sum.lat / path.length,
            lng: sum.lng / path.length,
        };
    }

    // Wyliczenie środka ścieżki (po konwersji)
    const center = getCenterOfPath(convertPath(path));

    return (
        <div style={{ width: "100%", maxWidth: 700, margin: "0 auto" }}>
            {isLoaded && (
                <GoogleMap
                    mapContainerStyle={containerStyle}
                    center={center}
                    zoom={zoom}
                    options={{
                        disableDefaultUI: true,         // Ukrywa domyślne kontrolki
                        draggable: false,               // Blokuje przesuwanie mapy
                        zoomControl: false,             // Blokuje zoom ręczny
                        scrollwheel: false,             // Blokuje zoom przez scroll
                        disableDoubleClickZoom: true,   // Blokuje double-click zoom
                        gestureHandling: "none",        // Blokuje pinch/swipe
                        styles: [
                            {
                                featureType: "poi",
                                elementType: "all",
                                stylers: [{ visibility: "off" }],
                            },
                        ],
                    }}
                >
                    {/* Rysowanie ścieżki jeśli jest więcej niż 1 punkt */}
                    {path.length > 1 && (
                        <Polyline
                            path={convertPath(path)}
                            options={{
                                strokeColor: "#FF0000", // domyślny czerwony
                                strokeOpacity: 0.7,
                                strokeWeight: 4,
                                ...options,
                            }}
                        />
                    )}
                </GoogleMap>
            )}
        </div>
    );
}
