import React from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardHeader, CardBody, KPICard, Button } from "../../common";
import { Truck, Package, AlertCircle, Wrench, MapPin } from "lucide-react";
import "./Dashboard.css";
import { useLogistics } from "../../../context/LogisticsContext";
import { FleetMetricsCard } from "./FleetMetricsCard";
import { ShipmentTracker } from "./ShipmentTracker";
import { DeliveryStatusCard } from "./DeliveryStatusCard";

export const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const { deliveries, vehicles, orders } = useLogistics();

  const activeDeliveriesCount = deliveries.filter((d) =>
    ["In Progress", "Scheduled", "Delayed"].includes(d.status),
  ).length;

  const delayedCount = deliveries.filter((d) => d.status === "Delayed").length;

  const kpis = [
    {
      label: "Total Fleet",
      value: vehicles.length,
      unit: "vehicles",
      trend: "up" as const,
      change: 5,
    },
    {
      label: "Available Now",
      value: vehicles.filter((v) => v.status === "Available").length,
      unit: "vehicles",
      trend: "up" as const,
      change: 12,
    },
    {
      label: "Active Deliveries",
      value: activeDeliveriesCount,
      trend: "up" as const,
      change: 8,
    },
    {
      label: "Pending Orders",
      value: orders.filter((o) => o.status === "Pending").length,
      trend: "down" as const,
      change: -15,
    },
  ];

  return (
    <div className="dashboard">
      <div className="dashboard__header">
        <div>
          <h1>Logistics Dashboard</h1>
          <p className="dashboard__subtitle">
            Real-time overview of your fleet and operations
          </p>
        </div>
        <div className="dashboard__actions">
          <Button
            variant="outline"
            icon={<Truck size={16} />}
            onClick={() => navigate("/fleet")}
          >
            View Fleet
          </Button>
          <Button
            icon={<Package size={16} />}
            onClick={() => navigate("/assign")}
          >
            Assign Vehicle
          </Button>
        </div>
      </div>

      {/* KPI Section */}
      <div className="dashboard__kpi-grid">
        {kpis.map((kpi, index) => (
          <KPICard
            key={index}
            kpi={kpi}
            onClick={() => {
              if (
                kpi.label.includes("Fleet") ||
                kpi.label.includes("Available")
              ) {
                navigate("/fleet");
              } else if (kpi.label.includes("Deliveries")) {
                navigate("/deliveries");
              } else if (kpi.label.includes("Orders")) {
                navigate("/assign");
              }
            }}
          />
        ))}
      </div>

      {/* Shipment Tracking Map - Full Width */}
      <div className="dashboard__map-section">
        <ShipmentTracker />
      </div>

      {/* Main Content Grid */}
      <div className="dashboard__content-grid">
        {/* Fleet Performance */}
        <FleetMetricsCard />

        {/* Delivery Status */}
        <DeliveryStatusCard />

        {/* Alerts & Notifications */}
        <Card className="dashboard__card">
          <CardHeader title="Recent Alerts" subtitle="Last 24 hours" />
          <CardBody>
            <div className="alert-list">
              {delayedCount > 0 && (
                <div className="alert-item alert-item--warning">
                  <AlertCircle size={16} className="alert-item__icon" />
                  <div className="alert-item__content">
                    <p className="alert-item__title">Delivery Delayed</p>
                    <p className="alert-item__description">
                      ORD-2025-005 - 2 hours behind schedule
                    </p>
                    <span className="alert-item__time">30 mins ago</span>
                  </div>
                </div>
              )}
              <div className="alert-item alert-item--info">
                <Wrench size={16} className="alert-item__icon" />
                <div className="alert-item__content">
                  <p className="alert-item__title">Vehicle Maintenance Due</p>
                  <p className="alert-item__description">
                    MH-12-GH-3456 - Service required in 2 days
                  </p>
                  <span className="alert-item__time">2 hours ago</span>
                </div>
              </div>
              <div className="alert-item alert-item--success">
                <AlertCircle size={16} className="alert-item__icon" />
                <div className="alert-item__content">
                  <p className="alert-item__title">Delivery Completed</p>
                  <p className="alert-item__description">
                    ORD-2025-003 - Delivered on time
                  </p>
                  <span className="alert-item__time">3 hours ago</span>
                </div>
              </div>
            </div>
          </CardBody>
        </Card>

        {/* Quick Actions */}
        <Card className="dashboard__card">
          <CardHeader title="Quick Actions" />
          <CardBody>
            <div className="quick-actions">
              <button
                className="quick-action-btn"
                onClick={() => navigate("/assign")}
              >
                <Truck className="quick-action-btn__icon" size={20} />
                <span>Assign Vehicle</span>
              </button>
              <button
                className="quick-action-btn"
                onClick={() => navigate("/assign")}
              >
                <Package className="quick-action-btn__icon" size={20} />
                <span>Create Order</span>
              </button>
              <button
                className="quick-action-btn"
                onClick={() => navigate("/deliveries")}
              >
                <MapPin className="quick-action-btn__icon" size={20} />
                <span>Track Shipments</span>
              </button>
              <button
                className="quick-action-btn"
                onClick={() => navigate("/fleet")}
              >
                <Wrench className="quick-action-btn__icon" size={20} />
                <span>Fleet Status</span>
              </button>
            </div>
          </CardBody>
        </Card>
      </div>
    </div>
  );
};
