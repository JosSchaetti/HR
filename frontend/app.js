const {
  useState,
  useEffect,
  createContext,
  useContext
} = React;

// ── API ──────────────────────────────────────────────────────────────────────
const API = {
  async post(path, data, form = false) {
    const token = localStorage.getItem('g_token');
    const opts = form ? {
      method: 'POST',
      body: data
    } : {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    };
    const r = await fetch(path, opts);
    if (!r.ok) {
      const e = await r.json().catch(() => ({}));
      throw new Error(e.detail || 'Fehler');
    }
    return r.json();
  },
  async get(path) {
    const token = localStorage.getItem('g_token');
    const r = await fetch(path, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    if (r.status === 401) {
      localStorage.removeItem('g_token');
      localStorage.removeItem('g_user');
      window.location.reload();
    }
    if (!r.ok) {
      const e = await r.json().catch(() => ({}));
      throw new Error(e.detail || 'Fehler');
    }
    return r.json();
  },
  async put(path, data) {
    const token = localStorage.getItem('g_token');
    const r = await fetch(path, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    });
    if (!r.ok) {
      const e = await r.json().catch(() => ({}));
      throw new Error(e.detail || 'Fehler');
    }
    return r.json();
  }
};

// ── Auth Context ─────────────────────────────────────────────────────────────
const AuthCtx = createContext(null);
const useAuth = () => useContext(AuthCtx);
const NavCtx = createContext(null);
const useNav = () => useContext(NavCtx);

// ── Language Context ──────────────────────────────────────────────────────────
const LangCtx = createContext('EN');
const useLang = () => useContext(LangCtx);
const T = {
  EN: {
    dashboard: 'Dashboard', wageband: 'Wage Band Monitor',
    employees: 'Employees', payroll: 'Payroll / Budget',
    bands: 'Band Reference', users: 'User Management',
    transparency: 'Pay Transparency',
    total: 'Total Employees', active: 'Active', inactive: 'Inactive',
    outOfBand: 'Out of Band', annualCost: 'Annual Employer Cost',
    bandDist: 'Band Distribution (total)', bandStatus: 'Band Status by Section',
    hcCC: 'Headcount by Cost Center', hcDept: 'Headcount by Department',
    hcBereich: 'Areas (1–6)', hcAbt: 'Departments (10–69)',
    hcMG: 'Machine Groups (100–699)', hcKST: 'Cost Centers',
    budgetVsActual: 'Budget vs. Actual \u2014 All Departments',
    budgetMonth: 'Budget This Month', salaryData: 'Salary Data',
    loading: 'Loading\u2026', logout: 'Logout',
    username: 'Username', password: 'Password', login: 'Login',
    secureSystem: 'Secure system \u2013 authorised users only',
    search: 'Search\u2026', department: 'Department', costCenter: 'Cost Center',
    position: 'Position', entryDate: 'Entry Date', fte: 'FTE', status: 'Status',
    save: 'Save', cancel: 'Cancel', newUser: 'New User', auditLog: 'Audit Log',
    role: 'Role', fullName: 'Full Name', action: 'Action', resource: 'Resource',
    time: 'Time', ip: 'IP', release: 'Release', released: 'Released',
    budgetControl: 'Monthly Budget Control', variance: 'Variance',
    actual: 'Actual', budget: 'Budget', section: 'Section',
    minNet: 'Min Net', targetNet: 'Target Net', maxNet: 'Max Net',
    actualNet: 'Actual Net', bandPosition: 'Band Position',
    belowMin: 'Below Min', belowTarget: 'Below Target', onTarget: 'On Target / Above',
    internalHR: 'Internal Personnel Management System',
    annualBudget: 'Annual Budget', monthlyBudget: 'Monthly Budget',
    pending: 'Pending', approve: 'Approve', allDepts: 'All Departments',
    notes: 'Notes', profiles: 'profiles', fillLevel: 'Fill Level',
    neverLoggedIn: 'Never', deactivate: 'Deactivate', activate: 'Activate',
    adminOnly: 'Administrators only', createUserBtn: 'Create User',
    accessLog: 'Access Log (last 100)', deptGroup: 'Group',
    entries: 'entries', allSections: 'All Sections / Groups',
    allBandCodes: 'All Band Codes', wageRef: 'Wage Band Reference',
    month: 'Month', departments: 'departments',
  },
  BG: {
    dashboard: 'Табло', wageband: 'Монитор Диапазони',
    employees: 'Служители', payroll: 'Заплати / Бюджет',
    bands: 'Справочник Диапазони', users: 'Управление Потребители',
    transparency: 'Прозрачност Заплащане',
    total: 'Общо Служители', active: 'Активни', inactive: 'Неактивни',
    outOfBand: 'Извън Диапазон', annualCost: 'Год. Разходи Работодател',
    bandDist: 'Разпределение Диапазони', bandStatus: 'Статус по Секция',
    hcCC: 'Персонал по КС', hcDept: 'Персонал по Отдел',
    hcBereich: 'Области (1–6)', hcAbt: 'Отдели (10–69)',
    hcMG: 'Машинни Групи (100–699)', hcKST: 'Костенстели',
    budgetVsActual: 'Бюджет vs. Факт \u2014 Всички Отдели',
    budgetMonth: 'Бюджет Текущ Месец', salaryData: 'Данни Заплати',
    loading: 'Зарежда\u2026', logout: 'Изход',
    username: 'Потребител', password: 'Парола', login: 'Вход',
    secureSystem: 'Защитена система \u2013 само оторизирани потребители',
    search: 'Търсене\u2026', department: 'Отдел', costCenter: 'КС',
    position: 'Позиция', entryDate: 'Постъпване', fte: 'FTE', status: 'Статус',
    save: 'Запази', cancel: 'Отказ', newUser: 'Нов Потребител', auditLog: 'Одит Лог',
    role: 'Роля', fullName: 'Пълно Име', action: 'Действие', resource: 'Ресурс',
    time: 'Час', ip: 'IP', release: 'Освободи', released: 'Освободен',
    budgetControl: 'Месечен Бюджет Контрол', variance: 'Отклонение',
    actual: 'Факт', budget: 'Бюджет', section: 'Секция',
    minNet: 'Мин Нето', targetNet: 'Цел Нето', maxNet: 'Макс Нето',
    actualNet: 'Факт Нето', bandPosition: 'Позиция Диапазон',
    belowMin: 'Под Мин', belowTarget: 'Под Цел', onTarget: 'На Цел / Над',
    internalHR: 'Вътрешна Система Управление Персонал',
    annualBudget: 'Годишен Бюджет', monthlyBudget: 'Бюджет Месец',
    pending: 'Очаква', approve: 'Одобри', allDepts: 'Всички Отдели',
    notes: 'Бележки', profiles: 'профила', fillLevel: 'Ниво',
    neverLoggedIn: 'Никога', deactivate: 'Деактивирай', activate: 'Активирай',
    adminOnly: 'Само Администратори', createUserBtn: 'Създай Потребител',
    accessLog: 'Протокол Достъп (последни 100)', deptGroup: 'Група',
    entries: 'записа', allSections: 'Всички Секции / Групи',
    allBandCodes: 'Всички Кодове', wageRef: 'Справочник Диапазони',
    month: 'Месец', departments: 'отдела',
  }
};
const t = (lang, key) => (T[lang] && T[lang][key]) || T.EN[key] || key;

// ── Department name translations (BG → EN) ───────────────────────────────────
const DEPT_MAP = {
  '\u0410\u0432\u0442\u043e\u043c\u0430\u0442\u0438\u0437\u0430\u0446\u0438\u044f': 'Automation',
  '\u0414\u0438\u0437\u0430\u0439\u043d\u0020\u043d\u0430\u0020\u0430\u0432\u0442\u043e\u043c\u0430\u0442\u0438\u0437\u0430\u0446\u0438\u044f': 'Automation Design',
  '\u0414\u0438\u0437\u0430\u0439\u043d\u0020\u043d\u0430\u0020\u0438\u043d\u0441\u0442\u0440\u0443\u043c\u0435\u043d\u0442\u0438': 'Tool Design',
  '\u0417\u0430\u0432\u0430\u0440\u044a\u0447\u043d\u043e': 'Welding',
  '\u0417\u0430\u0433\u043e\u0442\u043e\u0432\u043a\u0438\u0020\u0437\u0430\u0020\u043f\u0440\u043e\u0438\u0437\u0432\u043e\u0434\u0441\u0442\u0432\u043e': 'Production Blanks',
  '\u0418\u043d\u0441\u0442\u0440\u0443\u043c\u0435\u043d\u0442\u0430\u043b\u0435\u043d\u0020\u043e\u0442\u0434\u0435\u043b': 'Tool Shop',
  '\u041a\u0430\u043b\u043a\u0443\u043b\u0430\u0446\u0438\u044f': 'Costing',
  '\u041c\u0435\u0445\u0430\u043d\u0438\u0447\u043d\u0430\u0020\u043e\u0431\u0440\u0430\u0431\u043e\u0442\u043a\u0430': 'Machining',
  '\u041c\u043e\u043d\u0442\u0430\u0436': 'Assembly',
  '\u041e\u0431\u0449\u0438\u0020\u0049\u0054': 'General IT',
  '\u041e\u0441\u0438\u0433\u0443\u0440\u044f\u0432\u0430\u043d\u0435\u0020\u043d\u0430\u0020\u043a\u0430\u0447\u0435\u0441\u0442\u0432\u043e\u0442\u043e': 'Quality Assurance',
  '\u041f\u043e\u0434\u0434\u0440\u044a\u0436\u043a\u0430\u0020\u043c\u0430\u0448\u0438\u043d\u0438': 'Machine Maintenance',
  '\u041f\u043e\u043a\u0443\u043f\u043a\u0438': 'Procurement',
  '\u041f\u0440\u0435\u0441\u0438': 'Press Shop',
  '\u041f\u0440\u043e\u0434\u0430\u0436\u0431\u0438': 'Sales',
  '\u041f\u0440\u043e\u0438\u0437\u0432\u043e\u0434\u0441\u0442\u0432\u043e': 'Production',
  '\u0420\u0430\u0437\u0432\u043e\u0439\u043d\u0430\u0020\u0434\u0435\u0439\u043d\u043e\u0441\u0442': 'R&D',
  '\u0421\u0433\u0440\u0430\u0434\u0438': 'Facilities',
  '\u0421\u043a\u043b\u0430\u0434': 'Warehouse',
  '\u0421\u043f\u0435\u0434\u0438\u0446\u0438\u044f': 'Logistics',
  '\u0421\u0447\u0435\u0442\u043e\u0432\u043e\u0434\u0441\u0442\u0432\u043e': 'Accounting',
  '\u0422\u0420\u0410\u041d\u0421\u041f\u041e\u0420\u0422': 'Transport',
  '\u0423\u043f\u0440\u0430\u0432\u043b\u0435\u043d\u0438\u0435\u0020\u0427\u0420': 'HR Management',
  '\u0423\u043f\u0440\u0430\u0432\u043b\u0435\u043d\u0438\u0435\u0020\u043d\u0430\u0020\u043a\u0430\u0447\u0435\u0441\u0442\u0432\u043e\u0442\u043e': 'Quality Management',
  '\u0423\u043f\u0440\u0430\u0432\u043b\u0435\u043d\u0438\u0435\u0020\u043d\u0430\u0020\u043f\u0440\u043e\u0435\u043a\u0442\u0438': 'Project Management',
  '\u0428\u043f\u0440\u0438\u0446\u043e\u0432\u0430\u043d\u0435': 'Injection Moulding',
};
const POSITION_MAP = {
  "Администратор, информационни системи": "System Administrator",
  "Водач, мотокар": "Forklift Operator",
  "Главен инженер, преработваща промишленост": "Chief Production Engineer",
  "Директор, производство": "Production Director",
  "Експерт, трудова заетост": "Labour Relations Expert",
  "Електротехник, промишлено предприятие": "Industrial Electrician",
  "Заварчик": "Welding Operator",
  "Зареждач, промишлено производство (ръчно)": "Material Handler",
  "Инженер, автоматизация": "Automation Engineer",
  "Инженер, електрически машини и апарати": "Electrical / Machine Engineer",
  "Инженер, качество": "Quality Engineer",
  "Инженер, конструктор": "Design Engineer",
  "Инженер, механик": "Maintenance Engineer",
  "Инженер, производство": "Production Engineer",
  "Инженер-технолог, електротехнически изделия": "Process Engineer",
  "Контрольор, качество": "Quality Controller",
  "Координатор производство": "Production Coordinator",
  "Матричар": "Toolroom Operator Gr.2",
  "Машинен инженер": "Mechanical Engineer",
  "Машинен оператор": "Machine Operator",
  "Машинен оператор, металообработващи машини": "Machining Operator",
  "Машинен оператор, опаковане/увиване": "Packaging Machine Operator",
  "Машинен оператор, производство на пластмасови изделия": "Injection Moulding Operator",
  "Мениджър, проекти": "Project Manager",
  "Мениджър, производство": "Production Manager",
  "Монтажник, изделия от метал": "Assembly Operator",
  "Настройчик монтажно оборудване и производствени линии": "Setter – Assembly",
  "Настройчик на шприцмашини и сродни на тях": "Setter – Injection Moulding",
  "Настройчик, металообработващи машини": "Setter – Machining",
  "Настройчик, металообработващи машини с цифрово управление": "Setter – Machining (CNC)",
  "Настройчик, пресови металообработващи машини": "Setter – Press",
  "Общ работник": "General Worker",
  "Окачествител, продукти (без храни и напитки)": "Quality Inspector",
  "Оператор, преса за метал": "Press Operator",
  "Оператор, робот": "Robot / Welding Operator",
  "Организатор": "Section Leader",
  "Организатор, експедиция/товаро-разтоварна и спедиторска дейност": "Shipping Organiser",
  "Организатор, отдел Заваръчен": "Section Leader – Welding",
  "Организатор, производство": "Production Organiser",
  "Организатор, работа с клиенти": "Customer Relations Organiser",
  "Организатор, ремонт и поддръжка": "Maintenance Supervisor",
  "Полировач, метал": "Metal Polisher",
  "Работник, поддръжка": "Maintenance Helper",
  "Резач, метал": "Metal Cutter",
  "Ръководител звено": "Section Leader",
  "Ръководител сектор/звено в промишлеността": "Sector / Unit Manager",
  "Ръководител, производствени  технологии": "Head of Production Technology",
  "Ръководител/Началник/Мениджър отдел": "Department Head",
  "Склададжия": "Warehouse Worker",
  "Служител, човешки ресурси": "HR Officer",
  "Снабдител, доставчик": "Procurement Operative",
  "Специалист, доставки": "Procurement Specialist",
  "Специалист, качество": "Quality Specialist",
  "Специалист, координатор информационни технологии": "IT Specialist",
  "Специалист, логистика": "Logistics Specialist",
  "Специалист, управление на човешките ресурси": "HR Manager",
  "Старши счетоводител": "Chief Accountant",
  "Счетоводител": "Senior Accountant",
  "Счетоводител, оперативен": "Accountant",
  "Техник, автоматизация": "Automation Technician",
  "Техник-механик, технолог (студена обработка)": "Machining Technologist",
  "Технически изпълнител": "Senior Technical Executive",
  "Технически сътрудник": "Technical Assistant",
  "Технолог": "Process Technologist",
  "Технолог, технология на пластмасите": "Plastics Technologist",
  "Шлосер": "Fitter / Operator",
  "Шофьор, лекотоварен автомобил": "Light Vehicle Driver"
};
const posName = (lang, name) => lang === 'EN' ? (POSITION_MAP[name] || name) : name;

