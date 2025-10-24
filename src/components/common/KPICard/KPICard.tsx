import React from "react";
import { KPI } from "../../../types";
import { TrendingUp, TrendingDown } from "lucide-react";
import "./KPICard.css";

interface KPICardProps {
  kpi: KPI;
  onClick?: () => void;
}

export const KPICard: React.FC<KPICardProps> = ({ kpi, onClick }) => {
  const getTrendIcon = () => {
    if (!kpi.trend) return null;

    if (kpi.trend === "up") {
      return (
        <TrendingUp
          className="kpi-card__trend-icon kpi-card__trend-icon--up"
          size={16}
        />
      );
    }

    return (
      <TrendingDown
        className="kpi-card__trend-icon kpi-card__trend-icon--down"
        size={16}
      />
    );
  };

  const getTrendClass = () => {
    if (!kpi.change) return "";
    return kpi.change > 0
      ? "kpi-card__change--positive"
      : "kpi-card__change--negative";
  };

  return (
    <div
      className={`kpi-card ${onClick ? "kpi-card--clickable" : ""}`}
      onClick={onClick}
    >
      <div className="kpi-card__label">{kpi.label}</div>
      <div className="kpi-card__value">
        {kpi.value}
        {kpi.unit && <span className="kpi-card__unit">{kpi.unit}</span>}
      </div>
      {kpi.change !== undefined && (
        <div className="kpi-card__footer">
          <span className={`kpi-card__change ${getTrendClass()}`}>
            {getTrendIcon()}
            {kpi.change > 0 ? "+" : ""}
            {kpi.change}%
          </span>
          <span className="kpi-card__footer-text">vs last period</span>
        </div>
      )}
    </div>
  );
};
