import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Truck,
  User,
  MapPin,
  Package,
  Gauge,
  Calendar,
  AlertCircle,
} from "lucide-react";
import { Card, CardBody, Button, StatusBadge } from "../../common";
import "./VehicleDetails.css";
import { useLogistics } from "../../../context/LogisticsContext";

export const VehicleDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { vehicles } = useLogistics();
  const vehicle = vehicles.find((v) => v.id === id);

  if (!vehicle) {
    return (
      <div className="vehicle-details">
        <div className="empty-state">
          <AlertCircle size={48} className="empty-state__icon" />
          <h2>Vehicle Not Found</h2>
          <p>The vehicle you're looking for doesn't exist.</p>
          <Button
            onClick={() => navigate("/fleet")}
            style={{ marginTop: "var(--spacing-lg)" }}
          >
            Back to Fleet
          </Button>
        </div>
      </div>
    );
  }

  const capacityPercentage = (vehicle.currentLoad / vehicle.capacity) * 100;

  return (
    <div className="vehicle-details">
      <div className="vehicle-details__header">
        <Button variant="ghost" onClick={() => navigate("/fleet")}>
          <ArrowLeft size={20} />
          Back to Fleet
        </Button>
      </div>

      <Card className="vehicle-overview">
        <CardBody>
          <div className="vehicle-overview__header">
            <div className="vehicle-overview__title">
              <div className="vehicle-icon">
                <Truck size={32} />
              </div>
              <div>
                <h1>{vehicle.vehicleNumber}</h1>
                <p className="vehicle-overview__type">{vehicle.type}</p>
              </div>
            </div>
            <StatusBadge status={vehicle.status} size="lg" />
          </div>

          <div className="vehicle-stats">
            <div className="stat-card">
              <div className="stat-card__icon">
                <Gauge size={24} />
              </div>
              <div>
                <p className="stat-card__label">Current Load</p>
                <p className="stat-card__value">
                  {vehicle.currentLoad} / {vehicle.capacity} kg
                </p>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-card__icon">
                <Package size={24} />
              </div>
              <div>
                <p className="stat-card__label">Capacity</p>
                <p className="stat-card__value">{vehicle.capacity} kg</p>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-card__icon">
                <MapPin size={24} />
              </div>
              <div>
                <p className="stat-card__label">Current Location</p>
                <p className="stat-card__value">
                  {vehicle.location.address.split(",")[0]}
                </p>
              </div>
            </div>
          </div>

          <div className="capacity-section">
            <div className="capacity-section__header">
              <span className="capacity-section__label">Load Capacity</span>
              <span className="capacity-section__value">
                {capacityPercentage.toFixed(0)}%
              </span>
            </div>
            <div className="capacity-bar-large">
              <div
                className="capacity-bar-large__fill"
                style={{ width: `${capacityPercentage}%` }}
              />
            </div>
          </div>
        </CardBody>
      </Card>

      <div className="vehicle-grid">
        <Card>
          <CardBody>
            <div className="info-section__header">
              <User size={20} />
              <h3>Driver Information</h3>
            </div>
            <div className="info-section__content">
              <div className="info-item">
                <span className="info-item__label">Name</span>
                <span className="info-item__value">{vehicle.driver.name}</span>
              </div>
              <div className="info-item">
                <span className="info-item__label">Phone</span>
                <span className="info-item__value">{vehicle.driver.phone}</span>
              </div>
              <div className="info-item">
                <span className="info-item__label">License</span>
                <span className="info-item__value">
                  {vehicle.driver.licenseNumber}
                </span>
              </div>
            </div>
          </CardBody>
        </Card>

        <Card>
          <CardBody>
            <div className="info-section__header">
              <MapPin size={20} />
              <h3>Location Details</h3>
            </div>
            <div className="info-section__content">
              <div className="info-item">
                <span className="info-item__label">Address</span>
                <span className="info-item__value">
                  {vehicle.location.address}
                </span>
              </div>
              <div className="info-item">
                <span className="info-item__label">Area</span>
                <span className="info-item__value">
                  {vehicle.location.address.split(",")[1] || "N/A"}
                </span>
              </div>
              <div className="info-item">
                <span className="info-item__label">Coordinates</span>
                <span className="info-item__value">
                  {vehicle.location.lat.toFixed(4)},{" "}
                  {vehicle.location.lng.toFixed(4)}
                </span>
              </div>
            </div>
          </CardBody>
        </Card>

        <Card>
          <CardBody>
            <div className="info-section__header">
              <Truck size={20} />
              <h3>Vehicle Specifications</h3>
            </div>
            <div className="info-section__content">
              <div className="info-item">
                <span className="info-item__label">Type</span>
                <span className="info-item__value">{vehicle.type}</span>
              </div>
              <div className="info-item">
                <span className="info-item__label">Max Capacity</span>
                <span className="info-item__value">{vehicle.capacity} kg</span>
              </div>
              <div className="info-item">
                <span className="info-item__label">Registration</span>
                <span className="info-item__value">
                  {vehicle.vehicleNumber}
                </span>
              </div>
            </div>
          </CardBody>
        </Card>

        <Card>
          <CardBody>
            <div className="info-section__header">
              <Calendar size={20} />
              <h3>Status & Activity</h3>
            </div>
            <div className="info-section__content">
              <div className="info-item">
                <span className="info-item__label">Current Status</span>
                <StatusBadge status={vehicle.status} />
              </div>
              <div className="info-item">
                <span className="info-item__label">Current Load</span>
                <span className="info-item__value">
                  {vehicle.currentLoad} kg
                </span>
              </div>
              <div className="info-item">
                <span className="info-item__label">Available Capacity</span>
                <span className="info-item__value">
                  {vehicle.capacity - vehicle.currentLoad} kg
                </span>
              </div>
            </div>
          </CardBody>
        </Card>
      </div>

      <div className="vehicle-actions">
        {vehicle.status === "Available" && (
          <Button onClick={() => navigate("/assign")}>Assign to Order</Button>
        )}
        <Button variant="outline" onClick={() => navigate("/fleet")}>
          Back to Fleet
        </Button>
      </div>
    </div>
  );
};
