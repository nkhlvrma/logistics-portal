import React, { createContext, useContext, useState, ReactNode } from "react";
import { mockOrders, mockVehicles, mockDeliveries } from "../data/mockData";
import { Order, Vehicle, Delivery } from "../types";

interface LogisticsContextType {
  orders: Order[];
  setOrders: React.Dispatch<React.SetStateAction<Order[]>>;
  vehicles: Vehicle[];
  setVehicles: React.Dispatch<React.SetStateAction<Vehicle[]>>;
  deliveries: Delivery[];
  setDeliveries: React.Dispatch<React.SetStateAction<Delivery[]>>;
}

const LogisticsContext = createContext<LogisticsContextType | undefined>(
  undefined
);

export const LogisticsProvider = ({ children }: { children: ReactNode }) => {
  const [orders, setOrders] = useState<Order[]>(() => [...mockOrders]);
  const [vehicles, setVehicles] = useState<Vehicle[]>(() => [...mockVehicles]);
  const [deliveries, setDeliveries] = useState<Delivery[]>(() => [
    ...mockDeliveries,
  ]);

  return (
    <LogisticsContext.Provider
      value={{
        orders,
        setOrders,
        vehicles,
        setVehicles,
        deliveries,
        setDeliveries,
      }}
    >
      {children}
    </LogisticsContext.Provider>
  );
};

export const useLogistics = () => {
  const context = useContext(LogisticsContext);
  if (!context) {
    throw new Error("useLogistics must be used within a LogisticsProvider");
  }
  return context;
};
