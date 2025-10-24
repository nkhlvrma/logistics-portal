import React from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Polyline,
} from "react-leaflet";
import { useNavigate } from "react-router-dom";
import L from "leaflet";
import { Delivery, DeliveryStatus } from "../../../types";
import "leaflet/dist/leaflet.css";
import "./DeliveryMap.css";

interface DeliveryMapProps {
  deliveries: Delivery[];
}

export const DeliveryMap: React.FC<DeliveryMapProps> = ({ deliveries }) => {
  const navigate = useNavigate();

  // Create custom marker icons for different delivery statuses
  const createCustomIcon = (status: DeliveryStatus) => {
    const colors: Record<DeliveryStatus, string> = {
      Scheduled: "#6b7280",
      "In Progress": "#3b82f6",
      Delayed: "#ef4444",
      Completed: "#10b981",
      Cancelled: "#9ca3af",
    };

    const svgIcon = `
      <svg width="32" height="32" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
        <circle cx="16" cy="16" r="14" fill="${colors[status]}" stroke="white" stroke-width="3"/>
        <text x="16" y="20" text-anchor="middle" fill="white" font-size="16" font-weight="bold">📦</text>
      </svg>
    `;

    return L.divIcon({
      html: svgIcon,
      className: "custom-marker",
      iconSize: [32, 32],
      iconAnchor: [16, 32],
      popupAnchor: [0, -32],
    });
  };

  return (
    <div style={{ position: "relative", height: "600px", width: "100%" }}>
      <MapContainer
        center={[19.076, 72.8777]}
        zoom={10}
        scrollWheelZoom={true}
        style={{
          height: "100%",
          width: "100%",
          borderRadius: "8px",
          zIndex: 0,
        }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {deliveries.map((delivery) => {
          const currentLat = delivery.vehicle.location.lat;
          const currentLng = delivery.vehicle.location.lng;

          // Get route polyline from stops
          const routeCoordinates: [number, number][] = delivery.stops.map(
            (stop) => [stop.location.lat, stop.location.lng]
          );

          return (
            <React.Fragment key={delivery.id}>
              {/* Route line */}
              {routeCoordinates.length > 1 && (
                <Polyline
                  positions={routeCoordinates}
                  pathOptions={{
                    color:
                      delivery.status === "Delayed" ? "#ef4444" : "#3b82f6",
                    weight: 3,
                    opacity: 0.7,
                    dashArray:
                      delivery.status === "Completed" ? "10, 10" : undefined,
                  }}
                />
              )}

              {/* Current vehicle position */}
              <Marker
                position={[currentLat, currentLng]}
                icon={createCustomIcon(delivery.status)}
              >
                <Popup>
                  <div style={{ minWidth: "220px" }}>
                    <h3
                      style={{
                        margin: "0 0 8px 0",
                        fontSize: "16px",
                        fontWeight: 600,
                      }}
                    >
                      {delivery.orderNumber}
                    </h3>
                    <div style={{ fontSize: "14px", marginBottom: "4px" }}>
                      <strong>Vehicle:</strong> {delivery.vehicle.vehicleNumber}
                    </div>
                    <div style={{ fontSize: "14px", marginBottom: "4px" }}>
                      <strong>Driver:</strong> {delivery.vehicle.driver.name}
                    </div>
                    <div style={{ fontSize: "14px", marginBottom: "4px" }}>
                      <strong>Route:</strong> {delivery.route}
                    </div>
                    <div style={{ fontSize: "14px", marginBottom: "4px" }}>
                      <strong>Status:</strong>{" "}
                      <span
                        style={{
                          padding: "2px 8px",
                          borderRadius: "4px",
                          backgroundColor:
                            delivery.status === "Completed"
                              ? "#d1fae5"
                              : delivery.status === "In Progress"
                              ? "#dbeafe"
                              : delivery.status === "Delayed"
                              ? "#fee2e2"
                              : delivery.status === "Scheduled"
                              ? "#f3f4f6"
                              : "#e5e7eb",
                          color:
                            delivery.status === "Completed"
                              ? "#065f46"
                              : delivery.status === "In Progress"
                              ? "#1e40af"
                              : delivery.status === "Delayed"
                              ? "#991b1b"
                              : delivery.status === "Scheduled"
                              ? "#1f2937"
                              : "#6b7280",
                          fontSize: "12px",
                          fontWeight: 500,
                        }}
                      >
                        {delivery.status}
                      </span>
                    </div>
                    <div style={{ fontSize: "14px", marginBottom: "4px" }}>
                      <strong>Progress:</strong> {delivery.progress}%
                    </div>
                    <div style={{ fontSize: "14px", marginBottom: "8px" }}>
                      <strong>ETA:</strong>{" "}
                      {delivery.eta.toLocaleTimeString("en-IN", {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </div>
                    <button
                      onClick={() => navigate(`/deliveries/${delivery.id}`)}
                      style={{
                        width: "100%",
                        padding: "8px",
                        backgroundColor: "#2563eb",
                        color: "white",
                        border: "none",
                        borderRadius: "4px",
                        cursor: "pointer",
                        fontSize: "14px",
                        fontWeight: 500,
                      }}
                    >
                      View Details
                    </button>
                  </div>
                </Popup>
              </Marker>

              {/* Markers for each stop */}
              {delivery.stops.map((stop, index) => (
                <Marker
                  key={stop.id}
                  position={[stop.location.lat, stop.location.lng]}
                  icon={L.divIcon({
                    html: `
                      <div style="
                        background-color: ${
                          stop.status === "Completed" ? "#10b981" : "#6b7280"
                        };
                        width: 20px;
                        height: 20px;
                        border-radius: 50%;
                        border: 2px solid white;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        color: white;
                        font-size: 10px;
                        font-weight: bold;
                      ">${index + 1}</div>
                    `,
                    className: "stop-marker",
                    iconSize: [20, 20],
                    iconAnchor: [10, 10],
                  })}
                >
                  <Popup>
                    <div style={{ minWidth: "180px" }}>
                      <h4 style={{ margin: "0 0 6px 0", fontSize: "14px" }}>
                        Stop {index + 1}: {stop.type}
                      </h4>
                      <div style={{ fontSize: "13px", marginBottom: "3px" }}>
                        <strong>Location:</strong> {stop.location.address}
                      </div>
                      <div style={{ fontSize: "13px", marginBottom: "3px" }}>
                        <strong>Status:</strong> {stop.status}
                      </div>
                      {stop.actualTime && (
                        <div style={{ fontSize: "13px" }}>
                          <strong>Completed:</strong>{" "}
                          {stop.actualTime.toLocaleTimeString("en-IN", {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </div>
                      )}
                    </div>
                  </Popup>
                </Marker>
              ))}
            </React.Fragment>
          );
        })}
      </MapContainer>

      {/* Map Legend */}
      <div className="map-legend">
        <div className="map-legend__title">Delivery Status</div>
        <div className="map-legend__items">
          <div className="map-legend__item">
            <div className="map-legend__marker map-legend__marker--scheduled"></div>
            <span>Scheduled</span>
          </div>
          <div className="map-legend__item">
            <div className="map-legend__marker map-legend__marker--in-progress"></div>
            <span>In Progress</span>
          </div>
          <div className="map-legend__item">
            <div className="map-legend__marker map-legend__marker--delayed"></div>
            <span>Delayed</span>
          </div>
          <div className="map-legend__item">
            <div className="map-legend__marker map-legend__marker--completed"></div>
            <span>Completed</span>
          </div>
        </div>
      </div>
    </div>
  );
};
