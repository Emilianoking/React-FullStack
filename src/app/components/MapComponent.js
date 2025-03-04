"use client"; // Asegura que se ejecute solo en el cliente
import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Importar las imágenes de los íconos de Leaflet
import markerIconPng from "leaflet/dist/images/marker-icon.png";
import markerShadowPng from "leaflet/dist/images/marker-shadow.png";

// Cargar react-leaflet dinámicamente (para evitar errores en SSR)
const MapContainer = dynamic(() => import("react-leaflet").then((mod) => mod.MapContainer), { ssr: false });
const TileLayer = dynamic(() => import("react-leaflet").then((mod) => mod.TileLayer), { ssr: false });
const Marker = dynamic(() => import("react-leaflet").then((mod) => mod.Marker), { ssr: false });
const Popup = dynamic(() => import("react-leaflet").then((mod) => mod.Popup), { ssr: false });

// Configurar los íconos de Leaflet
const customIcon = new L.Icon({
  iconUrl: markerIconPng,
  shadowUrl: markerShadowPng,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

export default function MapComponent() {
  const [isClient, setIsClient] = useState(false);

  // esto es para asegurarse de que el código se ejecute solo en el cliente
  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) return <p>Cargando mapa...</p>;

  return (
    <MapContainer center={[4.142, -73.626]} zoom={13} style={{ height: "80vh", width: "100%" }}>
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      <Marker position={[4.142, -73.626]} icon={customIcon}>
        <Popup>Villavicencio, Colombia.</Popup>
      </Marker>
    </MapContainer>
  );
}