const deptName = (lang, name) => lang === 'EN' ? (DEPT_MAP[name] || name) : name;

// ── Helpers ──────────────────────────────────────────────────────────────────
const fmt = n => n == null ? '–' : new Intl.NumberFormat('de-CH', {
  maximumFractionDigits: 0
}).format(n);
const fmtE = n => n == null ? '–' : `€ ${new Intl.NumberFormat('de-CH', {
  minimumFractionDigits: 0,
  maximumFractionDigits: 0
}).format(n)}`;
const fmtP = n => n == null ? '–' : `${n > 0 ? '+' : ''}${n.toFixed(1)}%`;
function Loading() {
  return /*#__PURE__*/React.createElement("div", {
    className: "loading"
  }, /*#__PURE__*/React.createElement("div", {
    className: "spinner"
  }), " Laden\u2026");
}
function RoleBadge({
  role
}) {
  const m = {
    admin: ['badge-admin', 'Admin'],
    manager: ['badge-manager', 'Manager'],
    hr: ['badge-hr', 'HR'],
    payroll: ['badge-payroll', 'Lohnbuchhaltung']
  };
  const [cls, lbl] = m[role] || ['badge-admin', role];
  return /*#__PURE__*/React.createElement("span", {
    className: `badge ${cls}`
  }, lbl);
}
function BandStatus({
  status
}) {
  if (!status || status === '–') return /*#__PURE__*/React.createElement("span", {
    className: "text-muted"
  }, "\u2013");
  if (status.includes('⚠')) return /*#__PURE__*/React.createElement("span", {
    className: "sb sb-min"
  }, "\u26A0 Below Min");
  if (status.includes('▲')) return /*#__PURE__*/React.createElement("span", {
    className: "sb sb-tgt"
  }, "\u25B2 Below Target");
  if (status.includes('★')) return /*#__PURE__*/React.createElement("span", {
    className: "sb sb-max"
  }, "\u2605 Above Max");
  if (status.includes('✓')) return /*#__PURE__*/React.createElement("span", {
    className: "sb sb-ok"
  }, "\u2713 On Target");
  return /*#__PURE__*/React.createElement("span", {
    className: "text-muted"
  }, status);
}

// ── SVG Charts ───────────────────────────────────────────────────────────────
function PieChart({
  data,
  size = 200
}) {
  const COLORS = ['#ef4444', '#f59e0b', '#10b981', '#9ca3af'];
  const total = data.reduce((s, d) => s + d.value, 0);
  if (!total) return null;
  let angle = -Math.PI / 2;
  const cx = size / 2,
    cy = size / 2,
    r = size * 0.38,
    ir = size * 0.22;
  const slices = data.map((d, i) => {
    const sweep = d.value / total * Math.PI * 2;
    const x1 = cx + r * Math.cos(angle),
      y1 = cy + r * Math.sin(angle);
    angle += sweep;
    const x2 = cx + r * Math.cos(angle),
      y2 = cy + r * Math.sin(angle);
    const lf = sweep > Math.PI ? 1 : 0;
    const ix1 = cx + ir * Math.cos(angle - sweep),
      iy1 = cy + ir * Math.sin(angle - sweep);
    const ix2 = cx + ir * Math.cos(angle),
      iy2 = cy + ir * Math.sin(angle);
    const pct = Math.round(d.value / total * 100);
    const midA = angle - sweep / 2;
    const lx = cx + (r + 14) * Math.cos(midA),
      ly = cy + (r + 14) * Math.sin(midA);
    return {
      path: `M${ix1},${iy1} L${x1},${y1} A${r},${r},0,${lf},1,${x2},${y2} L${ix2},${iy2} A${ir},${ir},0,${lf},0,${ix1},${iy1}Z`,
      color: COLORS[i % COLORS.length],
      pct,
      lx,
      ly,
      name: d.name
    };
  });
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 16,
      alignItems: 'center',
      flexWrap: 'wrap'
    }
  }, /*#__PURE__*/React.createElement("svg", {
    width: size,
    height: size
  }, slices.map((s, i) => /*#__PURE__*/React.createElement("g", {
    key: i
  }, /*#__PURE__*/React.createElement("path", {
    d: s.path,
    fill: s.color,
    opacity: 0.9
  }), s.pct > 5 && /*#__PURE__*/React.createElement("text", {
    x: s.lx,
    y: s.ly,
    textAnchor: "middle",
    dominantBaseline: "middle",
    fontSize: "10",
    fill: "#555"
  }, s.pct, "%")))), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 12,
      display: 'flex',
      flexDirection: 'column',
      gap: 6
    }
  }, slices.map((s, i) => /*#__PURE__*/React.createElement("div", {
    key: i,
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 6
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: 10,
      height: 10,
      borderRadius: 2,
      background: s.color,
      flexShrink: 0
    }
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      color: '#555'
    }
  }, s.name), /*#__PURE__*/React.createElement("span", {
    style: {
      fontWeight: 600,
      marginLeft: 'auto',
      paddingLeft: 8
    }
  }, data[i].value)))));
}
// Dual horizontal bar chart: top bar = headcount, bottom bar = payroll (own scale each)
function HBarChart({data, valueKey, color = '#3b82f6', labelWidth = 90}) {
  if (!data || !data.length) return null;
  const hasDual = data.some(d => d.payroll);
  const maxCount = Math.max(...data.map(d => d[valueKey] || 0), 1);
  const maxPay   = hasDual ? Math.max(...data.map(d => d.payroll || 0), 1) : 1;
  const hasSubLabel = data.some(d => d.subLabel);
  const PL = labelWidth, PR = 6, PT = 6;
  const barH = 11, barGap = 4;
  // Bars height: 2 bars stacked or 1 bar
  const barsH = hasDual ? barH * 2 + barGap : barH;
  // Row height: enough for bars + vertical padding; at least 30 if two-line label
  const vPad = 5;
  const rowH = Math.max(barsH + vPad * 2, hasSubLabel ? 32 : 22);
  const W = 520, iW = W - PL - PR;
  const totalH = PT + data.length * rowH + PT;
  const fmtPay = v => '\u20ac\u00a0' + new Intl.NumberFormat('de-CH', {maximumFractionDigits:0}).format(v);
  return /*#__PURE__*/React.createElement("svg", {
    width: "100%", height: totalH,
    viewBox: `0 0 ${W} ${totalH}`,
    style: {display:'block', maxHeight: totalH + 'px'}
  }, data.map((d, i) => {
    const y = PT + i * rowH;
    const cnt = d[valueKey] || 0;
    const pay = d.payroll || 0;
    const bw1 = Math.max(2, cnt / maxCount * iW);
    const bw2 = hasDual && pay ? Math.max(2, pay / maxPay * iW) : 0;
    // Center bars vertically within the row
    const bar1Y = y + (rowH - barsH) / 2;
    const bar2Y = bar1Y + barH + barGap;
    // Labels: vertically centered on bar stack, left of bars
    const barMid = bar1Y + barsH / 2;
    const labelY  = hasSubLabel ? barMid - 6 : barMid + 4;
    const subLabelY = hasSubLabel ? barMid + 7 : null;
    return /*#__PURE__*/React.createElement("g", {key: i},
      // Number (bold)
      /*#__PURE__*/React.createElement("text", {
        x: PL - 6, y: labelY,
        textAnchor: "end", fontSize: "11", fill: "#222", fontWeight: "700"
      }, d.name),
      // Sub-label (dept name, gray, smaller)
      hasSubLabel && subLabelY && /*#__PURE__*/React.createElement("text", {
        x: PL - 6, y: subLabelY,
        textAnchor: "end", fontSize: "10", fill: "#888"
      }, d.subLabel),
      // Headcount bar
      /*#__PURE__*/React.createElement("rect", {x: PL, y: bar1Y, width: bw1, height: barH, fill: color, rx: 2, opacity: 0.85}),
      /*#__PURE__*/React.createElement("text", {
        x: PL + bw1 + 4, y: bar1Y + 9,
        fontSize: "10", fill: "#444", fontWeight: "600"
      }, cnt + ' MA'),
      // Payroll bar
      hasDual && bw2 > 0 && /*#__PURE__*/React.createElement("rect", {x: PL, y: bar2Y, width: bw2, height: barH, fill: "#059669", rx: 2, opacity: 0.8}),
      hasDual && pay > 0 && /*#__PURE__*/React.createElement("text", {
        x: PL + bw2 + 4, y: bar2Y + 9,
        fontSize: "10", fill: "#059669", fontWeight: "600"
      }, fmtPay(pay))
    );
  }));
}

function BarChart({
  data,
  keys,
  colors,
  height = 200,
  formatter
}) {
  if (!data || !data.length) return null;
  const allVals = data.flatMap(d => keys.map(k => d[k] || 0));
  const maxV = Math.max(...allVals, 1);
  const W = 520,
    PL = 52,
    PR = 16,
    PT = 10,
    PB = 72,
    iW = W - PL - PR,
    iH = height - PT - PB;
  const bw = Math.max(8, iW / data.length * 0.7 / keys.length);
  const groupW = iW / data.length;
  const ticks = [0, 0.25, 0.5, 0.75, 1].map(t => Math.round(maxV * t));
  return /*#__PURE__*/React.createElement("svg", {
    width: "100%",
    height: height + 20,
    viewBox: `0 0 ${W} ${height + 20}`,
    preserveAspectRatio: "xMidYMid meet",
    style: {
      overflow: 'visible',
      display: 'block',
      maxHeight: (height + 20) + 'px'
    }
  }, ticks.map((t, i) => {
    const y = PT + iH - t / maxV * iH;
    return /*#__PURE__*/React.createElement("g", {
      key: i
    }, /*#__PURE__*/React.createElement("line", {
      x1: PL,
      x2: W - PR,
      y1: y,
      y2: y,
      stroke: "#f0f0f0",
      strokeWidth: 1
    }), /*#__PURE__*/React.createElement("text", {
      x: PL - 6,
      y: y + 4,
      textAnchor: "end",
      fontSize: "10",
      fill: "#aaa"
    }, formatter ? formatter(t) : fmt(t)));
  }), data.map((d, gi) => {
    const gx = PL + gi * groupW + groupW * 0.15;
    return /*#__PURE__*/React.createElement("g", {
      key: gi
    }, keys.map((k, ki) => {
      const val = d[k] || 0;
      const bh = Math.max(1, val / maxV * iH);
      const x = gx + ki * (bw + 2);
      const y = PT + iH - bh;
      return /*#__PURE__*/React.createElement("rect", {
        key: ki,
        x: x,
        y: y,
        width: bw,
        height: bh,
        fill: colors[ki],
        rx: 2,
        opacity: 0.85
      });
    }), /*#__PURE__*/React.createElement("text", {
      x: PL + gi * groupW + groupW / 2,
      y: PT + iH + 8,
      textAnchor: "end",
      fontSize: "10",
      fill: "#555",
      transform: `rotate(-42, ${PL + gi * groupW + groupW / 2}, ${PT + iH + 8})`
    }, d.name));
  }), /*#__PURE__*/React.createElement("line", {
    x1: PL,
    x2: PL,
    y1: PT,
    y2: PT + iH,
    stroke: "#e5e7eb",
    strokeWidth: 1
  }), /*#__PURE__*/React.createElement("line", {
    x1: PL,
    x2: W - PR,
    y1: PT + iH,
    y2: PT + iH,
    stroke: "#e5e7eb",
    strokeWidth: 1
  }));
}
function StackedBar({
  label,
  vals,
  colors,
  total
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      marginBottom: 14
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'space-between',
      marginBottom: 4,
      fontSize: 13
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontWeight: 600
    }
  }, label), /*#__PURE__*/React.createElement("span", {
    style: {
      color: '#888',
      fontSize: 12
    }
  }, total, " MA")), /*#__PURE__*/React.createElement("div", {
    style: {
      height: 8,
      background: '#f3f4f6',
      borderRadius: 4,
      overflow: 'hidden',
      display: 'flex'
    }
  }, vals.map((v, i) => /*#__PURE__*/React.createElement("div", {
    key: i,
    style: {
      width: `${v / total * 100}%`,
      background: colors[i]
    }
  }))));
}

