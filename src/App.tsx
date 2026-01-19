import React, { Suspense, lazy } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Layout } from "./components/Layout/Layout";
import { LogisticsProvider } from "./context/LogisticsContext";
import "./App.css";

// Lazy load page components for code-splitting
const Dashboard = lazy(() =>
  import("./components/pages/Dashboard/Dashboard").then((m) => ({
    default: m.Dashboard,
  })),
);
const FleetManagement = lazy(() =>
  import("./components/pages/FleetManagement/FleetManagement").then((m) => ({
    default: m.FleetManagement,
  })),
);
const VehicleDetails = lazy(() =>
  import("./components/pages/VehicleDetails/VehicleDetails").then((m) => ({
    default: m.VehicleDetails,
  })),
);
const VehicleAssignment = lazy(() =>
  import("./components/pages/VehicleAssignment/VehicleAssignment").then(
    (m) => ({ default: m.VehicleAssignment }),
  ),
);
const Deliveries = lazy(() =>
  import("./components/pages/Deliveries/Deliveries").then((m) => ({
    default: m.Deliveries,
  })),
);
const DeliveryDetails = lazy(() =>
  import("./components/pages/Deliveries/DeliveryDetails").then((m) => ({
    default: m.DeliveryDetails,
  })),
);
const LoadManagement = lazy(() =>
  import("./components/pages/LoadManagement/LoadManagement").then((m) => ({
    default: m.LoadManagement,
  })),
);
const Settings = lazy(() => import("./components/pages/Settings/Settings"));
const FAQs = lazy(() => import("./components/pages/FAQs/FAQs"));
const Help = lazy(() => import("./components/pages/Help/Help"));
const Privacy = lazy(() => import("./components/pages/Privacy/Privacy"));
const Terms = lazy(() => import("./components/pages/Terms/Terms"));

// Loading fallback component
const PageLoader = () => (
  <div
    style={{
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      height: "50vh",
      color: "var(--text-secondary)",
    }}
  >
    Loading...
  </div>
);

function App() {
  return (
    <LogisticsProvider>
      <Router>
        <Layout>
          <Suspense fallback={<PageLoader />}>
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
          </Suspense>
        </Layout>
      </Router>
    </LogisticsProvider>
  );
}

export default App;
