import React from "react";
import { VehicleStatus, DeliveryStatus } from "../../../types";
import "./StatusBadge.css";

interface StatusBadgeProps {
  status: VehicleStatus | DeliveryStatus | string;
  size?: "sm" | "md" | "lg";
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({
  status,
  size = "md",
}) => {
  const getStatusClass = (status: string): string => {
    // Vehicle statuses
    if (status === "Available") return "status-badge--success";
    if (status === "In Transit") return "status-badge--info";
    if (status === "Loading" || status === "Unloading")
      return "status-badge--warning";
    if (status === "Maintenance") return "status-badge--danger";

    // Delivery statuses
    if (status === "Completed") return "status-badge--success";
    if (status === "In Progress" || status === "Scheduled")
      return "status-badge--info";
    if (status === "Delayed") return "status-badge--danger";
    if (status === "Cancelled") return "status-badge--gray";

    return "status-badge--gray";
  };

  const classes = [
    "status-badge",
    `status-badge--${size}`,
    getStatusClass(status),
  ].join(" ");

  return (
    <span className={classes}>
      <span className="status-badge__dot"></span>
      {status}
    </span>
  );
};