// ── Login ────────────────────────────────────────────────────────────────────
function LoginPage({
  onLogin
}) {
  const [username, setU] = useState('');
  const [password, setP] = useState('');
  const [error, setE] = useState('');
  const [loading, setL] = useState(false);
  async function submit(e) {
    e.preventDefault();
    setL(true);
    setE('');
    try {
      const form = new URLSearchParams();
      form.append('username', username);
      form.append('password', password);
      form.append('grant_type', 'password');
      const data = await API.post('/api/auth/login', form, true);
      localStorage.setItem('g_token', data.access_token);
      localStorage.setItem('g_user', JSON.stringify(data.user));
      onLogin(data.user);
    } catch (err) {
      setE(err.message);
    }
    setL(false);
  }
  return /*#__PURE__*/React.createElement("div", {
    className: "login-wrap"
  }, /*#__PURE__*/React.createElement("div", {
    className: "login-card"
  }, /*#__PURE__*/React.createElement("div", {
    className: "login-logo"
  }, /*#__PURE__*/React.createElement("div", {
    className: "login-icon"
  }, "G"), /*#__PURE__*/React.createElement("h1", null, "Glatec HR Platform"), /*#__PURE__*/React.createElement("p", null, "Internes Personalmanagement-System")), error && /*#__PURE__*/React.createElement("div", {
    className: "err-msg"
  }, /*#__PURE__*/React.createElement("i", {
    className: "fa fa-exclamation-circle"
  }), " ", error), /*#__PURE__*/React.createElement("form", {
    onSubmit: submit
  }, /*#__PURE__*/React.createElement("div", {
    className: "form-group"
  }, /*#__PURE__*/React.createElement("label", {
    className: "form-label"
  }, "Benutzername"), /*#__PURE__*/React.createElement("input", {
    className: "form-input",
    type: "text",
    value: username,
    onChange: e => setU(e.target.value),
    autoFocus: true
  })), /*#__PURE__*/React.createElement("div", {
    className: "form-group"
  }, /*#__PURE__*/React.createElement("label", {
    className: "form-label"
  }, "Passwort"), /*#__PURE__*/React.createElement("input", {
    className: "form-input",
    type: "password",
    value: password,
    onChange: e => setP(e.target.value)
  })), /*#__PURE__*/React.createElement("button", {
    className: "btn-primary",
    type: "submit",
    disabled: loading || !username || !password
  }, loading ? 'Anmelden…' : 'Anmelden')), /*#__PURE__*/React.createElement("p", {
    className: "sec-note"
  }, /*#__PURE__*/React.createElement("i", {
    className: "fa fa-lock"
  }), " Gesch\xFCtztes System \u2013 nur autorisierte Benutzer")));
}

// ── Dashboard ────────────────────────────────────────────────────────────────
function Dashboard() {
  const {user} = useAuth();
  const lang = useLang();
  const {goToEmployees} = useNav();
  const [wb, setWb] = useState(null);
  const [emp, setEmp] = useState(null);
  const [budget, setBudget] = useState(null);
  const [loading, setL] = useState(true);
  useEffect(() => {
    Promise.all([API.get('/api/wageband/overview'), API.get('/api/employees/stats')]).then(([w, e]) => {
      setWb(w);
      setEmp(e);
    }).then(() => ['admin', 'payroll', 'manager'].includes(user.role) ? API.get('/api/payroll/budget/summary').then(setBudget) : null).finally(() => setL(false));
  }, []);
  if (loading) return /*#__PURE__*/React.createElement(Loading, null);
  const s = wb?.summary || {};
  const pieData = [{
    name: '⚠ Below Min',
    value: s.below_min || 0
  }, {
    name: '▲ Below Target',
    value: s.below_target || 0
  }, {
    name: '✓ On/Above Target',
    value: s.on_target || 0
  }, {
    name: '– No Data',
    value: s.no_data || 0
  }].filter(d => d.value > 0);
  return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "page-header"
  }, /*#__PURE__*/React.createElement("h2", null, "Dashboard"), /*#__PURE__*/React.createElement("p", null, lang==='EN'?'Welcome, ':'Willkommen, ', user.full_name, lang==='EN'?' \u2014 Glatec EOOD, Feb 2026':' \u2014 Glatec EOOD, Stand Feb 2026')), /*#__PURE__*/React.createElement("div", {style:{display:'flex',flexDirection:'column',gap:14,marginBottom:22}},
  /*#__PURE__*/React.createElement("div", {className:"stat-grid"},
    /*#__PURE__*/React.createElement("div", {className:"stat-card blue",style:{cursor:'pointer'},onClick:()=>goToEmployees({status:'',newOnly:false})},
      /*#__PURE__*/React.createElement("div",{className:"stat-lbl"},lang==='EN'?'Total Employees':'Mitarbeiter gesamt'),
      /*#__PURE__*/React.createElement("div",{className:"stat-val"},emp?.total??'–'),
      /*#__PURE__*/React.createElement("div",{className:"stat-sub text-muted"},lang==='EN'?'Click to view all':'→ Alle anzeigen')
    ),
    /*#__PURE__*/React.createElement("div", {className:"stat-card green",style:{cursor:'pointer'},onClick:()=>goToEmployees({status:'Active',newOnly:false})},
      /*#__PURE__*/React.createElement("div",{className:"stat-lbl"},lang==='EN'?'Active':'Aktiv'),
      /*#__PURE__*/React.createElement("div",{className:"stat-val",style:{color:'#15803d'}},emp?.active??'–'),
      /*#__PURE__*/React.createElement("div",{className:"stat-sub text-muted"},lang==='EN'?'Click to view':'→ Anzeigen')
    ),
    /*#__PURE__*/React.createElement("div", {className:"stat-card red",style:{cursor:'pointer'},onClick:()=>goToEmployees({status:'Inactive',newOnly:false})},
      /*#__PURE__*/React.createElement("div",{className:"stat-lbl"},lang==='EN'?'Inactive':'Inaktiv'),
      /*#__PURE__*/React.createElement("div",{className:"stat-val",style:{color:'#dc2626'}},emp?.inactive??'–'),
      /*#__PURE__*/React.createElement("div",{className:"stat-sub text-muted"},lang==='EN'?'Click to view':'→ Anzeigen')
    )
  ),
  /*#__PURE__*/React.createElement("div", {className:"stat-grid"},
    /*#__PURE__*/React.createElement("div", {className:"stat-card yellow",style:{cursor:'pointer'},onClick:()=>goToEmployees({status:'Active',newOnly:true})},
      /*#__PURE__*/React.createElement("div",{className:"stat-lbl"},lang==='EN'?'New (6-month trial)':'Neu (Probezeit 6 Mon.)'),
      /*#__PURE__*/React.createElement("div",{className:"stat-val",style:{color:'#b45309'}},emp?.new_count??'–'),
      /*#__PURE__*/React.createElement("div",{className:"stat-sub text-muted"},lang==='EN'?'Click to view':'→ Anzeigen')
    ),
    /*#__PURE__*/React.createElement("div", {className:"stat-card red",style:{cursor:'pointer'},onClick:()=>goToWageband('\u26a0 BELOW MIN')},
      /*#__PURE__*/React.createElement("div",{className:"stat-lbl"},"\u26A0 Below Min"),
      /*#__PURE__*/React.createElement("div",{className:"stat-val",style:{color:'#dc2626'}},s.below_min??'–'),
      /*#__PURE__*/React.createElement("div",{className:"stat-sub",style:{color:'#dc2626'}},lang==='EN'?'Urgent \u2013 contract check':'Dringend \u2013 Vertragscheck'),
      s.below_min_trainee>0&&/*#__PURE__*/React.createElement("div",{className:"stat-sub",style:{color:'#6b7280',fontSize:'0.7rem'}},'+',s.below_min_trainee,' Trainee',s.below_min_trainee>1?'s':'',lang==='EN'?' excl.':' ausgeschl.')
    ),
    /*#__PURE__*/React.createElement("div", {className:"stat-card yellow",style:{cursor:'pointer'},onClick:()=>goToWageband('\u25b2 Below Target')},
      /*#__PURE__*/React.createElement("div",{className:"stat-lbl"},"\u25B2 Below Target"),
      /*#__PURE__*/React.createElement("div",{className:"stat-val",style:{color:'#d97706'}},s.below_target??'–'),
      /*#__PURE__*/React.createElement("div",{className:"stat-sub text-muted"},lang==='EN'?'Development needed':'Entwicklung n\u00f6tig')
    ),
    /*#__PURE__*/React.createElement("div", {className:"stat-card green",style:{cursor:'pointer'},onClick:()=>goToWageband('\u2713 On/Above Target')},
      /*#__PURE__*/React.createElement("div",{className:"stat-lbl"},"\u2713 On/Above Target"),
      /*#__PURE__*/React.createElement("div",{className:"stat-val",style:{color:'#16a34a'}},s.on_target??'–'),
      /*#__PURE__*/React.createElement("div",{className:"stat-sub",style:{color:'#16a34a'}},s.pct_on_target,"% ",lang==='EN'?'of workforce':'der Belegschaft')
    )
  )), /*#__PURE__*/React.createElement("div", {style:{display:'grid',gridTemplateColumns:'1fr 1fr',gap:20,marginBottom:24}},
  /*#__PURE__*/React.createElement("div", {style:{display:'flex',flexDirection:'column',gap:20,height:'100%'}},
    /*#__PURE__*/React.createElement("div",{className:"card"},
      /*#__PURE__*/React.createElement("div",{className:"card-title"},t(lang,'bandDist')),
      /*#__PURE__*/React.createElement(PieChart,{data:pieData,size:160})
    ),
    /*#__PURE__*/React.createElement("div",{className:"card"},
      /*#__PURE__*/React.createElement("div",{className:"card-title"},t(lang,'bandStatus')),
      wb&&Object.entries(wb.by_section).map(([sec,d])=>/*#__PURE__*/React.createElement(StackedBar,{key:sec,label:sec,total:d.total,vals:[d.below_min,d.below_target,d.on_target],colors:['#ef4444','#f59e0b','#10b981']}))
    ),
    emp&&emp.by_bereich&&emp.by_bereich.length>0&&/*#__PURE__*/React.createElement("div",{className:"card",style:{flex:1}},
      /*#__PURE__*/React.createElement("div",{className:"card-title"},t(lang,'hcBereich')),
      /*#__PURE__*/React.createElement(HBarChart,{data:emp.by_bereich.map(d=>({name:d.cc,subLabel:deptName(lang,d.name||''),count:d.count,payroll:d.payroll})),valueKey:"count",color:"#6366f1",labelWidth:140})
    )
  ),
  emp&&emp.by_abteilung&&emp.by_abteilung.length>0&&/*#__PURE__*/React.createElement("div",{className:"card",style:{height:'100%'}},
    /*#__PURE__*/React.createElement("div",{className:"card-title"},t(lang,'hcAbt')),
    /*#__PURE__*/React.createElement(HBarChart,{data:emp.by_abteilung.map(d=>({name:d.cc,subLabel:deptName(lang,d.name||''),count:d.count,payroll:d.payroll})),valueKey:"count",color:"#3b82f6",labelWidth:140})
  )));
}

