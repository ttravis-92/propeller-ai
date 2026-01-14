import type { AirfoilPoint, AirfoilConfig } from '../types';

export class AirfoilGenerator {
  static generateNACA4(code: string, numPoints: number = 100): AirfoilPoint[] {
    if (code.length !== 4) {
      throw new Error(`Invalid NACA 4-digit code: ${code}`);
    }

    const m = parseInt(code[0]) / 100;
    const p = parseInt(code[1]) / 10;
    const t = parseInt(code.substring(2)) / 100;

    const points: AirfoilPoint[] = [];
    const beta = Math.PI / (numPoints - 1);

    for (let i = 0; i < numPoints; i++) {
      const x = (1 - Math.cos(i * beta)) / 2;
      const yt = 5 * t * (
        0.2969 * Math.sqrt(x) -
        0.1260 * x -
        0.3516 * Math.pow(x, 2) +
        0.2843 * Math.pow(x, 3) -
        0.1015 * Math.pow(x, 4)
      );

      let yc: number, dyc_dx: number;

      if (p === 0) {
        yc = 0;
        dyc_dx = 0;
      } else if (x < p) {
        yc = (m / Math.pow(p, 2)) * (2 * p * x - Math.pow(x, 2));
        dyc_dx = (2 * m / Math.pow(p, 2)) * (p - x);
      } else {
        yc = (m / Math.pow(1 - p, 2)) * ((1 - 2 * p) + 2 * p * x - Math.pow(x, 2));
        dyc_dx = (2 * m / Math.pow(1 - p, 2)) * (p - x);
      }

      const theta = Math.atan(dyc_dx);

      points.push({
        x: x - yt * Math.sin(theta),
        y: yc + yt * Math.cos(theta)
      });
    }

    for (let i = numPoints - 2; i >= 0; i--) {
      const x = (1 - Math.cos(i * beta)) / 2;
      const yt = 5 * t * (
        0.2969 * Math.sqrt(x) -
        0.1260 * x -
        0.3516 * Math.pow(x, 2) +
        0.2843 * Math.pow(x, 3) -
        0.1015 * Math.pow(x, 4)
      );

      let yc: number, dyc_dx: number;

      if (p === 0) {
        yc = 0;
        dyc_dx = 0;
      } else if (x < p) {
        yc = (m / Math.pow(p, 2)) * (2 * p * x - Math.pow(x, 2));
        dyc_dx = (2 * m / Math.pow(p, 2)) * (p - x);
      } else {
        yc = (m / Math.pow(1 - p, 2)) * ((1 - 2 * p) + 2 * p * x - Math.pow(x, 2));
        dyc_dx = (2 * m / Math.pow(1 - p, 2)) * (p - x);
      }

      const theta = Math.atan(dyc_dx);

      const originalPoint = points[i];
      points.push({
        x: originalPoint.x + yt * Math.sin(theta),
        y: yc - yt * Math.cos(theta)
      });
    }

    return points;
  }

