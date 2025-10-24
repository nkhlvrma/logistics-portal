// Core type definitions for the logistics portal

export type VehicleStatus =
  | "Available"
  | "In Transit"
  | "Loading"
  | "Unloading"
  | "Maintenance";

export type DeliveryStatus =
  | "Scheduled"
  | "In Progress"
  | "Delayed"
  | "Completed"
  | "Cancelled";

export type LoadStatus =
  | "Not Started"
  | "Loading"
  | "Loaded"
  | "Unloading"
  | "Unloaded";

export interface Vehicle {
  id: string;
  vehicleNumber: string;
  type: string;
  capacity: number;
  currentLoad: number;
  status: VehicleStatus;
  driver: Driver;
  location: Location;
  lastUpdated: Date;
}

export interface Driver {
  id: string;
  name: string;
  phone: string;
  licenseNumber: string;
}

export interface Location {
  lat: number;
  lng: number;
  address: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  products: Product[];
  destination: Location;
  requiredCapacity: number;
  deliveryWindow: {
    start: Date;
    end: Date;
  };
  priority: "High" | "Medium" | "Low";
  status: "Pending" | "Assigned" | "In Progress" | "Completed";
  createdAt: Date;
}

export interface Product {
  id: string;
  name: string;
  type: "Seeds" | "Saplings" | "Fertilizers";
  quantity: number;
  unit: string;
  crateCount: number;
}

export interface Delivery {
  id: string;
  orderId: string;
  vehicleId: string;
  orderNumber: string;
  vehicle: Vehicle;
  route: string;
  status: DeliveryStatus;
  progress: number;
  eta: Date;
  startTime: Date;
  completedTime?: Date;
  stops: DeliveryStop[];
}

export interface DeliveryStop {
  id: string;
  location: Location;
  type: "Pickup" | "Delivery";
  status: "Pending" | "Completed" | "Skipped";
  scheduledTime: Date;
  actualTime?: Date;
  notes?: string;
}

export interface Crate {
  id: string;
  crateNumber: string;
  type: string;
  status: "Available" | "In Use" | "In Transit" | "Being Cleaned";
  location: string;
  lastUpdated: Date;
}

export interface LoadItem {
  id: string;
  productId: string;
  productName: string;
  quantity: number;
  unit: string;
  crateCount: number;
  crateNumbers: string[];
  isLoaded: boolean;
  loadedAt?: Date;
  notes?: string;
}

export interface LoadConfirmation {
  id: string;
  vehicleId: string;
  type: "Loading" | "Unloading";
  items: LoadItem[];
  startTime: Date;
  completedTime?: Date;
  status: LoadStatus;
  location: Location;
  confirmedBy?: string;
  photos?: string[];
  discrepancies?: Discrepancy[];
}

export interface Discrepancy {
  id: string;
  itemId: string;
  type: "Quantity Mismatch" | "Damage" | "Missing Item";
  expected: number;
  actual: number;
  notes: string;
  reportedAt: Date;
}

export interface KPI {
  label: string;
  value: number | string;
  change?: number;
  trend?: "up" | "down" | "stable";
  unit?: string;
}
