export interface PropellerParams {
  id: string;
  name: string;
  diameter: number;
  numBlades: number;
  hubRadius: number;
  chordDistribution: number[];
  pitchDistribution: number[];
  skewDistribution: number[];
  rakeDistribution: number[];
  thicknessDistribution: number[];
  airfoil: AirfoilConfig;
  units: 'metric' | 'imperial';
}

export interface AirfoilConfig {
  type: 'naca4' | 'naca5' | 'custom';
  code?: string;
  name?: string;
  coordinates?: { x: number; y: number }[];
  polarData?: AirfoilPolar;
}

export interface AirfoilPolar {
  aoa: number[];
  cl: number[];
  cd: number[];
  cm?: number[];
}

export interface AirfoilPoint {
  x: number;
  y: number;
}

export interface BEMTResult {
  thrust: number;
  torque: number;
  power: number;
  efficiency: number;
  ct: number;
  cq: number;
  cp: number;
  advanceRatio: number;
  localInducedVelocity: number[];
  localAoA: number[];
  localCl: number[];
  localCd: number[];
  localLift: number[];
  localDrag: number[];
}

export interface PerformanceCurves {
  rpm: number[];
  thrust: number[];
  torque: number[];
  power: number[];
  efficiency: number[];
  ct: number[];
  cq: number[];
  cp: number[];
}

export interface EfficiencyMap {
  advanceRatio: number[];
  rpm: number[];
  ct: number[][];
  cq: number[][];
  efficiency: number[][];
}

export interface OperatingConditions {
  velocity: number;
  rpm: number;
  airDensity: number;
  kinematicViscosity: number;
}

export const DEFAULT_PARAMS: Omit<PropellerParams, 'id' | 'name'> = {
  diameter: 0.5,
  numBlades: 3,
  hubRadius: 0.025,
  chordDistribution: [],
  pitchDistribution: [],
  skewDistribution: [],
  rakeDistribution: [],
  thicknessDistribution: [],
  airfoil: {
    type: 'naca4',
    code: '2412'
  },
  units: 'metric'
};

export const NACA_4_DIGIT_AIRFOILS = [
  '0006', '0010', '0012', '0015', '0018', '0021', '0024',
  '1410', '1412', '1415', '1418', '1424',
  '2411', '2412', '2415', '2418', '2421', '2424',
  '2510', '2515', '2518', '2521', '2524',
  '4412', '4415', '4418', '4421', '4424',
  '6412', '6415', '6418', '6421', '6424',
  '0012', '0025', '0030'
];

export const NACA_5_DIGIT_AIRFOILS = [
  '21010', '21012', '21015', '21020', '21021', '21024',
  '22010', '22012', '22015', '22020', '22024',
  '22110', '22112', '22115', '22120', '22124',
  '23010', '23012', '23015', '23018', '23020', '23024',
  '23110', '23112', '23115', '23118', '23120', '23124',
  '24010', '24012', '24015', '24018', '24020', '24024',
  '24110', '24112', '24115', '24118', '24120', '24124',
  '24210', '24212', '24215', '24218', '24220', '24224',
  '25010', '25012', '25015', '25018', '25020', '25024',
  '25110', '25112', '25115', '25118', '25120', '25124',
  '44112', '44118', '44212', '44218'
];

export interface AirfoilDatabase {
  metadata: {
    description: string;
    reynoldsRange: string;
    lastUpdated: string;
  };
  airfoils: {
    [key: string]: {
      name: string;
      type: string;
      description: string;
      thickness: number;
      camber: number;
      polars: {
        [key: string]: {
          reynolds: number;
          data: Array<{
            alpha: number;
            cl: number;
            cd: number;
            cm?: number;
          }>;
        };
      };
    };
  };
}