// ── Wage Band Monitor ────────────────────────────────────────────────────────
function WageBandMonitor() {
  const lang = useLang();
  const {
    user
  } = useAuth();
  const [data, setData] = useState([]);
  const [loading, setL] = useState(true);
  const [filter, setF] = useState('');
  const [sec, setSec] = useState('');
  const [bandF, setBandF] = useState('');
  const [bandStatusF, setBandStatusF] = useState('');
  const {wbFilter} = useNav();
  React.useEffect(() => { if(wbFilter !== undefined) setBandStatusF(wbFilter); }, [wbFilter]);
  useEffect(() => {
    if (['admin', 'hr', 'payroll'].includes(user.role)) API.get('/api/wageband/detail').then(setData).finally(() => setL(false));else setL(false);
  }, []);
  if (loading) return /*#__PURE__*/React.createElement(Loading, null);
  if (user.role === 'manager') return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "page-header"
  }, /*#__PURE__*/React.createElement("h2", null, "Wage Band Monitor")), /*#__PURE__*/React.createElement("div", {
    className: "alert alert-info"
  }, /*#__PURE__*/React.createElement("i", {
    className: "fa fa-info-circle"
  }), " Als Manager siehst du die aggregierte \xDCbersicht im Dashboard. Detaildaten sind f\xFCr HR und Lohnbuchhaltung zug\xE4nglich."));
  // Build section → department_group hierarchy for grouped dropdown
  const sectionGroups = {};
  data.forEach(d => {
    if (!sectionGroups[d.section]) sectionGroups[d.section] = new Set();
    if (d.department_group) sectionGroups[d.section].add(d.department_group);
  });
  const sections = Object.keys(sectionGroups);
  // Unique band code prefixes (part before "_"), sorted
  const bandPrefixes = [...new Set(data.map(d => (d.band_code || '').split('_')[0]).filter(Boolean))].sort();
  const filtered = data.filter(d => {
    const q = filter.toLowerCase();
    const matchText = !filter ||
      (d.en_title || '').toLowerCase().includes(q) ||
      (d.band_code || '').toLowerCase().includes(q) ||
      (d.erp_id || '').includes(filter) ||
      (d.department_group || '').toLowerCase().includes(q);
    let matchSec = true;
    if (sec.startsWith('s:')) matchSec = d.section === sec.slice(2);
    else if (sec.startsWith('d:')) matchSec = d.department_group === sec.slice(2);
    const matchBand = !bandF || (d.band_code || '').split('_')[0] === bandF;
    const matchStatus = !bandStatusF || (d.band_position || '') === bandStatusF;
    return matchText && matchSec && matchBand && matchStatus;
  });
  return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "page-header"
  }, /*#__PURE__*/React.createElement("h2", null, "Wage Band Monitor"), /*#__PURE__*/React.createElement("p", null, data.length, lang==='EN'?' employees · Feb 2026':' \u0441\u043b\u0443\u0436\u0438\u0442\u0435\u043b\u0438 · \u0424\u0435\u0432\u0440. 2026')),
  /*#__PURE__*/React.createElement('div',{className:'stat-grid',style:{marginBottom:22}},
    /*#__PURE__*/React.createElement('div',{className:'stat-card red',
      style:{cursor:'pointer',outline:bandStatusF==='\u26a0 BELOW MIN'?'2px solid #2E74B5':'none',outlineOffset:2},
      onClick:()=>setBandStatusF(bandStatusF==='\u26a0 BELOW MIN'?'':'\u26a0 BELOW MIN')},
      /*#__PURE__*/React.createElement('div',{className:'stat-val',style:{color:'#dc2626'}},filtered.filter(d=>d.band_position==='\u26a0 BELOW MIN'&&d.employee_type!=='Trainee').length),
      /*#__PURE__*/React.createElement('div',{className:'stat-lbl'},lang==='EN'?'Below Min':'Unter Minimum'),
      /*#__PURE__*/React.createElement('div',{className:'stat-sub',style:{color:'#dc2626'}},lang==='EN'?'Urgent \u2013 contract review':'Dringend \u2013 Vertragscheck'),
      filtered.filter(d=>d.band_position==='\u26a0 BELOW MIN'&&d.employee_type==='Trainee').length>0&&/*#__PURE__*/React.createElement('div',{className:'stat-sub',style:{color:'#6b7280',fontSize:'0.7rem'}},'+',filtered.filter(d=>d.band_position==='\u26a0 BELOW MIN'&&d.employee_type==='Trainee').length,' Trainee(s) excl.')
    ),
    /*#__PURE__*/React.createElement('div',{className:'stat-card yellow',
      style:{cursor:'pointer',outline:bandStatusF==='\u25b2 Below Target'?'2px solid #2E74B5':'none',outlineOffset:2},
      onClick:()=>setBandStatusF(bandStatusF==='\u25b2 Below Target'?'':'\u25b2 Below Target')},
      /*#__PURE__*/React.createElement('div',{className:'stat-val',style:{color:'#d97706'}},filtered.filter(d=>d.band_position==='\u25b2 Below Target').length),
      /*#__PURE__*/React.createElement('div',{className:'stat-lbl'},lang==='EN'?'Below Target':'Unter Zielband'),
      /*#__PURE__*/React.createElement('div',{className:'stat-sub'},lang==='EN'?'Development needed':'Entwicklung n\u00f6tig')
    ),
    /*#__PURE__*/React.createElement('div',{className:'stat-card green',
      style:{cursor:'pointer',outline:bandStatusF==='\u2713 On/Above Target'?'2px solid #2E74B5':'none',outlineOffset:2},
      onClick:()=>setBandStatusF(bandStatusF==='\u2713 On/Above Target'?'':'\u2713 On/Above Target')},
      /*#__PURE__*/React.createElement('div',{className:'stat-val',style:{color:'#16a34a'}},filtered.filter(d=>d.band_position==='\u2713 On/Above Target').length),
      /*#__PURE__*/React.createElement('div',{className:'stat-lbl'},lang==='EN'?'On / Above Target':'Im / \u00fcber Zielband'),
      /*#__PURE__*/React.createElement('div',{className:'stat-sub',style:{color:'#16a34a'}},Math.round(filtered.filter(d=>d.band_position==='\u2713 On/Above Target'||d.band_position==='\u2605 Above Max').length/(filtered.length||1)*100)+'%',lang==='EN'?' of filtered':' der Anzeige')
    ),
    /*#__PURE__*/React.createElement('div',{className:'stat-card blue',
      style:{cursor:'pointer',outline:bandStatusF==='\u2605 Above Max'?'2px solid #2E74B5':'none',outlineOffset:2},
      onClick:()=>setBandStatusF(bandStatusF==='\u2605 Above Max'?'':'\u2605 Above Max')},
      /*#__PURE__*/React.createElement('div',{className:'stat-val',style:{color:'#2E74B5'}},filtered.filter(d=>d.band_position==='\u2605 Above Max').length),
      /*#__PURE__*/React.createElement('div',{className:'stat-lbl'},lang==='EN'?'Above Max':'\u00dcber Maximum'),
      /*#__PURE__*/React.createElement('div',{className:'stat-sub'},lang==='EN'?'Review recommended':'\u00dcberpr\u00fcfung empfohlen')
    )
  ),
  /*#__PURE__*/React.createElement("div", {
    className: "card mb-6"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex gap-3 items-center",
    style: {
      flexWrap: 'wrap'
    }
  }, /*#__PURE__*/React.createElement("input", {
    type: "text",
    placeholder: lang==='EN'?"\uD83D\uDD0D Search title, band code, ERP-ID, group\u2026":"\uD83D\uDD0D \u0422\u044a\u0440\u0441\u0435\u043d\u0435 \u0437\u0430\u0433\u043b\u0430\u0432\u0438\u0435, \u043a\u043e\u0434, ERP-ID, \u0433\u0440\u0443\u043f\u0430\u2026",
    value: filter,
    onChange: e => setF(e.target.value),
    style: {
      width: 280
    }
  }), /*#__PURE__*/React.createElement("select", {
    value: sec,
    onChange: e => setSec(e.target.value)
  }, /*#__PURE__*/React.createElement("option", {
    value: ""
  }, t(lang,'allSections')),
  sections.map(s => /*#__PURE__*/React.createElement("optgroup", {
    key: s, label: s
  }, [...sectionGroups[s]].sort().map(g => /*#__PURE__*/React.createElement("option", {
    key: g, value: 'd:' + g
  }, g))))), /*#__PURE__*/React.createElement("select", {
    value: bandF,
    onChange: e => setBandF(e.target.value)
  }, /*#__PURE__*/React.createElement("option", {value: ""}, t(lang,'allBandCodes')),
  bandPrefixes.map(bp => /*#__PURE__*/React.createElement("option", {key: bp, value: bp}, bp))),
  /*#__PURE__*/React.createElement("span", {
    className: "text-muted text-sm"
  }, filtered.length, " ", t(lang,'entries')))), /*#__PURE__*/React.createElement("div", {
    className: "card"
  }, /*#__PURE__*/React.createElement("div", {
    className: "table-wrap"
  }, /*#__PURE__*/React.createElement("table", null, /*#__PURE__*/React.createElement("thead", null, /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("th",null,"ERP-ID"), /*#__PURE__*/React.createElement("th",null,t(lang,'deptGroup')), /*#__PURE__*/React.createElement("th",null,lang==='EN'?'Title':'\u041f\u043e\u0437\u0438\u0446\u0438\u044f (EN)'), /*#__PURE__*/React.createElement("th",null,"Band"), /*#__PURE__*/React.createElement("th",null,"Sur."), /*#__PURE__*/React.createElement("th",null,t(lang,'minNet')), /*#__PURE__*/React.createElement("th",null,t(lang,'targetNet')), /*#__PURE__*/React.createElement("th",null,t(lang,'maxNet')), /*#__PURE__*/React.createElement("th",null,t(lang,'actualNet')), /*#__PURE__*/React.createElement("th",null,t(lang,'status')), /*#__PURE__*/React.createElement("th",null,t(lang,'fillLevel')))), /*#__PURE__*/React.createElement("tbody", null, filtered.map((row, i) => {
    const pct = row.min_net && row.max_net && row.actual_net ? Math.min(100, Math.max(0, (row.actual_net - row.min_net) / (row.max_net - row.min_net) * 100)) : null;
    const fc = !row.band_position ? '#9ca3af' : row.band_position.includes('⚠') ? '#ef4444' : row.band_position.includes('▲') ? '#f59e0b' : '#10b981';
    return /*#__PURE__*/React.createElement("tr", {
      key: i
    }, /*#__PURE__*/React.createElement("td", {
      style: {
        fontFamily: 'monospace',
        fontWeight: 600
      }
    }, row.erp_id), /*#__PURE__*/React.createElement("td", null, row.department_group), /*#__PURE__*/React.createElement("td", {
      style: {
        maxWidth: 200
      }
    }, row.en_title), /*#__PURE__*/React.createElement("td", null, /*#__PURE__*/React.createElement("code", null, row.band_code)), /*#__PURE__*/React.createElement("td", null, /*#__PURE__*/React.createElement("span", {
      className: `tag tag-${row.surcharge}`
    }, row.surcharge)), /*#__PURE__*/React.createElement("td", null, fmt(row.min_net)), /*#__PURE__*/React.createElement("td", null, fmt(row.target_net)), /*#__PURE__*/React.createElement("td", null, fmt(row.max_net)), /*#__PURE__*/React.createElement("td", {
      style: {
        fontWeight: 600
      }
    }, fmt(row.actual_net)), /*#__PURE__*/React.createElement("td", null, /*#__PURE__*/React.createElement(BandStatus, {
      status: row.band_position
    })), /*#__PURE__*/React.createElement("td", null, pct != null ? /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        alignItems: 'center',
        gap: 6
      }
    }, /*#__PURE__*/React.createElement("div", {
      className: "band-bar"
    }, /*#__PURE__*/React.createElement("div", {
      className: "band-fill",
      style: {
        width: `${pct}%`,
        background: fc
      }
    })), /*#__PURE__*/React.createElement("span", {
      style: {
        fontSize: 11,
        color: '#888',
        width: 32
      }
    }, Math.round(pct), "%")) : '–'));
  }))))));
}