  static generateNACA5(code: string, numPoints: number = 100): AirfoilPoint[] {
    if (code.length !== 5) {
      throw new Error(`Invalid NACA 5-digit code: ${code}`);
    }

    const nn = parseInt(code[0]);
    const p1 = parseInt(code[1]);
    const p2 = parseInt(code[2]);
    const xx = parseInt(code.substring(3));

    const t = xx / 100;
    const a0 = 0.2969;
    const a1 = -0.1260;
    const a2 = -0.3516;
    const a3 = 0.2843;
    const a4 = -0.1015;

    let m = 0, p = 0;
    if (p1 === 0) {
      m = 0;
      p = 0;
    } else {
      switch (p2) {
        case 0: m = 0.1 * p1; p = 0.05; break;
        case 1: m = 0.1 * p1; p = 0.10; break;
        case 2: m = 0.1 * p1; p = 0.15; break;
        case 3: m = 0.1 * p1; p = 0.20; break;
        case 4: m = 0.1 * p1; p = 0.25; break;
        case 5: m = 0.1 * p1; p = 0.30; break;
        case 6: m = 0.1 * p1; p = 0.35; break;
        case 7: m = 0.1 * p1; p = 0.40; break;
        case 8: m = 0.1 * p1; p = 0.45; break;
        case 9: m = 0.1 * p1; p = 0.50; break;
        default: m = 0; p = 0;
      }
    }

    const points: AirfoilPoint[] = [];
    const beta = Math.PI / (numPoints - 1);

    for (let i = 0; i < numPoints; i++) {
      const x = (1 - Math.cos(i * beta)) / 2;
      const yt = 5 * t * (
        a0 * Math.sqrt(x) +
        a1 * x +
        a2 * Math.pow(x, 2) +
        a3 * Math.pow(x, 3) +
        a4 * Math.pow(x, 4)
      );

      let yc: number, dyc_dx: number;

      if (m === 0) {
        yc = 0;
        dyc_dx = 0;
      } else if (x < p) {
        yc = (m / Math.pow(p, 2)) * (2 * p * x - Math.pow(x, 2));
        dyc_dx = (2 * m / Math.pow(p, 2)) * (p - x);
      } else {
        yc = (m / Math.pow(1 - p, 2)) * ((1 - 2 * p) + 2 * p * x - Math.pow(x, 2));
        dyc_dx = (2 * m / Math.pow(1 - p, 2)) * (p - x);
      }

      const theta = Math.atan(dyc_dx);

      points.push({
        x: x - yt * Math.sin(theta),
        y: yc + yt * Math.cos(theta)
      });
    }

    for (let i = numPoints - 2; i >= 0; i--) {
      const x = (1 - Math.cos(i * beta)) / 2;
      const yt = 5 * t * (
        a0 * Math.sqrt(x) +
        a1 * x +
        a2 * Math.pow(x, 2) +
        a3 * Math.pow(x, 3) +
        a4 * Math.pow(x, 4)
      );

      let yc: number, dyc_dx: number;

      if (m === 0) {
        yc = 0;
        dyc_dx = 0;
      } else if (x < p) {
        yc = (m / Math.pow(p, 2)) * (2 * p * x - Math.pow(x, 2));
        dyc_dx = (2 * m / Math.pow(p, 2)) * (p - x);
      } else {
        yc = (m / Math.pow(1 - p, 2)) * ((1 - 2 * p) + 2 * p * x - Math.pow(x, 2));
        dyc_dx = (2 * m / Math.pow(1 - p, 2)) * (p - x);
      }

      const theta = Math.atan(dyc_dx);

      const originalPoint = points[i];
      points.push({
        x: originalPoint.x + yt * Math.sin(theta),
        y: yc - yt * Math.cos(theta)
      });
    }

    return points;
  }

  static generateCustom(coordinates: { x: number; y: number }[]): AirfoilPoint[] {
    if (coordinates.length < 3) {
      throw new Error('Custom airfoil must have at least 3 points');
    }

    const normalized = coordinates.map(p => ({
      x: Math.max(0, Math.min(1, p.x)),
      y: Math.max(-0.5, Math.min(0.5, p.y))
    }));

    return normalized;
  }

  static parseSeligFormat(content: string): AirfoilPoint[] {
    const lines = content.split('\n').filter(l => l.trim() && !l.trim().startsWith(' '));
    const points: AirfoilPoint[] = [];

    for (const line of lines) {
      const parts = line.trim().split(/\s+/).map(Number);
      if (parts.length >= 2 && !isNaN(parts[0]) && !isNaN(parts[1])) {
        points.push({ x: parts[0], y: parts[1] });
      }
    }

    return points;
  }

  static parseLednicerFormat(content: string): AirfoilPoint[] {
    const lines = content.split('\n').filter(l => l.trim() && !l.trim().startsWith(' '));
    const points: AirfoilPoint[] = [];

    let inTopSection = true;
    const topPoints: AirfoilPoint[] = [];
    const bottomPoints: AirfoilPoint[] = [];

    for (const line of lines) {
      const parts = line.trim().split(/\s+/).map(Number);
      if (parts.length >= 2 && !isNaN(parts[0]) && !isNaN(parts[1])) {
        const point = { x: parts[0], y: parts[1] };
        if (inTopSection) {
          if (parts[0] === 0 && parts[1] === 0) {
            inTopSection = false;
          } else {
            topPoints.push(point);
          }
        } else {
          bottomPoints.push(point);
        }
      }
    }

    bottomPoints.reverse();
    return [...topPoints, ...bottomPoints];
  }

  static parseCSV(content: string): AirfoilPoint[] {
    const lines = content.split('\n').filter(l => l.trim());
    const points: AirfoilPoint[] = [];

    for (const line of lines) {
      const parts = line.split(',').map(s => s.trim());
      if (parts.length >= 2) {
        const x = parseFloat(parts[0]);
        const y = parseFloat(parts[1]);
        if (!isNaN(x) && !isNaN(y)) {
          points.push({ x, y });
        }
      }
    }

    return points;
  }

