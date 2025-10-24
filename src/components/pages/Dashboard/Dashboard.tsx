import React from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardHeader, CardBody, KPICard, Button } from "../../common";
import { Truck, Package, AlertCircle, Clock } from "lucide-react";
import "./Dashboard.css";
import { useLogistics } from "../../../context/LogisticsContext";

export const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const { deliveries, vehicles, orders } = useLogistics();

  const activeDeliveriesCount = deliveries.filter((d) =>
    ["In Progress", "Scheduled", "Delayed"].includes(d.status)
  ).length;

  const kpis = [
    {
      label: "Total Fleet",
      value: vehicles.length,
      unit: "vehicles",
    },
    {
      label: "Available Now",
      value: vehicles.filter((v) => v.status === "Available").length,
      unit: "vehicles",
    },
    {
      label: "Active Deliveries",
      value: activeDeliveriesCount,
    },
    {
      label: "Pending Orders",
      value: orders.filter((o) => o.status === "Pending").length,
    },
    {
      label: "Under Maintenance",
      value: vehicles.filter((v) => v.status === "Maintenance").length,
      unit: "vehicles",
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

      {/* Main Content Grid */}
      <div className="dashboard__content-grid">
        {/* Active Deliveries */}
        <Card className="dashboard__card dashboard__card--large">
          <CardHeader
            title="Active Deliveries"
            subtitle={`${activeDeliveriesCount} active deliveries`}
            actions={
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate("/deliveries")}
              >
                View All
              </Button>
            }
          />
          <CardBody>
            <div className="delivery-list">
              {deliveries.map((delivery) => (
                <div
                  key={delivery.id}
                  className="delivery-item"
                  onClick={() => navigate("/deliveries")}
                  style={{ cursor: "pointer" }}
                >
                  <div className="delivery-item__header">
                    <div className="delivery-item__info">
                      <h4 className="delivery-item__title">
                        {delivery.orderNumber}
                      </h4>
                      <p className="delivery-item__route">{delivery.route}</p>
                    </div>
                    <span
                      className={`delivery-item__status delivery-item__status--${delivery.status
                        .toLowerCase()
                        .replace(/\s/g, "-")}`}
                    >
                      {delivery.status}
                    </span>
                  </div>
                  <div className="delivery-item__details">
                    <div className="delivery-item__detail">
                      <Truck size={14} />
                      <span>{delivery.vehicle.vehicleNumber}</span>
                    </div>
                    <div className="delivery-item__detail">
                      <Clock size={14} />
                      <span>
                        ETA:{" "}
                        {delivery.eta.toLocaleTimeString("en-IN", {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                    </div>
                  </div>
                  <div className="delivery-item__progress">
                    <div className="progress-bar">
                      <div
                        className="progress-bar__fill"
                        style={{ width: `${delivery.progress}%` }}
                      ></div>
                    </div>
                    <span className="delivery-item__progress-text">
                      {delivery.progress}%
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardBody>
        </Card>

        {/* Alerts & Notifications */}
        <Card className="dashboard__card">
          <CardHeader title="Recent Alerts" subtitle="Last 24 hours" />
          <CardBody>
            <div className="alert-list">
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
              <div className="alert-item alert-item--info">
                <AlertCircle size={16} className="alert-item__icon" />
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
                <Clock className="quick-action-btn__icon" size={20} />
                <span>Schedule Delivery</span>
              </button>
            </div>
          </CardBody>
        </Card>
      </div>
    </div>
  );
};
