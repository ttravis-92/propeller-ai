import type {
  PropellerParams,
  BEMTResult,
  PerformanceCurves,
  EfficiencyMap,
  OperatingConditions,
  AirfoilPolar
} from '../types';

export class BEMTSolver {
  private params: PropellerParams;
  private conditions: OperatingConditions;
  private numStations: number = 20;
  private convergenceTolerance: number = 1e-6;
  private maxIterations: number = 100;

  constructor(params: PropellerParams, conditions?: OperatingConditions) {
    this.params = params;
    this.conditions = conditions || {
      velocity: 10,
      rpm: 1000,
      airDensity: 1.225,
      kinematicViscosity: 1.5e-5
    };

    this.initializeDistributions();
  }

  private initializeDistributions(): void {
    const r = this.params.diameter / 2;
    const rHub = this.params.hubRadius;
    const stations = this.numStations;

    const defaultChord = 0.15 * this.params.diameter;
    const defaultPitch = 0.6 * this.params.diameter;

    if (this.params.chordDistribution.length === 0) {
      this.params.chordDistribution = this.generateLinearDistribution(rHub, r, stations, defaultChord, defaultChord * 0.4);
    }
    if (this.params.pitchDistribution.length === 0) {
      this.params.pitchDistribution = this.generateLinearDistribution(rHub, r, stations, defaultPitch * 0.8, defaultPitch * 1.2);
    }
    if (this.params.skewDistribution.length === 0) {
      this.params.skewDistribution = new Array(stations).fill(0);
    }
    if (this.params.rakeDistribution.length === 0) {
      this.params.rakeDistribution = new Array(stations).fill(0);
    }
    if (this.params.thicknessDistribution.length === 0) {
      this.params.thicknessDistribution = new Array(stations).fill(0.12);
    }
  }

  private generateLinearDistribution(r1: number, r2: number, n: number, v1: number, v2: number): number[] {
    const result: number[] = [];
    for (let i = 0; i < n; i++) {
      const r = r1 + (r2 - r1) * i / (n - 1);
      const t = (r - r1) / (r2 - r1);
      result.push(v1 + (v2 - v1) * t);
    }
    return result;
  }

  private getRadiusStations(): number[] {
    const r = this.params.diameter / 2;
    const rHub = this.params.hubRadius;
    const stations: number[] = [];

    for (let i = 0; i < this.numStations; i++) {
      const fraction = (i + 0.5) / this.numStations;
      stations.push(rHub + fraction * (r - rHub));
    }

    return stations;
  }

  private getLocalChord(r: number): number {
    const stations = this.getRadiusStations();
    return this.interpolate(stations, this.params.chordDistribution, r);
  }

  private getLocalPitch(r: number): number {
    const stations = this.getRadiusStations();
    return this.interpolate(stations, this.params.pitchDistribution, r);
  }

  private getLocalSkew(r: number): number {
    const stations = this.getRadiusStations();
    return this.interpolate(stations, this.params.skewDistribution, r);
  }

  private getLocalRake(r: number): number {
    const stations = this.getRadiusStations();
    return this.interpolate(stations, this.params.rakeDistribution, r);
  }

  private getLocalThickness(r: number): number {
    const stations = this.getRadiusStations();
    return this.interpolate(stations, this.params.thicknessDistribution, r);
  }

  private interpolate(xArr: number[], yArr: number[], x: number): number {
    if (x <= xArr[0]) return yArr[0];
    if (x >= xArr[xArr.length - 1]) return yArr[yArr.length - 1];

    let i = 0;
    while (i < xArr.length - 1 && xArr[i + 1] < x) {
      i++;
    }

    const x0 = xArr[i];
    const x1 = xArr[i + 1];
    const t = (x - x0) / (x1 - x0);

    return yArr[i] + t * (yArr[i + 1] - yArr[i]);
  }

  private prandtlTipLossFactor(r: number, numBlades: number, phi: number): number {
    const R = this.params.diameter / 2;
    const f = numBlades / 2 * (R - r) / (r * Math.abs(phi));

    if (f > 700) return 0.0001;

    const exp_f = Math.exp(-f);
    return (2 / Math.PI) * Math.acos(exp_f);
  }

