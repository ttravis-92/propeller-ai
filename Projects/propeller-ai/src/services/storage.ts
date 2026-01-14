import type { PropellerParams } from '../types';
import { DEFAULT_PARAMS } from '../types';

const STORAGE_KEY = 'propeller_ai_designs';

export class StorageService {
  static generateId(): string {
    return `prop_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
  }

  static saveDesign(params: PropellerParams): void {
    const designs = this.loadAllDesigns();
    const index = designs.findIndex(d => d.id === params.id);

    if (index >= 0) {
      designs[index] = params;
    } else {
      designs.push(params);
    }

    localStorage.setItem(STORAGE_KEY, JSON.stringify(designs));
  }

  static loadDesign(id: string): PropellerParams | null {
    const designs = this.loadAllDesigns();
    const design = designs.find(d => d.id === id);
    return design || null;
  }

  static loadAllDesigns(): PropellerParams[] {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      if (!data) return [];
      return JSON.parse(data);
    } catch {
      return [];
    }
  }

  static deleteDesign(id: string): void {
    const designs = this.loadAllDesigns().filter(d => d.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(designs));
  }

  static createDefaultDesign(name: string = 'New Propeller'): PropellerParams {
    const diameter = 0.5;
    const numBlades = 3;
    const hubRadius = 0.025;
    const r = diameter / 2;

    const chordDistribution: number[] = [];
    const pitchDistribution: number[] = [];
    const skewDistribution: number[] = [];
    const rakeDistribution: number[] = [];
    const thicknessDistribution: number[] = [];

    const numStations = 20;
    for (let i = 0; i < numStations; i++) {
      const t = i / (numStations - 1);
      chordDistribution.push(0.12 * diameter * (1 - t * 0.5));
      pitchDistribution.push(0.5 * diameter);
      skewDistribution.push(0);
      rakeDistribution.push(0);
      thicknessDistribution.push(0.12 - t * 0.04);
    }

    return {
      id: this.generateId(),
      name,
      diameter,
      numBlades,
      hubRadius,
      chordDistribution,
      pitchDistribution,
      skewDistribution,
      rakeDistribution,
      thicknessDistribution,
      airfoil: {
        type: 'naca4',
        code: '2412'
      },
      units: 'metric'
    };
  }

  static exportDesign(params: PropellerParams): Blob {
    const exportData = {
      version: '1.0',
      exportedAt: new Date().toISOString(),
      params
    };

    return new Blob([JSON.stringify(exportData, null, 2)], {
      type: 'application/json'
    });
  }

  static async importDesign(file: File): Promise<PropellerParams> {
    const text = await file.text();
    const data = JSON.parse(text);

    if (data.version && data.params) {
      const params = data.params as PropellerParams;
      params.id = this.generateId();
      return params;
    }

    if (data.diameter && data.numBlades) {
      const params = data as PropellerParams;
      params.id = this.generateId();
      return params;
    }

    throw new Error('Invalid design file format');
  }

  static downloadDesign(params: PropellerParams, filename?: string): void {
    const blob = this.exportDesign(params);
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename || `${params.name.replace(/\s+/g, '_')}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }

  static downloadSTL(params: PropellerParams, filename?: string): void {
    import('../core/geometry').then(({ PropellerGeometry }) => {
      const geometry = new PropellerGeometry(params);
      const stl = geometry.generateSTL();

      const blob = new Blob([stl], { type: 'model/stl' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = filename || `${params.name.replace(/\s+/g, '_')}.stl`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    });
  }

  static downloadOBJ(params: PropellerParams, filename?: string): void {
    import('../core/geometry').then(({ PropellerGeometry }) => {
      const geometry = new PropellerGeometry(params);
      const obj = geometry.generateOBJ();

      const blob = new Blob([obj], { type: 'model/obj' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = filename || `${params.name.replace(/\s+/g, '_')}.obj`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    });
  }
}
