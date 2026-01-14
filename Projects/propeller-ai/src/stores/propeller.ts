import { defineStore } from 'pinia';
import { ref, computed, watch } from 'vue';
import type { PropellerParams, PerformanceCurves, EfficiencyMap, OperatingConditions, AirfoilPolar } from '../types';
import { StorageService } from '../services/storage';
import { BEMTSolver } from '../core/bemt';
import { PropellerGeometry } from '../core/geometry';
import { loadAirfoilDatabase, getAvailableAirfoils, getPolarForAirfoil } from '../services/airfoil-database';

export const usePropellerStore = defineStore('propeller', () => {
  const currentDesign = ref<PropellerParams>(StorageService.createDefaultDesign());
  const savedDesigns = ref<PropellerParams[]>([]);
  const performanceCurves = ref<PerformanceCurves | null>(null);
  const efficiencyMap = ref<EfficiencyMap | null>(null);
  const operatingConditions = ref<OperatingConditions>({
    velocity: 10,
    rpm: 1000,
    airDensity: 1.225,
    kinematicViscosity: 1.5e-5
  });
  const isCalculating = ref(false);
  const lastCalculationResult = ref<any>(null);
  const availableAirfoils = ref<Array<{ id: string; name: string; type: string; thickness: number; camber: number }>>([]);
  const isAirfoilDatabaseLoaded = ref(false);

  const diameter = computed(() => currentDesign.value.diameter);
  const numBlades = computed(() => currentDesign.value.numBlades);

  async function initializeAirfoilDatabase(): Promise<void> {
    if (isAirfoilDatabaseLoaded.value) return;

    try {
      await loadAirfoilDatabase();
      availableAirfoils.value = getAvailableAirfoils();
      isAirfoilDatabaseLoaded.value = true;
    } catch (error) {
      console.error('Failed to load airfoil database:', error);
    }
  }

  function selectPresetAirfoil(airfoilId: string): void {
    const polar = getPolarForAirfoil(airfoilId, 100000);
    if (polar) {
      currentDesign.value.airfoil = {
        type: 'custom',
        name: airfoilId,
        polarData: polar as AirfoilPolar
      };
    }
  }

  function loadSavedDesigns(): void {
    savedDesigns.value = StorageService.loadAllDesigns();
  }

  function saveCurrentDesign(): void {
    StorageService.saveDesign(currentDesign.value);
    loadSavedDesigns();
  }

  function loadDesign(id: string): void {
    const design = StorageService.loadDesign(id);
    if (design) {
      currentDesign.value = { ...design };
    }
  }

  function newDesign(name: string = 'New Propeller'): void {
    currentDesign.value = StorageService.createDefaultDesign(name);
    performanceCurves.value = null;
    efficiencyMap.value = null;
  }

  function deleteDesign(id: string): void {
    StorageService.deleteDesign(id);
    loadSavedDesigns();
  }

  function updateAirfoil(airfoil: PropellerParams['airfoil']): void {
    currentDesign.value.airfoil = airfoil;
  }

  function updateOperatingConditions(conditions: Partial<OperatingConditions>): void {
    operatingConditions.value = { ...operatingConditions.value, ...conditions };
  }

  function generateDefaultDistributions(): void {
    const diameter = currentDesign.value.diameter;
    const hubRadius = currentDesign.value.hubRadius;
    const numStations = 20;

    const chordDistribution: number[] = [];
    const pitchDistribution: number[] = [];
    const skewDistribution: number[] = [];
    const rakeDistribution: number[] = [];
    const thicknessDistribution: number[] = [];

    for (let i = 0; i < numStations; i++) {
      const t = i / (numStations - 1);
      chordDistribution.push(0.12 * diameter * (1 - t * 0.5));
      pitchDistribution.push(0.5 * diameter);
      skewDistribution.push(0);
      rakeDistribution.push(0);
      thicknessDistribution.push(0.12 - t * 0.04);
    }

    currentDesign.value.chordDistribution = chordDistribution;
    currentDesign.value.pitchDistribution = pitchDistribution;
    currentDesign.value.skewDistribution = skewDistribution;
    currentDesign.value.rakeDistribution = rakeDistribution;
    currentDesign.value.thicknessDistribution = thicknessDistribution;
  }

  async function calculatePerformance(rpmMin?: number, rpmMax?: number): Promise<void> {
    isCalculating.value = true;

    try {
      const rpmStart = rpmMin || operatingConditions.value.rpm;
      const rpmEnd = rpmMax || operatingConditions.value.rpm * 2;

      const solver = new BEMTSolver(currentDesign.value, operatingConditions.value);
      performanceCurves.value = solver.generatePerformanceCurves(rpmStart, rpmEnd, 30);

      const rpm = operatingConditions.value.rpm;
      efficiencyMap.value = solver.generateEfficiencyMap(rpm, 0, 1.5, 20);

      lastCalculationResult.value = solver.solve();
    } finally {
      isCalculating.value = false;
    }
  }

  function getGeometry(): PropellerGeometry {
    return new PropellerGeometry(currentDesign.value);
  }

  function exportDesign(filename?: string): void {
    StorageService.downloadDesign(currentDesign.value, filename);
  }

  function importDesign(file: File): Promise<void> {
    return StorageService.importDesign(file).then(design => {
      currentDesign.value = design;
      performanceCurves.value = null;
      efficiencyMap.value = null;
    });
  }

  function exportSTL(filename?: string): void {
    StorageService.downloadSTL(currentDesign.value, filename);
  }

  function exportOBJ(filename?: string): void {
    StorageService.downloadOBJ(currentDesign.value, filename);
  }

  watch(currentDesign, () => {
    performanceCurves.value = null;
    efficiencyMap.value = null;
  }, { deep: true });

  loadSavedDesigns();

  return {
    currentDesign,
    savedDesigns,
    performanceCurves,
    efficiencyMap,
    operatingConditions,
    isCalculating,
    lastCalculationResult,
    diameter,
    numBlades,
    availableAirfoils,
    isAirfoilDatabaseLoaded,
    initializeAirfoilDatabase,
    selectPresetAirfoil,
    loadSavedDesigns,
    saveCurrentDesign,
    loadDesign,
    newDesign,
    deleteDesign,
    updateAirfoil,
    updateOperatingConditions,
    generateDefaultDistributions,
    calculatePerformance,
    getGeometry,
    exportDesign,
    importDesign,
    exportSTL,
    exportOBJ
  };
});