  private prandtlHubLossFactor(r: number, numBlades: number, phi: number): number {
    const rHub = this.params.hubRadius;
    const f = numBlades / 2 * (r - rHub) / (rHub * Math.abs(phi));

    if (f > 700) return 0.0001;

    const exp_f = Math.exp(-f);
    return (2 / Math.PI) * Math.acos(exp_f);
  }

  private getAirfoilPolar(aoa: number): { cl: number; cd: number } {
    const polar = this.params.airfoil.polarData;

    if (!polar || polar.aoa.length === 0) {
      const aoaRad = aoa * Math.PI / 180;
      return {
        cl: 2 * Math.PI * aoaRad,
        cd: 0.01 + 0.01 * Math.pow(aoaRad * 180 / Math.PI, 2)
      };
    }

    const cl = this.interpolate(polar.aoa, polar.cl, aoa);
    const cd = this.interpolate(polar.aoa, polar.cd, aoa);

    return { cl: Math.max(-2, Math.min(2, cl)), cd: Math.max(0.005, cd) };
  }

  solve(rpm: number = this.conditions.rpm, velocity: number = this.conditions.velocity): BEMTResult {
    const omega = rpm * 2 * Math.PI / 60;
    const R = this.params.diameter / 2;
    const rho = this.conditions.airDensity;
    const numBlades = this.params.numBlades;

    const stations = this.getRadiusStations();
    const numStations = stations.length;

    const localInducedVelocity: number[] = [];
    const localAoA: number[] = [];
    const localCl: number[] = [];
    const localCd: number[] = [];
    const localLift: number[] = [];
    const localDrag: number[] = [];

    let totalThrust = 0;
    let totalTorque = 0;

    for (let i = 0; i < numStations; i++) {
      const r = stations[i];
      const dr = (R - this.params.hubRadius) / numStations;
      const chord = this.getLocalChord(r);
      const pitch = this.getLocalPitch(r);

      let phi = Math.atan2(velocity, omega * r);
      let a = 0;
      let aPrime = 0;

      for (let iter = 0; iter < this.maxIterations; iter++) {
        const phiOld = phi;

        const F = this.prandtlTipLossFactor(r, numBlades, phi);
        const FHub = this.prandtlHubLossFactor(r, numBlades, phi);
        const Ftotal = F * FHub;

        const sinPhi = Math.sin(phi);
        const cosPhi = Math.cos(phi);

        const localV = Math.sqrt(
          Math.pow(velocity * (1 + a), 2) +
          Math.pow(omega * r * (1 - aPrime), 2)
        );

        const geometricPitch = pitch / (2 * Math.PI * r);
        const beta = Math.atan(geometricPitch);
        const aoa = (phi - beta) * 180 / Math.PI;

        const { cl, cd } = this.getAirfoilPolar(aoa);

        const sigma = chord * numBlades / (2 * Math.PI * r);
        const tempA = sigma * cl / (4 * Ftotal * sinPhi);
        const tempAPrime = sigma * cd / (4 * Ftotal * cosPhi);

        const newA = tempA / (1 + tempA);
        const newAPrime = tempAPrime / (1 + tempAPrime);

        a = Math.max(0, Math.min(0.9, newA));
        aPrime = Math.max(-0.5, Math.min(0.5, newAPrime));

        const inducedFactor = 1 / (1 + a);
        const tanPhiFactor = (1 - aPrime) / (1 + a);

        phi = Math.atan(
          velocity * inducedFactor /
          (omega * r * tanPhiFactor)
        );

        if (Math.abs(phi - phiOld) < this.convergenceTolerance) break;
      }

      const sinPhi = Math.sin(phi);
      const cosPhi = Math.cos(phi);
      const tanPhi = sinPhi / cosPhi;

      const geometricPitch = pitch / (2 * Math.PI * r);
      const beta = Math.atan(geometricPitch);
      const aoa = (phi - beta) * 180 / Math.PI;

      const { cl, cd } = this.getAirfoilPolar(aoa);

      const localV = Math.sqrt(
        Math.pow(velocity * (1 + a), 2) +
        Math.pow(omega * r * (1 - aPrime), 2)
      );

      const dL = 0.5 * rho * Math.pow(localV, 2) * chord * dr * cl;
      const dD = 0.5 * rho * Math.pow(localV, 2) * chord * dr * cd;

      localInducedVelocity.push(a * velocity);
      localAoA.push(aoa);
      localCl.push(cl);
      localCd.push(cd);
      localLift.push(dL);
      localDrag.push(dD);

      totalThrust += dL * cosPhi - dD * sinPhi;
      totalTorque += r * (dL * sinPhi + dD * cosPhi);
    }

    const area = Math.PI * Math.pow(R, 2);
    const n = rpm / 60;

    const ct = totalThrust / (rho * Math.pow(n, 2) * Math.pow(this.params.diameter, 4));
    const cq = totalTorque / (rho * Math.pow(n, 2) * Math.pow(this.params.diameter, 5));
    const cp = cq * 2 * Math.PI;
    const advanceRatio = velocity / (n * this.params.diameter);
    const efficiency = totalThrust * velocity / (totalTorque * omega);

    return {
      thrust: totalThrust,
      torque: totalTorque,
      power: totalTorque * omega,
      efficiency: Math.max(0, Math.min(1, efficiency)) * 100,
      ct,
      cq,
      cp,
      advanceRatio,
      localInducedVelocity,
      localAoA,
      localCl,
      localCd,
      localLift,
      localDrag
    };
  }

