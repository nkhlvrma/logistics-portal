import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, CardBody, StatusBadge, Button } from "../../common";
import {
  ArrowLeft,
  MapPin,
  User,
  Truck,
  Clock,
  Package,
  CheckCircle,
} from "lucide-react";
import "./DeliveryDetails.css";
import { useLogistics } from "../../../context/LogisticsContext";

export const DeliveryDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { deliveries } = useLogistics();
  const delivery = deliveries.find((d) => d.id === id);

  if (!delivery) {
    return (
      <div className="delivery-details">
        <div className="delivery-details__header">
          <Button
            variant="outline"
            icon={<ArrowLeft size={16} />}
            onClick={() => navigate("/deliveries")}
          >
            Back to Deliveries
          </Button>
        </div>
        <Card>
          <CardBody>
            <div className="empty-state">
              <h2>Delivery Not Found</h2>
              <p>The delivery you're looking for doesn't exist.</p>
            </div>
          </CardBody>
        </Card>
      </div>
    );
  }

  return (
    <div className="delivery-details">
      <div className="delivery-details__header">
        <Button
          variant="outline"
          icon={<ArrowLeft size={16} />}
          onClick={() => navigate("/deliveries")}
        >
          Back to Deliveries
        </Button>
        <h1>Delivery Details</h1>
      </div>

      {/* Overview Card */}
      <Card>
        <CardBody>
          <div className="delivery-overview">
            <div className="delivery-overview__header">
              <div>
                <h2>{delivery.orderNumber}</h2>
                <p className="delivery-overview__route">{delivery.route}</p>
              </div>
              <StatusBadge status={delivery.status} />
            </div>

            <div className="delivery-overview__stats">
              <div className="stat-card">
                <div className="stat-card__icon">
                  <Clock size={20} />
                </div>
                <div className="stat-card__content">
                  <p className="stat-card__label">Started</p>
                  <p className="stat-card__value">
                    {delivery.startTime.toLocaleString("en-IN", {
                      dateStyle: "medium",
                      timeStyle: "short",
                    })}
                  </p>
                </div>
              </div>

              <div className="stat-card">
                <div className="stat-card__icon">
                  <Clock size={20} />
                </div>
                <div className="stat-card__content">
                  <p className="stat-card__label">ETA</p>
                  <p className="stat-card__value">
                    {delivery.eta.toLocaleString("en-IN", {
                      dateStyle: "medium",
                      timeStyle: "short",
                    })}
                  </p>
                </div>
              </div>

              <div className="stat-card">
                <div className="stat-card__icon">
                  <Package size={20} />
                </div>
                <div className="stat-card__content">
                  <p className="stat-card__label">Progress</p>
                  <p className="stat-card__value">{delivery.progress}%</p>
                </div>
              </div>
            </div>

            <div className="progress-section">
              <div className="progress-bar-large">
                <div
                  className="progress-bar-large__fill"
                  style={{ width: `${delivery.progress}%` }}
                ></div>
              </div>
            </div>
          </div>
        </CardBody>
      </Card>

      {/* Vehicle & Driver Info */}
      <div className="delivery-grid">
        <Card>
          <CardBody>
            <div className="info-section">
              <div className="info-section__header">
                <Truck size={20} />
                <h3>Vehicle Information</h3>
              </div>
              <div className="info-section__content">
                <div className="info-item">
                  <span className="info-item__label">Vehicle Number</span>
                  <span className="info-item__value">
                    {delivery.vehicle.vehicleNumber}
                  </span>
                </div>
                <div className="info-item">
                  <span className="info-item__label">Type</span>
                  <span className="info-item__value">
                    {delivery.vehicle.type}
                  </span>
                </div>
                <div className="info-item">
                  <span className="info-item__label">Status</span>
                  <StatusBadge status={delivery.vehicle.status} size="sm" />
                </div>
                <div className="info-item">
                  <span className="info-item__label">Current Load</span>
                  <span className="info-item__value">
                    {delivery.vehicle.currentLoad} / {delivery.vehicle.capacity}{" "}
                    kg
                  </span>
                </div>
              </div>
            </div>
          </CardBody>
        </Card>

        <Card>
          <CardBody>
            <div className="info-section">
              <div className="info-section__header">
                <User size={20} />
                <h3>Driver Information</h3>
              </div>
              <div className="info-section__content">
                <div className="info-item">
                  <span className="info-item__label">Name</span>
                  <span className="info-item__value">
                    {delivery.vehicle.driver.name}
                  </span>
                </div>
                <div className="info-item">
                  <span className="info-item__label">Phone</span>
                  <span className="info-item__value">
                    {delivery.vehicle.driver.phone}
                  </span>
                </div>
                <div className="info-item">
                  <span className="info-item__label">License Number</span>
                  <span className="info-item__value">
                    {delivery.vehicle.driver.licenseNumber}
                  </span>
                </div>
              </div>
            </div>
          </CardBody>
        </Card>
      </div>

      {/* Route Stops */}
      <Card>
        <CardBody>
          <div className="route-section">
            <div className="route-section__header">
              <MapPin size={20} />
              <h3>Route & Stops</h3>
            </div>
            <div className="route-timeline">
              {delivery.stops.map((stop, index) => (
                <div
                  key={stop.id}
                  className={`timeline-item ${
                    stop.status === "Completed"
                      ? "timeline-item--completed"
                      : ""
                  }`}
                >
                  <div className="timeline-item__marker">
                    {stop.status === "Completed" ? (
                      <CheckCircle size={24} />
                    ) : (
                      <span className="timeline-item__number">{index + 1}</span>
                    )}
                  </div>
                  <div className="timeline-item__content">
                    <div className="timeline-item__header">
                      <div>
                        <h4 className="timeline-item__title">
                          {stop.type} - Stop {index + 1}
                        </h4>
                        <p className="timeline-item__address">
                          {stop.location.address}
                        </p>
                      </div>
                      <StatusBadge status={stop.status} size="sm" />
                    </div>
                    <div className="timeline-item__details">
                      <div className="timeline-detail">
                        <Clock size={14} />
                        <span>
                          Scheduled:{" "}
                          {stop.scheduledTime.toLocaleTimeString("en-IN", {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </span>
                      </div>
                      {stop.actualTime && (
                        <div className="timeline-detail">
                          <CheckCircle size={14} />
                          <span>
                            Completed:{" "}
                            {stop.actualTime.toLocaleTimeString("en-IN", {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </span>
                        </div>
                      )}
                      {stop.notes && (
                        <div className="timeline-detail timeline-detail--note">
                          <span>Note: {stop.notes}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </CardBody>
      </Card>
    </div>
  );
};