// ── Tenure Distribution Chart ─────────────────────────────────────────────────
function TenureChart({employees, lang}) {
  const active = employees.filter(e => e.status === 'Active' && e.entry_date);
  if (!active.length) return null;
  const now = new Date();
  const years = active.map(e => (now - new Date(e.entry_date)) / (1000 * 60 * 60 * 24 * 365.25));
  const avg = years.reduce((a, b) => a + b, 0) / years.length;
  const buckets = [
    {label: lang==='EN' ? '<1 yr' : '<1 J', max: 1},
    {label: lang==='EN' ? '1–2 yrs' : '1–2 J', max: 2},
    {label: lang==='EN' ? '2–3 yrs' : '2–3 J', max: 3},
    {label: lang==='EN' ? '3–5 yrs' : '3–5 J', max: 5},
    {label: lang==='EN' ? '5–10 yrs' : '5–10 J', max: 10},
    {label: lang==='EN' ? '10–15 yrs' : '10–15 J', max: 15},
    {label: lang==='EN' ? '15–20 yrs' : '15–20 J', max: 20},
    {label: lang==='EN' ? '20+ yrs' : '20+ J', max: Infinity},
  ];
  const counts = buckets.map((b, i) => {
    const prev = i === 0 ? 0 : buckets[i-1].max;
    return years.filter(y => y >= prev && y < b.max).length;
  });
  const maxC = Math.max(...counts, 1);
  // SVG dimensions
  const W = 520, H = 180, PL = 10, PR = 20, PT = 20, PB = 40;
  const iW = W - PL - PR, iH = H - PT - PB;
  const bW = iW / buckets.length;
  const barColor = '#3b82f6';
  // avg x position: find bucket where avg falls, interpolate
  const avgX = PL + (avg / 20) * iW;  // rough; clamp to chart
  const avgXc = Math.min(PL + iW - 2, Math.max(PL, avgX));
  return /*#__PURE__*/React.createElement("div", {className: "card mb-6"},
    /*#__PURE__*/React.createElement("div", {className: "card-title"},
      lang === 'EN' ? 'Tenure Distribution' : 'Dienstjahr-Verteilung',
      /*#__PURE__*/React.createElement("span", {style: {marginLeft: 16, fontSize: 13, color: '#059669', fontWeight: 700}},
        '∅ ', avg.toFixed(1), lang === 'EN' ? ' yrs' : ' J'
      )
    ),
    /*#__PURE__*/React.createElement("svg", {width:"100%", height: H, viewBox:`0 0 ${W} ${H}`, style:{display:'block'}},
      // Bars
      counts.map((c, i) => {
        const x = PL + i * bW + 4;
        const bh = c / maxC * iH;
        const by = PT + iH - bh;
        return /*#__PURE__*/React.createElement("g", {key: i},
          /*#__PURE__*/React.createElement("rect", {x, y: by, width: bW - 8, height: bh, fill: barColor, rx: 3, opacity: 0.82}),
          c > 0 && /*#__PURE__*/React.createElement("text", {x: x + (bW-8)/2, y: by - 4, textAnchor:"middle", fontSize:10, fill:"#444", fontWeight:600}, c),
          /*#__PURE__*/React.createElement("text", {x: x + (bW-8)/2, y: H - PB + 14, textAnchor:"middle", fontSize:9, fill:"#888"}, buckets[i].label)
        );
      }),
      // Average line
      /*#__PURE__*/React.createElement("line", {x1: avgXc, y1: PT, x2: avgXc, y2: PT + iH, stroke:"#059669", strokeWidth:1.5, strokeDasharray:"4 3"}),
      /*#__PURE__*/React.createElement("text", {x: avgXc + 4, y: PT + 10, fontSize:9, fill:"#059669"},
        '∅ ', avg.toFixed(1), lang==='EN'?' yrs':' J'
      )
    )
  );
}

// ── Employees ────────────────────────────────────────────────────────────────
function EmployeeList() {
  const lang = useLang();
  const {empFilter} = useNav();
  const [employees, setE] = useState([]);
  const [loading, setL] = useState(true);
  const [filter, setF] = useState('');
  const [statusF, setSF] = useState(() => empFilter?.status ?? 'Active');
  const [newOnly, setNewOnly] = useState(() => empFilter?.newOnly ?? false);
  // Sync filter when empFilter changes (tile navigation)
  React.useEffect(() => { if(empFilter){ setSF(empFilter.status); setNewOnly(empFilter.newOnly); } }, [empFilter]);
  useEffect(() => {
    API.get('/api/employees/').then(setE).finally(() => setL(false));
  }, []);
  if (loading) return /*#__PURE__*/React.createElement(Loading, null);
  const cutoff = new Date(); cutoff.setDate(cutoff.getDate() - 180);
  const filtered = employees.filter(e => {
    const q = filter.toLowerCase();
    const t = !filter ||
      (e.department || '').toLowerCase().includes(q) ||
      (e.position_bg || '').toLowerCase().includes(q) ||
      (e.position_en || '').toLowerCase().includes(q) ||
      (e.erp_id || '').includes(filter);
    const matchStatus = !statusF || e.status === statusF;
    const matchNew = !newOnly || (e.entry_date && new Date(e.entry_date) >= cutoff);
    return t && matchStatus && matchNew;
  }).sort((a, b) => newOnly
    ? new Date(b.entry_date||0) - new Date(a.entry_date||0)
    : (a.department||'').localeCompare(b.department||'')
  );
  const activeCount = employees.filter(e => e.status === 'Active').length;
  const posCol   = 'Position';
  const deptCol  = lang === 'EN' ? 'Department' : 'Abteilung';
  const entryCol = lang === 'EN' ? 'Entry Date' : 'Eintrittsdatum';
  const statusLbl = s => lang === 'EN' ? (s === 'Active' ? 'Active' : 'Inactive') : (s === 'Active' ? 'Aktiv' : 'Inaktiv');
  return /*#__PURE__*/React.createElement("div", null,
    /*#__PURE__*/React.createElement("div", {className: "page-header"},
      /*#__PURE__*/React.createElement("h2", null, lang === 'EN' ? 'Employee List' : 'Mitarbeiterliste'),
      /*#__PURE__*/React.createElement("p", null, activeCount, lang === 'EN' ? ' active employees (anonymised)' : ' aktive Mitarbeiter (anonymisiert)')
    ),
    /*#__PURE__*/React.createElement(TenureChart, {employees, lang}),
    /*#__PURE__*/React.createElement("div", {className: "card mb-6"},
      /*#__PURE__*/React.createElement("div", {className: "flex gap-3 items-center", style:{flexWrap:'wrap'}},
        /*#__PURE__*/React.createElement("input", {
          type: "text",
          placeholder: lang === 'EN' ? "\uD83D\uDD0D Department, Position, ERP-ID\u2026" : "\uD83D\uDD0D Abteilung, Position, ERP-ID\u2026",
          value: filter, onChange: e => setF(e.target.value), style:{width:280}
        }),
        /*#__PURE__*/React.createElement("select", {value: statusF, onChange: e => setSF(e.target.value)},
          /*#__PURE__*/React.createElement("option", {value: ""}, lang==='EN'?'All':'Alle'),
          /*#__PURE__*/React.createElement("option", {value: "Active"}, lang==='EN'?'Active':'Aktiv'),
          /*#__PURE__*/React.createElement("option", {value: "Inactive"}, lang==='EN'?'Inactive':'Inaktiv')
        ),
        /*#__PURE__*/React.createElement("button", {
          className: newOnly ? 'btn btn-blue' : 'btn btn-gray',
          onClick: () => setNewOnly(!newOnly)
        }, lang==='EN'?(newOnly?'\u2714 New only':'New only'):(newOnly?'\u2714 Nur Neue':'Nur Neue')),
        /*#__PURE__*/React.createElement("span", {className:"text-muted text-sm"}, filtered.length, lang==='EN'?' entries':' Einträge')
      )
    ),
    /*#__PURE__*/React.createElement("div", {className: "card"},
      /*#__PURE__*/React.createElement("div", {className: "table-wrap"},
        /*#__PURE__*/React.createElement("table", null,
          /*#__PURE__*/React.createElement("thead", null,
            /*#__PURE__*/React.createElement("tr", null,
              /*#__PURE__*/React.createElement("th", null, "ERP-ID"),
              /*#__PURE__*/React.createElement("th", null, deptCol),
              /*#__PURE__*/React.createElement("th", null, posCol),
              /*#__PURE__*/React.createElement("th", null, entryCol),
              /*#__PURE__*/React.createElement("th", null, "FTE"),
              /*#__PURE__*/React.createElement("th", null, lang==='EN'?'Cost Center':'KST'),
              /*#__PURE__*/React.createElement("th", null, "Status")
            )
          ),
          /*#__PURE__*/React.createElement("tbody", null, filtered.map((e, i) =>
            /*#__PURE__*/React.createElement("tr", {key: i},
              /*#__PURE__*/React.createElement("td", {style:{fontFamily:'monospace',fontWeight:600}}, e.erp_id),
              /*#__PURE__*/React.createElement("td", null, deptName(lang, e.department)),
              /*#__PURE__*/React.createElement("td", {style:{maxWidth:220,fontSize:12}},
                posName(lang, e.position_bg)
              ),
              /*#__PURE__*/React.createElement("td", null, e.entry_date ? new Date(e.entry_date).toLocaleDateString('de-CH') : '–'),
              /*#__PURE__*/React.createElement("td", null, e.fte),
              /*#__PURE__*/React.createElement("td", null, /*#__PURE__*/React.createElement("code", null, e.cost_center)),
              /*#__PURE__*/React.createElement("td", null,
                /*#__PURE__*/React.createElement("span", {className:`sb ${e.status==='Active'?'sb-active':'sb-inactive'}`},
                  statusLbl(e.status)
                )
              )
            )
          ))
        )
      )
    )
  );
}

// ── Payroll Budget ────────────────────────────────────────────────────────────
function PayrollBudget() {
  const lang = useLang();
  const {
    user
  } = useAuth();
  const [records, setR] = useState([]);
  const [summary, setS] = useState(null);
  const [loading, setL] = useState(true);
  const [releasing, setRel] = useState(null);
  const [msg, setMsg] = useState('');
  async function loadData() {
    setL(true);
    try {
      const s = await API.get('/api/payroll/budget/summary');
      setS(s);
      if (['admin', 'payroll'].includes(user.role)) {
        const r = await API.get('/api/payroll/budget');
        setR(r);
      }
    } catch (e) {}
    setL(false);
  }
  useEffect(() => {
    loadData();
  }, []);
  async function release(dept) {
    if (!confirm(lang==='EN'?`Release payroll for "${dept}"?`:`\u041e\u0434\u043e\u0431\u0440\u0438 \u0437\u0430\u043f\u043b\u0430\u0442\u0438 \u0437\u0430 "${dept}"?`)) return;
    setRel(dept);
    try {
      await API.post(`/api/payroll/release/${encodeURIComponent(dept)}`, {});
      setMsg(lang==='EN'?`✓ ${dept} released`:`✓ ${dept} \u043e\u0434\u043e\u0431\u0440\u0435\u043d\u043e`);
      loadData();
    } catch (e) {
      setMsg(`Fehler: ${e.message}`);
    }
    setRel(null);
  }
  if (loading) return /*#__PURE__*/React.createElement(Loading, null);
  if (user.role === 'manager' && summary) return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "page-header"
  }, /*#__PURE__*/React.createElement("h2", null, "Payroll \xDCbersicht")), /*#__PURE__*/React.createElement("div", {
    className: "stat-grid"
  }, /*#__PURE__*/React.createElement("div", {
    className: "stat-card blue"
  }, /*#__PURE__*/React.createElement("div", {
    className: "stat-lbl"
  }, t(lang,'annualBudget')), /*#__PURE__*/React.createElement("div", {
    className: "stat-val",
    style: {
      fontSize: 20
    }
  }, fmtE(summary.total_annual_budget))), /*#__PURE__*/React.createElement("div", {
    className: "stat-card blue"
  }, /*#__PURE__*/React.createElement("div", {
    className: "stat-lbl"
  }, t(lang,'budgetMonth')), /*#__PURE__*/React.createElement("div", {
    className: "stat-val",
    style: {
      fontSize: 20
    }
  }, fmtE(summary.total_monthly_budget))), /*#__PURE__*/React.createElement("div", {
    className: "stat-card green"
  }, /*#__PURE__*/React.createElement("div", {
    className: "stat-lbl"
  }, "Tats\xE4chlicher Aufwand"), /*#__PURE__*/React.createElement("div", {
    className: "stat-val",
    style: {
      fontSize: 20
    }
  }, fmtE(summary.total_actual_payroll))), /*#__PURE__*/React.createElement("div", {
    className: `stat-card ${summary.total_variance > 0 ? 'red' : 'green'}`
  }, /*#__PURE__*/React.createElement("div", {
    className: "stat-lbl"
  }, t(lang,'variance')), /*#__PURE__*/React.createElement("div", {
    className: "stat-val",
    style: {
      fontSize: 20,
      color: summary.total_variance > 0 ? '#dc2626' : '#16a34a'
    }
  }, fmtP(summary.total_variance_pct)))));
  const chartData = records.map(r => ({
    name: deptName(lang, r.department),
    Budget: Math.round(r.approved_monthly_budget || 0),
    Actual: Math.round(r.actual_payroll || 0)
  }));
  return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "page-header"
  }, /*#__PURE__*/React.createElement("h2", null, lang==='EN'?'Payroll Budget Control':'\u041a\u043e\u043d\u0442\u0440\u043e\u043b \u0411\u044e\u0434\u0436\u0435\u0442 \u0417\u0430\u043f\u043b\u0430\u0442\u0438'), /*#__PURE__*/React.createElement("p", null, "Monat 2 \xB7 ", records.length, " Abteilungen")), msg && /*#__PURE__*/React.createElement("div", {
    className: "alert alert-info"
  }, msg), summary && /*#__PURE__*/React.createElement("div", {
    className: "stat-grid mb-6"
  }, /*#__PURE__*/React.createElement("div", {
    className: "stat-card blue"
  }, /*#__PURE__*/React.createElement("div", {
    className: "stat-lbl"
  }, t(lang,'annualBudget')), /*#__PURE__*/React.createElement("div", {
    className: "stat-val",
    style: {
      fontSize: 20
    }
  }, fmtE(summary.total_annual_budget))), /*#__PURE__*/React.createElement("div", {
    className: "stat-card blue"
  }, /*#__PURE__*/React.createElement("div", {
    className: "stat-lbl"
  }, t(lang,'monthlyBudget')), /*#__PURE__*/React.createElement("div", {
    className: "stat-val",
    style: {
      fontSize: 20
    }
  }, fmtE(summary.total_monthly_budget))), /*#__PURE__*/React.createElement("div", {
    className: "stat-card green"
  }, /*#__PURE__*/React.createElement("div", {
    className: "stat-lbl"
  }, "Tats\xE4chlich"), /*#__PURE__*/React.createElement("div", {
    className: "stat-val",
    style: {
      fontSize: 20
    }
  }, fmtE(summary.total_actual_payroll))), /*#__PURE__*/React.createElement("div", {
    className: `stat-card ${summary.total_variance > 0 ? 'red' : 'green'}`
  }, /*#__PURE__*/React.createElement("div", {
    className: "stat-lbl"
  }, t(lang,'variance')), /*#__PURE__*/React.createElement("div", {
    className: "stat-val",
    style: {
      fontSize: 20,
      color: summary.total_variance > 0 ? '#dc2626' : '#16a34a'
    }
  }, fmtP(summary.total_variance_pct)))), chartData.length > 0 && /*#__PURE__*/React.createElement("div", {
    className: "card mb-6"
  }, /*#__PURE__*/React.createElement("div", {
    className: "card-title"
  }, "Budget vs. Actual \u2014 All Departments"), /*#__PURE__*/React.createElement(BarChart, {
    data: chartData,
    keys: ['Budget', 'Actual'],
    colors: ['#93c5fd', '#3b82f6'],
    height: 240,
    formatter: v => `€${(v / 1000).toFixed(0)}k`
  })), /*#__PURE__*/React.createElement("div", {
    className: "card"
  }, /*#__PURE__*/React.createElement("div", {
    className: "table-wrap"
  }, /*#__PURE__*/React.createElement("table", null, /*#__PURE__*/React.createElement("thead", null, /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("th",null,t(lang,'department')), /*#__PURE__*/React.createElement("th",null,t(lang,'costCenter')), /*#__PURE__*/React.createElement("th",null,t(lang,'budget')), /*#__PURE__*/React.createElement("th",null,t(lang,'actual')), /*#__PURE__*/React.createElement("th",null,t(lang,'variance')), /*#__PURE__*/React.createElement("th",null,"Var %"), /*#__PURE__*/React.createElement("th",null,t(lang,'status')), /*#__PURE__*/React.createElement("th",null,lang==='EN'?'Action':'\u0414\u0435\u0439\u0441\u0442\u0432\u0438\u0435'))), /*#__PURE__*/React.createElement("tbody", null, records.map((r, i) => /*#__PURE__*/React.createElement("tr", {
    key: i
  }, /*#__PURE__*/React.createElement("td", {
    style: {
      fontWeight: 500
    }
  }, deptName(lang, r.department)), /*#__PURE__*/React.createElement("td", null, /*#__PURE__*/React.createElement("code", null, r.cost_center)), /*#__PURE__*/React.createElement("td", null, fmtE(r.approved_monthly_budget)), /*#__PURE__*/React.createElement("td", null, fmtE(r.actual_payroll)), /*#__PURE__*/React.createElement("td", {
    style: {
      color: r.variance < 0 ? '#16a34a' : '#dc2626',
      fontWeight: 600
    }
  }, fmtE(r.variance)), /*#__PURE__*/React.createElement("td", {
    style: {
      color: r.variance_pct < 0 ? '#16a34a' : '#dc2626'
    }
  }, fmtP(r.variance_pct)), /*#__PURE__*/React.createElement("td", null, r.release_status ? /*#__PURE__*/React.createElement("span", {
    className: "sb sb-ok"
  }, "\u2713 ", r.release_status) : /*#__PURE__*/React.createElement("span", {
    className: "sb sb-inactive"
  }, t(lang,'pending'))), /*#__PURE__*/React.createElement("td", null, !r.release_status && /*#__PURE__*/React.createElement("button", {
    className: "btn btn-sm btn-success",
    disabled: releasing === r.department,
    onClick: () => release(r.department)
  }, releasing===r.department?'…':t(lang,'approve'))))))))));
}

