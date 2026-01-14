# Propeller AI

Online propeller design and CFD analysis platform for UAV and eVTOL applications.

## Features

- **Parametric Design**: Define propeller geometry with diameter, blade count, chord/pitch/skew/rake distributions
- **Airfoil Support**: NACA 4-digit and 5-digit series, plus custom airfoil upload
- **3D Visualization**: Real-time Three.js preview with rotation animation
- **BEMT Analysis**: Blade Element Momentum Theory for fast performance prediction
- **Performance Curves**: Thrust, power, torque, and efficiency vs RPM
- **J-T Diagram**: Efficiency map for advance ratio and RPM analysis
- **Export**: Download STL or OBJ files for 3D printing or CFD
- **Local Storage**: Save and load designs without login

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

Open http://localhost:5173 in your browser.

### Build

```bash
npm run build
```

The build output is in the `dist/` folder, ready for deployment to GitHub Pages.

## Deployment

### GitHub Pages

1. Push this repository to GitHub
2. Go to Repository Settings → Pages
3. Select "GitHub Actions" as the source
4. The site will be deployed automatically on push to main

## Architecture

```
src/
├── components/
│   ├── PropellerForm.vue      # Parameter input forms
│   ├── PropellerPreview.vue   # Three.js 3D preview
│   └── PerformanceCharts.vue  # ECharts performance plots
├── core/
│   ├── airfoils.ts            # NACA/custom airfoil generation
│   ├── bemt.ts                # BEMT solver engine
│   └── geometry.ts            # 3D geometry generation
├── services/
│   └── storage.ts             # Local storage management
├── stores/
│   └── propeller.ts           # Pinia state management
└── types/
    └── index.ts               # TypeScript definitions
```

## Technologies

- **Vue 3** - Frontend framework
- **TypeScript** - Type safety
- **Vite** - Build tool
- **Three.js** - 3D visualization
- **ECharts** - Performance charts
- **Element Plus** - UI components
- **Pinia** - State management

## License

MIT
