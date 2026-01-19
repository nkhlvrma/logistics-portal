import React from "react";
import { useNavigate } from "react-router-dom";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Polyline,
} from "react-leaflet";
import { Icon, DivIcon } from "leaflet";
import { Card, CardHeader, CardBody, Button } from "../../common";
import { useLogistics } from "../../../context/LogisticsContext";
import { MapPin, Navigation, ExternalLink } from "lucide-react";
import "./ShipmentTracker.css";
import "leaflet/dist/leaflet.css";

const STATUS_COLORS: Record<string, string> = {
  Available: "#10b981",
  "In Transit": "#3b82f6",
  Loading: "#f59e0b",
  Unloading: "#8b5cf6",
  Maintenance: "#ef4444",
  Delayed: "#ef4444",
  "In Progress": "#3b82f6",
  Scheduled: "#6b7280",
};

const createVehicleIcon = (status: string) => {
  const color = STATUS_COLORS[status] || "#6b7280";
  return new DivIcon({
    className: "vehicle-marker",
    html: `
      <div class="vehicle-marker__wrapper" style="--marker-color: ${color}">
        <div class="vehicle-marker__dot"></div>
        <div class="vehicle-marker__pulse"></div>
      </div>
    `,
    iconSize: [24, 24],
    iconAnchor: [12, 12],
  });
};

export const ShipmentTracker: React.FC = () => {
  const navigate = useNavigate();
  const { vehicles, deliveries } = useLogistics();

  // Filter active vehicles (those with location data)
  const activeVehicles = vehicles.filter(
    (v) => v.location && v.location.lat && v.location.lng
  );

  // Get active deliveries for route lines
  const activeDeliveries = deliveries.filter((d) =>
    ["In Progress", "Delayed"].includes(d.status)
  );

  // Center map on Mumbai region
  const mapCenter: [number, number] = [19.076, 72.8777];

  // Calculate stats
  const inTransitCount = vehicles.filter(
    (v) => v.status === "In Transit"
  ).length;
  const delayedCount = deliveries.filter((d) => d.status === "Delayed").length;

  return (
    <Card className="shipment-tracker">
      <CardHeader
        title="Live Shipment Tracking"
        subtitle={`${inTransitCount} vehicles in transit`}
        actions={
          <div className="shipment-tracker__header-actions">
            {delayedCount > 0 && (
              <span className="shipment-tracker__alert-badge">
                {delayedCount} delayed
              </span>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate("/deliveries")}
            >
              <ExternalLink size={14} />
              Full Map
            </Button>
          </div>
        }
      />
      <CardBody className="shipment-tracker__body">
        <div className="shipment-tracker__map-container">
          <MapContainer
            center={mapCenter}
            zoom={10}
            scrollWheelZoom={false}
            className="shipment-tracker__map"
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a>'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />

            {/* Vehicle Markers */}
            {activeVehicles.map((vehicle) => (
              <Marker
                key={vehicle.id}
                position={[vehicle.location.lat, vehicle.location.lng]}
                icon={createVehicleIcon(vehicle.status)}
              >
                <Popup className="vehicle-popup">
                  <div className="vehicle-popup__content">
                    <div className="vehicle-popup__header">
                      <span className="vehicle-popup__number">
                        {vehicle.vehicleNumber}
                      </span>
                      <span
                        className="vehicle-popup__status"
                        style={{
                          backgroundColor: STATUS_COLORS[vehicle.status],
                        }}
                      >
                        {vehicle.status}
                      </span>
                    </div>
                    <div className="vehicle-popup__details">
                      <p>
                        <strong>Driver:</strong> {vehicle.driver.name}
                      </p>
                      <p>
                        <strong>Location:</strong> {vehicle.location.address}
                      </p>
                      <p>
                        <strong>Load:</strong> {vehicle.currentLoad}/
                        {vehicle.capacity} kg
                      </p>
                    </div>
                    <Button
                      size="sm"
                      onClick={() => navigate(`/fleet`)}
                      style={{ marginTop: "8px", width: "100%" }}
                    >
                      View Details
                    </Button>
                  </div>
                </Popup>
              </Marker>
            ))}

            {/* Route Lines for Active Deliveries */}
            {activeDeliveries.map((delivery) => {
              const stops = delivery.stops;
              if (stops.length < 2) return null;

              const positions: [number, number][] = stops.map((stop) => [
                stop.location.lat,
                stop.location.lng,
              ]);

              return (
                <Polyline
                  key={delivery.id}
                  positions={positions}
                  color={STATUS_COLORS[delivery.status]}
                  weight={3}
                  opacity={0.7}
                  dashArray={
                    delivery.status === "Delayed" ? "10, 10" : undefined
                  }
                />
              );
            })}
          </MapContainer>
        </div>

        {/* Legend */}
        <div className="shipment-tracker__legend">
          <div className="shipment-tracker__legend-item">
            <span
              className="shipment-tracker__legend-dot"
              style={{ backgroundColor: STATUS_COLORS["Available"] }}
            />
            <span>Available</span>
          </div>
          <div className="shipment-tracker__legend-item">
            <span
              className="shipment-tracker__legend-dot"
              style={{ backgroundColor: STATUS_COLORS["In Transit"] }}
            />
            <span>In Transit</span>
          </div>
          <div className="shipment-tracker__legend-item">
            <span
              className="shipment-tracker__legend-dot"
              style={{ backgroundColor: STATUS_COLORS["Loading"] }}
            />
            <span>Loading</span>
          </div>
          <div className="shipment-tracker__legend-item">
            <span
              className="shipment-tracker__legend-dot"
              style={{ backgroundColor: STATUS_COLORS["Delayed"] }}
            />
            <span>Delayed</span>
          </div>
        </div>
      </CardBody>
    </Card>
  );
};
