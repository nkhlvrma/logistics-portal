import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Layout } from "./components/Layout/Layout";
import { Dashboard } from "./components/pages/Dashboard/Dashboard";
import { FleetManagement } from "./components/pages/FleetManagement/FleetManagement";
import { VehicleDetails } from "./components/pages/VehicleDetails/VehicleDetails";
import { VehicleAssignment } from "./components/pages/VehicleAssignment/VehicleAssignment";
import { Deliveries } from "./components/pages/Deliveries/Deliveries";
import { DeliveryDetails } from "./components/pages/Deliveries/DeliveryDetails";
import { LoadManagement } from "./components/pages/LoadManagement/LoadManagement";
import { LogisticsProvider } from "./context/LogisticsContext";
import Settings from "./components/pages/Settings/Settings";
import FAQs from "./components/pages/FAQs/FAQs";
import Help from "./components/pages/Help/Help";
import Privacy from "./components/pages/Privacy/Privacy";
import Terms from "./components/pages/Terms/Terms";
import "./App.css";

function App() {
  return (
    <LogisticsProvider>
      <Router>
        <Layout>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/fleet" element={<FleetManagement />} />
            <Route path="/fleet/:id" element={<VehicleDetails />} />
            <Route path="/assign" element={<VehicleAssignment />} />
            <Route path="/deliveries" element={<Deliveries />} />
            <Route path="/deliveries/:id" element={<DeliveryDetails />} />
            <Route path="/loads" element={<LoadManagement />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/faqs" element={<FAQs />} />
            <Route path="/help" element={<Help />} />
            <Route path="/privacy" element={<Privacy />} />
            <Route path="/terms" element={<Terms />} />
          </Routes>
        </Layout>
      </Router>
    </LogisticsProvider>
  );
}

export default App;
