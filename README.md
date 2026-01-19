# LogisticsHub - Agri-Business Logistics Portal

A modern, responsive logistics management dashboard for agricultural businesses. Track fleet vehicles, manage deliveries, and monitor operations in real-time.

![React](https://img.shields.io/badge/React-19.2-61DAFB?logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-4.9-3178C6?logo=typescript)
![License](https://img.shields.io/badge/License-MIT-green)

## 🌐 Live Demo

**[https://logistics-portal-alpha.vercel.app/](https://logistics-portal-alpha.vercel.app/)**

## ✨ Features

- **Dashboard** - Real-time KPIs, fleet metrics, delivery status, and alerts
- **Live Shipment Tracking** - Interactive map with vehicle markers and route visualization
- **Fleet Management** - View and manage all vehicles with status indicators
- **Vehicle Assignment** - Assign vehicles to orders with capacity matching
- **Delivery Tracking** - Monitor delivery progress with stop-by-stop details
- **Load Management** - Track loading/unloading operations
- **Dark Mode** - Full dark theme support with system preference detection

## 🛠️ Tech Stack

| Category   | Technology                           |
| ---------- | ------------------------------------ |
| Framework  | React 19 with TypeScript             |
| Routing    | React Router v7                      |
| Maps       | Leaflet / React-Leaflet              |
| Charts     | Recharts                             |
| Icons      | Lucide React                         |
| Styling    | CSS Variables with responsive design |
| Deployment | Vercel                               |

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/nkhlvrma/logistics-portal.git
cd logistics-portal

# Install dependencies
npm install

# Start development server
npm start
```

Open [http://localhost:3000](http://localhost:3000) to view in your browser.

### Build for Production

```bash
npm run build
```

## 📁 Project Structure

```
src/
├── components/
│   ├── common/          # Reusable UI components (Button, Card, KPICard)
│   ├── Layout/          # App layout with sidebar navigation
│   ├── pages/           # Route page components
│   │   ├── Dashboard/   # Main dashboard with metrics & map
│   │   ├── FleetManagement/
│   │   ├── VehicleAssignment/
│   │   ├── Deliveries/
│   │   └── ...
│   └── ui/              # Base UI primitives
├── context/             # React Context for global state
├── data/                # Mock data for development
├── styles/              # Global CSS with design tokens
└── types/               # TypeScript interfaces
```

## ⚡ Performance

- **Code Splitting** - Lazy-loaded routes reduce initial bundle by ~53KB
- **Memoization** - Expensive calculations cached with `useMemo`
- **Optimized Builds** - Production builds with tree shaking

## 🎨 Design System

The app uses CSS custom properties for consistent theming:

- **Colors**: Primary blue, status colors (success/warning/danger)
- **Spacing**: 4px base unit scale
- **Typography**: System font stack with responsive sizing
- **Shadows**: Layered elevation system
- **Dark Mode**: Full theme support via `.dark-mode` class

## 📄 License

MIT License - feel free to use this project for learning or as a template.

---

Built with ❤️ for agri-business logistics
