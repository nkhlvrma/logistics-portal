import React, { useState } from "react";
import { Card, CardHeader, CardBody, Button, StatusBadge } from "../../common";
import {
  Package,
  Truck,
  MapPin,
  Calendar,
  CheckCircle2,
  ArrowRight,
  User,
  Weight,
} from "lucide-react";
import "./VehicleAssignment.css";
import { useLogistics } from "../../../context/LogisticsContext";
import { Order, Vehicle } from "../../../types";
type Step = "order" | "vehicle" | "confirm";

export const VehicleAssignment: React.FC = () => {
  const { orders, setOrders, vehicles, setVehicles, setDeliveries } =
    useLogistics();
  const [currentStep, setCurrentStep] = useState<Step>("order");
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);

  // Only show orders that are Pending
  const pendingOrders = orders.filter((order) => order.status === "Pending");
  // Only show vehicles that are Available
  const availableVehicles = vehicles.filter(
    (vehicle) => vehicle.status === "Available"
  );
  // Filter vehicles based on selected order's capacity requirement
  const compatibleVehicles = selectedOrder
    ? availableVehicles.filter(
        (vehicle) => vehicle.capacity >= selectedOrder.requiredCapacity
      )
    : availableVehicles;

  // Select order and go to next step
  const handleOrderSelect = (order: Order) => {
    setSelectedOrder(order);
    setCurrentStep("vehicle");
  };

  // Select vehicle and go to next step
  const handleVehicleSelect = (vehicle: Vehicle) => {
    setSelectedVehicle(vehicle);
    setCurrentStep("confirm");
  };

  // Confirm assignment: update order, vehicle, and deliveries state
  const handleConfirmAssignment = () => {
    if (selectedOrder && selectedVehicle) {
      // Update order status to Assigned
      setOrders((prev) =>
        prev.map((order) =>
          order.id === selectedOrder.id
            ? { ...order, status: "Assigned" }
            : order
        )
      );
      // Update vehicle status to Loading
      setVehicles((prev) =>
        prev.map((vehicle) =>
          vehicle.id === selectedVehicle.id
            ? {
                ...vehicle,
                status: "Loading",
                currentLoad: selectedOrder.requiredCapacity,
              }
            : vehicle
        )
      );
      // Add new delivery
      setDeliveries((prev) => [
        ...prev,
        {
          id: `del-${Date.now()}`,
          orderId: selectedOrder.id,
          vehicleId: selectedVehicle.id,
          orderNumber: selectedOrder.orderNumber,
          vehicle: selectedVehicle,
          route: `${selectedVehicle.location.address} → ${selectedOrder.destination.address}`,
          status: "Scheduled",
          progress: 0,
          eta: selectedOrder.deliveryWindow.end,
          startTime: new Date(),
          stops: [
            {
              id: `stop-${Date.now()}-pickup`,
              location: selectedVehicle.location,
              type: "Pickup",
              status: "Completed",
              scheduledTime: new Date(),
              actualTime: new Date(),
            },
            {
              id: `stop-${Date.now()}-delivery`,
              location: selectedOrder.destination,
              type: "Delivery",
              status: "Pending",
              scheduledTime: selectedOrder.deliveryWindow.end,
            },
          ],
        },
      ]);
      // Reset wizard and selections
      setSelectedOrder(null);
      setSelectedVehicle(null);
      setCurrentStep("order");
    }
  };

  // Reset wizard
  const handleReset = () => {
    setSelectedOrder(null);
    setSelectedVehicle(null);
    setCurrentStep("order");
  };

  return (
    <div className="vehicle-assignment">
      <div className="vehicle-assignment__header">
        <h1>Assign Vehicle to Order</h1>
        <p className="vehicle-assignment__subtitle">
          Follow the steps to assign an available vehicle to a pending order
        </p>
      </div>

      {/* Progress Steps */}
      <div className="progress-steps">
        <div
          className={`progress-step ${
            currentStep === "order" || selectedOrder
              ? "progress-step--active"
              : ""
          }`}
        >
          <div className="progress-step__number">
            {selectedOrder ? <CheckCircle2 size={20} /> : "1"}
          </div>
          <div className="progress-step__label">Select Order</div>
        </div>
        <div className="progress-step__line"></div>
        <div
          className={`progress-step ${
            currentStep === "vehicle" || selectedVehicle
              ? "progress-step--active"
              : ""
          }`}
        >
          <div className="progress-step__number">
            {selectedVehicle ? <CheckCircle2 size={20} /> : "2"}
          </div>
          <div className="progress-step__label">Choose Vehicle</div>
        </div>
        <div className="progress-step__line"></div>
        <div
          className={`progress-step ${
            currentStep === "confirm" ? "progress-step--active" : ""
          }`}
        >
          <div className="progress-step__number">3</div>
          <div className="progress-step__label">Confirm</div>
        </div>
      </div>

      {/* Step 1: Select Order */}
      {currentStep === "order" && (
        <Card>
          <CardHeader
            title="Step 1: Select a Pending Order"
            subtitle={`${pendingOrders.length} orders awaiting assignment`}
          />
          <CardBody>
            <div className="assignment-grid">
              {pendingOrders.length === 0 ? (
                <div
                  style={{
                    textAlign: "center",
                    color: "var(--text-secondary)",
                    padding: "2rem",
                  }}
                >
                  <CheckCircle2
                    size={32}
                    style={{ color: "var(--color-success)" }}
                  />
                  <div>All orders have been assigned!</div>
                </div>
              ) : (
                pendingOrders.map((order) => (
                  <div
                    key={order.id}
                    className="assignment-card"
                    onClick={() => handleOrderSelect(order)}
                  >
                    <div className="assignment-card__header">
                      <div className="assignment-card__icon assignment-card__icon--order">
                        <Package size={24} />
                      </div>
                      <div className="assignment-card__title">
                        <h3>{order.orderNumber}</h3>
                        <span
                          className={`priority-badge priority-badge--${order.priority.toLowerCase()}`}
                        >
                          {order.priority}
                        </span>
                      </div>
                    </div>

                    <div className="assignment-card__details">
                      <div className="detail-row">
                        <MapPin size={16} className="detail-icon" />
                        <span className="detail-label">Destination:</span>
                        <span className="detail-value">
                          {order.destination.address}
                        </span>
                      </div>
                      <div className="detail-row">
                        <Calendar size={16} className="detail-icon" />
                        <span className="detail-label">Delivery:</span>
                        <span className="detail-value">
                          {order.deliveryWindow.start.toLocaleDateString(
                            "en-IN",
                            {
                              day: "numeric",
                              month: "short",
                              year: "numeric",
                            }
                          )}
                        </span>
                      </div>
                      <div className="detail-row">
                        <Weight size={16} className="detail-icon" />
                        <span className="detail-label">Required:</span>
                        <span className="detail-value detail-value--highlight">
                          {order.requiredCapacity} kg
                        </span>
                      </div>
                    </div>

                    <div className="assignment-card__products">
                      <div className="products-label">Products:</div>
                      <div className="products-list">
                        {order.products.map((product) => (
                          <span key={product.id} className="product-tag">
                            {product.name}
                          </span>
                        ))}
                      </div>
                    </div>

                    <Button fullWidth variant="outline">
                      Select This Order <ArrowRight size={16} />
                    </Button>
                  </div>
                ))
              )}
            </div>
          </CardBody>
        </Card>
      )}

      {/* Step 2: Select Vehicle */}
      {currentStep === "vehicle" && selectedOrder && (
        <div className="assignment-step">
          <Card className="selected-summary">
            <CardBody>
              <div className="summary-content">
                <div className="summary-section">
                  <h4>Selected Order</h4>
                  <div className="summary-details">
                    <span className="summary-label">
                      {selectedOrder.orderNumber}
                    </span>
                    <span className="summary-value">
                      {selectedOrder.destination.address}
                    </span>
                    <span className="summary-meta">
                      Requires: {selectedOrder.requiredCapacity} kg
                    </span>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setCurrentStep("order")}
                >
                  Change Order
                </Button>
              </div>
            </CardBody>
          </Card>

          <Card>
            <CardHeader
              title="Step 2: Choose an Available Vehicle"
              subtitle={
                compatibleVehicles.length > 0
                  ? `${compatibleVehicles.length} compatible vehicles found`
                  : "No vehicles with sufficient capacity"
              }
            />
            <CardBody>
              <div className="assignment-grid">
                {compatibleVehicles.map((vehicle) => (
                  <div
                    key={vehicle.id}
                    className="assignment-card"
                    onClick={() => handleVehicleSelect(vehicle)}
                  >
                    <div className="assignment-card__header">
                      <div className="assignment-card__icon assignment-card__icon--vehicle">
                        <Truck size={24} />
                      </div>
                      <div className="assignment-card__title">
                        <h3>{vehicle.vehicleNumber}</h3>
                        <StatusBadge status={vehicle.status} size="sm" />
                      </div>
                    </div>

                    <div className="assignment-card__details">
                      <div className="detail-row">
                        <User size={16} className="detail-icon" />
                        <span className="detail-label">Driver:</span>
                        <span className="detail-value">
                          {vehicle.driver.name}
                        </span>
                      </div>
                      <div className="detail-row">
                        <Truck size={16} className="detail-icon" />
                        <span className="detail-label">Type:</span>
                        <span className="detail-value">{vehicle.type}</span>
                      </div>
                      <div className="detail-row">
                        <Weight size={16} className="detail-icon" />
                        <span className="detail-label">Capacity:</span>
                        <span className="detail-value detail-value--highlight">
                          {vehicle.capacity} kg
                        </span>
                      </div>
                      <div className="detail-row">
                        <MapPin size={16} className="detail-icon" />
                        <span className="detail-label">Location:</span>
                        <span className="detail-value">
                          {vehicle.location.address.split(",")[0]}
                        </span>
                      </div>
                    </div>

                    <div className="capacity-match">
                      <div className="capacity-match__label">
                        Capacity Match
                      </div>
                      <div className="capacity-match__bar">
                        <div
                          className="capacity-match__fill"
                          style={{
                            width: `${Math.min(
                              (selectedOrder.requiredCapacity /
                                vehicle.capacity) *
                                100,
                              100
                            )}%`,
                          }}
                        ></div>
                      </div>
                      <div className="capacity-match__text">
                        {vehicle.capacity - selectedOrder.requiredCapacity} kg
                        available
                      </div>
                    </div>

                    <Button fullWidth>
                      Assign This Vehicle <ArrowRight size={16} />
                    </Button>
                  </div>
                ))}
              </div>
            </CardBody>
          </Card>
        </div>
      )}

      {/* Step 3: Confirm Assignment */}
      {currentStep === "confirm" && selectedOrder && selectedVehicle && (
        <div className="assignment-step">
          <Card className="confirmation-card">
            <CardBody>
              <div className="confirmation-header">
                <CheckCircle2 size={48} className="confirmation-icon" />
                <h2>Confirm Assignment</h2>
                <p>Review the details and confirm the vehicle assignment</p>
              </div>

              <div className="confirmation-details">
                <div className="confirmation-section">
                  <h3>Order Details</h3>
                  <div className="confirmation-grid">
                    <div className="confirmation-item">
                      <span className="confirmation-label">Order Number</span>
                      <span className="confirmation-value">
                        {selectedOrder.orderNumber}
                      </span>
                    </div>
                    <div className="confirmation-item">
                      <span className="confirmation-label">Priority</span>
                      <span
                        className={`priority-badge priority-badge--${selectedOrder.priority.toLowerCase()}`}
                      >
                        {selectedOrder.priority}
                      </span>
                    </div>
                    <div className="confirmation-item">
                      <span className="confirmation-label">Destination</span>
                      <span className="confirmation-value">
                        {selectedOrder.destination.address}
                      </span>
                    </div>
                    <div className="confirmation-item">
                      <span className="confirmation-label">Delivery Date</span>
                      <span className="confirmation-value">
                        {selectedOrder.deliveryWindow.start.toLocaleDateString(
                          "en-IN"
                        )}
                      </span>
                    </div>
                    <div className="confirmation-item">
                      <span className="confirmation-label">
                        Required Capacity
                      </span>
                      <span className="confirmation-value">
                        {selectedOrder.requiredCapacity} kg
                      </span>
                    </div>
                    <div className="confirmation-item">
                      <span className="confirmation-label">Products</span>
                      <span className="confirmation-value">
                        {selectedOrder.products.map((p) => p.name).join(", ")}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="confirmation-divider"></div>

                <div className="confirmation-section">
                  <h3>Vehicle Details</h3>
                  <div className="confirmation-grid">
                    <div className="confirmation-item">
                      <span className="confirmation-label">Vehicle Number</span>
                      <span className="confirmation-value">
                        {selectedVehicle.vehicleNumber}
                      </span>
                    </div>
                    <div className="confirmation-item">
                      <span className="confirmation-label">Type</span>
                      <span className="confirmation-value">
                        {selectedVehicle.type}
                      </span>
                    </div>
                    <div className="confirmation-item">
                      <span className="confirmation-label">Driver Name</span>
                      <span className="confirmation-value">
                        {selectedVehicle.driver.name}
                      </span>
                    </div>
                    <div className="confirmation-item">
                      <span className="confirmation-label">Driver Phone</span>
                      <span className="confirmation-value">
                        {selectedVehicle.driver.phone}
                      </span>
                    </div>
                    <div className="confirmation-item">
                      <span className="confirmation-label">
                        Vehicle Capacity
                      </span>
                      <span className="confirmation-value">
                        {selectedVehicle.capacity} kg
                      </span>
                    </div>
                    <div className="confirmation-item">
                      <span className="confirmation-label">
                        Current Location
                      </span>
                      <span className="confirmation-value">
                        {selectedVehicle.location.address.split(",")[0]}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="confirmation-actions">
                <Button variant="outline" onClick={handleReset}>
                  Start Over
                </Button>
                <Button onClick={handleConfirmAssignment}>
                  <CheckCircle2 size={20} />
                  Confirm & Create Delivery
                </Button>
              </div>
            </CardBody>
          </Card>
        </div>
      )}
    </div>
  );
};
