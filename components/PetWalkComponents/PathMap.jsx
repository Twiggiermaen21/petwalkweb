import React from "react";
import { GoogleMap, Polyline, useJsApiLoader } from "@react-google-maps/api";

// Styl i domyślny rozmiar mapy
const containerStyle = {
    width: "100%",
    height: "200px", // Możesz zmienić wysokość mapy
    borderRadius: "0.75rem", // Zaokrąglenie jak w Tailwind rounded-lg

};

const defaultCenter = { lat: 50.0619474, lng: 19.9368564 }; // Kraków, zmień jak chcesz

/**
 * @param {Array<{lat: number, lng: number}>} path - tablica punktów [{lat, lng}, ...]
 * @param {object} options - opcje Polyline (kolor itd.)
 * @param {number} zoom - zoom mapy
 */
export default function PathMap({ path = [], options = {}, zoom = 13 }) {
    // Klucz API powinien być w zmiennej środowiskowej, tu wpisz testowy lub przekaż jako props
    const { isLoaded } = useJsApiLoader({
        id: "google-map-script",
        googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "AIzaSyD0q28TOssWVwz5thTdq60x9pa5fMXMgnc",
    });

    function convertPath(path) {
        return path.map(point => ({
            lat: Number(point.latitude),
            lng: Number(point.longitude)
        }));
    }


    function getCenterOfPath(path) {
        if (!path.length) return { lat: 0, lng: 0 };

        const sum = path.reduce(
            (acc, point) => ({
                lat: acc.lat + point.lat,
                lng: acc.lng + point.lng
            }),
            { lat: 0, lng: 0 }
        );

        return {
            lat: sum.lat / path.length,
            lng: sum.lng / path.length
        };
    }
    const center = getCenterOfPath(convertPath(path));
    console.log("PathMap center:", center);

    return (
        <div style={{ width: "100%", maxWidth: 700, margin: "0 auto" }}>


            {isLoaded && (
                <GoogleMap
                    mapContainerStyle={containerStyle}
                    center={center}
                    zoom={zoom}

                    options={{
                        // disableDefaultUI: true,         // ukrywa wszystkie kontrolki (możesz ustawić na false jeśli chcesz)
                        // draggable: false,               // blokuje przesuwanie mapy
                        // zoomControl: false,             // blokuje przyciski zoomu
                        // scrollwheel: false,             // blokuje zoom na kółku myszy
                        // disableDoubleClickZoom: true,   // blokuje zoom przez double-click
                        // gestureHandling: "none",        // blokuje gesty mobilne (pinch, swipe itd.)
                        styles: [
                            {
                                featureType: "poi",
                                elementType: "all",
                                stylers: [{ visibility: "off" }]
                            }
                        ]
                    }}
                >
                    {path.length > 1 && (
                        <Polyline
                            path={convertPath(path)}
                            options={{
                                strokeColor: "#FF0000",
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
