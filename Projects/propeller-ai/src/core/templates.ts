import type { PropellerParams } from './index';

export interface PropellerTemplate {
  id: string;
  name: string;
  nameZh: string;
  description: string;
  descriptionZh: string;
  category: 'uav' | 'multirotor' | 'vtol' | 'experimental';
  params: Omit<PropellerParams, 'id' | 'name' | 'airfoil'> & { airfoil: string };
}

export const PROPELLER_TEMPLATES: PropellerTemplate[] = [
  {
    id: 'uav_standard_5x4',
    name: 'Standard UAV 5x4',
    nameZh: '标准无人机 5x4',
    description: 'General purpose UAV propeller, 5 inch diameter, 4 inch pitch',
    descriptionZh: '通用无人机螺旋桨，直径5英寸，桨距4英寸',
    category: 'uav',
    params: {
      diameter: 0.127,
      numBlades: 2,
      hubRadius: 0.008,
      chordDistribution: [0.018, 0.017, 0.016, 0.014, 0.012, 0.010, 0.008, 0.006],
      pitchDistribution: [0.102, 0.103, 0.104, 0.103, 0.100, 0.095, 0.088, 0.078],
      skewDistribution: [0, 0.001, 0.002, 0.003, 0.003, 0.002, 0.001, 0],
      rakeDistribution: [0, 0.001, 0.002, 0.002, 0.002, 0.001, 0, 0],
      thicknessDistribution: [0.12, 0.12, 0.11, 0.10, 0.09, 0.08, 0.07, 0.06],
      airfoil: 'naca2412',
      units: 'metric'
    }
  },
  {
    id: 'uav_standard_6x4.5',
    name: 'Standard UAV 6x4.5',
    nameZh: '标准无人机 6x4.5',
    description: 'General purpose UAV propeller, 6 inch diameter, 4.5 inch pitch',
    descriptionZh: '通用无人机螺旋桨，直径6英寸，桨距4.5英寸',
    category: 'uav',
    params: {
      diameter: 0.152,
      numBlades: 2,
      hubRadius: 0.010,
      chordDistribution: [0.020, 0.019, 0.018, 0.016, 0.014, 0.012, 0.010, 0.008],
      pitchDistribution: [0.114, 0.115, 0.116, 0.115, 0.112, 0.106, 0.098, 0.088],
      skewDistribution: [0, 0.001, 0.002, 0.003, 0.003, 0.002, 0.001, 0],
      rakeDistribution: [0, 0.001, 0.002, 0.002, 0.002, 0.001, 0, 0],
      thicknessDistribution: [0.12, 0.12, 0.11, 0.10, 0.09, 0.08, 0.07, 0.06],
      airfoil: 'naca2412',
      units: 'metric'
    }
  },
  {
    id: 'tricopter_8x4',
    name: 'Tricopter 8x4',
    nameZh: '三轴飞行器 8x4',
    description: 'Large tricopter propeller, 8 inch diameter',
    descriptionZh: '大型三轴飞行器螺旋桨，直径8英寸',
    category: 'multirotor',
    params: {
      diameter: 0.203,
      numBlades: 2,
      hubRadius: 0.015,
      chordDistribution: [0.028, 0.026, 0.024, 0.022, 0.019, 0.016, 0.013, 0.010],
      pitchDistribution: [0.102, 0.103, 0.104, 0.103, 0.100, 0.095, 0.088, 0.078],
      skewDistribution: [0, 0.002, 0.004, 0.005, 0.005, 0.004, 0.002, 0],
      rakeDistribution: [0, 0.002, 0.003, 0.004, 0.004, 0.003, 0.002, 0],
      thicknessDistribution: [0.12, 0.11, 0.10, 0.09, 0.08, 0.07, 0.06, 0.05],
      airfoil: 'naca2415',
      units: 'metric'
    }
  },
  {
    id: 'quadcopter_10x4.5',
    name: 'Quadcopter 10x4.5',
    nameZh: '四轴飞行器 10x4.5',
    description: 'Standard quadcopter propeller, 10 inch diameter, 4.5 inch pitch',
    descriptionZh: '标准四轴飞行器螺旋桨，直径10英寸，桨距4.5英寸',
    category: 'multirotor',
    params: {
      diameter: 0.254,
      numBlades: 2,
      hubRadius: 0.018,
      chordDistribution: [0.035, 0.033, 0.031, 0.028, 0.024, 0.020, 0.016, 0.012],
      pitchDistribution: [0.114, 0.115, 0.116, 0.115, 0.112, 0.106, 0.098, 0.088],
      skewDistribution: [0, 0.002, 0.004, 0.005, 0.005, 0.004, 0.002, 0],
      rakeDistribution: [0, 0.002, 0.003, 0.004, 0.004, 0.003, 0.002, 0],
      thicknessDistribution: [0.12, 0.11, 0.10, 0.09, 0.08, 0.07, 0.06, 0.05],
      airfoil: 'naca2412',
      units: 'metric'
    }
  },
  {
    id: 'quadcopter_11x3',
    name: 'Quadcopter 11x3',
    nameZh: '四轴飞行器 11x3',
    description: 'Efficient quadcopter propeller for long endurance, 11 inch diameter',
    descriptionZh: '长航时四轴飞行器螺旋桨，直径11英寸',
    category: 'multirotor',
    params: {
      diameter: 0.279,
      numBlades: 2,
      hubRadius: 0.020,
      chordDistribution: [0.038, 0.036, 0.034, 0.030, 0.026, 0.022, 0.018, 0.014],
      pitchDistribution: [0.076, 0.077, 0.078, 0.077, 0.074, 0.070, 0.064, 0.056],
      skewDistribution: [0, 0.003, 0.005, 0.006, 0.006, 0.005, 0.003, 0],
      rakeDistribution: [0, 0.003, 0.005, 0.006, 0.006, 0.005, 0.003, 0],
      thicknessDistribution: [0.12, 0.11, 0.10, 0.09, 0.08, 0.07, 0.06, 0.05],
      airfoil: 'naca4412',
      units: 'metric'
    }
  },
  {
    id: 'hexacopter_8x4',
    name: 'Hexacopter 8x4',
    nameZh: '六轴飞行器 8x4',
    description: 'Heavy lift hexacopter propeller, 8 inch diameter',
    descriptionZh: '高负载六轴飞行器螺旋桨，直径8英寸',
    category: 'multirotor',
    params: {
      diameter: 0.203,
      numBlades: 2,
      hubRadius: 0.015,
      chordDistribution: [0.030, 0.028, 0.026, 0.024, 0.021, 0.018, 0.014, 0.011],
      pitchDistribution: [0.102, 0.103, 0.104, 0.103, 0.100, 0.095, 0.088, 0.078],
      skewDistribution: [0, 0.002, 0.003, 0.004, 0.004, 0.003, 0.002, 0],
      rakeDistribution: [0, 0.002, 0.003, 0.004, 0.004, 0.003, 0.002, 0],
      thicknessDistribution: [0.14, 0.13, 0.12, 0.11, 0.10, 0.09, 0.08, 0.07],
      airfoil: 'naca2415',
      units: 'metric'
    }
  },
  {
    id: 'vtol_12x6',
    name: 'VTOL 12x6',
    nameZh: '垂直起降 12x6',
    description: 'eVTOL propeller for transition flight, 12 inch diameter',
    descriptionZh: '电动垂直起降飞行器螺旋桨，直径12英寸',
    category: 'vtol',
    params: {
      diameter: 0.305,
      numBlades: 3,
      hubRadius: 0.025,
      chordDistribution: [0.042, 0.040, 0.037, 0.033, 0.029, 0.024, 0.019, 0.015],
      pitchDistribution: [0.152, 0.153, 0.154, 0.153, 0.150, 0.144, 0.134, 0.120],
      skewDistribution: [0, 0.003, 0.005, 0.006, 0.006, 0.005, 0.003, 0],
      rakeDistribution: [0, 0.003, 0.005, 0.006, 0.006, 0.005, 0.003, 0],
      thicknessDistribution: [0.12, 0.11, 0.10, 0.09, 0.08, 0.07, 0.06, 0.05],
      airfoil: 'naca23012',
      units: 'metric'
    }
  },
  {
    id: 'racing_5x3',
    name: 'Racing 5x3',
    nameZh: '竞速 5x3',
    description: 'High-speed racing drone propeller, 5 inch diameter, 3 inch pitch',
    descriptionZh: '高速竞速无人机螺旋桨，直径5英寸，桨距3英寸',
    category: 'experimental',
    params: {
      diameter: 0.127,
      numBlades: 2,
      hubRadius: 0.008,
      chordDistribution: [0.016, 0.015, 0.014, 0.012, 0.010, 0.008, 0.006, 0.004],
      pitchDistribution: [0.076, 0.077, 0.078, 0.077, 0.074, 0.070, 0.064, 0.056],
      skewDistribution: [0, -0.001, -0.002, -0.002, -0.002, -0.001, 0, 0],
      rakeDistribution: [0, 0.003, 0.005, 0.006, 0.006, 0.005, 0.003, 0],
      thicknessDistribution: [0.15, 0.14, 0.13, 0.12, 0.10, 0.09, 0.08, 0.07],
      airfoil: 'naca0010',
      units: 'metric'
    }
  },
  {
    id: 'acro_6x3',
    name: 'Acro 6x3',
    nameZh: '特技 6x3',
    description: 'Acrobatic drone propeller, 6 inch diameter, 3 inch pitch',
    descriptionZh: '特技无人机螺旋桨，直径6英寸，桨距3英寸',
    category: 'experimental',
    params: {
      diameter: 0.152,
      numBlades: 2,
      hubRadius: 0.010,
      chordDistribution: [0.020, 0.019, 0.018, 0.016, 0.014, 0.012, 0.009, 0.007],
      pitchDistribution: [0.076, 0.077, 0.078, 0.077, 0.074, 0.070, 0.064, 0.056],
      skewDistribution: [0, -0.001, -0.002, -0.002, -0.002, -0.001, 0, 0],
      rakeDistribution: [0, 0.003, 0.005, 0.006, 0.006, 0.005, 0.003, 0],
      thicknessDistribution: [0.14, 0.13, 0.12, 0.11, 0.10, 0.09, 0.08, 0.07],
      airfoil: 'naca0010',
      units: 'metric'
    }
  },
  {
    id: 'cinematic_10x4.5',
    name: 'Cinematic 10x4.5',
    nameZh: '影视 10x4.5',
    description: 'Cinematic drone propeller for smooth footage, 10 inch diameter',
    descriptionZh: '影视航拍螺旋桨，直径10英寸',
    category: 'uav',
    params: {
      diameter: 0.254,
      numBlades: 2,
      hubRadius: 0.018,
      chordDistribution: [0.038, 0.036, 0.034, 0.030, 0.026, 0.022, 0.018, 0.014],
      pitchDistribution: [0.114, 0.115, 0.116, 0.115, 0.112, 0.106, 0.098, 0.088],
      skewDistribution: [0, 0.002, 0.004, 0.005, 0.005, 0.004, 0.002, 0],
      rakeDistribution: [0, -0.002, -0.003, -0.004, -0.004, -0.003, -0.002, 0],
      thicknessDistribution: [0.10, 0.09, 0.08, 0.07, 0.06, 0.05, 0.04, 0.03],
      airfoil: 'naca4415',
      units: 'metric'
    }
  }
];

