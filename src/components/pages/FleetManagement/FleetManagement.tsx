import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardBody, StatusBadge, Button } from "../../common";
import { useLogistics } from "../../../context/LogisticsContext";
import { AddVehicleForm } from "../VehicleAssignment/AddVehicleForm";
import { Vehicle, VehicleStatus } from "../../../types";
import { Search, Filter, MapPin, User, Package } from "lucide-react";
import "./FleetManagement.css";

function Modal({
  open,
  onClose,
  children,
}: {
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
}) {
  if (!open) return null;
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" aria-label="Close" onClick={onClose}>
          &times;
        </button>
        {children}
      </div>
    </div>
  );
}

export const FleetManagement: React.FC = () => {
  const { vehicles, setVehicles } = useLogistics();
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<VehicleStatus | "All">(
    "All"
  );
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [showAddForm, setShowAddForm] = useState(false);

  const filteredVehicles = vehicles.filter((vehicle) => {
    const matchesSearch =
      vehicle.vehicleNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      vehicle.driver.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus =
      statusFilter === "All" || vehicle.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const statusCounts = {
    All: vehicles.length,
    Available: vehicles.filter((v) => v.status === "Available").length,
    "In Transit": vehicles.filter((v) => v.status === "In Transit").length,
    Loading: vehicles.filter((v) => v.status === "Loading").length,
    Unloading: vehicles.filter((v) => v.status === "Unloading").length,
    Maintenance: vehicles.filter((v) => v.status === "Maintenance").length,
  };

  return (
    <div className="fleet-management">
      <div className="fleet-management__header">
        <div>
          <h1>Fleet Management</h1>
          <p className="fleet-management__subtitle">
            Manage and monitor your vehicle fleet in real-time
          </p>
        </div>
        <div className="fleet-management__actions">
          <Button
            icon={<Package size={16} />}
            onClick={() => setShowAddForm(true)}
          >
            Add Vehicle
          </Button>
        </div>
      </div>

      {/* Add Vehicle Modal */}
      <Modal open={showAddForm} onClose={() => setShowAddForm(false)}>
        <Card>
          <CardBody>
            <AddVehicleForm
              onAdd={(vehicle) => {
                setVehicles((prev) => [...prev, vehicle]);
                setShowAddForm(false);
              }}
              onCancel={() => setShowAddForm(false)}
            />
          </CardBody>
        </Card>
      </Modal>

      {/* Filters and Search */}
      <Card className="fleet-management__controls">
        <CardBody>
          <div className="controls-row">
            <div className="search-box">
              <Search size={18} className="search-box__icon" />
              <input
                type="text"
                className="search-box__input"
                placeholder="Search by vehicle number or driver name..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="view-toggle">
              <button
                className={`view-toggle__btn ${
                  viewMode === "grid" ? "view-toggle__btn--active" : ""
                }`}
                onClick={() => setViewMode("grid")}
              >
                Grid
              </button>
              <button
                className={`view-toggle__btn ${
                  viewMode === "list" ? "view-toggle__btn--active" : ""
                }`}
                onClick={() => setViewMode("list")}
              >
                List
              </button>
            </div>
          </div>
        </CardBody>
      </Card>

      {/* Status Filter Tabs */}
      <div className="status-tabs">
        {(Object.keys(statusCounts) as Array<VehicleStatus | "All">).map(
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

      {/* Vehicle Grid/List */}
      <div className={`vehicle-${viewMode}`}>
        {filteredVehicles.map((vehicle) => (
          <VehicleCard key={vehicle.id} vehicle={vehicle} />
        ))}
      </div>

      {filteredVehicles.length === 0 && (
        <div className="empty-state">
          <Filter size={48} className="empty-state__icon" />
          <h3>No vehicles found</h3>
          <p>Try adjusting your search or filter criteria</p>
        </div>
      )}
    </div>
  );
};

interface VehicleCardProps {
  vehicle: Vehicle;
}

const VehicleCard: React.FC<VehicleCardProps> = ({ vehicle }) => {
  const navigate = useNavigate();
  const capacityPercentage = (vehicle.currentLoad / vehicle.capacity) * 100;

  return (
    <Card className="vehicle-card" hoverable>
      <CardBody>
        <div className="vehicle-card__header">
          <div className="vehicle-card__info">
            <h3 className="vehicle-card__number">{vehicle.vehicleNumber}</h3>
            <p className="vehicle-card__type">{vehicle.type}</p>
          </div>
          <StatusBadge status={vehicle.status} size="sm" />
        </div>

        <div className="vehicle-card__details">
          <div className="vehicle-card__detail">
            <User size={14} className="vehicle-card__detail-icon" />
            <div>
              <p className="vehicle-card__detail-label">Driver</p>
              <p className="vehicle-card__detail-value">
                {vehicle.driver.name}
              </p>
            </div>
          </div>

          <div className="vehicle-card__detail">
            <MapPin size={14} className="vehicle-card__detail-icon" />
            <div>
              <p className="vehicle-card__detail-label">Location</p>
              <p className="vehicle-card__detail-value">
                {vehicle.location.address}
              </p>
            </div>
          </div>
        </div>

        <div className="vehicle-card__capacity">
          <div className="vehicle-card__capacity-header">
            <span className="vehicle-card__capacity-label">Capacity</span>
            <span className="vehicle-card__capacity-value">
              {vehicle.currentLoad} / {vehicle.capacity} kg
            </span>
          </div>
          <div className="capacity-bar">
            <div
              className="capacity-bar__fill"
              style={{ width: `${capacityPercentage}%` }}
            ></div>
          </div>
        </div>

        <div className="vehicle-card__actions">
          <Button
            variant="outline"
            size="sm"
            fullWidth
            onClick={(e) => {
              e.stopPropagation();
              navigate(`/fleet/${vehicle.id}`);
            }}
          >
            View Details
          </Button>
          {vehicle.status === "Available" && (
            <Button
              size="sm"
              fullWidth
              onClick={(e) => {
                e.stopPropagation();
                navigate("/assign");
              }}
            >
              Assign Order
            </Button>
          )}
        </div>
      </CardBody>
    </Card>
  );
};
