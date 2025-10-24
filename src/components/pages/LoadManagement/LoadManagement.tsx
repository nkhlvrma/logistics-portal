import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardHeader, CardBody, Button, StatusBadge } from "../../common";
import { Package, CheckCircle, Truck, User, Clock } from "lucide-react";
import { useLogistics } from "../../../context/LogisticsContext";
import "./LoadManagement.css";

interface LoadItem {
  id: string;
  productName: string;
  quantity: number;
  unit: string;
  crateCount: number;
  isLoaded: boolean;
}

export const LoadManagement: React.FC = () => {
  const navigate = useNavigate();
  const { vehicles } = useLogistics();
  const activeVehicles = vehicles.filter(
    (v) =>
      v.status === "Available" ||
      v.status === "Loading" ||
      v.status === "In Transit"
  );
  const [selectedVehicleId, setSelectedVehicleId] = useState<string>(
    activeVehicles.length > 0 ? activeVehicles[0].id : vehicles[0]?.id || ""
  );
  const [loadMode, setLoadMode] = useState<"loading" | "unloading">("loading");

  const selectedVehicle = activeVehicles.find(
    (v) => v.id === selectedVehicleId
  );

  // Mock load items based on orders
  const [loadItems, setLoadItems] = useState<LoadItem[]>([
    {
      id: "1",
      productName: "Tomato Seeds - Hybrid",
      quantity: 500,
      unit: "kg",
      crateCount: 10,
      isLoaded: false,
    },
    {
      id: "2",
      productName: "Organic Fertilizer",
      quantity: 2000,
      unit: "kg",
      crateCount: 40,
      isLoaded: false,
    },
    {
      id: "3",
      productName: "Mango Saplings",
      quantity: 300,
      unit: "units",
      crateCount: 15,
      isLoaded: false,
    },
    {
      id: "4",
      productName: "NPK Fertilizer",
      quantity: 1500,
      unit: "kg",
      crateCount: 30,
      isLoaded: false,
    },
  ]);

  const toggleLoadItem = (itemId: string) => {
    setLoadItems((items) =>
      items.map((item) =>
        item.id === itemId ? { ...item, isLoaded: !item.isLoaded } : item
      )
    );
  };

  const loadedCount = loadItems.filter((item) => item.isLoaded).length;
  const totalWeight = loadItems
    .filter((item) => item.isLoaded)
    .reduce((sum, item) => sum + (item.unit === "kg" ? item.quantity : 0), 0);

  const handleConfirmLoad = () => {
    const loadedItems = loadItems.filter((item) => item.isLoaded);
    if (loadedItems.length === 0) {
      return; // Do nothing if no items selected
    }

    // In a real app, this would make an API call
    // Reset and navigate to deliveries
    setLoadItems(
      loadItems.map((item) => ({
        ...item,
        isLoaded: false,
      }))
    );
    navigate("/deliveries");
  };

  return (
    <div className="load-management">
      <div className="load-management__header">
        <div>
          <h1>Load Management</h1>
          <p className="load-management__subtitle">
            Confirm crate loading and unloading for vehicles
          </p>
        </div>
        <div className="load-mode-toggle">
          <button
            className={`load-mode-btn ${
              loadMode === "loading" ? "load-mode-btn--active" : ""
            }`}
            onClick={() => setLoadMode("loading")}
          >
            Loading
          </button>
          <button
            className={`load-mode-btn ${
              loadMode === "unloading" ? "load-mode-btn--active" : ""
            }`}
            onClick={() => setLoadMode("unloading")}
          >
            Unloading
          </button>
        </div>
      </div>

      <div className="load-management__layout">
        {/* Vehicle Selection Tabs */}
        <Card className="vehicle-tabs-card">
          <CardHeader
            title="Select Vehicle"
            subtitle="Choose vehicle to manage load"
          />
          <CardBody>
            <div className="vehicle-tabs">
              {activeVehicles.map((vehicle) => (
                <button
                  key={vehicle.id}
                  className={`vehicle-tab ${
                    selectedVehicleId === vehicle.id
                      ? "vehicle-tab--active"
                      : ""
                  }`}
                  onClick={() => setSelectedVehicleId(vehicle.id)}
                >
                  <div className="vehicle-tab__icon">
                    <Truck size={20} />
                  </div>
                  <div className="vehicle-tab__info">
                    <p className="vehicle-tab__number">
                      {vehicle.vehicleNumber}
                    </p>
                    <p className="vehicle-tab__driver">{vehicle.driver.name}</p>
                  </div>
                  <StatusBadge status={vehicle.status} size="sm" />
                </button>
              ))}
            </div>
          </CardBody>
        </Card>

        {/* Selected Vehicle Info */}
        {selectedVehicle && (
          <Card className="selected-vehicle-card">
            <CardBody>
              <div className="selected-vehicle">
                <div className="selected-vehicle__header">
                  <Truck size={24} className="selected-vehicle__icon" />
                  <div className="selected-vehicle__info">
                    <h3>{selectedVehicle.vehicleNumber}</h3>
                    <p>{selectedVehicle.type}</p>
                  </div>
                  <StatusBadge status={selectedVehicle.status} />
                </div>
                <div className="selected-vehicle__details">
                  <div className="detail-item">
                    <User size={16} />
                    <span>{selectedVehicle.driver.name}</span>
                  </div>
                  <div className="detail-item">
                    <Package size={16} />
                    <span>
                      Capacity: {selectedVehicle.currentLoad}/
                      {selectedVehicle.capacity} kg
                    </span>
                  </div>
                  <div className="detail-item">
                    <Clock size={16} />
                    <span>
                      Last Updated: {new Date().toLocaleTimeString("en-IN")}
                    </span>
                  </div>
                </div>
              </div>
            </CardBody>
          </Card>
        )}

        {/* Load Items List */}
        <Card className="load-items-card">
          <CardHeader
            title={`${
              loadMode === "loading" ? "Items to Load" : "Items to Unload"
            }`}
            subtitle={`${loadedCount}/${loadItems.length} items confirmed`}
          />
          <CardBody>
            <div className="load-summary">
              <div className="load-summary__stat">
                <span className="load-summary__label">Total Weight</span>
                <span className="load-summary__value">{totalWeight} kg</span>
              </div>
              <div className="load-summary__stat">
                <span className="load-summary__label">Total Crates</span>
                <span className="load-summary__value">
                  {loadItems
                    .filter((item) => item.isLoaded)
                    .reduce((sum, item) => sum + item.crateCount, 0)}
                </span>
              </div>
              <div className="load-summary__stat">
                <span className="load-summary__label">Items Confirmed</span>
                <span className="load-summary__value">
                  {loadedCount}/{loadItems.length}
                </span>
              </div>
            </div>

            <div className="load-items-list">
              {loadItems.map((item) => (
                <div
                  key={item.id}
                  className={`load-item ${
                    item.isLoaded ? "load-item--loaded" : ""
                  }`}
                  onClick={() => toggleLoadItem(item.id)}
                >
                  <div className="load-item__checkbox">
                    <input
                      type="checkbox"
                      checked={item.isLoaded}
                      onChange={() => toggleLoadItem(item.id)}
                      onClick={(e) => e.stopPropagation()}
                    />
                  </div>
                  <div className="load-item__content">
                    <div className="load-item__header">
                      <h4 className="load-item__name">{item.productName}</h4>
                      {item.isLoaded && (
                        <CheckCircle
                          size={20}
                          className="load-item__check-icon"
                        />
                      )}
                    </div>
                    <div className="load-item__details">
                      <span className="load-item__quantity">
                        {item.quantity} {item.unit}
                      </span>
                      <span className="load-item__separator">•</span>
                      <span className="load-item__crates">
                        {item.crateCount} crates
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="load-actions">
              <Button
                variant="outline"
                fullWidth
                onClick={() =>
                  setLoadItems((items) =>
                    items.map((item) => ({ ...item, isLoaded: false }))
                  )
                }
                disabled={loadedCount === 0}
              >
                Clear Selection
              </Button>
              <Button
                fullWidth
                onClick={handleConfirmLoad}
                disabled={loadedCount === 0}
                icon={<CheckCircle size={16} />}
              >
                Confirm {loadMode === "loading" ? "Loading" : "Unloading"} (
                {loadedCount})
              </Button>
            </div>
          </CardBody>
        </Card>
      </div>
    </div>
  );
};
