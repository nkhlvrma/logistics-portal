import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardBody, StatusBadge, Button } from "../../common";
import { DeliveryStatus } from "../../../types";
import { Search, Filter, MapPin, Clock } from "lucide-react";
import { DeliveryMap } from "./DeliveryMap";
import "./Deliveries.css";
import { useLogistics } from "../../../context/LogisticsContext";

export const Deliveries: React.FC = () => {
  const navigate = useNavigate();
  const { deliveries } = useLogistics();
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<DeliveryStatus | "All">(
    "All"
  );
  const [showMap, setShowMap] = useState(false);

  const filteredDeliveries = deliveries.filter((delivery) => {
    const matchesSearch =
      delivery.orderNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      delivery.vehicle.vehicleNumber
        .toLowerCase()
        .includes(searchQuery.toLowerCase());

    const matchesStatus =
      statusFilter === "All" || delivery.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const statusCounts = {
    All: deliveries.length,
    Scheduled: deliveries.filter((d) => d.status === "Scheduled").length,
    "In Progress": deliveries.filter((d) => d.status === "In Progress").length,
    Delayed: deliveries.filter((d) => d.status === "Delayed").length,
    Completed: deliveries.filter((d) => d.status === "Completed").length,
    Cancelled: deliveries.filter((d) => d.status === "Cancelled").length,
  };

  return (
    <div className="deliveries">
      <div className="deliveries__header">
        <div>
          <h1>Active Deliveries</h1>
          <p className="deliveries__subtitle">
            Monitor and track all ongoing deliveries in real-time
          </p>
        </div>
        <Button
          variant={showMap ? "primary" : "outline"}
          icon={<MapPin size={16} />}
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            setShowMap(!showMap);
          }}
          type="button"
        >
          {showMap ? "Hide Map" : "View Map"}
        </Button>
      </div>

      {/* Search and Filters */}
      <Card className="deliveries__controls">
        <CardBody>
          <div className="search-box">
            <Search size={18} className="search-box__icon" aria-hidden="true" />
            <input
              type="text"
              className="search-box__input"
              placeholder="Search by order number or vehicle..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              aria-label="Search deliveries by order number or vehicle"
            />
          </div>
        </CardBody>
      </Card>

      {/* Status Filter Tabs */}
      <div className="status-tabs">
        {(Object.keys(statusCounts) as Array<DeliveryStatus | "All">).map(
          (status) => (
            <button
              key={status}
              className={`status-tab ${
                statusFilter === status ? "status-tab--active" : ""
              }`}
              onClick={() => setStatusFilter(status)}
            >
              <span className="status-tab__label">{status}</span>
              <span className="status-tab__count">{statusCounts[status]}</span>
            </button>
          )
        )}
      </div>

      {/* Interactive Map View */}
      {showMap && (
        <Card className="delivery-map-card">
          <CardBody>
            <DeliveryMap deliveries={filteredDeliveries} />
          </CardBody>
        </Card>
      )}

      {/* Deliveries Table */}
      <Card>
        <CardBody>
          <div className="deliveries-table">
            <div className="deliveries-table__header">
              <div className="deliveries-table__cell">Order</div>
              <div className="deliveries-table__cell">Vehicle</div>
              <div className="deliveries-table__cell">Route</div>
              <div className="deliveries-table__cell">Status</div>
              <div className="deliveries-table__cell">Progress</div>
              <div className="deliveries-table__cell">ETA</div>
              <div className="deliveries-table__cell">Actions</div>
            </div>

            {filteredDeliveries.map((delivery) => (
              <div
                key={delivery.id}
                className="deliveries-table__row"
                onClick={() => {
                  navigate(`/deliveries/${delivery.id}`);
                }}
              >
                <div className="deliveries-table__cell">
                  <div className="cell-content">
                    <p className="cell-content__primary">
                      {delivery.orderNumber}
                    </p>
                    <p className="cell-content__secondary">
                      Started{" "}
                      {delivery.startTime.toLocaleTimeString("en-IN", {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>
                </div>

                <div className="deliveries-table__cell">
                  <div className="cell-content">
                    <p className="cell-content__primary">
                      {delivery.vehicle.vehicleNumber}
                    </p>
                    <p className="cell-content__secondary">
                      {delivery.vehicle.driver.name}
                    </p>
                  </div>
                </div>

                <div className="deliveries-table__cell">
                  <div className="cell-content">
                    <div className="route-info">
                      <MapPin size={14} />
                      <span>{delivery.route}</span>
                    </div>
                  </div>
                </div>

                <div className="deliveries-table__cell">
                  <StatusBadge status={delivery.status} />
                </div>

                <div className="deliveries-table__cell">
                  <div className="progress-container">
                    <div className="progress-bar">
                      <div
                        className="progress-bar__fill"
                        style={{ width: `${delivery.progress}%` }}
                      ></div>
                    </div>
                    <span className="progress-text">{delivery.progress}%</span>
                  </div>
                </div>

                <div className="deliveries-table__cell">
                  <div className="cell-content">
                    <div className="eta-info">
                      <Clock size={14} />
                      <span>
                        {delivery.eta.toLocaleTimeString("en-IN", {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="deliveries-table__cell">
                  <div className="table-actions">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/deliveries/${delivery.id}`);
                      }}
                    >
                      Track
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/deliveries/${delivery.id}`);
                      }}
                    >
                      Details
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {filteredDeliveries.length === 0 && (
            <div className="empty-state">
              <Filter size={48} className="empty-state__icon" />
              <h3>No deliveries found</h3>
              <p>Try adjusting your search or filter criteria</p>
            </div>
          )}
        </CardBody>
      </Card>
    </div>
  );
};