export function applyTemplate(template: PropellerTemplate, name: string): PropellerParams {
  return {
    id: `prop_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
    name,
    diameter: template.params.diameter,
    numBlades: template.params.numBlades,
    hubRadius: template.params.hubRadius,
    chordDistribution: [...template.params.chordDistribution],
    pitchDistribution: [...template.params.pitchDistribution],
    skewDistribution: [...template.params.skewDistribution],
    rakeDistribution: [...template.params.rakeDistribution],
    thicknessDistribution: [...template.params.thicknessDistribution],
    airfoil: {
      type: template.params.airfoil.startsWith('naca4') ? 'naca4' : 
            template.params.airfoil.startsWith('naca5') ? 'naca5' : 'naca4',
      code: template.params.airfoil.toUpperCase()
    },
    units: template.params.units
  };
}

export function getTemplatesByCategory(category: PropellerTemplate['category']): PropellerTemplate[] {
  return PROPELLER_TEMPLATES.filter(t => t.category === category);
}

export function searchTemplates(query: string): PropellerTemplate[] {
  const lowerQuery = query.toLowerCase();
  return PROPELLER_TEMPLATES.filter(t =>
    t.name.toLowerCase().includes(lowerQuery) ||
    t.nameZh.toLowerCase().includes(lowerQuery) ||
    t.description.toLowerCase().includes(lowerQuery) ||
    t.descriptionZh.toLowerCase().includes(lowerQuery)
  );
}
