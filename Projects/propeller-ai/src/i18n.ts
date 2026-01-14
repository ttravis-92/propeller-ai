import { createI18n } from 'vue-i18n';

const messages = {
  en: {
    app: {
      title: 'Propeller AI',
      subtitle: 'Design & Analysis'
    },
    header: {
      newDesign: 'New Design',
      save: 'Save',
      import: 'Import',
      export: 'Export',
      language: 'Language'
    },
    tabs: {
      basic: 'Basic',
      airfoil: 'Airfoil',
      chord: 'Chord',
      pitch: 'Pitch',
      skew: 'Skew',
      rake: 'Rake',
      export: 'Export',
      templates: 'Templates'
    },
    basic: {
      title: 'Design Parameters',
      name: 'Name',
      diameter: 'Diameter',
      numBlades: 'Number of Blades',
      hubRadius: 'Hub Radius'
    },
    operating: {
      title: 'Operating Conditions',
      velocity: 'Velocity',
      rpm: 'RPM',
      airDensity: 'Air Density',
      unit: {
        m: 'm',
        mps: 'm/s',
        kgm3: 'kg/m³'
      }
    },
    airfoil: {
      title: 'Airfoil Selection',
      preset: 'Preset Airfoils',
      standard: 'Standard',
      custom: 'Custom',
      upload: 'Upload File',
      paste: 'Paste Data',
      tip: 'Selig or Lednicer format (.txt, .dat)',
      loaded: 'Loaded Airfoil'
    },
    distribution: {
      chord: 'Chord Distribution',
      pitch: 'Pitch Distribution',
      skew: 'Skew Distribution',
      rake: 'Rake Distribution',
      header: {
        r: 'r (m)',
        c: 'Chord (m)',
        p: 'Pitch (m)',
        s: 'Skew (m)',
        rk: 'Rake (m)'
      }
    },
    preview: {
      play: 'Play',
      pause: 'Pause',
      reset: 'Reset',
      screenshot: 'Screenshot',
      axes: 'Axes',
      info: {
        diameter: 'D',
        blades: 'Blades'
      }
    },
    performance: {
      title: 'Performance Analysis',
      calculate: 'Calculate',
      results: {
        thrust: 'Thrust',
        power: 'Power',
        efficiency: 'Efficiency',
        ct: 'Ct',
        cq: 'Cq'
      },
      charts: {
        thrust: 'Thrust',
        curves: 'Curves',
        map: 'η Map'
      }
    },
    export: {
      title: 'Export Options',
      stl: 'Download STL',
      obj: 'Download OBJ'
    },
    templates: {
      title: 'Propeller Templates',
      select: 'Templates',
      search: 'Search templates...',
      empty: 'No templates found',
      All: 'All',
      UAV: 'UAV',
      Multirotor: 'Multirotor',
      VTOL: 'VTOL',
      Experimental: 'Experimental',
      'Standard UAV 5x4': 'Standard UAV 5x4',
      'Standard UAV 6x4.5': 'Standard UAV 6x4.5',
      'Tricopter 8x4': 'Tricopter 8x4',
      'Quadcopter 10x4.5': 'Quadcopter 10x4.5',
      'Quadcopter 11x3': 'Quadcopter 11x3',
      'Hexacopter 8x4': 'Hexacopter 8x4',
      'VTOL 12x6': 'VTOL 12x6',
      'Racing 5x3': 'Racing 5x3',
      'Acro 6x3': 'Acro 6x3',
      'Cinematic 10x4.5': 'Cinematic 10x4.5'
    },
    messages: {
      imported: 'Design imported successfully',
      created: 'New design created',
      saved: 'Design saved',
      templateApplied: 'Template applied successfully',
      error: {
        import: 'Failed to import design',
        invalid: 'Invalid design file format'
      }
    }
  },
  zh: {
    app: {
      title: '螺旋桨 AI',
      subtitle: '设计与分析'
    },
    header: {
      newDesign: '新建设计',
      save: '保存',
      import: '导入',
      export: '导出',
      language: '语言'
    },
    tabs: {
      basic: '基础',
      airfoil: '翼型',
      chord: '弦长',
      pitch: '桨距',
      skew: '侧斜',
      rake: '掠度',
      export: '导出',
      templates: '模板'
    },
    basic: {
      title: '设计参数',
      name: '名称',
      diameter: '直径',
      numBlades: '桨叶数',
      hubRadius: '毂半径'
    },
    operating: {
      title: '工作条件',
      velocity: '速度',
      rpm: '转速',
      airDensity: '空气密度',
      unit: {
        m: '米',
        mps: '米/秒',
        kgm3: '千克/立方米'
      }
    },
    airfoil: {
      title: '翼型选择',
      preset: '预设翼型',
      standard: '标准翼型',
      custom: '自定义翼型',
      upload: '上传文件',
      paste: '粘贴数据',
      tip: 'Selig 或 Lednicer 格式 (.txt, .dat)',
      loaded: '已加载翼型'
    },
    distribution: {
      chord: '弦长分布',
      pitch: '桨距分布',
      skew: '侧斜分布',
      rake: '掠度分布',
      header: {
        r: 'r (米)',
        c: '弦长 (米)',
        p: '桨距 (米)',
        s: '侧斜 (米)',
        rk: '掠度 (米)'
      }
    },
    preview: {
      play: '播放',
      pause: '暂停',
      reset: '重置',
      screenshot: '截图',
      axes: '坐标轴',
      info: {
        diameter: '直径',
        blades: '桨叶'
      }
    },
    performance: {
      title: '性能分析',
      calculate: '计算',
      results: {
        thrust: '推力',
        power: '功率',
        efficiency: '效率',
        ct: '推力系数',
        cq: '扭矩系数'
      },
      charts: {
        thrust: '推力',
        curves: '曲线',
        map: '效率图'
      }
    },
    export: {
      title: '导出选项',
      stl: '下载 STL',
      obj: '下载 OBJ'
    },
    templates: {
      title: '螺旋桨模板',
      select: '模板',
      search: '搜索模板...',
      empty: '未找到模板',
      All: '全部',
      UAV: '无人机',
      Multirotor: '多旋翼',
      VTOL: '垂直起降',
      Experimental: '特技',
      'Standard UAV 5x4': '标准无人机 5x4',
      'Standard UAV 6x4.5': '标准无人机 6x4.5',
      'Tricopter 8x4': '三轴飞行器 8x4',
      'Quadcopter 10x4.5': '四轴飞行器 10x4.5',
      'Quadcopter 11x3': '四轴飞行器 11x3',
      'Hexacopter 8x4': '六轴飞行器 8x4',
      'VTOL 12x6': '垂直起降 12x6',
      'Racing 5x3': '竞速 5x3',
      'Acro 6x3': '特技 6x3',
      'Cinematic 10x4.5': '影视 10x4.5'
    },
    messages: {
      imported: '设计导入成功',
      created: '新建设计已创建',
      saved: '设计已保存',
      templateApplied: '模板应用成功',
      error: {
        import: '导入设计失败',
        invalid: '设计文件格式无效'
      }
    }
  }
};

const i18n = createI18n({
  legacy: false,
  locale: localStorage.getItem('locale') || 'en',
  fallbackLocale: 'en',
  messages
});

export default i18n;
