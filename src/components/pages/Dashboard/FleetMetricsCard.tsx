import React from "react";
import { useNavigate } from "react-router-dom";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { Truck, TrendingUp, Gauge } from "lucide-react";
import { Card, CardHeader, CardBody } from "../../common";
import { useLogistics } from "../../../context/LogisticsContext";
import "./FleetMetricsCard.css";

const STATUS_COLORS: Record<string, string> = {
  Available: "#10b981",
  "In Transit": "#3b82f6",
  Loading: "#f59e0b",
  Unloading: "#8b5cf6",
  Maintenance: "#ef4444",
};

export const FleetMetricsCard: React.FC = () => {
  const navigate = useNavigate();
  const { vehicles } = useLogistics();

  // Calculate status breakdown
  const statusCounts = vehicles.reduce((acc, vehicle) => {
    acc[vehicle.status] = (acc[vehicle.status] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const chartData = Object.entries(statusCounts).map(([status, count]) => ({
    name: status,
    value: count,
    color: STATUS_COLORS[status] || "#6b7280",
  }));

  // Calculate fleet utilization
  const totalCapacity = vehicles.reduce((sum, v) => sum + v.capacity, 0);
  const currentLoad = vehicles.reduce((sum, v) => sum + v.currentLoad, 0);
  const utilizationPercent =
    totalCapacity > 0 ? Math.round((currentLoad / totalCapacity) * 100) : 0;

  // Calculate available percentage
  const availableCount = statusCounts["Available"] || 0;
  const availablePercent = Math.round((availableCount / vehicles.length) * 100);

  return (
    <Card className="fleet-metrics-card" onClick={() => navigate("/fleet")}>
      <CardHeader
        title="Fleet Performance"
        subtitle={`${vehicles.length} total vehicles`}
        actions={
          <span className="fleet-metrics-card__badge">
            <Truck size={14} />
            Live
          </span>
        }
      />
      <CardBody>
        <div className="fleet-metrics-card__content">
          {/* Donut Chart */}
          <div className="fleet-metrics-card__chart">
            <ResponsiveContainer width="100%" height={160}>
              <PieChart>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  innerRadius={45}
                  outerRadius={70}
                  paddingAngle={3}
                  dataKey="value"
                  stroke="none"
                >
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value: number, name: string) => [
                    `${value} vehicles`,
                    name,
                  ]}
                  contentStyle={{
                    backgroundColor: "var(--bg-primary)",
                    border: "1px solid var(--border-color)",
                    borderRadius: "8px",
                    fontSize: "12px",
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="fleet-metrics-card__chart-center">
              <span className="fleet-metrics-card__center-value">
                {availableCount}
              </span>
              <span className="fleet-metrics-card__center-label">
                Available
              </span>
            </div>
          </div>

          {/* Legend */}
          <div className="fleet-metrics-card__legend">
            {chartData.map((item) => (
              <div key={item.name} className="fleet-metrics-card__legend-item">
                <span
                  className="fleet-metrics-card__legend-dot"
                  style={{ backgroundColor: item.color }}
                />
                <span className="fleet-metrics-card__legend-label">
                  {item.name}
                </span>
                <span className="fleet-metrics-card__legend-value">
                  {item.value}
                </span>
              </div>
            ))}
          </div>

          {/* Metrics Row */}
          <div className="fleet-metrics-card__metrics">
            <div className="fleet-metrics-card__metric">
              <div className="fleet-metrics-card__metric-icon fleet-metrics-card__metric-icon--green">
                <TrendingUp size={16} />
              </div>
              <div className="fleet-metrics-card__metric-content">
                <span className="fleet-metrics-card__metric-value">
                  {availablePercent}%
                </span>
                <span className="fleet-metrics-card__metric-label">
                  Available
                </span>
              </div>
            </div>
            <div className="fleet-metrics-card__metric">
              <div className="fleet-metrics-card__metric-icon fleet-metrics-card__metric-icon--blue">
                <Gauge size={16} />
              </div>
              <div className="fleet-metrics-card__metric-content">
                <span className="fleet-metrics-card__metric-value">
                  {utilizationPercent}%
                </span>
                <span className="fleet-metrics-card__metric-label">
                  Capacity Used
                </span>
              </div>
            </div>
          </div>
        </div>
      </CardBody>
    </Card>
  );
};