// ── Band Referenz ─────────────────────────────────────────────────────────────
function BandReferenz() {
  const lang = useLang();
  const [bands, setB] = useState([]);
  const [loading, setL] = useState(true);
  const [dept, setD] = useState('');
  useEffect(() => {
    API.get('/api/wageband/bands').then(setB).finally(() => setL(false));
  }, []);
  if (loading) return /*#__PURE__*/React.createElement(Loading, null);
  const depts = [...new Set(bands.map(b => b.department))];
  const filtered = dept ? bands.filter(b => b.department === dept) : bands;
  return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "page-header"
  }, /*#__PURE__*/React.createElement("h2", null, t(lang,'wageRef')), /*#__PURE__*/React.createElement("p", null, bands.length, " ", t(lang,'profiles'))), /*#__PURE__*/React.createElement("div", {
    className: "card mb-6"
  }, /*#__PURE__*/React.createElement("select", {
    value: dept,
    onChange: e => setD(e.target.value)
  }, /*#__PURE__*/React.createElement("option", {
    value: ""
  }, t(lang,'allDepts')), depts.map(d => /*#__PURE__*/React.createElement("option", {
    key: d,
    value: d
  }, d))), /*#__PURE__*/React.createElement("span", {
    className: "text-muted text-sm",
    style: {
      marginLeft: 12
    }
  }, filtered.length, " ", t(lang,'profiles'))), /*#__PURE__*/React.createElement("div", {
    className: "card"
  }, /*#__PURE__*/React.createElement("div", {
    className: "table-wrap"
  }, /*#__PURE__*/React.createElement("table", null, /*#__PURE__*/React.createElement("thead", null, /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("th",null,"Code"), /*#__PURE__*/React.createElement("th",null,t(lang,'section')), /*#__PURE__*/React.createElement("th",null,lang==='EN'?'Title':'\u041f\u043e\u0437\u0438\u0446\u0438\u044f'), /*#__PURE__*/React.createElement("th",null,"Sur."), /*#__PURE__*/React.createElement("th",null,t(lang,'minNet')), /*#__PURE__*/React.createElement("th",null,t(lang,'targetNet')), /*#__PURE__*/React.createElement("th",null,t(lang,'maxNet')), /*#__PURE__*/React.createElement("th",null,t(lang,'notes')))), /*#__PURE__*/React.createElement("tbody", null, filtered.map((b, i) => /*#__PURE__*/React.createElement("tr", {
    key: i
  }, /*#__PURE__*/React.createElement("td", null, /*#__PURE__*/React.createElement("code", null, b.code)), /*#__PURE__*/React.createElement("td", null, b.department), /*#__PURE__*/React.createElement("td", {
    style: {
      fontWeight: 500
    }
  }, b.en_title), /*#__PURE__*/React.createElement("td", null, /*#__PURE__*/React.createElement("span", {
    className: `tag tag-${b.surcharge}`
  }, b.surcharge)), /*#__PURE__*/React.createElement("td", null, fmt(b.min_net)), /*#__PURE__*/React.createElement("td", {
    style: {
      fontWeight: 600
    }
  }, fmt(b.target_net)), /*#__PURE__*/React.createElement("td", null, fmt(b.max_net)), /*#__PURE__*/React.createElement("td", {
    style: {
      fontSize: 12,
      color: '#888',
      maxWidth: 200
    }
  }, b.notes || '–'))))))));
}

// ── Benutzerverwaltung ────────────────────────────────────────────────────────
function Benutzer() {
  const lang = useLang();
  const [users, setU] = useState([]);
  const [logs, setLogs] = useState([]);
  const [loading, setL] = useState(true);
  const [tab, setTab] = useState('users');
  const [form, setForm] = useState({
    username: '',
    full_name: '',
    role: 'hr',
    password: ''
  });
  const [msg, setMsg] = useState('');
  async function loadData() {
    try {
      const [u, l] = await Promise.all([API.get('/api/users/'), API.get('/api/users/audit-log')]);
      setU(u);
      setLogs(l);
    } catch (e) {}
    setL(false);
  }
  useEffect(() => {
    loadData();
  }, []);
  async function toggleActive(u) {
    try {
      await API.put(`/api/users/${u.id}`, {
        is_active: !u.is_active
      });
      setMsg(lang==='EN'?`${u.full_name} ${u.is_active?'deactivated':'activated'}`:`${u.full_name} ${u.is_active?'\u0434\u0435\u0430\u043a\u0442\u0438\u0432\u0438\u0440\u0430\u043d':'\u0430\u043a\u0442\u0438\u0432\u0438\u0440\u0430\u043d'}`);
      loadData();
    } catch (e) {
      setMsg(`Fehler: ${e.message}`);
    }
  }
  async function createUser(e) {
    e.preventDefault();
    try {
      await API.post('/api/users/', form);
      setMsg(lang==='EN'?`✓ User "${form.username}" created`:`✓ \u041f\u043e\u0442\u0440\u0435\u0431\u0438\u0442\u0435\u043b "${form.username}" \u0441\u044a\u0437\u0434\u0430\u0434\u0435\u043d`);
      setForm({
        username: '',
        full_name: '',
        role: 'hr',
        password: ''
      });
      loadData();
    } catch (err) {
      setMsg(`Fehler: ${err.message}`);
    }
  }
  if (loading) return /*#__PURE__*/React.createElement(Loading, null);
  return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "page-header"
  }, /*#__PURE__*/React.createElement("h2", null, t(lang,'users')), /*#__PURE__*/React.createElement("p", null, t(lang,'adminOnly'))), msg && /*#__PURE__*/React.createElement("div", {
    className: "alert alert-info"
  }, msg), /*#__PURE__*/React.createElement("div", {
    className: "flex gap-2 mb-6"
  }, ['users', 'create', 'audit'].map(t => /*#__PURE__*/React.createElement("button", {
    key: t,
    className: `btn ${tab === t ? 'btn-blue' : 'btn-gray'}`,
    onClick: () => setTab(t)
  }, t==='users'?(lang==='EN'?'Users':'\u041f\u043e\u0442\u0440\u0435\u0431\u0438\u0442\u0435\u043b\u0438'):t==='create'?(lang==='EN'?'+ New':'+ \u041d\u043e\u0432'):t(lang,'auditLog')))), tab === 'users' && /*#__PURE__*/React.createElement("div", {
    className: "card"
  }, /*#__PURE__*/React.createElement("table", null, /*#__PURE__*/React.createElement("thead", null, /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("th",null,t(lang,'username')), /*#__PURE__*/React.createElement("th",null,t(lang,'fullName')), /*#__PURE__*/React.createElement("th",null,t(lang,'role')), /*#__PURE__*/React.createElement("th",null,lang==='EN'?'Last Login':'\u041f\u043e\u0441\u043b\u0435\u0434\u0435\u043d \u0412\u0445\u043e\u0434'), /*#__PURE__*/React.createElement("th",null,t(lang,'status')), /*#__PURE__*/React.createElement("th",null,lang==='EN'?'Action':'\u0414\u0435\u0439\u0441\u0442\u0432\u0438\u0435'))), /*#__PURE__*/React.createElement("tbody", null, users.map((u, i) => /*#__PURE__*/React.createElement("tr", {
    key: i
  }, /*#__PURE__*/React.createElement("td", {
    style: {
      fontFamily: 'monospace',
      fontWeight: 600
    }
  }, u.username), /*#__PURE__*/React.createElement("td", null, u.full_name), /*#__PURE__*/React.createElement("td", null, /*#__PURE__*/React.createElement(RoleBadge, {
    role: u.role
  })), /*#__PURE__*/React.createElement("td", {
    style: {
      fontSize: 12,
      color: '#888'
    }
  }, u.last_login ? new Date(u.last_login).toLocaleString('de-CH') : 'Noch nie'), /*#__PURE__*/React.createElement("td", null, /*#__PURE__*/React.createElement("span", {
    className: `sb ${u.is_active ? 'sb-active' : 'sb-inactive'}`
  }, u.is_active ? t(lang,'active') : t(lang,'inactive'))), /*#__PURE__*/React.createElement("td", null, /*#__PURE__*/React.createElement("button", {
    className: `btn btn-sm ${u.is_active ? 'btn-danger' : 'btn-success'}`,
    onClick: () => toggleActive(u)
  }, u.is_active ? t(lang,'deactivate') : t(lang,'activate')))))))), tab === 'create' && /*#__PURE__*/React.createElement("div", {
    className: "card",
    style: {
      maxWidth: 440
    }
  }, /*#__PURE__*/React.createElement("h3", {
    style: {
      marginBottom: 16,
      fontSize: 15
    }
  }, lang==='EN'?'Create New User':'\u0421\u044a\u0437\u0434\u0430\u0439 \u041d\u043e\u0432 \u041f\u043e\u0442\u0440\u0435\u0431\u0438\u0442\u0435\u043b'), /*#__PURE__*/React.createElement("form", {
    onSubmit: createUser
  }, [['username', 'Benutzername', 'text'], ['full_name', 'Vollständiger Name', 'text'], ['password', 'Passwort', 'password']].map(([f, lbl, type]) => /*#__PURE__*/React.createElement("div", {
    className: "form-group",
    key: f
  }, /*#__PURE__*/React.createElement("label", {
    className: "form-label"
  }, lbl), /*#__PURE__*/React.createElement("input", {
    className: "form-input",
    type: type,
    value: form[f],
    onChange: e => setForm({
      ...form,
      [f]: e.target.value
    }),
    required: true
  }))), /*#__PURE__*/React.createElement("div", {
    className: "form-group"
  }, /*#__PURE__*/React.createElement("label", {
    className: "form-label"
  }, t(lang,'role')), /*#__PURE__*/React.createElement("select", {
    className: "form-input",
    value: form.role,
    onChange: e => setForm({
      ...form,
      role: e.target.value
    })
  }, /*#__PURE__*/React.createElement("option", {
    value: "admin"
  }, "Admin"), /*#__PURE__*/React.createElement("option", {
    value: "manager"
  }, "Manager"), /*#__PURE__*/React.createElement("option", {
    value: "hr"
  }, "HR"), /*#__PURE__*/React.createElement("option", {
    value: "payroll"
  }, lang==='EN'?'Payroll':'\u041b\u043e\u0436\u043d\u043e\u0441\u0442\u044c'))), /*#__PURE__*/React.createElement("button", {
    className: "btn-primary",
    type: "submit"
  }, t(lang,'createUserBtn')))), tab === 'audit' && /*#__PURE__*/React.createElement("div", {
    className: "card"
  }, /*#__PURE__*/React.createElement("div", {
    className: "card-title",
    style: {
      marginBottom: 12
    }
  }, t(lang,'accessLog')), /*#__PURE__*/React.createElement("div", {
    className: "table-wrap"
  }, /*#__PURE__*/React.createElement("table", null, /*#__PURE__*/React.createElement("thead", null, /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("th",null,t(lang,'time')), /*#__PURE__*/React.createElement("th",null,t(lang,'username')), /*#__PURE__*/React.createElement("th",null,t(lang,'action')), /*#__PURE__*/React.createElement("th",null,t(lang,'resource')), /*#__PURE__*/React.createElement("th",null,"IP"))), /*#__PURE__*/React.createElement("tbody", null, logs.map((l, i) => /*#__PURE__*/React.createElement("tr", {
    key: i
  }, /*#__PURE__*/React.createElement("td", {
    style: {
      fontSize: 11,
      whiteSpace: 'nowrap'
    }
  }, l.timestamp ? new Date(l.timestamp).toLocaleString('de-CH') : '–'), /*#__PURE__*/React.createElement("td", {
    style: {
      fontWeight: 600
    }
  }, l.username), /*#__PURE__*/React.createElement("td", null, /*#__PURE__*/React.createElement("span", {
    className: "tag",
    style: {
      background: l.action === 'LOGIN' ? '#dbeafe' : '#f3f4f6',
      color: l.action === 'LOGIN' ? '#1e40af' : '#374151'
    }
  }, l.action)), /*#__PURE__*/React.createElement("td", {
    style: {
      fontFamily: 'monospace',
      fontSize: 12
    }
  }, l.resource), /*#__PURE__*/React.createElement("td", {
    style: {
      fontSize: 11,
      color: '#888'
    }
  }, l.ip_address || '–'))))))));
}

