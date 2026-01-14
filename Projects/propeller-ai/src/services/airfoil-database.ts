import type { AirfoilDatabase, AirfoilPolar } from '../types';

let database: AirfoilDatabase | null = null;

export async function loadAirfoilDatabase(): Promise<AirfoilDatabase> {
  if (database) return database;

  try {
    const response = await fetch('/data/airfoil-polars.json');
    if (!response.ok) {
      throw new Error('Failed to load airfoil database');
    }
    database = await response.json();
    return database;
  } catch (error) {
    console.error('Error loading airfoil database:', error);
    throw error;
  }
}

export function getAirfoilByName(name: string): AirfoilDatabase['airfoils'][string] | null {
  if (!database) return null;
  return database.airfoils[name] || null;
}

export function getAvailableAirfoils(): Array<{ id: string; name: string; type: string; thickness: number; camber: number }> {
  if (!database) return [];

  return Object.entries(database.airfoils).map(([id, airfoil]) => ({
    id,
    name: id.replace('_', ' '),
    type: airfoil.type,
    thickness: airfoil.thickness,
    camber: airfoil.camber
  }));
}

export function getPolarForAirfoil(
  airfoilName: string,
  reynolds: number
): { cl: number[]; cd: number[]; aoa: number[] } | null {
  const airfoil = getAirfoilByName(airfoilName);
  if (!airfoil) return null;

  const polars = airfoil.polars;
  const reynoldsValues = Object.keys(polars).map(k => parseInt(k.replace('Re_', '')));

  const closestRe = reynoldsValues.reduce((prev, curr) =>
    Math.abs(curr - reynolds) < Math.abs(prev - reynolds) ? curr : prev
  );

  const polarData = polars[`Re_${closestRe}`];
  if (!polarData) return null;

  return {
    aoa: polarData.data.map(d => d.alpha),
    cl: polarData.data.map(d => d.cl),
    cd: polarData.data.map(d => d.cd)
  };
}

export function interpolatePolar(
  polar: { aoa: number[]; cl: number[]; cd: number[] },
  aoa: number
): { cl: number; cd: number } {
  const { aoa: aoaArr, cl: clArr, cd: cdArr } = polar;

  if (aoa <= aoaArr[0]) {
    return { cl: clArr[0], cd: cdArr[0] };
  }
  if (aoa >= aoaArr[aoaArr.length - 1]) {
    return { cl: clArr[aoaArr.length - 1], cd: cdArr[aoaArr.length - 1] };
  }

  let i = 0;
  while (i < aoaArr.length - 1 && aoaArr[i + 1] < aoa) {
    i++;
  }

  const aoa0 = aoaArr[i];
  const aoa1 = aoaArr[i + 1];
  const t = (aoa - aoa0) / (aoa1 - aoa0);

  const cl = clArr[i] + t * (clArr[i + 1] - clArr[i]);
  const cd = cdArr[i] + t * (cdArr[i + 1] - cdArr[i]);

  return { cl, cd };
}