  static generate(config: AirfoilConfig, numPoints: number = 100): AirfoilPoint[] {
    switch (config.type) {
      case 'naca4':
        return this.generateNACA4(config.code!, numPoints);
      case 'naca5':
        return this.generateNACA5(config.code!, numPoints);
      case 'custom':
        if (config.name && this.isPresetAirfoil(config.name)) {
          return this.generatePresetAirfoil(config.name, numPoints);
        }
        if (config.coordinates) {
          return this.generateCustom(config.coordinates);
        }
        throw new Error('Custom airfoil requires coordinates');
      default:
        throw new Error(`Unknown airfoil type: ${config.type}`);
    }
  }

  static isPresetAirfoil(name: string): boolean {
    const presetAirfoils = ['NACA_0012', 'NACA_2412', 'S1223', 'MH_32', 'Clark_Y', 'RG_15'];
    return presetAirfoils.includes(name);
  }

  static normalize(airfoil: AirfoilPoint[]): AirfoilPoint[] {
    if (airfoil.length === 0) return [];

    const minX = Math.min(...airfoil.map(p => p.x));
    const maxX = Math.max(...airfoil.map(p => p.x));
    const scale = 1 / (maxX - minX);

    return airfoil.map(p => ({
      x: (p.x - minX) * scale,
      y: p.y * scale
    }));
  }

  static scaleToChord(airfoil: AirfoilPoint[], chord: number): AirfoilPoint[] {
    return airfoil.map(p => ({
      x: p.x * chord,
      y: p.y * chord
    }));
  }

  static getThickness(airfoil: AirfoilPoint[]): number {
    let maxThickness = 0;
    const normalized = this.normalize(airfoil);

    for (const p of normalized) {
      const thickness = Math.abs(p.y);
      if (thickness > maxThickness) {
        maxThickness = thickness;
      }
    }

    return maxThickness * 2;
  }

  static generatePresetAirfoil(name: string, numPoints: number = 100): AirfoilPoint[] {
    switch (name) {
      case 'NACA_0012':
        return this.generateNACA4('0012', numPoints);
      case 'NACA_2412':
        return this.generateNACA4('2412', numPoints);
      case 'S1223':
        return this.generateS1223(numPoints);
      case 'MH_32':
        return this.generateMH32(numPoints);
      case 'Clark_Y':
        return this.generateClarkY(numPoints);
      case 'RG_15':
        return this.generateRG15(numPoints);
      default:
        return this.generateNACA4('2412', numPoints);
    }
  }

  private static generateS1223(numPoints: number): AirfoilPoint[] {
    const points: AirfoilPoint[] = [];
    const s1223Coords = [
      [1, 0], [0.95, 0.00542], [0.9, 0.0148], [0.8, 0.0334], [0.7, 0.0502],
      [0.6, 0.0638], [0.5, 0.0732], [0.4, 0.0782], [0.3, 0.0786], [0.2, 0.0732],
      [0.15, 0.0672], [0.1, 0.0572], [0.075, 0.0492], [0.05, 0.0382], [0.025, 0.0242],
      [0.0125, 0.0148], [0, 0], [0.0125, -0.0125], [0.025, -0.0185], [0.05, -0.0265],
      [0.075, -0.0315], [0.1, -0.0345], [0.15, -0.0372], [0.2, -0.0365], [0.3, -0.0305],
      [0.4, -0.0205], [0.5, -0.0085], [0.6, 0.0055], [0.7, 0.0205], [0.8, 0.0365],
      [0.9, 0.0525], [0.95, 0.0605], [1, 0]
    ];
    return this.interpolateAirfoil(s1223Coords, numPoints);
  }

  private static generateMH32(numPoints: number): AirfoilPoint[] {
    const points: AirfoilPoint[] = [];
    const mh32Coords = [
      [1, 0], [0.95, 0.0038], [0.9, 0.0105], [0.8, 0.0245], [0.7, 0.0368],
      [0.6, 0.0462], [0.5, 0.0522], [0.4, 0.0548], [0.3, 0.0538], [0.2, 0.0485],
      [0.15, 0.0438], [0.1, 0.0365], [0.075, 0.0308], [0.05, 0.0235], [0.025, 0.0145],
      [0.0125, 0.0085], [0, 0], [0.0125, -0.0065], [0.025, -0.0105], [0.05, -0.0155],
      [0.075, -0.0185], [0.1, -0.0205], [0.15, -0.0225], [0.2, -0.0228], [0.3, -0.0205],
      [0.4, -0.0155], [0.5, -0.0085], [0.6, -0.0005], [0.7, 0.0085], [0.8, 0.0185],
      [0.9, 0.0295], [0.95, 0.0355], [1, 0]
    ];
    return this.interpolateAirfoil(mh32Coords, numPoints);
  }