// ── App Shell ─────────────────────────────────────────────────────────────────

// ── EU Pay Transparency Page (Richtlinie 2023/970/EU) ────────────────────────
function TransparencyPage() {
  const lang = useLang();
  const [employees, setEmps] = React.useState([]);
  const [search, setSearch] = React.useState('');
  const [selected, setSelected] = React.useState('');
  const [doc, setDoc] = React.useState(null);
  const [loading, setL] = React.useState(false);
  const [err, setErr] = React.useState('');

  React.useEffect(() => {
    API.get('/api/wageband/transparency/list').then(data => setEmps(data)).catch(() => {});
  }, []);

  function loadDoc(erpId) {
    if (!erpId) { setDoc(null); return; }
    setL(true); setErr('');
    API.get('/api/wageband/transparency/' + erpId)
      .then(d => { setDoc(d); setL(false); })
      .catch(() => { setErr(lang==='EN'?'No band data found for this employee.':'Keine Banddaten für diesen Mitarbeiter gefunden.'); setL(false); setDoc(null); });
  }

  const fmt = v => v != null ? new Intl.NumberFormat('de-DE',{style:'currency',currency:'EUR',maximumFractionDigits:0}).format(v) : '\u2013';
  const fmtDate = s => s ? new Date(s).toLocaleDateString('de-DE') : '\u2013';

  const filtered = employees.filter(e => {
    const q = search.toLowerCase();
    return !q || (e.erp_id||'').includes(q) || (e.en_title||'').toLowerCase().includes(q) || (e.department_group||'').toLowerCase().includes(q) || (e.section||'').toLowerCase().includes(q);
  }).slice(0,150);

  const bandStatusColor = (s) => {
    if (!s) return '#888';
    if (s.includes('\u26a0')) return '#dc2626';
    if (s.includes('\u25b2')) return '#d97706';
    if (s.includes('\u2605')) return '#2E74B5';
    return '#16a34a';
  };

  const Row = (k,v) => /*#__PURE__*/React.createElement('tr', {key:k},
    /*#__PURE__*/React.createElement('td',{className:'print-td-label'},k),
    /*#__PURE__*/React.createElement('td',{className:'print-td-value'},v)
  );

  return /*#__PURE__*/React.createElement('div', null,
    /*#__PURE__*/React.createElement('div', {className:'page-header'},
      /*#__PURE__*/React.createElement('h2', null, lang==='EN'?'Pay Transparency \u2013 EU Directive 2023/970/EU':'Gehaltstransparenz \u2013 EU-Richtlinie 2023/970/EU'),
      /*#__PURE__*/React.createElement('p', null, lang==='EN'
        ?'Individual pay disclosure per employee (Art.\u00a07)  \u2013 Admin / HR only'
        :'Individuelle Gehaltsauskunft je Mitarbeiter (Art.\u00a07) \u2013 nur Admin / HR')
    ),
    /*#__PURE__*/React.createElement('div', {className:'card mb-6', id:'no-print'},
      /*#__PURE__*/React.createElement('div', {className:'card-title'}, lang==='EN'?'Select Employee':'Mitarbeiter ausw\u00e4hlen'),
      /*#__PURE__*/React.createElement('div', {className:'flex gap-3 items-center', style:{flexWrap:'wrap'}},
        /*#__PURE__*/React.createElement('input', {type:'text',
          placeholder:'\uD83D\uDD0D ERP-ID / Position / Abteilung\u2026',
          value:search, onChange:e=>setSearch(e.target.value), style:{width:280}}),
        /*#__PURE__*/React.createElement('select', {value:selected,
          onChange:e=>{ setSelected(e.target.value); loadDoc(e.target.value); }, style:{minWidth:340}},
          /*#__PURE__*/React.createElement('option',{value:''},'-- '+(lang==='EN'?'Select':'Ausw\u00e4hlen')+' --'),
          filtered.map(e=>/*#__PURE__*/React.createElement('option',{key:e.erp_id,value:e.erp_id},
            e.erp_id+' \u2013 '+(e.position_en||e.position_bg||'')+' ('+(e.department_en||e.department||'')+')'
          ))
        ),
        doc && /*#__PURE__*/React.createElement('button',{
          className:'btn', style:{background:'#1A2B3C',color:'#fff',border:'none',fontWeight:700},
          onClick:()=>window.print()},
          '\uD83D\uDDA8\uFE0F '+(lang==='EN'?'Print / Export PDF':'Drucken / PDF Export')
        )
      ),
      err && /*#__PURE__*/React.createElement('div',{className:'err-msg',style:{marginTop:12}},err)
    ),
    loading && /*#__PURE__*/React.createElement(Loading,null),
    doc && /*#__PURE__*/React.createElement('div', {id:'print-doc'},
      /*#__PURE__*/React.createElement('div', {className:'print-doc-header'},
        /*#__PURE__*/React.createElement('div', {className:'print-logo'},
          /*#__PURE__*/React.createElement('div',{style:{width:44,height:44,background:'#2E74B5',borderRadius:6,display:'flex',alignItems:'center',justifyContent:'center',fontWeight:900,fontSize:20,color:'#fff',flexShrink:0}},'G'),
          /*#__PURE__*/React.createElement('div',null,
            /*#__PURE__*/React.createElement('div',{style:{fontWeight:800,fontSize:16,color:'#1A2B3C'}},'GLATEC EOOD'),
            /*#__PURE__*/React.createElement('div',{style:{fontSize:11,color:'#5F6062'}},'Kostievo / Plovdiv, Bulgaria')
          )
        ),
        /*#__PURE__*/React.createElement('div',{style:{textAlign:'right'}},
          /*#__PURE__*/React.createElement('div',{style:{fontSize:11,color:'#5F6062'}},lang==='EN'?'Document date:':'Ausstellungsdatum:'),
          /*#__PURE__*/React.createElement('div',{style:{fontWeight:700,fontSize:13}}, fmtDate(doc.generated_date)),
          /*#__PURE__*/React.createElement('div',{style:{fontSize:10,color:'#8fa3b3',marginTop:2}},'Ref: EU Dir 2023/970/EU Art. 7')
        )
      ),
      /*#__PURE__*/React.createElement('div',{className:'print-doc-title'},
        lang==='EN'
          ?'Individual Pay Information \u2013 EU Pay Transparency Directive 2023/970/EU'
          :'Individuelle Gehaltsauskunft \u2013 EU-Lohntransparenz-Richtlinie 2023/970/EU'
      ),
      /*#__PURE__*/React.createElement('p',{style:{fontSize:12,color:'#5F6062',marginBottom:20,lineHeight:1.6}},
        lang==='EN'
          ?'This document is issued pursuant to Article\u00a07 of Directive (EU) 2023/970 on pay transparency and pay gap reporting. It sets out information about your individual pay level and comparable pay ranges within your job category.'
          :'Dieses Dokument wird gem\u00e4\u00df Artikel\u00a07 der Richtlinie (EU) 2023/970 zur Lohntransparenz ausgestellt. Es enth\u00e4lt Informationen \u00fcber Ihr pers\u00f6nliches Gehaltsniveau sowie die Verg\u00fctungsspannen in Ihrer Jobkategorie.'
      ),
      /*#__PURE__*/React.createElement('div',{className:'print-section-title'},'1. '+(lang==='EN'?'Employee Information':'Mitarbeiterinformationen')),
      /*#__PURE__*/React.createElement('table',{className:'print-table'},/*#__PURE__*/React.createElement('tbody',null,
        Row(lang==='EN'?'ERP-ID':'ERP-ID', doc.erp_id),
        Row(lang==='EN'?'Job Title':'Berufsbezeichnung', doc.position_en||doc.position_bg||'\u2013'),
        Row(lang==='EN'?'Department':'Abteilung', [doc.section,doc.department_group,doc.department_en||doc.department].filter(Boolean).join(' \u203a ')),
        Row(lang==='EN'?'Cost Centre':'Kostenstelle', doc.cost_center||'\u2013'),
        Row(lang==='EN'?'Entry Date':'Eintrittsdatum', fmtDate(doc.entry_date)),
        Row(lang==='EN'?'Tenure':'Betriebszugeh\u00f6rigkeit', doc.tenure_years!=null?doc.tenure_years+(lang==='EN'?' yrs':' J'):'\u2013'),
        Row('FTE', doc.fte!=null?doc.fte:'\u2013')
      )),
      /*#__PURE__*/React.createElement('div',{className:'print-section-title'},'2. '+(lang==='EN'?'Pay Band & Classification':'Lohnband & Einstufung')),
      /*#__PURE__*/React.createElement('table',{className:'print-table'},/*#__PURE__*/React.createElement('tbody',null,
        Row(lang==='EN'?'Band Code':'Bandcode',
          /*#__PURE__*/React.createElement('span',null,
            /*#__PURE__*/React.createElement('code',null,doc.band_code),
            /*#__PURE__*/React.createElement('span',{style:{fontSize:11,color:'#5F6062',marginLeft:10}},
              lang==='EN'?'(Section\u2013JobFamily\u2013Grade)':'(Sektion\u2013JobFamilie\u2013Stufe)'
            )
          )
        ),
        Row(lang==='EN'?'Surcharge Category':'Zuschlagskat.',
          /*#__PURE__*/React.createElement('span',null,
            doc.surcharge?'Cat. '+doc.surcharge:'\u2013',
            doc.surcharge&&/*#__PURE__*/React.createElement('span',{style:{fontSize:11,color:'#5F6062',marginLeft:10}},
              doc.surcharge==='A'?(lang==='EN'?'Standard rate \u2013 no additional supplement':'Basisentgelt \u2013 kein Zuschlag'):
              doc.surcharge==='B'?(lang==='EN'?'Shift supplement \u2013 shift work / extended hours':'Schichtzulage \u2013 Schichtarbeit / verl\u00e4ngerte Arbeitszeit'):
              doc.surcharge==='C'?(lang==='EN'?'Specialist supplement \u2013 specialist skills / hazardous conditions':'Fachkr\u00e4ftezulage \u2013 Spezialwissen / erschwerte Bedingungen'):''
            )
          )
        ),
        Row(lang==='EN'?'Minimum (net/month)':'Minimum (netto/Monat)', fmt(doc.min_net)),
        Row(lang==='EN'?'Target (net/month)':'Ziel (netto/Monat)', fmt(doc.target_net)),
        Row(lang==='EN'?'Maximum (net/month)':'Maximum (netto/Monat)', fmt(doc.max_net))
      )),
      /*#__PURE__*/React.createElement('div',{className:'print-section-title'},'3. '+(lang==='EN'?'Your Individual Pay':'Ihr Gehaltsniveau')),
      /*#__PURE__*/React.createElement('table',{className:'print-table'},/*#__PURE__*/React.createElement('tbody',null,
        Row(lang==='EN'?'Actual Net Salary':'Ist-Nettogehalt',
          /*#__PURE__*/React.createElement('strong',{style:{fontSize:15,color:'#1A2B3C'}},fmt(doc.actual_net))),
        Row(lang==='EN'?'Position in Band':'Position im Band',
          doc.band_pct!=null?doc.band_pct+'%\u00a0'+/*#__PURE__*/React.createElement('span',{style:{fontSize:11,color:'#888'}},'(0%=Min, 100%=Max)'):'\u2013'),
        Row(lang==='EN'?'Band Status':'Bandstatus',
          /*#__PURE__*/React.createElement('span',{style:{fontWeight:700,color:bandStatusColor(doc.band_position)}},doc.band_position||'\u2013'))
      )),
      /*#__PURE__*/React.createElement('div',{className:'print-section-title'},'4. '+(lang==='EN'?'Comparable Pay Data (Art. 7 para. 1 lit. b)':'Vergleichsdaten (Art. 7 Abs. 1 lit. b)')),
      /*#__PURE__*/React.createElement('p',{style:{fontSize:11,color:'#5F6062',marginBottom:8}},
        lang==='EN'
          ?'Average pay for employees in the same job category (band code + surcharge).'
          :'Durchschnittliche Verg\u00fctung f\u00fcr Besch\u00e4ftigte in derselben Jobkategorie (Bandcode + Zuschlag).'),
      /*#__PURE__*/React.createElement('table',{className:'print-table'},/*#__PURE__*/React.createElement('tbody',null,
        Row(lang==='EN'?'Comparable Positions':'Vergleichspositionen', doc.peer_count+(lang==='EN'?' employees':' Mitarbeitende')),
        Row(lang==='EN'?'Average Net':'\u00d8 Netto', fmt(doc.peer_avg_net)),
        Row(lang==='EN'?'Peer Range':'Spanne', doc.peer_min_net!=null?fmt(doc.peer_min_net)+' \u2013 '+fmt(doc.peer_max_net):'\u2013'),
        Row(lang==='EN'?'Gender Breakdown':'Geschlechterdifferenzierung',
          /*#__PURE__*/React.createElement('span',{style:{color:'#d97706',fontSize:11}},
            lang==='EN'?'\u26a0 Gender data not yet captured in HR system':'\u26a0 Geschlechtsdaten im HR-System noch nicht erfasst'))
      )),
      /*#__PURE__*/React.createElement('div',{className:'print-section-title'},'5. '+(lang==='EN'?'Pay Determination Criteria (Art. 5 & 9)':'Einstufungskriterien (Art. 5 & 9)')),
      /*#__PURE__*/React.createElement('p',{style:{fontSize:11,color:'#333',lineHeight:1.65}},
        lang==='EN'
          ?'Pay levels at GLATEC EOOD are determined by the following objective, gender-neutral criteria: (1)\u00a0Job category and band code as defined in the internal Wage Band Reference, based on scope of responsibility, required qualifications and complexity of tasks. (2)\u00a0Surcharge category (A/B/C) reflecting additional responsibilities, shift work or specialist functions. (3)\u00a0Individual performance and tenure, assessed annually in accordance with internal performance evaluation guidelines. (4)\u00a0Market benchmarks reviewed periodically against sector standards.'
          :'Die Geh\u00e4lter bei GLATEC EOOD werden nach folgenden objektiven, geschlechtsneutralen Kriterien festgelegt: (1)\u00a0Jobkategorie und Bandcode gem\u00e4\u00df internem Lohnband-Referenzwerk, basierend auf Verantwortungsbereich, erforderlichen Qualifikationen und Aufgabenkomplexit\u00e4t. (2)\u00a0Zuschlagskategorie (A/B/C) f\u00fcr zus\u00e4tzliche Verantwortung, Schichtarbeit oder Spezialfunktionen. (3)\u00a0Individuelle Leistung und Betriebszugeh\u00f6rigkeit, j\u00e4hrlich gem\u00e4\u00df internen Leistungsbeurteilungsrichtlinien bewertet. (4)\u00a0Marktvergleiche anhand periodischer Branchenstandards.'
      ),
      /*#__PURE__*/React.createElement('div',{className:'print-section-title'},'6. '+(lang==='EN'?'Legal Basis & Employee Rights':'Rechtsgrundlage & Arbeitnehmerrechte')),
      /*#__PURE__*/React.createElement('p',{style:{fontSize:11,color:'#333',lineHeight:1.65}},
        lang==='EN'
          ?'This disclosure is issued under Directive (EU) 2023/970 of the European Parliament and of the Council of 10\u00a0May\u00a02023. You have the right to receive this information annually upon request (Art.\u00a07). You have the right to equal pay without discrimination (Art.\u00a04). You may seek legal redress if you believe your pay right has been violated.'
          :'Diese Auskunft ergeht auf Grundlage der Richtlinie (EU) 2023/970 vom 10.\u00a0Mai\u00a02023. Sie haben das Recht, diese Auskunft j\u00e4hrlich auf Anfrage zu erhalten (Art.\u00a07). Sie haben Anspruch auf gleiches Entgelt ohne Diskriminierung (Art.\u00a04). Bei Verletzung Ihres Entgeltgleichheitsrechts steht Ihnen der Rechtsweg offen.'
      ),
      /*#__PURE__*/React.createElement('div',{className:'print-sig-row'},
        /*#__PURE__*/React.createElement('div',{className:'print-sig-box'},
          /*#__PURE__*/React.createElement('div',{className:'print-sig-line'}),
          /*#__PURE__*/React.createElement('div',{className:'print-sig-label'},lang==='EN'?'Employer Representative / Date':'Arbeitgebervertreter / Datum')
        ),
        /*#__PURE__*/React.createElement('div',{className:'print-sig-box'},
          /*#__PURE__*/React.createElement('div',{className:'print-sig-line'}),
          /*#__PURE__*/React.createElement('div',{className:'print-sig-label'},lang==='EN'?'Employee Acknowledgement / Date':'Kenntnisnahme Arbeitnehmer / Datum')
        )
      ),
      /*#__PURE__*/React.createElement('div',{style:{fontSize:10,color:'#aaa',textAlign:'center',marginTop:16,paddingTop:10,borderTop:'1px solid #e0e4e8'}},
        'GLATEC EOOD \u2013 Confidential \u2013 ',lang==='EN'?'Generated ':'Erstellt ',fmtDate(doc.generated_date),
        ' \u2013 EU Directive 2023/970/EU Art.\u00a07'
      )
    )
  );
}

