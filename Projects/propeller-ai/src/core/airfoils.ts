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
        if (config.coordinates) {
          return this.generateCustom(config.coordinates);
        }
        throw new Error('Custom airfoil requires coordinates');
      default:
        throw new Error(`Unknown airfoil type: ${config.type}`);
    }
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
}
