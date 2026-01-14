import * as THREE from 'three';
import type { PropellerParams, AirfoilPoint } from '../types';
import { AirfoilGenerator } from './airfoils';

export class PropellerGeometry {
  private params: PropellerParams;
  private bladeAirfoils: AirfoilPoint[][] = [];

  constructor(params: PropellerParams) {
    this.params = params;
    this.precomputeBladeAirfoils();
  }

  private precomputeBladeAirfoils(): void {
    const stations = this.getRadiusStations();
    const numSections = 20;

    for (let i = 0; i < stations.length; i++) {
      const r = stations[i];
      const chord = this.getLocalChord(r);
      const thicknessRatio = this.getLocalThickness(r);

      const baseAirfoil = AirfoilGenerator.generate(this.params.airfoil, numSections);
      const scaledAirfoil = AirfoilGenerator.scaleToChord(baseAirfoil, chord);

      this.bladeAirfoils.push(scaledAirfoil);
    }
  }

  private getRadiusStations(): number[] {
    const r = this.params.diameter / 2;
    const rHub = this.params.hubRadius;
    const numStations = 20;
    const stations: number[] = [];

    for (let i = 0; i < numStations; i++) {
      const fraction = (i + 0.5) / numStations;
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

  generateBladeSurface(): THREE.BufferGeometry {
    const stations = this.getRadiusStations();
    const numRadial = stations.length;
    const numChordwise = this.bladeAirfoils[0].length;
    const numBlades = this.params.numBlades;

    const vertices: number[] = [];
    const indices: number[] = [];
    const normals: number[] = [];

    const bladeVertices: number[][] = [];

    for (let blade = 0; blade < numBlades; blade++) {
      const bladeVerts: number[] = [];
      const bladeAngle = (blade / numBlades) * 2 * Math.PI;

      for (let i = 0; i < numRadial; i++) {
        const r = stations[i];
        const chord = this.getLocalChord(r);
        const pitch = this.getLocalPitch(r);
        const skew = this.getLocalSkew(r);
        const rake = this.getLocalRake(r);

        const pitchAngle = pitch / (2 * Math.PI * r);
        const skewOffset = skew / this.params.diameter;
        const rakeOffset = rake;

        const airfoil = this.bladeAirfoils[i];
        const chordScale = chord / this.params.diameter;

        for (let j = 0; j < airfoil.length; j++) {
          const point = airfoil[j];
          const xLocal = point.x * chordScale;
          const yLocal = point.y * chordScale;

          const xSkewed = xLocal - skewOffset;
          const zRaked = yLocal + rakeOffset;

          const angle = bladeAngle + pitchAngle * (xLocal * this.params.diameter / r);

          const x = r * Math.cos(angle) - xSkewed * Math.sin(angle);
          const y = r * Math.sin(angle) + xSkewed * Math.cos(angle);
          const z = zRaked;

          bladeVerts.push(x, z, y);
        }
      }

      bladeVertices.push(bladeVerts);
    }

    for (let blade = 0; blade < numBlades; blade++) {
      const verts = bladeVertices[blade];

      for (let i = 0; i < numRadial - 1; i++) {
        for (let j = 0; j < numChordwise - 1; j++) {
          const base = i * numChordwise + j;
          const v0 = base;
          const v1 = base + 1;
          const v2 = base + numChordwise;
          const v3 = base + numChordwise + 1;

          indices.push(v0, v2, v1);
          indices.push(v1, v2, v3);
        }
      }

      vertices.push(...verts);
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
    geometry.setIndex(indices);
    geometry.computeVertexNormals();

    return geometry;
  }

  generateHub(): THREE.BufferGeometry {
    const hubRadius = this.params.hubRadius;
    const hubLength = hubRadius * 0.8;
    const segments = 32;

    const geometry = new THREE.CylinderGeometry(
      hubRadius * 0.8,
      hubRadius,
      hubLength,
      segments,
      1,
      false
    );

    geometry.rotateX(Math.PI / 2);

    const positions = geometry.attributes.position.array;
    for (let i = 0; i < positions.length; i += 3) {
      positions[i + 2] -= hubLength / 2;
    }

    return geometry;
  }

  generateCompletePropeller(): THREE.Group {
    const group = new THREE.Group();

    const bladeGeometry = this.generateBladeSurface();
    const hubGeometry = this.generateHub();

    const bladeMaterial = new THREE.MeshStandardMaterial({
      color: 0xcc8800,
      metalness: 0.3,
      roughness: 0.6,
      side: THREE.DoubleSide
    });

    const hubMaterial = new THREE.MeshStandardMaterial({
      color: 0x444444,
      metalness: 0.8,
      roughness: 0.3
    });

    for (let i = 0; i < this.params.numBlades; i++) {
      const bladeMesh = new THREE.Mesh(bladeGeometry.clone(), bladeMaterial);
      group.add(bladeMesh);
    }

    const hubMesh = new THREE.Mesh(hubGeometry, hubMaterial);
    group.add(hubMesh);

    return group;
  }

  getPreviewMesh(): THREE.Group {
    return this.generateCompletePropeller();
  }

  generateSTL(): string {
    const geometry = this.generateBladeSurface();
    const positions = geometry.attributes.position.array;
    const indices = geometry.index!.array;

    let stl = 'solid propeller\n';

    for (let i = 0; i < indices.length; i += 3) {
      const i0 = indices[i] * 3;
      const i1 = indices[i + 1] * 3;
      const i2 = indices[i + 2] * 3;

      const v0 = [positions[i0], positions[i0 + 1], positions[i0 + 2]];
      const v1 = [positions[i1], positions[i1 + 1], positions[i1 + 2]];
      const v2 = [positions[i2], positions[i2 + 1], positions[i2 + 2]];

      const edge1 = [v1[0] - v0[0], v1[1] - v0[1], v1[2] - v0[2]];
      const edge2 = [v2[0] - v0[0], v2[1] - v0[1], v2[2] - v0[2]];

      const normal = [
        edge1[1] * edge2[2] - edge1[2] * edge2[1],
        edge1[2] * edge2[0] - edge1[0] * edge2[2],
        edge1[0] * edge2[1] - edge1[1] * edge2[0]
      ];

      const length = Math.sqrt(normal[0] ** 2 + normal[1] ** 2 + normal[2] ** 2);
      normal[0] /= length;
      normal[1] /= length;
      normal[2] /= length;

      stl += `  facet normal ${normal[0]} ${normal[1]} ${normal[2]}\n`;
      stl += `    outer loop\n`;
      stl += `      vertex ${v0[0]} ${v0[1]} ${v0[2]}\n`;
      stl += `      vertex ${v1[0]} ${v1[1]} ${v1[2]}\n`;
      stl += `      vertex ${v2[0]} ${v2[1]} ${v2[2]}\n`;
      stl += `    endloop\n`;
      stl += `  endfacet\n`;
    }

    stl += 'endsolid propeller';

    return stl;
  }

  generateOBJ(): string {
    const geometry = this.generateBladeSurface();
    const positions = geometry.attributes.position.array;
    const indices = geometry.index!.array;

    let obj = '# Propeller geometry generated by Propeller AI\n';
    obj += `# Diameter: ${this.params.diameter} m\n`;
    obj += `# Blades: ${this.params.numBlades}\n\n`;

    for (let i = 0; i < positions.length; i += 3) {
      obj += `v ${positions[i].toFixed(6)} ${positions[i + 1].toFixed(6)} ${positions[i + 2].toFixed(6)}\n`;
    }

    obj += '\n';

    for (let i = 0; i < indices.length; i += 3) {
      const i0 = indices[i] + 1;
      const i1 = indices[i + 1] + 1;
      const i2 = indices[i + 2] + 1;
      obj += `f ${i0} ${i1} ${i2}\n`;
    }

    return obj;
  }
}