  private static generateClarkY(numPoints: number): AirfoilPoint[] {
    const points: AirfoilPoint[] = [];
    const clarkYCoords = [
      [1, 0], [0.95, 0.0062], [0.9, 0.0158], [0.8, 0.0352], [0.7, 0.0518],
      [0.6, 0.0645], [0.5, 0.0728], [0.4, 0.0768], [0.3, 0.0762], [0.2, 0.0702],
      [0.15, 0.0638], [0.1, 0.0542], [0.075, 0.0465], [0.05, 0.0365], [0.025, 0.0242],
      [0.0125, 0.0148], [0, 0], [0.0125, -0.0095], [0.025, -0.0145], [0.05, -0.0205],
      [0.075, -0.0245], [0.1, -0.0272], [0.15, -0.0305], [0.2, -0.0312], [0.3, -0.0285],
      [0.4, -0.0215], [0.5, -0.0115], [0.6, 0.0005], [0.7, 0.0135], [0.8, 0.0275],
      [0.9, 0.0425], [0.95, 0.0505], [1, 0]
    ];
    return this.interpolateAirfoil(clarkYCoords, numPoints);
  }

  private static generateRG15(numPoints: number): AirfoilPoint[] {
    const points: AirfoilPoint[] = [];
    const rg15Coords = [
      [1, 0], [0.95, 0.0085], [0.9, 0.0198], [0.8, 0.0425], [0.7, 0.0615],
      [0.6, 0.0762], [0.5, 0.0865], [0.4, 0.0918], [0.3, 0.0912], [0.2, 0.0845],
      [0.15, 0.0775], [0.1, 0.0665], [0.075, 0.0575], [0.05, 0.0458], [0.025, 0.0312],
      [0.0125, 0.0195], [0, 0], [0.0125, -0.0145], [0.025, -0.0215], [0.05, -0.0295],
      [0.075, -0.0355], [0.1, -0.0398], [0.15, -0.0452], [0.2, -0.0475], [0.3, -0.0465],
      [0.4, -0.0395], [0.5, -0.0275], [0.6, -0.0115], [0.7, 0.0075], [0.8, 0.0295],
      [0.9, 0.0545], [0.95, 0.0685], [1, 0]
    ];
    return this.interpolateAirfoil(rg15Coords, numPoints);
  }

  private static interpolateAirfoil(coordinates: number[][], numPoints: number): AirfoilPoint[] {
    const points: AirfoilPoint[] = [];
    const sortedCoords = [...coordinates].sort((a, b) => a[0] - b[0]);
    
    const numChordwise = Math.ceil(numPoints / 2);
    const beta = Math.PI / (numChordwise - 1);

    for (let i = 0; i < numChordwise; i++) {
      const x = (1 - Math.cos(i * beta)) / 2;
      const y = this.interp1D(sortedCoords, x, 0, 1);
      points.push({ x, y: y || 0 });
    }

    const bottomCoords = sortedCoords.filter(c => c[1] < 0).reverse();
    const numBottom = numChordwise - 2;

    for (let i = 1; i < numBottom; i++) {
      const x = (1 - Math.cos(i * beta)) / 2;
      const y = this.interp1D(bottomCoords, x, 0, 1);
      points.push({ x, y: y || 0 });
    }

    return points;
  }

  private static interp1D(data: number[][], x: number, xCol: number = 0, yCol: number = 1): number {
    if (x <= data[0][xCol]) return data[0][yCol];
    if (x >= data[data.length - 1][xCol]) return data[data.length - 1][yCol];

    let i = 0;
    while (i < data.length - 1 && data[i + 1][xCol] < x) {
      i++;
    }

    const x0 = data[i][xCol];
    const x1 = data[i + 1][xCol];
    const t = (x - x0) / (x1 - x0);

    return data[i][yCol] + t * (data[i + 1][yCol] - data[i][yCol]);
  }
}