const NAV_DEF = [
  {id:'dashboard', key:'dashboard', icon:'fa-gauge',     roles:['admin','manager','hr','payroll']},
  {id:'wageband',  key:'wageband',  icon:'fa-chart-bar', roles:['admin','hr','payroll','manager']},
  {id:'employees', key:'employees', icon:'fa-users',     roles:['admin','hr','payroll','manager']},
  {id:'payroll',   key:'payroll',   icon:'fa-euro-sign', roles:['admin','payroll','manager']},
  {id:'bands',     key:'bands',     icon:'fa-table',     roles:['admin','hr','payroll']},
  {id:'users',     key:'users',     icon:'fa-user-gear', roles:['admin']},
  {id:'transparency', key:'transparency', icon:'fa-scale-balanced', roles:['admin','hr']},
];
function App() {
  const [user, setUser] = useState(() => {
    try {
      const t = localStorage.getItem('g_token'),
        u = localStorage.getItem('g_user');
      return t && u ? JSON.parse(u) : null;
    } catch (e) {
      return null;
    }
  });
  const [page, setPage] = useState('dashboard');
  const [empFilter, setEmpFilter] = useState({status:'Active',newOnly:false});
  const goToEmployees = (filter) => { setEmpFilter(filter); setPage('employees'); };
  const [wbFilter, setWbFilter] = useState('');
  const goToWageband = (bandStatus) => { setWbFilter(bandStatus); setPage('wageband'); };
  const [collapsed, setCol] = useState(false);
  const [lang, setLang] = useState(() => localStorage.getItem('g_lang') || 'EN');
  const toggleLang = () => { const nl = lang === 'EN' ? 'BG' : 'EN'; localStorage.setItem('g_lang', nl); setLang(nl); };
  useEffect(() => {
    if (user) API.get('/api/auth/me').then(me => {
      setUser(me);
      localStorage.setItem('g_user', JSON.stringify(me));
    }).catch(() => handleLogout());
  }, []);
  function handleLogin(u) {
    localStorage.setItem('g_user', JSON.stringify(u));
    setUser(u);
  }
  function handleLogout() {
    localStorage.removeItem('g_token');
    localStorage.removeItem('g_user');
    setUser(null);
  }
  if (!user) return /*#__PURE__*/React.createElement(LoginPage, {
    onLogin: handleLogin
  });
  const initials = (user.full_name || user.username).split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();
  const pages = {
    dashboard: /*#__PURE__*/React.createElement(Dashboard, null),
    wageband: /*#__PURE__*/React.createElement(WageBandMonitor, null),
    employees: /*#__PURE__*/React.createElement(EmployeeList, null),
    payroll: /*#__PURE__*/React.createElement(PayrollBudget, null),
    bands: /*#__PURE__*/React.createElement(BandReferenz, null),
    users: /*#__PURE__*/React.createElement(Benutzer, null),
    transparency: /*#__PURE__*/React.createElement(TransparencyPage, null)
  };
  const nav = NAV_DEF.filter(n => n.roles.includes(user.role)).map(n => ({...n, label: t(lang, n.key)}));
  return /*#__PURE__*/React.createElement(LangCtx.Provider, {value: lang},
  /*#__PURE__*/React.createElement(NavCtx.Provider, {value: {goToEmployees, empFilter, goToWageband, wbFilter}},
  /*#__PURE__*/React.createElement(AuthCtx.Provider, {
    value: {
      user,
      setUser
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "app-shell"
  }, /*#__PURE__*/React.createElement("div", {
    className: `sidebar ${collapsed ? 'collapsed' : ''}`
  }, /*#__PURE__*/React.createElement("div", {
    className: "sidebar-header"
  }, /*#__PURE__*/React.createElement("div", {
    className: "logo-wrap"
  }, /*#__PURE__*/React.createElement("div", {
    className: "logo-icon"
  }, "G"), !collapsed && /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "logo-text"
  }, "Glatec HR"), /*#__PURE__*/React.createElement("div", {
    className: "logo-sub"
  }, "EOOD · Kostievo / Plovdiv")))), /*#__PURE__*/React.createElement("nav", {
    className: "sidebar-nav"
  }, !collapsed && /*#__PURE__*/React.createElement("div", {
    className: "nav-sec"
  }, "Navigation"), nav.map(n => /*#__PURE__*/React.createElement("div", {
    key: n.id,
    className: `nav-item ${page === n.id ? 'active' : ''}`,
    onClick: () => setPage(n.id)
  }, /*#__PURE__*/React.createElement("i", {
    className: `fa ${n.icon}`
  }), !collapsed && /*#__PURE__*/React.createElement("span", null, n.label)))), /*#__PURE__*/React.createElement("div", {
    className: "sidebar-footer"
  }, /*#__PURE__*/React.createElement("div", {
    className: "user-pill"
  }, /*#__PURE__*/React.createElement("div", {
    className: "user-avatar"
  }, initials), !collapsed && /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
    style: {
      overflow: 'hidden'
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "uname"
  }, user.full_name || user.username), /*#__PURE__*/React.createElement("div", {
    className: "urole"
  }, user.role)), /*#__PURE__*/React.createElement("button", {
    className: "logout-btn",
    onClick: handleLogout,
    title: "Abmelden"
  }, /*#__PURE__*/React.createElement("i", {
    className: "fa fa-right-from-bracket"
  })))))), /*#__PURE__*/React.createElement("div", {
    className: `main-content ${collapsed ? 'expanded' : ''}`
  }, /*#__PURE__*/React.createElement("div", {
    className: "topbar"
  }, /*#__PURE__*/React.createElement("div", {
    className: "topbar-left"
  }, /*#__PURE__*/React.createElement("button", {
    className: "toggle-btn",
    onClick: () => setCol(!collapsed)
  }, /*#__PURE__*/React.createElement("i", {
    className: "fa fa-bars"
  })), /*#__PURE__*/React.createElement("span", {
    className: "page-title"
  }, t(lang, page) || 'Glatec HR')), /*#__PURE__*/React.createElement("div", {
    className: "topbar-right"
  }, /*#__PURE__*/React.createElement("button", {
    onClick: toggleLang,
    className: 'lang-btn',
    style: {marginRight: 8, background: lang==='BG'?'#1A2B3C':undefined, color: lang==='BG'?'#fff':undefined, borderColor: lang==='BG'?'#1A2B3C':undefined}
  }, lang), /*#__PURE__*/React.createElement(RoleBadge, {
    role: user.role
  }), /*#__PURE__*/React.createElement("span", {
    style: {fontSize:12, color:'#888'}
  }, new Date().toLocaleDateString('de-CH')))), /*#__PURE__*/React.createElement("div", {
    className: "content-body"
  }, pages[page] || /*#__PURE__*/React.createElement(Dashboard, null)))))));
}
ReactDOM.createRoot(document.getElementById("root")).render(/*#__PURE__*/React.createElement(App, null));