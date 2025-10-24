import React, { useState } from "react";
import { Vehicle } from "../../../types";
import { Button } from "../../common";
import "./AddVehicleForm.css";

interface AddVehicleFormProps {
  onAdd: (vehicle: Vehicle) => void;
  onCancel: () => void;
}

export const AddVehicleForm: React.FC<AddVehicleFormProps> = ({
  onAdd,
  onCancel,
}) => {
  const [vehicleNumber, setVehicleNumber] = useState("");
  const [type, setType] = useState("Truck");
  const [capacity, setCapacity] = useState("");
  const [driverName, setDriverName] = useState("");
  const [driverPhone, setDriverPhone] = useState("");
  const [location, setLocation] = useState("");
  const [status, setStatus] = useState<Vehicle["status"]>("Available");
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (
      !vehicleNumber ||
      !type ||
      !capacity ||
      !driverName ||
      !driverPhone ||
      !location
    ) {
      setError("All fields are required.");
      return;
    }
    if (isNaN(Number(capacity)) || Number(capacity) <= 0) {
      setError("Capacity must be a positive number.");
      return;
    }
    const newVehicle: Vehicle = {
      id: `v-${Date.now()}`,
      vehicleNumber,
      type,
      capacity: Number(capacity),
      currentLoad: 0,
      status,
      driver: {
        id: `d-${Date.now()}`,
        name: driverName,
        phone: driverPhone,
        licenseNumber: "",
      },
      location: {
        lat: 0,
        lng: 0,
        address: location,
      },
      lastUpdated: new Date(),
    };
    onAdd(newVehicle);
  };

  return (
    <form className="add-vehicle-form" onSubmit={handleSubmit}>
      <div className="form-title">New Vehicle</div>
      {error && <div className="form-error">{error}</div>}
      <div className="form-grid">
        <div className="form-field">
          <label>Vehicle Number</label>
          <input
            className="form-input"
            type="text"
            placeholder="e.g. MH-12-AB-1234"
            value={vehicleNumber}
            onChange={(e) => setVehicleNumber(e.target.value)}
          />
        </div>
        <div className="form-field">
          <label>Type</label>
          <select
            className="form-input"
            value={type}
            onChange={(e) => setType(e.target.value)}
          >
            <option value="Truck">Truck</option>
            <option value="Van">Van</option>
            <option value="Mini Truck">Mini Truck</option>
          </select>
        </div>
        <div className="form-field">
          <label>Capacity (kg)</label>
          <input
            className="form-input"
            type="number"
            placeholder="e.g. 5000"
            value={capacity}
            onChange={(e) => setCapacity(e.target.value)}
          />
        </div>
        <div className="form-field">
          <label>Driver Name</label>
          <input
            className="form-input"
            type="text"
            placeholder="e.g. Rajesh Kumar"
            value={driverName}
            onChange={(e) => setDriverName(e.target.value)}
          />
        </div>
        <div className="form-field">
          <label>Driver Phone</label>
          <input
            className="form-input"
            type="text"
            placeholder="e.g. +91 98765 43210"
            value={driverPhone}
            onChange={(e) => setDriverPhone(e.target.value)}
          />
        </div>
        <div className="form-field form-field--full">
          <label>Location Address</label>
          <input
            className="form-input"
            type="text"
            placeholder="e.g. Mumbai Central Depot"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
          />
        </div>
        <div className="form-field">
          <label>Status</label>
          <select
            className="form-input"
            value={status}
            onChange={(e) => setStatus(e.target.value as Vehicle["status"])}
          >
            <option value="Available">Available</option>
            <option value="Loading">Loading</option>
            <option value="In Transit">In Transit</option>
            <option value="Maintenance">Maintenance</option>
          </select>
        </div>
      </div>
      <div className="form-actions">
        <Button type="button" variant="outline" onClick={onCancel} fullWidth>
          Cancel
        </Button>
        <Button type="submit" fullWidth>
          Add Vehicle
        </Button>
      </div>
    </form>
  );
};
