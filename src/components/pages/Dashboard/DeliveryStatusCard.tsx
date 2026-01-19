import React from "react";
import { useNavigate } from "react-router-dom";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Cell,
  Tooltip,
} from "recharts";
import { Card, CardHeader, CardBody, Button } from "../../common";
import { useLogistics } from "../../../context/LogisticsContext";
import {
  Clock,
  CheckCircle2,
  AlertTriangle,
  Timer,
  TrendingUp,
} from "lucide-react";
import "./DeliveryStatusCard.css";

const STATUS_CONFIG: Record<
  string,
  { color: string; icon: React.ReactNode; label: string }
> = {
  Scheduled: {
    color: "#6b7280",
    icon: <Timer size={14} />,
    label: "Scheduled",
  },
  "In Progress": {
    color: "#3b82f6",
    icon: <Clock size={14} />,
    label: "In Progress",
  },
  Delayed: {
    color: "#ef4444",
    icon: <AlertTriangle size={14} />,
    label: "Delayed",
  },
  Completed: {
    color: "#10b981",
    icon: <CheckCircle2 size={14} />,
    label: "Completed",
  },
};

export const DeliveryStatusCard: React.FC = () => {
  const navigate = useNavigate();
  const { deliveries } = useLogistics();

  // Calculate status distribution
  const statusCounts = deliveries.reduce((acc, delivery) => {
    acc[delivery.status] = (acc[delivery.status] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const chartData = Object.entries(STATUS_CONFIG).map(([status, config]) => ({
    name: config.label,
    value: statusCounts[status] || 0,
    color: config.color,
  }));

  // Calculate on-time rate (completed and not delayed)
  const completedDeliveries = deliveries.filter(
    (d) => d.status === "Completed"
  );
  const onTimeDeliveries = completedDeliveries.filter((d) => {
    // For demo, assume all completed deliveries are on-time
    return true;
  });
  const onTimeRate =
    completedDeliveries.length > 0
      ? Math.round((onTimeDeliveries.length / completedDeliveries.length) * 100)
      : 100;

  // Recent events (simulated based on delivery data)
  const recentEvents = [
    {
      id: 1,
      type: "progress",
      message: "ORD-2025-004 - En route to Thane",
      time: "10 mins ago",
      icon: <Clock size={14} />,
    },
    {
      id: 2,
      type: "delayed",
      message: "ORD-2025-005 - Delayed due to traffic",
      time: "30 mins ago",
      icon: <AlertTriangle size={14} />,
    },
    {
      id: 3,
      type: "completed",
      message: "ORD-2025-003 - Delivered successfully",
      time: "1 hour ago",
      icon: <CheckCircle2 size={14} />,
    },
  ];

  const activeCount = deliveries.filter((d) =>
    ["In Progress", "Delayed", "Scheduled"].includes(d.status)
  ).length;

  return (
    <Card className="delivery-status-card">
      <CardHeader
        title="Delivery Status"
        subtitle={`${activeCount} active deliveries`}
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
        <div className="delivery-status-card__content">
          {/* Status Distribution Chart */}
          <div className="delivery-status-card__chart">
            <ResponsiveContainer width="100%" height={120}>
              <BarChart data={chartData} layout="vertical" barCategoryGap={8}>
                <XAxis type="number" hide />
                <YAxis
                  type="category"
                  dataKey="name"
                  axisLine={false}
                  tickLine={false}
                  width={80}
                  tick={{ fontSize: 12, fill: "var(--text-secondary)" }}
                />
                <Tooltip
                  formatter={(value: number) => [`${value} deliveries`]}
                  contentStyle={{
                    backgroundColor: "var(--bg-primary)",
                    border: "1px solid var(--border-color)",
                    borderRadius: "8px",
                    fontSize: "12px",
                  }}
                />
                <Bar dataKey="value" radius={[0, 4, 4, 0]} maxBarSize={20}>
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* On-Time Performance */}
          <div className="delivery-status-card__metric">
            <div className="delivery-status-card__metric-header">
              <span className="delivery-status-card__metric-label">
                On-Time Performance
              </span>
              <span className="delivery-status-card__metric-trend">
                <TrendingUp size={12} />
                +2.5%
              </span>
            </div>
            <div className="delivery-status-card__progress-container">
              <div className="delivery-status-card__progress-bar">
                <div
                  className="delivery-status-card__progress-fill"
                  style={{ width: `${onTimeRate}%` }}
                />
              </div>
              <span className="delivery-status-card__progress-value">
                {onTimeRate}%
              </span>
            </div>
          </div>

          {/* Recent Events Timeline */}
          <div className="delivery-status-card__timeline">
            <h4 className="delivery-status-card__timeline-title">
              Recent Updates
            </h4>
            <div className="delivery-status-card__events">
              {recentEvents.map((event) => (
                <div
                  key={event.id}
                  className={`delivery-status-card__event delivery-status-card__event--${event.type}`}
                >
                  <span className="delivery-status-card__event-icon">
                    {event.icon}
                  </span>
                  <div className="delivery-status-card__event-content">
                    <span className="delivery-status-card__event-message">
                      {event.message}
                    </span>
                    <span className="delivery-status-card__event-time">
                      {event.time}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </CardBody>
    </Card>
  );
};