  generatePerformanceCurves(
    rpmMin: number,
    rpmMax: number,
    numPoints: number = 20,
    velocity: number = this.conditions.velocity
  ): PerformanceCurves {
    const curves: PerformanceCurves = {
      rpm: [],
      thrust: [],
      torque: [],
      power: [],
      efficiency: [],
      ct: [],
      cq: [],
      cp: []
    };

    const rpmStep = (rpmMax - rpmMin) / (numPoints - 1);

    for (let i = 0; i < numPoints; i++) {
      const rpm = rpmMin + i * rpmStep;
      const result = this.solve(rpm, velocity);

      curves.rpm.push(rpm);
      curves.thrust.push(result.thrust);
      curves.torque.push(result.torque);
      curves.power.push(result.power);
      curves.efficiency.push(result.efficiency);
      curves.ct.push(result.ct);
      curves.cq.push(result.cq);
      curves.cp.push(result.cp);
    }

    return curves;
  }

  generateEfficiencyMap(
    rpm: number,
    jMin: number = 0,
    jMax: number = 1.5,
    jSteps: number = 20
  ): EfficiencyMap {
    const jStep = (jMax - jMin) / (jSteps - 1);
    const n = rpm / 60;
    const velocityMin = jMin * n * this.params.diameter;
    const velocityMax = jMax * n * this.params.diameter;

    const ctGrid: number[][] = [];
    const cqGrid: number[][] = [];
    const efficiencyGrid: number[][] = [];
    const advanceRatios: number[] = [];

    for (let j = 0; j < jSteps; j++) {
      const velocity = velocityMin + j * jStep;
      const result = this.solve(rpm, velocity);

      ctGrid.push([]);
      cqGrid.push([]);
      efficiencyGrid.push([]);

      for (let rpmIdx = 0; rpmIdx < 10; rpmIdx++) {
        const rpmFactor = 0.5 + rpmIdx * 0.1;
        const adjustedRpm = rpm * rpmFactor;
        const adjustedResult = this.solve(adjustedRpm, velocity);

        ctGrid[j].push(adjustedResult.ct);
        cqGrid[j].push(adjustedResult.cq);
        efficiencyGrid[j].push(adjustedResult.efficiency);
      }

      advanceRatios.push(velocity / (n * this.params.diameter));
    }

    return {
      advanceRatio: advanceRatios,
      rpm: [],
      ct: ctGrid,
      cq: cqGrid,
      efficiency: efficiencyGrid
    };
  }

  updateConditions(conditions: Partial<OperatingConditions>): void {
    this.conditions = { ...this.conditions, ...conditions };
  }
}
