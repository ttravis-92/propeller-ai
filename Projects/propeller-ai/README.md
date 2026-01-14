# Propeller AI - Propeller Design Platform

## Quick Start

### Online Demo
Visit: https://ttravis-92.github.io/propeller-ai/

### Local Development
1. Clone repository
```bash
git clone https://github.com/ttravis-92/propeller-ai.git
cd propeller-ai
```

2. Install dependencies
```bash
npm install
```

3. Start development server
```bash
npm run dev
```
Open http://localhost:5173

### Build for Production
```bash
npm run build
```

Deploy `dist/` folder to GitHub Pages or your preferred hosting service.

## Features

- **Parametric Design**: Define propeller geometry with diameter, blade count, chord/pitch/skew/rake distributions
- **Airfoil Support**: 10+ preset UAV airfoils with real polar data (Re: 50k-500k)
- **3D Visualization**: Real-time Three.js preview with realistic airfoil shapes and rotation animation
- **BEMT Analysis**: Blade Element Momentum Theory with real airfoil polar data integration
- **Performance Curves**: Thrust, power, torque, and efficiency vs RPM
- **J-T Diagram**: Efficiency contour map for advance ratio and RPM analysis
- **Export**: Download STL or OBJ files for 3D printing or CFD analysis
- **Local Storage**: Save and load designs without login
- **Templates**: Pre-configured propeller templates for different applications
- **Internationalization**: English and Chinese language support

## Technologies

- **Vue 3 + TypeScript** - Frontend framework
- **Three.js** - 3D visualization
- **ECharts** - Performance charts
- **Element Plus** - UI components
- **Vite** - Build tool
- **Pinia** - State management

## Preset Airfoils

The platform includes 10 carefully selected airfoils with complete polar data:

### Symmetric Airfoils
- **NACA 0012**: Classic symmetric airfoil, widely used for propellers

### Cambered Airfoils
- **NACA 2412**: Moderate camber, good for general propeller applications
- **NACA 4412**: High camber airfoil for maximum lift
- **S1223**: High-lift airfoil, excellent for low Reynolds number applications
- **MH 32**: Thin, high-performance racing airfoil
- **Clark Y**: Flat-bottom airfoil with excellent stall characteristics
- **RG 15**: Efficient airfoil for low Reynolds number applications
- **E423**: Eppler E423 airfoil, good for UAV applications
- **GOE 398**: Goettingen airfoil for model aircraft
- **FX 76-MP140**: High performance model aircraft airfoil

---

## Status

✅ **Website**: https://ttravis-92.github.io/propeller-ai/
✅ **GitHub Pages**: Deployed successfully
✅ **Features**: All core functionality implemented
✅ **Airfoil Database**: 10 airfoils with polar data
✅ **3D Visualization**: Realistic airfoil shapes
✅ **BEMT Analysis**: Performance prediction engine
✅ **Export**: STL/OBJ file download

---

*Last updated: January 14, 2026*