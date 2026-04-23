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
    review: 'Monthly Review',
    qualmatrix: 'Qual. Matrix',
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
  const [wbTileFilter, setWbTileFilter] = useState(null);
  const [wbDetail, setWbDetail] = useState(null);
  const [wbDetailLoading, setWbDetailLoading] = useState(false);
  const handleWbTile = (key) => {
    if(wbTileFilter===key){setWbTileFilter(null);setWbDetail(null);return;}
    setWbTileFilter(key);
    if(key==='new'){
      setWbDetailLoading(true);
      API.get('/api/employees/?status=Active').then(data=>{
        const cutoff=new Date(); cutoff.setDate(cutoff.getDate()-180);
        setWbDetail(data.filter(e=>e.entry_date&&new Date(e.entry_date)>=cutoff).map(e=>({erp_id:e.erp_id,department_group:e.department,en_title:e.position_en||e.position_bg,band_code:null,min_net:null,target_net:null,max_net:null,actual_net:null,band_position:null,entry_date:e.entry_date})));
      }).finally(()=>setWbDetailLoading(false));
    } else {
      setWbDetailLoading(true);
      API.get('/api/wageband/detail').then(data=>setWbDetail(data)).finally(()=>setWbDetailLoading(false));
    }
  };
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
  }, /*#__PURE__*/React.createElement("h2", null, "Dashboard"), /*#__PURE__*/React.createElement("p", null, lang==='EN'?'Welcome, ':'Добре дошли, ', user.full_name, lang==='EN'?' \u2014 Glatec EOOD, Feb 2026':' \u2014 Glatec EOOD, \u0424\u0435\u0432. 2026')), /*#__PURE__*/React.createElement("div", {style:{display:'flex',flexDirection:'column',gap:14,marginBottom:22}},
  /*#__PURE__*/React.createElement("div", {className:"stat-grid"},
    /*#__PURE__*/React.createElement("div", {className:"stat-card blue",style:{cursor:'pointer'},onClick:()=>goToEmployees({status:'',newOnly:false})},
      /*#__PURE__*/React.createElement("div",{className:"stat-lbl"},lang==='EN'?'Total Employees':'Служители общо'),
      /*#__PURE__*/React.createElement("div",{className:"stat-val"},emp?.total??'–'),
      /*#__PURE__*/React.createElement("div",{className:"stat-sub text-muted"},lang==='EN'?'Click to view all':'→ Виж всички')
    ),
    /*#__PURE__*/React.createElement("div", {className:"stat-card green",style:{cursor:'pointer'},onClick:()=>goToEmployees({status:'Active',newOnly:false})},
      /*#__PURE__*/React.createElement("div",{className:"stat-lbl"},lang==='EN'?'Active':'Активни'),
      /*#__PURE__*/React.createElement("div",{className:"stat-val",style:{color:'#15803d'}},emp?.active??'–'),
      /*#__PURE__*/React.createElement("div",{className:"stat-sub text-muted"},lang==='EN'?'Click to view':'→ Виж')
    ),
    /*#__PURE__*/React.createElement("div", {className:"stat-card red",style:{cursor:'pointer'},onClick:()=>goToEmployees({status:'Inactive',newOnly:false})},
      /*#__PURE__*/React.createElement("div",{className:"stat-lbl"},lang==='EN'?'Inactive':'Неактивни'),
      /*#__PURE__*/React.createElement("div",{className:"stat-val",style:{color:'#dc2626'}},emp?.inactive??'–'),
      /*#__PURE__*/React.createElement("div",{className:"stat-sub text-muted"},lang==='EN'?'Click to view':'→ Виж')
    )
  ),
  /*#__PURE__*/React.createElement("div", {className:"stat-grid"},
    /*#__PURE__*/React.createElement("div", {className:"stat-card yellow",style:{cursor:'pointer',outline:wbTileFilter==='new'?'2px solid #b45309':'none',outlineOffset:2},onClick:()=>handleWbTile('new')},
      /*#__PURE__*/React.createElement("div",{className:"stat-lbl"},lang==='EN'?'New (6-month trial)':'Нови (6 мес. изп. срок)'),
      /*#__PURE__*/React.createElement("div",{className:"stat-val",style:{color:'#b45309'}},emp?.new_count??'–'),
      /*#__PURE__*/React.createElement("div",{className:"stat-sub text-muted"},lang==='EN'?'Click to view':'→ Виж')
    ),
    /*#__PURE__*/React.createElement("div", {className:"stat-card red",style:{cursor:'pointer',outline:wbTileFilter==='⚠ BELOW MIN'?'2px solid #dc2626':'none',outlineOffset:2},onClick:()=>handleWbTile('⚠ BELOW MIN')},
      /*#__PURE__*/React.createElement("div",{className:"stat-lbl"},"⚠ Below Min"),
      /*#__PURE__*/React.createElement("div",{className:"stat-val",style:{color:'#dc2626'}},s.below_min??'–'),
      /*#__PURE__*/React.createElement("div",{className:"stat-sub",style:{color:'#dc2626'}},lang==='EN'?'Urgent – contract check':'Спешно – проверка договор'),
      s.below_min_trainee>0&&/*#__PURE__*/React.createElement("div",{className:"stat-sub",style:{color:'#6b7280',fontSize:'0.7rem'}},'+',s.below_min_trainee,' Trainee',s.below_min_trainee>1?'s':'',lang==='EN'?' excl.':' изкл.')
    ),
    /*#__PURE__*/React.createElement("div", {className:"stat-card yellow",style:{cursor:'pointer',outline:wbTileFilter==='▲ Below Target'?'2px solid #d97706':'none',outlineOffset:2},onClick:()=>handleWbTile('▲ Below Target')},
      /*#__PURE__*/React.createElement("div",{className:"stat-lbl"},"▲ Below Target"),
      /*#__PURE__*/React.createElement("div",{className:"stat-val",style:{color:'#d97706'}},s.below_target??'–'),
      /*#__PURE__*/React.createElement("div",{className:"stat-sub text-muted"},lang==='EN'?'Development needed':'Нужно развитие')
    ),
    /*#__PURE__*/React.createElement("div", {className:"stat-card green",style:{cursor:'pointer',outline:wbTileFilter==='✓ On/Above Target'?'2px solid #16a34a':'none',outlineOffset:2},onClick:()=>handleWbTile('✓ On/Above Target')},
      /*#__PURE__*/React.createElement("div",{className:"stat-lbl"},"✓ On / Above Target"),
      /*#__PURE__*/React.createElement("div",{className:"stat-val",style:{color:'#16a34a'}},s.on_target??'–'),
      /*#__PURE__*/React.createElement("div",{className:"stat-sub",style:{color:'#16a34a'}},s.pct_on_target,"% ",lang==='EN'?'of workforce':'от персонала')
    ),
    /*#__PURE__*/React.createElement("div", {className:"stat-card blue",style:{cursor:'pointer',outline:wbTileFilter==='★ Above Max'?'2px solid #2E74B5':'none',outlineOffset:2},onClick:()=>handleWbTile('★ Above Max')},
      /*#__PURE__*/React.createElement("div",{className:"stat-lbl"},"★ Above Max"),
      /*#__PURE__*/React.createElement("div",{className:"stat-val",style:{color:'#2E74B5'}},s.above_max??'–'),
      /*#__PURE__*/React.createElement("div",{className:"stat-sub"},lang==='EN'?'Review recommended':'Препоръчителна проверка')
    )
  ),
  wbTileFilter&&/*#__PURE__*/React.createElement("div",{className:"card",style:{marginBottom:8}},
    /*#__PURE__*/React.createElement("div",{style:{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:10}},
      /*#__PURE__*/React.createElement("div",{className:"card-title",style:{margin:0}},
        wbTileFilter==='new'
          ?(lang==='EN'?'New Employees – Trial Period':'Нови служители – Изп. срок')
          :(lang==='EN'?'Filtered: ':'Филтър: ')+wbTileFilter,
        wbDetail&&' ('+( wbTileFilter==='new' ? wbDetail.length : wbDetail.filter(d=>(d.band_position||'')===wbTileFilter).length )+(lang==='EN'?' employees)':' служители)')
      ),
      /*#__PURE__*/React.createElement("button",{onClick:()=>{setWbTileFilter(null);setWbDetail(null);},style:{background:'none',border:'none',cursor:'pointer',fontSize:18,color:'#888',lineHeight:1}},'×')
    ),
    wbDetailLoading&&/*#__PURE__*/React.createElement("div",{style:{color:'#888',padding:'8px 0'}},lang==='EN'?'Loading...':'Зареждане...'),
    !wbDetailLoading&&wbDetail&&/*#__PURE__*/React.createElement("div",{className:"table-wrap"},
      /*#__PURE__*/React.createElement("table",null,
        /*#__PURE__*/React.createElement("thead",null,/*#__PURE__*/React.createElement("tr",null,
          /*#__PURE__*/React.createElement("th",null,"ERP-ID"),
          /*#__PURE__*/React.createElement("th",null,lang==='EN'?'Department':'Отдел'),
          /*#__PURE__*/React.createElement("th",null,lang==='EN'?'Title':'Длъжност'),
          wbTileFilter!=='new'&&/*#__PURE__*/React.createElement("th",null,"Band"),
          wbTileFilter!=='new'&&/*#__PURE__*/React.createElement("th",null,lang==='EN'?'Min':'Мин'),
          wbTileFilter!=='new'&&/*#__PURE__*/React.createElement("th",null,lang==='EN'?'Target':'Цел'),
          wbTileFilter!=='new'&&/*#__PURE__*/React.createElement("th",null,lang==='EN'?'Max':'Макс'),
          wbTileFilter!=='new'&&/*#__PURE__*/React.createElement("th",null,lang==='EN'?'Net (actual)':'Нето (факт)'),
          wbTileFilter!=='new'&&/*#__PURE__*/React.createElement("th",null,lang==='EN'?'Status':'Статус'),
          wbTileFilter==='new'&&/*#__PURE__*/React.createElement("th",null,lang==='EN'?'Entry Date':'Постъпване'),
          wbTileFilter==='new'&&/*#__PURE__*/React.createElement("th",null,lang==='EN'?'Type':'Тип')
        )),
        /*#__PURE__*/React.createElement("tbody",null,
          wbDetail.filter(d=>wbTileFilter==='new'?true:(d.band_position||'')===wbTileFilter).map((row,i)=>{
            const fc=!row.band_position?'#9ca3af':row.band_position.includes('⚠')?'#ef4444':row.band_position.includes('▲')?'#f59e0b':row.band_position.includes('★')?'#2E74B5':'#10b981';
            return /*#__PURE__*/React.createElement("tr",{key:i},
              /*#__PURE__*/React.createElement("td",{style:{fontFamily:'monospace',fontWeight:600}},row.erp_id),
              /*#__PURE__*/React.createElement("td",null,row.department_group||row.department),
              /*#__PURE__*/React.createElement("td",{style:{maxWidth:200,overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}},row.en_title||row.position_en||row.position_bg),
              wbTileFilter!=='new'&&/*#__PURE__*/React.createElement("td",null,/*#__PURE__*/React.createElement("code",null,row.band_code)),
              wbTileFilter!=='new'&&/*#__PURE__*/React.createElement("td",null,fmt(row.min_net)),
              wbTileFilter!=='new'&&/*#__PURE__*/React.createElement("td",null,fmt(row.target_net)),
              wbTileFilter!=='new'&&/*#__PURE__*/React.createElement("td",null,fmt(row.max_net)),
              wbTileFilter!=='new'&&/*#__PURE__*/React.createElement("td",{style:{fontWeight:600}},fmt(row.actual_net)),
              wbTileFilter!=='new'&&/*#__PURE__*/React.createElement("td",null,/*#__PURE__*/React.createElement("span",{style:{color:fc,fontWeight:600,fontSize:'0.75rem'}},row.band_position||'–')),
              wbTileFilter==='new'&&/*#__PURE__*/React.createElement("td",null,row.entry_date||'–'),
              wbTileFilter==='new'&&/*#__PURE__*/React.createElement("td",null,row.employee_type||'Regular')
            );
          })
        )
      )
    )
  ),
  ), /*#__PURE__*/React.createElement("div", {style:{display:'grid',gridTemplateColumns:'1fr 1fr',gap:20,marginBottom:24}},
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
      /*#__PURE__*/React.createElement('div',{className:'stat-lbl'},lang==='EN'?'Below Min':'Под минимум'),
      /*#__PURE__*/React.createElement('div',{className:'stat-sub',style:{color:'#dc2626'}},lang==='EN'?'Urgent \u2013 contract review':'\u0421\u043f\u0435\u0448\u043d\u043e \u2013 \u043f\u0440\u043e\u0432\u0435\u0440\u043a\u0430 \u0434\u043e\u0433\u043e\u0432\u043e\u0440'),
      filtered.filter(d=>d.band_position==='\u26a0 BELOW MIN'&&d.employee_type==='Trainee').length>0&&/*#__PURE__*/React.createElement('div',{className:'stat-sub',style:{color:'#6b7280',fontSize:'0.7rem'}},'+',filtered.filter(d=>d.band_position==='\u26a0 BELOW MIN'&&d.employee_type==='Trainee').length,' Trainee(s) excl.')
    ),
    /*#__PURE__*/React.createElement('div',{className:'stat-card yellow',
      style:{cursor:'pointer',outline:bandStatusF==='\u25b2 Below Target'?'2px solid #2E74B5':'none',outlineOffset:2},
      onClick:()=>setBandStatusF(bandStatusF==='\u25b2 Below Target'?'':'\u25b2 Below Target')},
      /*#__PURE__*/React.createElement('div',{className:'stat-val',style:{color:'#d97706'}},filtered.filter(d=>d.band_position==='\u25b2 Below Target').length),
      /*#__PURE__*/React.createElement('div',{className:'stat-lbl'},lang==='EN'?'Below Target':'Под целевото'),
      /*#__PURE__*/React.createElement('div',{className:'stat-sub'},lang==='EN'?'Development needed':'\u041d\u0443\u0436\u043d\u043e \u0440\u0430\u0437\u0432\u0438\u0442\u0438\u0435')
    ),
    /*#__PURE__*/React.createElement('div',{className:'stat-card green',
      style:{cursor:'pointer',outline:bandStatusF==='\u2713 On/Above Target'?'2px solid #2E74B5':'none',outlineOffset:2},
      onClick:()=>setBandStatusF(bandStatusF==='\u2713 On/Above Target'?'':'\u2713 On/Above Target')},
      /*#__PURE__*/React.createElement('div',{className:'stat-val',style:{color:'#16a34a'}},filtered.filter(d=>d.band_position==='\u2713 On/Above Target').length),
      /*#__PURE__*/React.createElement('div',{className:'stat-lbl'},lang==='EN'?'On / Above Target':'\u0412 / \u043d\u0430\u0434 \u0446\u0435\u043b\u0435\u0432\u043e\u0442\u043e'),
      /*#__PURE__*/React.createElement('div',{className:'stat-sub',style:{color:'#16a34a'}},Math.round(filtered.filter(d=>d.band_position==='\u2713 On/Above Target'||d.band_position==='\u2605 Above Max').length/(filtered.length||1)*100)+'%',lang==='EN'?' of filtered':' от показаното')
    ),
    /*#__PURE__*/React.createElement('div',{className:'stat-card blue',
      style:{cursor:'pointer',outline:bandStatusF==='\u2605 Above Max'?'2px solid #2E74B5':'none',outlineOffset:2},
      onClick:()=>setBandStatusF(bandStatusF==='\u2605 Above Max'?'':'\u2605 Above Max')},
      /*#__PURE__*/React.createElement('div',{className:'stat-val',style:{color:'#2E74B5'}},filtered.filter(d=>d.band_position==='\u2605 Above Max').length),
      /*#__PURE__*/React.createElement('div',{className:'stat-lbl'},lang==='EN'?'Above Max':'\u041d\u0430\u0434 \u043c\u0430\u043a\u0441\u0438\u043c\u0443\u043c'),
      /*#__PURE__*/React.createElement('div',{className:'stat-sub'},lang==='EN'?'Review recommended':'\u041f\u0440\u0435\u043f\u043e\u0440\u044a\u0447\u0438\u0442\u0435\u043b\u043d\u0430 \u043f\u0440\u043e\u0432\u0435\u0440\u043a\u0430')
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
    {label: lang==='EN' ? '<1 yr' : '<1 г.', max: 1},
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
      lang === 'EN' ? 'Tenure Distribution' : 'Разпределение по стаж',
      /*#__PURE__*/React.createElement("span", {style: {marginLeft: 16, fontSize: 13, color: '#059669', fontWeight: 700}},
        '∅ ', avg.toFixed(1), lang === 'EN' ? ' yrs' : ' г.'
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
        '∅ ', avg.toFixed(1), lang==='EN'?' yrs':' г.'
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
  const deptCol  = lang === 'EN' ? 'Department' : 'Отдел';
  const entryCol = lang === 'EN' ? 'Entry Date' : 'Дата постъпване';
  const statusLbl = s => lang === 'EN' ? (s === 'Active' ? 'Active' : 'Inactive') : (s === 'Active' ? 'Активен' : 'Неактивен');
  return /*#__PURE__*/React.createElement("div", null,
    /*#__PURE__*/React.createElement("div", {className: "page-header"},
      /*#__PURE__*/React.createElement("h2", null, lang === 'EN' ? 'Employee List' : '\u0421\u043f\u0438\u0441\u044a\u043a \u0441\u043b\u0443\u0436\u0438\u0442\u0435\u043b\u0438'),
      /*#__PURE__*/React.createElement("p", null, activeCount, lang === 'EN' ? ' active employees (anonymised)' : ' \u0430\u043a\u0442\u0438\u0432\u043d\u0438 \u0441\u043b\u0443\u0436\u0438\u0442\u0435\u043b\u0438 (\u0430\u043d\u043e\u043d\u0438\u043c\u0438\u0437\u0438\u0440\u0430\u043d\u0438)')
    ),
    /*#__PURE__*/React.createElement(TenureChart, {employees, lang}),
    /*#__PURE__*/React.createElement("div", {className: "card mb-6"},
      /*#__PURE__*/React.createElement("div", {className: "flex gap-3 items-center", style:{flexWrap:'wrap'}},
        /*#__PURE__*/React.createElement("input", {
          type: "text",
          placeholder: lang === 'EN' ? "\uD83D\uDD0D Department, Position, ERP-ID\u2026" : "\uD83D\uDD0D \u041e\u0442\u0434\u0435\u043b, \u0414\u043b\u044a\u0436\u043d\u043e\u0441\u0442, ERP-ID\u2026",
          value: filter, onChange: e => setF(e.target.value), style:{width:280}
        }),
        /*#__PURE__*/React.createElement("select", {value: statusF, onChange: e => setSF(e.target.value)},
          /*#__PURE__*/React.createElement("option", {value: ""}, lang==='EN'?'All':'Всички'),
          /*#__PURE__*/React.createElement("option", {value: "Active"}, lang==='EN'?'Active':'Активни'),
          /*#__PURE__*/React.createElement("option", {value: "Inactive"}, lang==='EN'?'Inactive':'Неактивни')
        ),
        /*#__PURE__*/React.createElement("button", {
          className: newOnly ? 'btn btn-blue' : 'btn btn-gray',
          onClick: () => setNewOnly(!newOnly)
        }, lang==='EN'?(newOnly?'\u2714 New only':'New only'):(newOnly?'\u2714 Nur Neue':'Nur Neue')),
        /*#__PURE__*/React.createElement("span", {className:"text-muted text-sm"}, filtered.length, lang==='EN'?' entries':' записа')
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
              /*#__PURE__*/React.createElement("th", null, lang==='EN'?'Cost Center':'Разх. център'),
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
  }, /*#__PURE__*/React.createElement("h2", null, lang==='EN'?'Payroll Budget Control':'\u041a\u043e\u043d\u0442\u0440\u043e\u043b \u0411\u044e\u0434\u0436\u0435\u0442 \u0417\u0430\u043f\u043b\u0430\u0442\u0438'), /*#__PURE__*/React.createElement("p", null, lang==='EN'?'Month 2 \xB7 ':'\u041c\u0435\u0441\u0435\u0446 2 \xB7 ', records.length, lang==='EN'?' Departments':' \u041e\u0442\u0434\u0435\u043b\u0430')), msg && /*#__PURE__*/React.createElement("div", {
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
  }, ['users', 'create', 'roles', 'audit'].map(tabKey => /*#__PURE__*/React.createElement("button", {
    key: tabKey,
    className: `btn ${tab === tabKey ? 'btn-blue' : 'btn-gray'}`,
    onClick: () => setTab(tabKey)
  }, tabKey==='users'?(lang==='EN'?'Users':'\u041f\u043e\u0442\u0440\u0435\u0431\u0438\u0442\u0435\u043b\u0438'):tabKey==='create'?(lang==='EN'?'+ New':'+ \u041d\u043e\u0432'):tabKey==='roles'?(lang==='EN'?'\u26f6 Permissions':'\u26f6 \u041f\u0440\u0430\u0432\u0430'):(lang==='EN'?'Audit Log':'\u041e\u0434\u0438\u0442 \u043b\u043e\u0433')))), tab === 'users' && /*#__PURE__*/React.createElement("div", {
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
  }, u.last_login ? new Date(u.last_login).toLocaleString('bg-BG') : (lang==='EN'?'Never':'Никога')), /*#__PURE__*/React.createElement("td", null, /*#__PURE__*/React.createElement("span", {
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
  }, [['username', lang==='EN'?'Username':'Потр. име', 'text'], ['full_name', lang==='EN'?'Full Name':'Пълно име', 'text'], ['password', lang==='EN'?'Password':'Парола', 'password']].map(([f, lbl, type]) => /*#__PURE__*/React.createElement("div", {
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
  }, lang==='EN'?'Payroll':'\u041b\u043e\u0436\u043d\u043e\u0441\u0442\u044c'), /*#__PURE__*/React.createElement("option", {
    value: "qs"
  }, lang==='EN'?'QM / Quality':'\u041a\u041c / \u041a\u0430\u0447\u0435\u0441\u0442\u0432\u043e'))), /*#__PURE__*/React.createElement("button", {
    className: "btn-primary",
    type: "submit"
  }, t(lang,'createUserBtn')))), tab === 'roles' && /*#__PURE__*/React.createElement("div", {className:"card"},
  /*#__PURE__*/React.createElement("div",{className:"card-title",style:{marginBottom:16}},lang==='EN'?'Role Permissions':'\u041f\u0440\u0430\u0432\u0430 \u043f\u043e \u0440\u043e\u043b\u0438'),
  /*#__PURE__*/React.createElement("div",{className:"table-wrap"},
    /*#__PURE__*/React.createElement("table",null,
      /*#__PURE__*/React.createElement("thead",null,/*#__PURE__*/React.createElement("tr",null,
        /*#__PURE__*/React.createElement("th",null,lang==='EN'?'Module':'\u041c\u043e\u0434\u0443\u043b'),
        ["ADMIN","MANAGER","HR","PAYROLL","QS"].map(r=>/*#__PURE__*/React.createElement("th",{key:r,style:{textAlign:'center'}},
          /*#__PURE__*/React.createElement(RoleBadge,{role:r.toLowerCase()})
        ))
      )),
      /*#__PURE__*/React.createElement("tbody",null,
        [
          {mod:lang==='EN'?'Dashboard':'\u0422\u0430\u0431\u043b\u043e',        roles:['admin','manager','hr','payroll','qs']},
          {mod:lang==='EN'?'Wage Band Monitor':'\u041c\u043e\u043d\u0438\u0442\u043e\u0440 \u0414\u0438\u0430\u043f\u0430\u0437\u043e\u043d\u0438', roles:['admin','hr','payroll','manager']},
          {mod:lang==='EN'?'Employees':'\u0421\u043b\u0443\u0436\u0438\u0442\u0435\u043b\u0438',   roles:['admin','hr','payroll','manager']},
          {mod:lang==='EN'?'Payroll / Budget':'\u041b\u043e\u0436\u043d\u043e\u0441\u0442 / \u0411\u044e\u0434\u0436\u0435\u0442',  roles:['admin','payroll','manager']},
          {mod:lang==='EN'?'Band Reference':'\u0421\u043f\u0440\u0430\u0432\u043e\u0447\u043d\u0438\u043a',   roles:['admin','hr','payroll']},
          {mod:lang==='EN'?'Pay Transparency':'\u041f\u0440\u043e\u0437\u0440\u0430\u0447\u043d\u043e\u0441\u0442', roles:['admin','hr']},
          {mod:lang==='EN'?'Monthly Review':'\u041c\u0435\u0441\u0435\u0447\u0435\u043d \u043f\u0440\u0435\u0433\u043b\u0435\u0434',  roles:['admin','hr','payroll','manager']},
          {mod:lang==='EN'?'Qual. Matrix':'\u041a\u0432\u0430\u043b. \u041c\u0430\u0442\u0440\u0438\u0446\u0430',   roles:['admin','hr','qs']},
          {mod:lang==='EN'?'User Management (\u2699 footer)':'\u0423\u043f\u0440\u0430\u0432\u043b\u0435\u043d\u0438\u0435 \u043f\u043e\u0442\u0440\u0435\u0431. (\u2699 \u0434\u043e\u043b\u0443)', roles:['admin']},
        ].map((row,i)=>/*#__PURE__*/React.createElement("tr",{key:i,style:{background:i%2===0?'#fafafa':'#fff'}},
          /*#__PURE__*/React.createElement("td",{style:{fontWeight:500}},row.mod),
          ["admin","manager","hr","payroll","qs"].map(r=>/*#__PURE__*/React.createElement("td",{key:r,style:{textAlign:'center',fontSize:16}},
            row.roles.includes(r)
              ?/*#__PURE__*/React.createElement("span",{style:{color:'#16a34a',fontWeight:700}},'✓')
              :/*#__PURE__*/React.createElement("span",{style:{color:'#e5e7eb'}},'–')
          ))
        ))
      )
    )
  ),
  /*#__PURE__*/React.createElement("div",{style:{marginTop:16,padding:'10px 14px',background:'#f0fdf4',borderRadius:8,fontSize:'0.82rem',color:'#15803d'}},
    /*#__PURE__*/React.createElement("strong",null,lang==='EN'?'Note: ':'\u0417\u0430\u0431\u0435\u043b\u0435\u0436\u043a\u0430: '),
    lang==='EN'
      ?'ADMIN has full access to all modules. Role permissions are enforced on both frontend navigation and backend API.'
      :'ADMIN \u0438\u043c\u0430 \u043f\u044a\u043b\u0435\u043d \u0434\u043e\u0441\u0442\u044a\u043f \u0434\u043e \u0432\u0441\u0438\u0447\u043a\u0438 \u043c\u043e\u0434\u0443\u043b\u0438. \u041f\u0440\u0430\u0432\u0430\u0442\u0430 \u0441\u0435 \u043f\u0440\u0438\u043b\u0430\u0433\u0430\u0442 \u0432 \u043d\u0430\u0432\u0438\u0433\u0430\u0446\u0438\u044f\u0442\u0430 \u0438 API.'
  )
),
tab === 'audit' && /*#__PURE__*/React.createElement("div", {
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
  }, l.timestamp ? new Date(l.timestamp).toLocaleString('bg-BG') : '–'), /*#__PURE__*/React.createElement("td", {
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
      .catch(() => { setErr(lang==='EN'?'No band data found for this employee.':'Няма данни за диапазон за този служител.'); setL(false); setDoc(null); });
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
      /*#__PURE__*/React.createElement('h2', null, lang==='EN'?'Pay Transparency \u2013 EU Directive 2023/970/EU':'\u041f\u0440\u043e\u0437\u0440\u0430\u0447\u043d\u043e\u0441\u0442 \u2013 EU \u0414\u0438\u0440\u0435\u043a\u0442\u0438\u0432\u0430 2023/970/EU'),
      /*#__PURE__*/React.createElement('p', null, lang==='EN'
        ?'Individual pay disclosure per employee (Art.\u00a07)  \u2013 Admin / HR only'
        :'\u0418\u043d\u0434\u0438\u0432\u0438\u0434\u0443\u0430\u043b\u043d\u0430 \u0437\u0430\u043f\u043b\u0430\u0442\u043d\u0430 \u0438\u043d\u0444\u043e\u0440\u043c\u0430\u0446\u0438\u044f (\u0447\u043b.\u00a07) \u2013 \u0421\u0430\u043c\u043e \u0410\u0434\u043c\u0438\u043d / HR')
    ),
    /*#__PURE__*/React.createElement('div', {className:'card mb-6', id:'no-print'},
      /*#__PURE__*/React.createElement('div', {className:'card-title'}, lang==='EN'?'Select Employee':'\u0418\u0437\u0431\u0435\u0440\u0435\u0442\u0435 \u0441\u043b\u0443\u0436\u0438\u0442\u0435\u043b'),
      /*#__PURE__*/React.createElement('div', {className:'flex gap-3 items-center', style:{flexWrap:'wrap'}},
        /*#__PURE__*/React.createElement('input', {type:'text',
          placeholder:'\uD83D\uDD0D ERP-ID / \u0414\u043b\u044a\u0436\u043d\u043e\u0441\u0442 / \u041e\u0442\u0434\u0435\u043b\u2026',
          value:search, onChange:e=>setSearch(e.target.value), style:{width:280}}),
        /*#__PURE__*/React.createElement('select', {value:selected,
          onChange:e=>{ setSelected(e.target.value); loadDoc(e.target.value); }, style:{minWidth:340}},
          /*#__PURE__*/React.createElement('option',{value:''},'-- '+(lang==='EN'?'Select':'\u0418\u0437\u0431\u0435\u0440\u0435\u0442\u0435')+' --'),
          filtered.map(e=>/*#__PURE__*/React.createElement('option',{key:e.erp_id,value:e.erp_id},
            e.erp_id+' \u2013 '+(e.position_en||e.position_bg||'')+' ('+(e.department_en||e.department||'')+')'
          ))
        ),
        doc && /*#__PURE__*/React.createElement('button',{
          className:'btn', style:{background:'#1A2B3C',color:'#fff',border:'none',fontWeight:700},
          onClick:()=>window.print()},
          '\uD83D\uDDA8\uFE0F '+(lang==='EN'?'Print / Export PDF':'Печат / PDF експорт')
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
          /*#__PURE__*/React.createElement('div',{style:{fontSize:11,color:'#5F6062'}},lang==='EN'?'Document date:':'Дата на документа:'),
          /*#__PURE__*/React.createElement('div',{style:{fontWeight:700,fontSize:13}}, fmtDate(doc.generated_date)),
          /*#__PURE__*/React.createElement('div',{style:{fontSize:10,color:'#8fa3b3',marginTop:2}},'Ref: EU Dir 2023/970/EU Art. 7')
        )
      ),
      /*#__PURE__*/React.createElement('div',{className:'print-doc-title'},
        lang==='EN'
          ?'Individual Pay Information \u2013 EU Pay Transparency Directive 2023/970/EU'
          :'\u0418\u043d\u0434\u0438\u0432\u0438\u0434\u0443\u0430\u043b\u043d\u0430 \u0437\u0430\u043f\u043b\u0430\u0442\u043d\u0430 \u0438\u043d\u0444\u043e\u0440\u043c\u0430\u0446\u0438\u044f \u2013 EU \u0414\u0438\u0440\u0435\u043a\u0442\u0438\u0432\u0430 2023/970/EU'
      ),
      /*#__PURE__*/React.createElement('p',{style:{fontSize:12,color:'#5F6062',marginBottom:20,lineHeight:1.6}},
        lang==='EN'
          ?'This document is issued pursuant to Article\u00a07 of Directive (EU) 2023/970 on pay transparency and pay gap reporting. It sets out information about your individual pay level and comparable pay ranges within your job category.'
          :'\u0422\u043e\u0437\u0438 \u0434\u043e\u043a\u0443\u043c\u0435\u043d\u0442 \u0435 \u0438\u0437\u0434\u0430\u0434\u0435\u043d \u0441\u044a\u0433\u043b\u0430\u0441\u043d\u043e \u0447\u043b.\u00a07 \u043e\u0442 \u0414\u0438\u0440\u0435\u043a\u0442\u0438\u0432\u0430 (EU) 2023/970 \u0437\u0430 \u043f\u0440\u043e\u0437\u0440\u0430\u0447\u043d\u043e\u0441\u0442 \u043d\u0430 \u0437\u0430\u043f\u043b\u0430\u0449\u0430\u043d\u0435\u0442\u043e.'
      ),
      /*#__PURE__*/React.createElement('div',{className:'print-section-title'},'1. '+(lang==='EN'?'Employee Information':'Информация за служителя')),
      /*#__PURE__*/React.createElement('table',{className:'print-table'},/*#__PURE__*/React.createElement('tbody',null,
        Row(lang==='EN'?'ERP-ID':'ERP-ID', doc.erp_id),
        Row(lang==='EN'?'Job Title':'Длъжност', doc.position_en||doc.position_bg||'\u2013'),
        Row(lang==='EN'?'Department':'Отдел', [doc.section,doc.department_group,doc.department_en||doc.department].filter(Boolean).join(' \u203a ')),
        Row(lang==='EN'?'Cost Centre':'Разх. център', doc.cost_center||'\u2013'),
        Row(lang==='EN'?'Entry Date':'Дата постъпване', fmtDate(doc.entry_date)),
        Row(lang==='EN'?'Tenure':'Betriebszugeh\u00f6rigkeit', doc.tenure_years!=null?doc.tenure_years+(lang==='EN'?' yrs':' г.'):'\u2013'),
        Row('FTE', doc.fte!=null?doc.fte:'\u2013')
      )),
      /*#__PURE__*/React.createElement('div',{className:'print-section-title'},'2. '+(lang==='EN'?'Pay Band & Classification':'Диапазон & Класификация')),
      /*#__PURE__*/React.createElement('table',{className:'print-table'},/*#__PURE__*/React.createElement('tbody',null,
        Row(lang==='EN'?'Band Code':'Код диапазон',
          /*#__PURE__*/React.createElement('span',null,
            /*#__PURE__*/React.createElement('code',null,doc.band_code),
            /*#__PURE__*/React.createElement('span',{style:{fontSize:11,color:'#5F6062',marginLeft:10}},
              lang==='EN'?'(Section\u2013JobFamily\u2013Grade)':'(\u0421\u0435\u043a\u0446\u0438\u044f\u2013\u0414\u043b\u044a\u0436\u043d\u043e\u0441\u0442\u043d\u0430 \u0444\u0430\u043c\u0438\u043b\u0438\u044f\u2013\u041d\u0438\u0432\u043e)'
            )
          )
        ),
        Row(lang==='EN'?'Surcharge Category':'Кат. надбавка',
          /*#__PURE__*/React.createElement('span',null,
            doc.surcharge?'Cat. '+doc.surcharge:'\u2013',
            doc.surcharge&&/*#__PURE__*/React.createElement('span',{style:{fontSize:11,color:'#5F6062',marginLeft:10}},
              doc.surcharge==='A'?(lang==='EN'?'Standard rate \u2013 no additional supplement':'\u0411\u0430\u0437\u043e\u0432\u043e \u2013 \u0431\u0435\u0437 \u043d\u0430\u0434\u0431\u0430\u0432\u043a\u0430'):
              doc.surcharge==='B'?(lang==='EN'?'Shift supplement \u2013 shift work / extended hours':'\u0421\u043c\u0435\u043d\u043d\u0430 \u043d\u0430\u0434\u0431\u0430\u0432\u043a\u0430 \u2013 \u0441\u043c\u0435\u043d\u0435\u043d \u0442\u0440\u0443\u0434'):
              doc.surcharge==='C'?(lang==='EN'?'Specialist supplement \u2013 specialist skills / hazardous conditions':'\u0421\u043f\u0435\u0446\u0438\u0430\u043b\u0438\u0441\u0442\u0438\u0447\u043d\u0430 \u043d\u0430\u0434\u0431\u0430\u0432\u043a\u0430 \u2013 \u0441\u043f\u0435\u0446\u0438\u0430\u043b\u043d\u0438 \u0443\u043c\u0435\u043d\u0438\u044f'):''
            )
          )
        ),
        Row(lang==='EN'?'Minimum (net/month)':'Минимум (нето/мес.)', fmt(doc.min_net)),
        Row(lang==='EN'?'Target (net/month)':'Цел (нето/мес.)', fmt(doc.target_net)),
        Row(lang==='EN'?'Maximum (net/month)':'Максимум (нето/мес.)', fmt(doc.max_net))
      )),
      /*#__PURE__*/React.createElement('div',{className:'print-section-title'},'3. '+(lang==='EN'?'Your Individual Pay':'Вашето ниво на заплащане')),
      /*#__PURE__*/React.createElement('table',{className:'print-table'},/*#__PURE__*/React.createElement('tbody',null,
        Row(lang==='EN'?'Actual Net Salary':'Фактическа нето заплата',
          /*#__PURE__*/React.createElement('strong',{style:{fontSize:15,color:'#1A2B3C'}},fmt(doc.actual_net))),
        Row(lang==='EN'?'Position in Band':'Позиция в диапазона',
          doc.band_pct!=null?doc.band_pct+'%\u00a0'+/*#__PURE__*/React.createElement('span',{style:{fontSize:11,color:'#888'}},'(0%=Min, 100%=Max)'):'\u2013'),
        Row(lang==='EN'?'Band Status':'Статус диапазон',
          /*#__PURE__*/React.createElement('span',{style:{fontWeight:700,color:bandStatusColor(doc.band_position)}},doc.band_position||'\u2013'))
      )),
      /*#__PURE__*/React.createElement('div',{className:'print-section-title'},'4. '+(lang==='EN'?'Comparable Pay Data (Art. 7 para. 1 lit. b)':'Сравнителни данни (Чл. 7 ал. 1 б. б)')),
      /*#__PURE__*/React.createElement('p',{style:{fontSize:11,color:'#5F6062',marginBottom:8}},
        lang==='EN'
          ?'Average pay for employees in the same job category (band code + surcharge).'
          :'Durchschnittliche Verg\u00fctung f\u00fcr Besch\u00e4ftigte in derselben Jobkategorie (Bandcode + Zuschlag).'),
      /*#__PURE__*/React.createElement('table',{className:'print-table'},/*#__PURE__*/React.createElement('tbody',null,
        Row(lang==='EN'?'Comparable Positions':'Сравнителни позиции', doc.peer_count+(lang==='EN'?' employees':' служители')),
        Row(lang==='EN'?'Average Net':'\u0421\u0440\u0435\u0434\u043d\u043e \u043d\u0435\u0442\u043e', fmt(doc.peer_avg_net)),
        Row(lang==='EN'?'Peer Range':'Диапазон', doc.peer_min_net!=null?fmt(doc.peer_min_net)+' \u2013 '+fmt(doc.peer_max_net):'\u2013'),
        Row(lang==='EN'?'Gender Breakdown':'Разпределение по пол',
          /*#__PURE__*/React.createElement('span',{style:{color:'#d97706',fontSize:11}},
            lang==='EN'?'\u26a0 Gender data not yet captured in HR system':'\u26a0 \u0414\u0430\u043d\u043d\u0438\u0442\u0435 \u0437\u0430 \u043f\u043e\u043b \u0432\u0441\u0435 \u043e\u0449\u0435 \u043d\u0435 \u0441\u0430 \u0432\u044a\u0432\u0435\u0434\u0435\u043d\u0438'))
      )),
      /*#__PURE__*/React.createElement('div',{className:'print-section-title'},'5. '+(lang==='EN'?'Pay Determination Criteria (Art. 5 & 9)':'Критерии за определяне (Чл. 5 & 9)')),
      /*#__PURE__*/React.createElement('p',{style:{fontSize:11,color:'#333',lineHeight:1.65}},
        lang==='EN'
          ?'Pay levels at GLATEC EOOD are determined by the following objective, gender-neutral criteria: (1)\u00a0Job category and band code as defined in the internal Wage Band Reference, based on scope of responsibility, required qualifications and complexity of tasks. (2)\u00a0Surcharge category (A/B/C) reflecting additional responsibilities, shift work or specialist functions. (3)\u00a0Individual performance and tenure, assessed annually in accordance with internal performance evaluation guidelines. (4)\u00a0Market benchmarks reviewed periodically against sector standards.'
          :'Die Geh\u00e4lter bei GLATEC EOOD werden nach folgenden objektiven, geschlechtsneutralen Kriterien festgelegt: (1)\u00a0Jobkategorie und Bandcode gem\u00e4\u00df internem Lohnband-Referenzwerk, basierend auf Verantwortungsbereich, erforderlichen Qualifikationen und Aufgabenkomplexit\u00e4t. (2)\u00a0Zuschlagskategorie (A/B/C) f\u00fcr zus\u00e4tzliche Verantwortung, Schichtarbeit oder Spezialfunktionen. (3)\u00a0Individuelle Leistung und Betriebszugeh\u00f6rigkeit, j\u00e4hrlich gem\u00e4\u00df internen Leistungsbeurteilungsrichtlinien bewertet. (4)\u00a0Marktvergleiche anhand periodischer Branchenstandards.'
      ),
      /*#__PURE__*/React.createElement('div',{className:'print-section-title'},'6. '+(lang==='EN'?'Legal Basis & Employee Rights':'Правна основа & Права на служителите')),
      /*#__PURE__*/React.createElement('p',{style:{fontSize:11,color:'#333',lineHeight:1.65}},
        lang==='EN'
          ?'This disclosure is issued under Directive (EU) 2023/970 of the European Parliament and of the Council of 10\u00a0May\u00a02023. You have the right to receive this information annually upon request (Art.\u00a07). You have the right to equal pay without discrimination (Art.\u00a04). You may seek legal redress if you believe your pay right has been violated.'
          :'Diese Auskunft ergeht auf Grundlage der Richtlinie (EU) 2023/970 vom 10.\u00a0Mai\u00a02023. Sie haben das Recht, diese Auskunft j\u00e4hrlich auf Anfrage zu erhalten (Art.\u00a07). Sie haben Anspruch auf gleiches Entgelt ohne Diskriminierung (Art.\u00a04). Bei Verletzung Ihres Entgeltgleichheitsrechts steht Ihnen der Rechtsweg offen.'
      ),
      /*#__PURE__*/React.createElement('div',{className:'print-section-title'},lang==='EN'?'Compensation Components':'Компоненти на възнаграждението'),
      /*#__PURE__*/React.createElement('table',{className:'print-table',style:{width:'100%',marginBottom:12}},
        /*#__PURE__*/React.createElement('tbody',null,
          /*#__PURE__*/React.createElement('tr',null,
            /*#__PURE__*/React.createElement('td',{className:'print-td-label'},lang==='EN'?'Net Salary':'Нето заплата'),
            /*#__PURE__*/React.createElement('td',{className:'print-td-value'},doc.actual_net?fmtCur(doc.actual_net)+' €':'–')
          ),
          /*#__PURE__*/React.createElement('tr',null,
            /*#__PURE__*/React.createElement('td',{className:'print-td-label'},lang==='EN'?'Food Voucher (monthly)':'Ваучери за храна (мес.)'),
            /*#__PURE__*/React.createElement('td',{className:'print-td-value'},doc.food_voucher_eur?fmtCur(doc.food_voucher_eur)+' € ('+doc.food_voucher_bgn+' BGN)':'–')
          ),
          /*#__PURE__*/React.createElement('tr',null,
            /*#__PURE__*/React.createElement('td',{className:'print-td-label'},lang==='EN'?'Additional Health Insurance':'Доп. здравно осигуряване'),
            /*#__PURE__*/React.createElement('td',{className:'print-td-value'},doc.health_ins_eur?fmtCur(doc.health_ins_eur)+' €':(doc.health_ins_note||'TBD'))
          ),
          doc.actual_net&&doc.food_voucher_eur&&/*#__PURE__*/React.createElement('tr',{style:{fontWeight:'bold',borderTop:'1px solid #e0e4e8'}},
            /*#__PURE__*/React.createElement('td',{className:'print-td-label'},lang==='EN'?'Total Compensation (net)':'Общо възнаграждение (нето)'),
            /*#__PURE__*/React.createElement('td',{className:'print-td-value'},fmtCur((doc.actual_net||0)+(doc.food_voucher_eur||0))+' €')
          )
        )
      ),
      /*#__PURE__*/React.createElement('div',{className:'print-sig-row'},
        /*#__PURE__*/React.createElement('div',{className:'print-sig-box'},
          /*#__PURE__*/React.createElement('div',{className:'print-sig-line'}),
          /*#__PURE__*/React.createElement('div',{className:'print-sig-label'},lang==='EN'?'Employer Representative / Date':'Представител на работодателя / Дата')
        ),
        /*#__PURE__*/React.createElement('div',{className:'print-sig-box'},
          /*#__PURE__*/React.createElement('div',{className:'print-sig-line'}),
          /*#__PURE__*/React.createElement('div',{className:'print-sig-label'},lang==='EN'?'Employee Acknowledgement / Date':'Потвърждение от служителя / Дата')
        )
      ),
      /*#__PURE__*/React.createElement('div',{style:{fontSize:10,color:'#aaa',textAlign:'center',marginTop:16,paddingTop:10,borderTop:'1px solid #e0e4e8'}},
        'GLATEC EOOD \u2013 Confidential \u2013 ',lang==='EN'?'Generated ':'Създадено ',fmtDate(doc.generated_date),
        ' \u2013 EU Directive 2023/970/EU Art.\u00a07'
      )
    )
  );
}


// ── Monthly Review ────────────────────────────────────────────────────────────
function MonthlyReview() {
  const lang = useLang();
  const {user} = useAuth();

  // list state
  const [reviews, setReviews] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [newPeriod, setNewPeriod] = React.useState('');
  const [saving, setSaving] = React.useState(false);

  // detail state
  const [selected, setSelected] = React.useState(null);   // review header
  const [departments, setDepts] = React.useState([]);      // [{department_en, employees:[...]}]
  const [activeDept, setActiveDept] = React.useState(null);
  const [edits, setEdits] = React.useState({});            // {erp_id: {field:val}}
  const [dirty, setDirty] = React.useState({});            // {erp_id: true}
  const [dpbPrompt, setDpbPrompt] = React.useState(false);
  const [dpbAmount, setDpbAmount] = React.useState('200');

  // analysis state
  const [listTab, setListTab] = React.useState('reviews'); // 'reviews' | 'analysis'
  const [analysisMonths, setAnalysisMonths] = React.useState(6);
  const [analysis, setAnalysis] = React.useState(null);
  const [analysisLoading, setAnalysisLoading] = React.useState(false);
  const [analysisDept, setAnalysisDept] = React.useState('');

  const loadAnalysis = (m) => {
    setAnalysisLoading(true);
    API.get('/api/review/salary-history?months='+(m||analysisMonths))
      .then(setAnalysis).catch(e=>alert(e.message)).finally(()=>setAnalysisLoading(false));
  };

  const fmt2 = n => n==null?'–':Number(n).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g,',');

  const canEdit    = selected && selected.status !== 'approved' && ['admin','hr','payroll','manager'].includes(user.role);
  const canSubmit  = selected && selected.status === 'draft'    && ['admin','hr','payroll','manager'].includes(user.role);
  const canApprove = selected && selected.status === 'submitted'&& ['admin','hr'].includes(user.role);
  const canReopen  = selected && selected.status !== 'draft'    && ['admin','hr'].includes(user.role);

  const fmtPeriod = (p) => {
    if (!p) return '';
    const [y,m] = p.split('-');
    return ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'][parseInt(m)-1]+' '+y;
  };
  const statusBadge = (s) => {
    const cfg={draft:{cls:'badge-admin',lbl:'Draft'},submitted:{cls:'badge-manager',lbl:'Submitted'},approved:{cls:'badge-hr',lbl:'Approved'}};
    const c=cfg[s]||{cls:'badge-admin',lbl:s};
    return React.createElement('span',{className:`badge ${c.cls}`},c.lbl);
  };

  const loadList = () => API.get('/api/review/').then(setReviews).finally(()=>setLoading(false));

  const loadDetail = async (id) => {
    const [rev, depts] = await Promise.all([
      API.get(`/api/review/${id}`),
      API.get(`/api/review/${id}/departments`)
    ]);
    setSelected(rev);
    setDepts(depts);
    setActiveDept(depts.length > 0 ? depts[0].department_en : null);
    setEdits({});
    setDirty({});
  };

  const reloadDepts = async () => {
    if (!selected) return;
    const depts = await API.get(`/api/review/${selected.id}/departments`);
    setDepts(depts);
  };

  React.useEffect(()=>{ loadList(); },[]);

  const createReview = async () => {
    if (!newPeriod.match(/^\d{4}-\d{2}$/)) { alert(lang==='EN'?'Format: YYYY-MM (e.g. 2026-05)':'Формат: YYYY-MM (напр. 2026-05)'); return; }
    setSaving(true);
    try {
      const r = await API.post('/api/review/', {period: newPeriod});
      setNewPeriod('');
      await loadList();
      await loadDetail(r.id);
    } catch(e) { alert(e.message||'Error'); }
    finally { setSaving(false); }
  };

  const gv = (erp_id, field, emp) => {
    if (edits[erp_id] && edits[erp_id][field] !== undefined) return edits[erp_id][field];
    return emp[field] !== undefined ? emp[field] : '';
  };

  const se = (erp_id, field, val) => {
    setEdits(p=>({...p,[erp_id]:{...(p[erp_id]||{}),[field]:val}}));
    setDirty(p=>({...p,[erp_id]:true}));
  };

  const buildPayload = (emp) => {
    const e = edits[emp.erp_id]||{};
    const g = (f,def=0) => { const v=e[f]!==undefined?e[f]:emp[f]; return parseFloat(v)||def; };
    const gs = (f) => { const v=e[f]!==undefined?e[f]:emp[f]; return v||null; };
    return {
      erp_id:             emp.erp_id,
      absence_days:       g('absence_days'),
      absence_type:       gs('absence_type'),
      quality_score:      g('quality_score',100),
      productivity_score: g('productivity_score',100),
      attitude_score:     g('attitude_score',100),
      salary_increase:    g('salary_increase'),
      one_time_bonus:     g('one_time_bonus'),
      transport:          g('transport'),
      presence_bonus:     g('presence_bonus'),
      suggestion:         gs('suggestion'),
    };
  };

  const saveRow = async (emp) => {
    await API.put(`/api/review/${selected.id}/entry`, buildPayload(emp));
    setDirty(p=>{const n={...p}; delete n[emp.erp_id]; return n;});
    setEdits(p=>{const n={...p}; delete n[emp.erp_id]; return n;});
    await reloadDepts();
  };

  const saveDept = async (dept) => {
    setSaving(true);
    try {
      for (const emp of dept.employees.filter(e=>dirty[e.erp_id])) {
        await saveRow(emp);
      }
    } catch(e){alert(e.message||'Error');}
    finally{setSaving(false);}
  };

  const applyDPB = async (dept) => {
    const amt = parseFloat(dpbAmount)||0;
    setSaving(true);
    try {
      for (const emp of dept.employees) {
        const abs = parseFloat(gv(emp.erp_id,'absence_days',emp))||0;
        const pl  = {...buildPayload(emp), presence_bonus: abs > 0 ? 0 : amt};
        await API.put(`/api/review/${selected.id}/entry`, pl);
      }
      setEdits({}); setDirty({});
      await reloadDepts();
    } catch(e){alert(e.message||'Error');}
    finally{setSaving(false); setDpbPrompt(false);}
  };

  const doAction = async (action) => {
    setSaving(true);
    try {
      const res = await API.post(`/api/review/${selected.id}/${action}`, {});
      if (action === 'approve' && res.salary_increases_applied > 0) {
        alert(lang==='EN'?`✓ Approved. ${res.salary_increases_applied} raise(s) applied.`:`✓ Одобрено. ${res.salary_increases_applied} увеличения приложени.`);
      }
      await loadList();
      const rev = await API.get(`/api/review/${selected.id}`);
      setSelected(rev);
    } catch(e){alert(e.message||'Error');}
    finally{setSaving(false);}
  };

  if (loading) return React.createElement(Loading,null);

  // ── DETAIL VIEW ──────────────────────────────────────────────────────────
  if (selected) {
    const totalEmp  = departments.reduce((s,d)=>s+d.total_employees,0);
    const totalAbs  = departments.reduce((s,d)=>s+(d.total_absence||0),0);
    const totalPay  = departments.reduce((s,d)=>s+(d.total_payout||0),0);
    const anyDirtyG = Object.keys(dirty).length > 0;

    const renderDeptPanel = (dept) => {
      if (!dept) return React.createElement('div',{className:'card',style:{padding:32,textAlign:'center',color:'#9ca3af'}},lang==='EN'?'Select a department on the left':'Изберете отдел отляво');
      const deptDirty = dept.employees.some(e=>dirty[e.erp_id]);

      // numeric input helper (yellow bg)
      const numIn = (erp, field, emp, w=55, step=50) =>
        React.createElement('input',{
          type:'number', min:0, step,
          value: gv(erp,field,emp),
          onChange: ev=>se(erp,field,ev.target.value),
          disabled: !canEdit,
          style:{width:w, textAlign:'right', fontSize:'0.73rem',
            background: canEdit?'#fffbeb':'transparent',
            border: canEdit?'1px solid #fde68a':'none',
            borderRadius:3, padding:'1px 3px'}
        });

      // small neutral input (grey bg)
      const neutIn = (erp, field, emp, w=44, step=1, max=9999) =>
        React.createElement('input',{
          type:'number', min:0, max, step,
          value: gv(erp,field,emp),
          onChange: ev=>se(erp,field,ev.target.value),
          disabled: !canEdit,
          style:{width:w, textAlign:'right', fontSize:'0.73rem',
            background: canEdit?'#fff':'transparent',
            border: canEdit?'1px solid #d1d5db':'none',
            borderRadius:3, padding:'1px 3px'}
        });

      return React.createElement('div', null,
        // dept header bar
        React.createElement('div',{style:{display:'flex',gap:10,alignItems:'center',marginBottom:10,flexWrap:'wrap'}},
          React.createElement('h3',{style:{margin:0,fontSize:'1rem',fontWeight:600}}, dept.department_en),
          React.createElement('span',{style:{color:'#6b7280',fontSize:'0.8rem'}}, dept.total_employees,' MA'),
          dept.total_absence>0 && React.createElement('span',{style:{color:'#dc2626',fontSize:'0.8rem'}},'\u26a0 ',dept.total_absence.toFixed(1),' Abs.'),
          canEdit && React.createElement('button',{className:'btn btn-secondary',style:{padding:'2px 10px',fontSize:12},
            onClick:()=>setDpbPrompt(p=>!p)
          },'DPB / Pr\u00e4senz setzen'),
          canEdit && deptDirty && React.createElement('button',{className:'btn btn-primary',style:{padding:'2px 10px',fontSize:12},
            disabled:saving, onClick:()=>saveDept(dept)
          }, saving?'\u29d7':'💾 Abt. speichern')
        ),
        // DPB prompt
        dpbPrompt && canEdit && React.createElement('div',{
          style:{background:'#fffbeb',border:'1px solid #fde68a',borderRadius:7,padding:'8px 12px',marginBottom:10,display:'flex',gap:8,alignItems:'center',flexWrap:'wrap'}
        },
          React.createElement('span',{style:{fontSize:13,fontWeight:500}},lang==='EN'?'DPB for all (no absence):':'DPB \u0437\u0430 \u0432\u0441\u0438\u0447\u043a\u0438 (\u0431\u0435\u0437 \u043e\u0442\u0441.):'),
          React.createElement('input',{type:'number',min:0,step:50,value:dpbAmount,onChange:e=>setDpbAmount(e.target.value),style:{width:72,textAlign:'right'}}),
          React.createElement('span',null,'BGN'),
          React.createElement('button',{className:'btn btn-primary',style:{padding:'2px 10px',fontSize:12},onClick:()=>applyDPB(dept)},'\u2713 Anwenden'),
          React.createElement('button',{className:'btn btn-secondary',style:{padding:'2px 8px',fontSize:12},onClick:()=>setDpbPrompt(false)},'\u2715')
        ),
        // table
        React.createElement('div',{style:{overflowX:'auto'}},
          React.createElement('table',{className:'data-table',style:{width:'100%',fontSize:'0.76rem',borderCollapse:'collapse'}},
            React.createElement('thead',null,
              React.createElement('tr',null,
                [
                  {h:'ERP',      align:'left'},
                  {h:'Name',     align:'left'},
                  {h:'Position', align:'left'},
                  {h:'Netto IST',align:'right'},
                  {h:'Abs.',     align:'right'},
                  {h:'Art',      align:'left'},
                  {h:'Q %',      align:'right'},
                  {h:'FIX+',     align:'right', yellow:true},
                  {h:lang==='EN'?'One-off':'\u0415\u0434\u043d\u043e\u043a\u0440.',   align:'right', yellow:true},
                  {h:'Transp.',  align:'right', yellow:true},
                  {h:'DPB',      align:'right', yellow:true},
                  {h:lang==='EN'?'Total':'\u041e\u0431\u0449\u043e',   align:'right', bold:true},
                  {h:lang==='EN'?'Note':'\u0411\u0435\u043b\u0435\u0436\u043a\u0430',    align:'left'},
                  {h:'',         align:'left'},
                ].map((col,i)=>React.createElement('th',{key:i,style:{
                  textAlign:col.align, fontSize:'0.71rem', padding:'4px 5px', whiteSpace:'nowrap',
                  background: col.yellow?'#fef9c3':undefined, color: col.yellow?'#92400e':undefined
                }},col.h))
              )
            ),
            React.createElement('tbody',null,
              dept.employees.map(emp=>{
                const isDirty  = !!dirty[emp.erp_id];
                const absV     = parseFloat(gv(emp.erp_id,'absence_days',emp))||0;
                const siV      = parseFloat(gv(emp.erp_id,'salary_increase',emp))||0;
                const obV      = parseFloat(gv(emp.erp_id,'one_time_bonus',emp))||0;
                const trV      = parseFloat(gv(emp.erp_id,'transport',emp))||0;
                const dpV      = parseFloat(gv(emp.erp_id,'presence_bonus',emp))||0;
                const gesamt   = (emp.actual_net||0) + siV + obV + trV + dpV;
                const name     = [emp.last_name, emp.first_name].filter(Boolean).join(' ')||'\u2013';
                const posShort = (emp.position_en||'\u2013').length>24?(emp.position_en||'').slice(0,22)+'\u2026':(emp.position_en||'\u2013');
                const rowBg    = isDirty?'#fffde7': absV>0?'#fef2f2':'transparent';

                return React.createElement('tr',{key:emp.erp_id,style:{background:rowBg}},
                  React.createElement('td',{style:{padding:'2px 5px'}},React.createElement('code',{style:{fontSize:'0.7rem'}},emp.erp_id)),
                  React.createElement('td',{style:{padding:'2px 5px',whiteSpace:'nowrap'}},name),
                  React.createElement('td',{style:{padding:'2px 5px',color:'#6b7280',fontSize:'0.72rem'}},posShort),
                  React.createElement('td',{style:{padding:'2px 5px',textAlign:'right',fontWeight:500}},
                    emp.actual_net?emp.actual_net.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g,','):'\u2013'),
                  // absence days
                  React.createElement('td',{style:{padding:'2px 4px',textAlign:'right'}},
                    neutIn(emp.erp_id,'absence_days',emp, 44, 0.5, 31)
                  ),
                  // absence type
                  React.createElement('td',{style:{padding:'2px 4px'}},
                    canEdit
                      ? React.createElement('select',{
                          value: gv(emp.erp_id,'absence_type',emp)||'',
                          onChange:e=>se(emp.erp_id,'absence_type',e.target.value),
                          style:{fontSize:'0.72rem',width:60}
                        },
                        [['','—'],['sick','K'],['vacation','U'],['unpaid','OB'],['other','S']].map(([v,l])=>
                          React.createElement('option',{key:v,value:v},l))
                        )
                      : React.createElement('span',null,gv(emp.erp_id,'absence_type',emp)||'\u2013')
                  ),
                  // quality %
                  React.createElement('td',{style:{padding:'2px 4px',textAlign:'right'}},
                    neutIn(emp.erp_id,'quality_score',emp, 40, 1, 100)
                  ),
                  // FIX+ salary increase (yellow)
                  React.createElement('td',{style:{padding:'2px 4px',textAlign:'right',background:'#fffbeb'}},
                    numIn(emp.erp_id,'salary_increase',emp, 55, 50)
                  ),
                  // one-time bonus (yellow)
                  React.createElement('td',{style:{padding:'2px 4px',textAlign:'right',background:'#fffbeb'}},
                    numIn(emp.erp_id,'one_time_bonus',emp, 60, 100)
                  ),
                  // transport (yellow)
                  React.createElement('td',{style:{padding:'2px 4px',textAlign:'right',background:'#fffbeb'}},
                    numIn(emp.erp_id,'transport',emp, 55, 50)
                  ),
                  // DPB (yellow)
                  React.createElement('td',{style:{padding:'2px 4px',textAlign:'right',background:'#fffbeb'}},
                    numIn(emp.erp_id,'presence_bonus',emp, 55, 100)
                  ),
                  // Gesamt (computed, read-only)
                  React.createElement('td',{style:{padding:'2px 5px',textAlign:'right',fontWeight:600,
                    color: (siV+obV+trV+dpV)>0?'#15803d':'#111'}},
                    gesamt>0?gesamt.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g,','):'\u2013'
                  ),
                  // suggestion / Notiz
                  React.createElement('td',{style:{padding:'2px 4px'}},
                    canEdit
                      ? React.createElement('input',{type:'text',placeholder:lang==='EN'?'Note\u2026':'\u0411\u0435\u043b\u0435\u0436\u043a\u0430\u2026',
                          value:gv(emp.erp_id,'suggestion',emp)||'',
                          onChange:e=>se(emp.erp_id,'suggestion',e.target.value),
                          style:{width:90,fontSize:'0.72rem'}
                        })
                      : React.createElement('span',{style:{color:'#6b7280',fontSize:'0.72rem'}},emp.suggestion||'')
                  ),
                  // per-row save
                  React.createElement('td',{style:{padding:'2px 4px'}},
                    isDirty && canEdit && React.createElement('button',{
                      className:'btn btn-primary', style:{padding:'1px 7px',fontSize:11},
                      disabled:saving,
                      onClick:async()=>{setSaving(true);try{await saveRow(emp);}catch(e){alert(e.message);}finally{setSaving(false);}}
                    },'\u2713')
                  )
                );
              })
            )
          )
        )
      );
    };

    return React.createElement('div',null,
      // page header
      React.createElement('div',{className:'page-header'},
        React.createElement('h2',null,'Monthly Review \u2014 ',fmtPeriod(selected.period)),
        React.createElement('p',null,
          statusBadge(selected.status),
          selected.submitted_by&&React.createElement('span',{className:'text-muted',style:{marginLeft:10}},'Submitted: ',selected.submitted_by),
          selected.approved_by&&React.createElement('span',{className:'text-muted',style:{marginLeft:10}},'\u2022 Approved: ',selected.approved_by)
        )
      ),
      // workflow buttons
      React.createElement('div',{style:{display:'flex',gap:10,marginBottom:14,flexWrap:'wrap',alignItems:'center'}},
        React.createElement('button',{className:'btn btn-secondary',onClick:()=>{setSelected(null);setDepts([]);loadList();}},' \u2190 Back'),
        canSubmit&&React.createElement('button',{className:'btn btn-primary',disabled:saving,onClick:()=>doAction('submit')},'\u2197 Submit for Approval'),
        canApprove&&React.createElement('button',{className:'btn btn-primary',style:{background:'#16a34a'},disabled:saving,onClick:()=>doAction('approve')},lang==='EN'?'\u2713 Approve & apply raises':'\u2713 \u041e\u0434\u043e\u0431\u0440\u0438 & \u043f\u0440\u0438\u043b\u043e\u0436\u0438 \u0443\u0432\u0435\u043b.'),
        canReopen&&React.createElement('button',{className:'btn btn-secondary',disabled:saving,onClick:()=>doAction('reopen')},'\u21ba Reopen to Draft'),
        anyDirtyG&&canEdit&&React.createElement('span',{style:{color:'#d97706',fontSize:'0.8rem',marginLeft:8}},lang==='EN'?'\u25cf Unsaved changes':'\u25cf \u041d\u0435\u0437\u0430\u043f\u0430\u0437\u0435\u043d\u0438 \u043f\u0440\u043e\u043c\u0435\u043d\u0438')
      ),
      // stat cards
      React.createElement('div',{className:'stat-grid',style:{marginBottom:14}},
        React.createElement('div',{className:'stat-card blue'},
          React.createElement('div',{className:'stat-lbl'},lang==='EN'?'Employees':'\u0421\u043b\u0443\u0436\u0438\u0442\u0435\u043b\u0438'),
          React.createElement('div',{className:'stat-val'},totalEmp)
        ),
        React.createElement('div',{className:'stat-card yellow'},
          React.createElement('div',{className:'stat-lbl'},lang==='EN'?'Total Payout':'\u041e\u0431\u0449\u043e \u0418\u0437\u043f\u043b\u0430\u0449\u0430\u043d\u0435'),
          React.createElement('div',{className:'stat-val',style:{color:'#d97706',fontSize:'1.05rem'}},
            totalPay.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g,','),' BGN')
        ),
        React.createElement('div',{className:'stat-card red'},
          React.createElement('div',{className:'stat-lbl'},lang==='EN'?'Abs. Days':'\u0414\u043d\u0438 \u043e\u0442\u0441.'),
          React.createElement('div',{className:'stat-val',style:{color:'#dc2626'}},totalAbs.toFixed(1))
        ),
        React.createElement('div',{className:'stat-card blue'},
          React.createElement('div',{className:'stat-lbl'},'Voucher / MA'),
          React.createElement('div',{className:'stat-val',style:{fontSize:'0.95rem'}},'200 BGN'),
          React.createElement('div',{className:'stat-sub'},'56 \u043b\u0432 | \u224828.64 \u20ac')
        )
      ),
      // two-panel layout
      React.createElement('div',{style:{display:'flex',gap:12,alignItems:'flex-start'}},
        // left sidebar
        React.createElement('div',{style:{width:190,flexShrink:0,background:'#f9fafb',border:'1px solid #e5e7eb',borderRadius:8,overflow:'hidden'}},
          React.createElement('div',{style:{padding:'7px 12px',fontWeight:600,fontSize:'0.72rem',color:'#6b7280',borderBottom:'1px solid #e5e7eb',textTransform:'uppercase',letterSpacing:'0.05em'}},lang==='EN'?'Departments':'\u041e\u0442\u0434\u0435\u043b\u0438'),
          departments.map(dept=>{
            const isActive = dept.department_en === activeDept;
            const hasDirty = dept.employees.some(e=>dirty[e.erp_id]);
            return React.createElement('div',{
              key:dept.department_en,
              onClick:()=>{setActiveDept(dept.department_en);setDpbPrompt(false);},
              style:{padding:'7px 12px',cursor:'pointer',
                background:isActive?'#dbeafe':'transparent',
                borderLeft:isActive?'3px solid #3b82f6':'3px solid transparent',
                borderBottom:'1px solid #f3f4f6'}
            },
              React.createElement('div',{style:{fontWeight:isActive?600:400,fontSize:'0.8rem',lineHeight:1.3}},dept.department_en),
              React.createElement('div',{style:{fontSize:'0.68rem',color:'#9ca3af',display:'flex',gap:5,marginTop:2}},
                React.createElement('span',null,dept.total_employees,' MA'),
                dept.total_absence>0&&React.createElement('span',{style:{color:'#ef4444'}},dept.total_absence.toFixed(1),' Abs'),
                hasDirty&&React.createElement('span',{style:{color:'#f59e0b'}},'\u25cf')
              )
            );
          })
        ),
        // right panel
        React.createElement('div',{style:{flex:1,minWidth:0}},
          renderDeptPanel(departments.find(d=>d.department_en===activeDept))
        )
      )
    );
  }

  return React.createElement('div',null,
    React.createElement('div',{className:'page-header'},
      React.createElement('h2',null,'Monthly Review'),
      React.createElement('p',null,lang==='EN'
        ?'Department payroll review \u2014 bonuses, absences & salary adjustments'
        :'\u041c\u0435\u0441\u0435\u0447\u0435\u043d п\u0440\u0435\u0433\u043b\u0435\u0434 \u2014 \u0431\u043e\u043d\u0443\u0441\u0438, \u043e\u0442\u0441\u044a\u0441\u0442\u0432\u0438\u044f & \u043f\u0440\u043e\u043c\u0435\u043d\u0438 \u0437\u0430\u043f\u043b\u0430\u0448\u0430\u043d\u0435')
    ),
    React.createElement('div',{style:{display:'flex',gap:8,marginBottom:16}},
      React.createElement('button',{className:'btn '+(listTab==='reviews'?'btn-primary':'btn-secondary'),onClick:()=>setListTab('reviews')},
        lang==='EN'?'\u2630 Reviews':'\u2630 \u041f\u0440\u0435\u0433\u043b\u0435\u0434\u0438'),
      React.createElement('button',{className:'btn '+(listTab==='analysis'?'btn-primary':'btn-secondary'),
        onClick:()=>{setListTab('analysis');if(!analysis)loadAnalysis(analysisMonths);}},
        lang==='EN'?'\u2197 Salary Analysis':'\u2197 \u0410\u043d\u0430\u043b\u0438\u0437 \u0437\u0430\u043f\u043b\u0430\u0448\u0430\u043d\u0435')
    ),

    listTab==='reviews'&&React.createElement(React.Fragment,null,
      ['admin','hr'].includes(user.role)&&React.createElement('div',{className:'card',style:{marginBottom:16}},
        React.createElement('div',{className:'card-title'},lang==='EN'?'New Review':'\u041d\u043e\u0432 \u043f\u0440\u0435\u0433\u043b\u0435\u0434'),
        React.createElement('div',{style:{display:'flex',gap:8,alignItems:'center'}},
          React.createElement('input',{type:'text',placeholder:lang==='EN'?'YYYY-MM (e.g. 2026-05)':'YYYY-MM (\u043d\u0430\u043f\u0440. 2026-05)',value:newPeriod,
            onChange:e=>setNewPeriod(e.target.value),style:{width:220},
            onKeyDown:e=>e.key==='Enter'&&createReview()}),
          React.createElement('button',{className:'btn btn-primary',disabled:saving||!newPeriod.trim(),onClick:createReview},
            lang==='EN'?'\u271a Create':'\u271a \u0421\u044a\u0437\u0434\u0430\u0439')
        )
      ),
      React.createElement('div',{className:'card'},
        reviews.length===0
          ?React.createElement('div',{style:{textAlign:'center',color:'#9ca3af',padding:'32px'}},
            lang==='EN'?'No reviews yet. Create one above.':'\u041d\u044f\u043c\u0430 \u043f\u0440\u0435\u0433\u043b\u0435\u0434\u0438. \u0421\u044a\u0437\u0434\u0430\u0439\u0442\u0435 \u043d\u043e\u0432.')
          :React.createElement('div',{className:'table-wrap'},
            React.createElement('table',null,
              React.createElement('thead',null,React.createElement('tr',null,
                React.createElement('th',null,lang==='EN'?'Period':'\u041f\u0435\u0440\u0438\u043e\u0434'),
                React.createElement('th',null,lang==='EN'?'Status':'\u0421\u0442\u0430\u0442\u0443\u0441'),
                React.createElement('th',{style:{textAlign:'right'}},lang==='EN'?'Employees':'\u0421\u043b\u0443\u0436.'),
                React.createElement('th',{style:{textAlign:'right'}},lang==='EN'?'Abs. Days':'\u0414\u043d\u0438 \u043e\u0442\u0441.'),
                React.createElement('th',{style:{textAlign:'right'}},lang==='EN'?'Salary +':'\u0417\u0430\u043f\u043b. +'),
                React.createElement('th',{style:{textAlign:'right'}},lang==='EN'?'Bonuses':'\u0411\u043e\u043d\u0443\u0441\u0438'),
                React.createElement('th',null,lang==='EN'?'Created by':'\u0421\u044a\u0437\u0434\u0430\u0434\u0435\u043d'),
                React.createElement('th',null,'')
              )),
              React.createElement('tbody',null,reviews.map(r=>
                React.createElement('tr',{key:r.id,style:{cursor:'pointer'},onClick:()=>loadDetail(r.id)},
                  React.createElement('td',null,React.createElement('strong',null,fmtPeriod(r.period))),
                  React.createElement('td',null,statusBadge(r.status)),
                  React.createElement('td',{style:{textAlign:'right'}},r.entry_count||0),
                  React.createElement('td',{style:{textAlign:'right'}},(r.absence_total||0).toFixed(1)),
                  React.createElement('td',{style:{textAlign:'right',color:r.salary_increase_total>0?'#16a34a':'#9ca3af'}},
                    r.salary_increase_total>0?'+'+fmt2(r.salary_increase_total)+' BGN':'\u2013'),
                  React.createElement('td',{style:{textAlign:'right'}},fmt2(r.bonus_total||0)+' BGN'),
                  React.createElement('td',null,r.created_by||'\u2013'),
                  React.createElement('td',null,React.createElement('span',{style:{color:'#2E74B5',fontWeight:600}},'\u2192'))
                )
              ))
            )
          )
      )
    ),

    listTab==='analysis'&&React.createElement(React.Fragment,null,
      React.createElement('div',{className:'card',style:{marginBottom:16}},
        React.createElement('div',{style:{display:'flex',gap:12,alignItems:'center',flexWrap:'wrap'}},
          React.createElement('div',{className:'card-title',style:{margin:0}},
            lang==='EN'?'Salary Increases':'\u041f\u043e\u0432\u0438\u0448\u0435\u043d\u0438\u044f \u043d\u0430 \u0437\u0430\u043f\u043b\u0430\u0448\u0430\u043d\u0435'),
          React.createElement('select',{value:analysisMonths,style:{width:160},
            onChange:e=>{const m=Number(e.target.value);setAnalysisMonths(m);loadAnalysis(m);}},
            [3,6,12,24].map(m=>React.createElement('option',{key:m,value:m},
              lang==='EN'?`Last ${m} months`:`\u041f\u043e\u0441\u043b\u0435\u0434\u043d\u0438 ${m} \u043c\u0435\u0441.`))),
          analysis&&React.createElement('select',{value:analysisDept,style:{width:200},
            onChange:e=>setAnalysisDept(e.target.value)},
            React.createElement('option',{value:''},lang==='EN'?'All departments':'\u0412\u0441\u0438\u0447\u043a\u0438 \u043e\u0442\u0434\u0435\u043b\u0438'),
            [...new Set((analysis.items||[]).map(i=>i.dept_group||i.department).filter(Boolean))].sort()
              .map(d=>React.createElement('option',{key:d,value:d},d))
          ),
          analysis&&React.createElement('span',{style:{fontSize:'0.85rem',color:'#6b7280'}},
            lang==='EN'
              ?`${analysis.employees_with_increase} employees received raises across ${analysis.approved_reviews} approved reviews`
              :`${analysis.employees_with_increase} \u0441\u043b\u0443\u0436\u0438\u0442\u0435\u043b\u0438 \u0441\u0430 \u043f\u043e\u043b\u0443\u0447\u0438\u043b\u0438 \u0443\u0432\u0435\u043b\u0438\u0447\u0435\u043d\u0438\u044f \u0432 ${analysis.approved_reviews} \u043e\u0434\u043e\u0431\u0440\u0435\u043d\u0438 \u043f\u0440\u0435\u0433\u043b\u0435\u0434\u0430`
          )
        )
      ),
      analysisLoading&&React.createElement('div',{style:{textAlign:'center',padding:32,color:'#6b7280'}},lang==='EN'?'Loading...':'\u0417\u0430\u0440\u0435\u0436\u0434\u0430\u043d\u0435...'),
      !analysisLoading&&analysis&&React.createElement('div',{className:'card'},
        analysis.items.length===0
          ?React.createElement('div',{style:{textAlign:'center',color:'#9ca3af',padding:32}},
            lang==='EN'?`No salary increases found in the last ${analysisMonths} months (approved reviews only).`
              :`\u041d\u044f\u043c\u0430 \u0443\u0432\u0435\u043b\u0438\u0447\u0435\u043d\u0438\u044f \u043f\u0440\u0435\u0437 \u043f\u043e\u0441\u043b\u0435\u0434\u043d\u0438\u0442\u0435 ${analysisMonths} \u043c\u0435\u0441.`)
          :React.createElement('div',{className:'table-wrap'},
            React.createElement('table',null,
              React.createElement('thead',null,React.createElement('tr',null,
                React.createElement('th',null,'ERP-ID'),
                React.createElement('th',null,lang==='EN'?'Department':'\u041e\u0442\u0434\u0435\u043b'),
                React.createElement('th',null,lang==='EN'?'Position':'\u0414\u043b\u044a\u0436\u043d\u043e\u0441\u0442'),
                React.createElement('th',{style:{textAlign:'right'}},lang==='EN'?'# Raises':'\u0411\u0440. \u0443\u0432\u0435\u043b.'),
                React.createElement('th',{style:{textAlign:'right'}},lang==='EN'?'Total +':'\u041e\u0431\u0449\u043e +'),
                React.createElement('th',null,lang==='EN'?'Last Raise':'\u041f\u043e\u0441\u043b\u0435\u0434\u043d\u043e \u0443\u0432\u0435\u043b.'),
                React.createElement('th',{style:{textAlign:'right'}},lang==='EN'?'Last Amount':'\u0421\u0443\u043c\u0430'),
                React.createElement('th',{style:{textAlign:'right'}},lang==='EN'?'Current Net':'\u0422\u0435\u043a. \u043d\u0435\u0442\u043e'),
                React.createElement('th',null,'Band'),
                React.createElement('th',null,lang==='EN'?'History':'\u0418\u0441\u0442\u043e\u0440\u0438\u044f')
              )),
              React.createElement('tbody',null,
                analysis.items
                  .filter(i=>!analysisDept||(i.dept_group||i.department)===analysisDept)
                  .map((row,i)=>React.createElement('tr',{key:i},
                    React.createElement('td',{style:{fontFamily:'monospace',fontWeight:600}},row.erp_id),
                    React.createElement('td',null,row.dept_group||row.department||'\u2013'),
                    React.createElement('td',{style:{maxWidth:160,overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}},row.position||'\u2013'),
                    React.createElement('td',{style:{textAlign:'right',fontWeight:600}},row.increases.length),
                    React.createElement('td',{style:{textAlign:'right',color:'#16a34a',fontWeight:600}},'+'+fmt2(row.total_increase)+' BGN'),
                    React.createElement('td',null,fmtPeriod(row.last_increase_period)),
                    React.createElement('td',{style:{textAlign:'right',color:'#16a34a'}},'+'+fmt2(row.last_increase_amount)+' BGN'),
                    React.createElement('td',{style:{textAlign:'right'}},row.actual_net!=null?fmt2(row.actual_net)+' BGN':'\u2013'),
                    React.createElement('td',null,row.band_code?React.createElement('code',null,row.band_code):'\u2013'),
                    React.createElement('td',null,
                      React.createElement('div',{style:{display:'flex',gap:4,flexWrap:'wrap'}},
                        row.increases.map((inc,j)=>React.createElement('span',{key:j,
                          style:{background:'#dcfce7',color:'#15803d',borderRadius:4,padding:'2px 6px',fontSize:'0.75rem',whiteSpace:'nowrap'}},
                          fmtPeriod(inc.period)+' +'+fmt2(inc.amount)))
                      )
                    )
                  ))
              )
            )
          )
      )
    )
  );
}







// ── Qualification Matrix ───────────────────────────────────────────────────────
function QualMatrix() {
  const {user} = useAuth();
  const [matrix, setMatrix]   = React.useState(null);
  const [loading, setLoading] = React.useState(true);
  const [deptFilter, setDeptFilter] = React.useState('');
  const [search, setSearch]   = React.useState('');
  const [saving, setSaving]   = React.useState({});  // {erp_id+wc: true}
  const [view, setView]       = React.useState('matrix'); // 'matrix' | 'coverage'
  const [coverage, setCoverage] = React.useState([]);

  const canEdit = ['admin','hr','qs'].includes(user.role);

  // Level config
  const LVL = {
    null: {bg:'#f3f4f6', color:'#9ca3af', label:'\u2013'},
    1:    {bg:'#fee2e2', color:'#dc2626', label:'1'},
    2:    {bg:'#fef9c3', color:'#ca8a04', label:'2'},
    3:    {bg:'#dcfce7', color:'#15803d', label:'3'},
    4:    {bg:'#bfdbfe', color:'#1d4ed8', label:'4'},
  };

  const loadMatrix = async (dg='') => {
    setLoading(true);
    try {
      const url = '/api/qualifications/matrix' + (dg?`?dept_group=${encodeURIComponent(dg)}`:'');
      const data = await API.get(url);
      setMatrix(data);
    } catch(e){alert(e.message);}
    finally{setLoading(false);}
  };

  const loadCoverage = async () => {
    try { setCoverage(await API.get('/api/qualifications/coverage')); }
    catch(e){alert(e.message);}
  };

  React.useEffect(()=>{ loadMatrix(deptFilter); },[deptFilter]);

  const setLevel = async (erp_id, wc_code, current) => {
    if (!canEdit) return;
    // cycle: null → 1 → 2 → 3 → 4 → null
    const seq = [null,1,2,3,4];
    const idx = seq.indexOf(current);
    const next = seq[(idx+1) % seq.length];
    const key = erp_id+'/'+wc_code;
    setSaving(p=>({...p,[key]:true}));
    try {
      await API.put('/api/qualifications/entry', {erp_id, wc_code, level: next});
      // Update local state immediately
      setMatrix(prev => {
        if (!prev) return prev;
        return {
          ...prev,
          employees: prev.employees.map(emp => {
            if (emp.erp_id !== erp_id) return emp;
            const newScores = {...emp.scores, [wc_code]: next};
            const vals = Object.values(newScores).filter(v=>v!==null);
            return {
              ...emp, scores: newScores,
              assessed: vals.length,
              ind_plus: vals.filter(v=>v>=3).length,
              trainer:  vals.filter(v=>v===4).length,
              pct:      prev.workcenters.length? Math.round(vals.length/prev.workcenters.length*100*10)/10 : 0
            };
          })
        };
      });
    } catch(e){alert(e.message);}
    finally{setSaving(p=>{const n={...p};delete n[key];return n;});}
  };

  if (loading) return React.createElement(Loading,null);
  if (!matrix) return React.createElement('div',null,'Fehler beim Laden');

  const filtered = matrix.employees.filter(emp =>
    !search || emp.name.toLowerCase().includes(search.toLowerCase()) ||
    emp.dept.toLowerCase().includes(search.toLowerCase())
  );

  const wcs = matrix.workcenters;

  // Group WCs by dept_group for header spans
  const wc_groups = [];
  let curr_grp = null, curr_start = 0;
  wcs.forEach((wc,i)=>{
    if (wc.dept_group !== curr_grp) {
      if (curr_grp) wc_groups.push({name:curr_grp, count:i-curr_start, start:curr_start});
      curr_grp = wc.dept_group; curr_start = i;
    }
    if (i===wcs.length-1) wc_groups.push({name:curr_grp, count:i-curr_start+1, start:curr_start});
  });

  const grpColors = {
    'Injection molding':'#eff6ff','Press':'#f0fdf4','Assembly':'#fefce8',
    'Welding':'#fff7ed','Mechanical':'#f5f3ff'
  };

  return React.createElement('div',null,
    React.createElement('div',{className:'page-header'},
      React.createElement('h2',null,'Qualification Matrix'),
      React.createElement('p',null,lang==='EN'?'Qualification levels 1\u20134 \u2014 ':'\u041a\u0432\u0430\u043b\u0438\u0444\u0438\u043a\u0430\u0446\u0438\u043e\u043d\u043d\u0438 \u043d\u0438\u0432\u0430 1\u20134 \u2014 ',
        React.createElement('span',{style:{color:'#dc2626',fontWeight:500}},lang==='EN'?'1 None':'1 \u041d\u044f\u043c\u0430'),
        '  ',
        React.createElement('span',{style:{color:'#ca8a04',fontWeight:500}},lang==='EN'?'2 Supervised':'2 Надзор'),
        '  ',
        React.createElement('span',{style:{color:'#15803d',fontWeight:500}},lang==='EN'?'3 Independent':'3 Самостоятелен'),
        '  ',
        React.createElement('span',{style:{color:'#1d4ed8',fontWeight:500}},'4 Trainer')
      )
    ),
    // toolbar
    React.createElement('div',{style:{display:'flex',gap:10,marginBottom:12,flexWrap:'wrap',alignItems:'center'}},
      React.createElement('select',{value:deptFilter,onChange:e=>setDeptFilter(e.target.value),style:{padding:'4px 8px',borderRadius:6,border:'1px solid #d1d5db'}},
        React.createElement('option',{value:''},lang==='EN'?'All Groups':'Всички групи'),
        (matrix.dept_groups||[]).map(g=>React.createElement('option',{key:g,value:g},g))
      ),
      React.createElement('input',{type:'text',placeholder:lang==='EN'?'Search name / dept…':'Търси име / отдел…',value:search,
        onChange:e=>setSearch(e.target.value),
        style:{padding:'4px 10px',borderRadius:6,border:'1px solid #d1d5db',width:200}}),
      React.createElement('div',{style:{marginLeft:'auto',display:'flex',gap:8}},
        React.createElement('button',{
          className:'btn '+(view==='matrix'?'btn-primary':'btn-secondary'),
          style:{padding:'3px 12px',fontSize:12}, onClick:()=>setView('matrix')
        },'Matrix'),
        React.createElement('button',{
          className:'btn '+(view==='coverage'?'btn-primary':'btn-secondary'),
          style:{padding:'3px 12px',fontSize:12},
          onClick:async()=>{await loadCoverage();setView('coverage');}
        },'Coverage')
      )
    ),
    // Legend note
    canEdit && React.createElement('div',{style:{marginBottom:8,fontSize:'0.75rem',color:'#6b7280'}},
      lang==='EN'?'✎ Click a cell to cycle level (empty → 1 → 2 → 3 → 4 → empty)':'✎ Клик върху клетка = циклично ниво (празно → 1 → 2 → 3 → 4 → празно)'
    ),

    // ── COVERAGE VIEW ──
    view==='coverage' && React.createElement('div',{className:'card'},
      React.createElement('table',{className:'data-table',style:{width:'100%',fontSize:'0.78rem'}},
        React.createElement('thead',null,
          React.createElement('tr',null,
            lang==='EN'?['Group','WC Code','Machine','Recorded','Lev 1','Lev 2','Lev 3 (Self)','Lev 4 (Trainer)','Has Trainer']:['\u0413\u0440\u0443\u043f\u0430','WC \u041a\u043e\u0434','\u041c\u0430\u0448\u0438\u043d\u0430','\u0417\u0430\u043f\u0438\u0441\u0430\u043d\u043e','\u041d\u0438\u0432 1','\u041d\u0438\u0432 2','\u041d\u0438\u0432 3 (\u0421\u0430\u043c\u043e)','\u041d\u0438\u0432 4 (\u0422\u0440\u0435\u0439\u043d\u044a\u0440)','\u0422\u0440\u0435\u0439\u043d\u044a\u0440'].map((h,i)=>
              React.createElement('th',{key:i},h))
          )
        ),
        React.createElement('tbody',null,
          coverage.map(wc=>
            React.createElement('tr',{key:wc.wc_code,style:{background: wc.trainer===0?'#fff7ed':'transparent'}},
              React.createElement('td',null,wc.dept_group),
              React.createElement('td',null,React.createElement('code',{style:{fontSize:'0.72rem'}},wc.wc_code)),
              React.createElement('td',null,wc.machine||'–'),
              React.createElement('td',{style:{textAlign:'right'}},wc.assessed),
              React.createElement('td',{style:{textAlign:'right',color:'#dc2626'}},wc.count_1||0),
              React.createElement('td',{style:{textAlign:'right',color:'#ca8a04'}},wc.count_2||0),
              React.createElement('td',{style:{textAlign:'right',color:'#15803d'}},wc.count_3||0),
              React.createElement('td',{style:{textAlign:'right',color:'#1d4ed8'}},wc.count_4||0),
              React.createElement('td',{style:{textAlign:'center'}},
                wc.trainer>0
                  ? React.createElement('span',{style:{color:'#15803d',fontWeight:600}},'\u2713 ',wc.trainer)
                  : React.createElement('span',{style:{color:'#dc2626'}},'\u26a0 Kein Trainer'))
            )
          )
        )
      )
    ),

    // ── MATRIX VIEW ──
    view==='matrix' && React.createElement('div',{style:{overflowX:'auto',overflowY:'auto',maxHeight:'72vh',border:'1px solid #e5e7eb',borderRadius:8}},
      React.createElement('table',{style:{borderCollapse:'collapse',fontSize:'0.72rem',whiteSpace:'nowrap'}},
        // Header row 1: dept group spans
        React.createElement('thead',null,
          React.createElement('tr',null,
            React.createElement('th',{colSpan:3,style:{padding:'4px 8px',background:'#f9fafb',position:'sticky',left:0,zIndex:3,borderBottom:'1px solid #e5e7eb'}},lang==='EN'?'Employee':'\u0421\u043b\u0443\u0436\u0438\u0442\u0435\u043b'),
            wc_groups.map(g=>
              React.createElement('th',{key:g.name,colSpan:g.count,style:{
                padding:'3px 6px',textAlign:'center',fontWeight:600,fontSize:'0.7rem',
                background:grpColors[g.name]||'#f9fafb',
                borderBottom:'1px solid #e5e7eb',borderLeft:'2px solid #d1d5db'
              }},g.name)
            ),
            React.createElement('th',{colSpan:4,style:{padding:'3px 6px',background:'#f0f9ff',borderLeft:'2px solid #d1d5db',textAlign:'center',fontSize:'0.7rem',fontWeight:600}},lang==='EN'?'Summary':'\u041e\u0431\u043e\u0431\u0449\u0435\u043d\u0438\u0435')
          ),
          // Header row 2: employee cols + WC codes + summary cols
          React.createElement('tr',null,
            (lang==='EN'?['Name','Dept.','Position']:['\u0418\u043c\u0435','\u041e\u0442\u0434.','\u041f\u043e\u0437\u0438\u0446\u0438\u044f']).map((h,i)=>
              React.createElement('th',{key:h,style:{
                padding:'4px 6px',textAlign:'left',fontSize:'0.7rem',
                background:'#f9fafb',position:'sticky',left:i===0?0:i===1?140:210,
                zIndex:2,borderBottom:'2px solid #e5e7eb',minWidth:i===0?140:i===1?70:100
              }},h)
            ),
            wcs.map((wc,i)=>{
              const isFirst = i===0 || wcs[i-1].dept_group!==wc.dept_group;
              return React.createElement('th',{key:wc.wc_code,style:{
                padding:'2px 4px',textAlign:'center',background:grpColors[wc.dept_group]||'#f9fafb',
                borderBottom:'2px solid #e5e7eb',
                borderLeft:isFirst?'2px solid #d1d5db':'1px solid #e5e7eb',
                fontSize:'0.65rem',maxWidth:38,overflow:'hidden',cursor:'default',
                writingMode:'vertical-rl',transform:'rotate(180deg)',height:60
              },title:wc.machine||wc.wc_code},
                wc.wc_code.replace('WC ',''))
            }),
            lang==='EN'?['Recorded','Self','Trainer','% Rec']:['\u0417\u0430\u043f\u0438\u0441\u0430\u043d\u043e','\u0421\u0430\u043c\u043e','\u0422\u0440\u0435\u0439\u043d\u044a\u0440','% \u0417\u0430\u043f.'].map(h=>
              React.createElement('th',{key:h,style:{
                padding:'3px 5px',background:'#f0f9ff',borderLeft:'2px solid #d1d5db',
                borderBottom:'2px solid #e5e7eb',fontSize:'0.68rem',textAlign:'center'
              }},h)
            )
          )
        ),
        // Body
        React.createElement('tbody',null,
          filtered.length===0&&React.createElement('tr',null,
            React.createElement('td',{colSpan:wcs.length+7,style:{textAlign:'center',color:'#9ca3af',padding:24}},lang==='EN'?'No employees':'\u041d\u044f\u043c\u0430 \u0441\u043b\u0443\u0436\u0438\u0442\u0435\u043b\u0438')
          ),
          filtered.map(emp=>
            React.createElement('tr',{key:emp.erp_id,style:{borderBottom:'1px solid #f3f4f6'}},
              React.createElement('td',{style:{padding:'2px 6px',position:'sticky',left:0,background:'#fff',zIndex:1,
                fontWeight:500,minWidth:140,borderRight:'1px solid #e5e7eb'}},
                emp.name||`ERP ${emp.erp_id}`),
              React.createElement('td',{style:{padding:'2px 6px',position:'sticky',left:140,background:'#fff',zIndex:1,
                color:'#6b7280',fontSize:'0.7rem',minWidth:70,borderRight:'1px solid #e5e7eb'}},
                (emp.dept||'').replace(' ','').slice(0,8)||'–'),
              React.createElement('td',{style:{padding:'2px 6px',position:'sticky',left:210,background:'#fff',zIndex:1,
                color:'#9ca3af',fontSize:'0.7rem',maxWidth:100,overflow:'hidden',borderRight:'1px solid #e5e7eb'}},
                (emp.position||'–').slice(0,15)),
              wcs.map((wc,i)=>{
                const lvl = emp.scores[wc.wc_code];
                const cfg = LVL[lvl]||LVL[null];
                const key = emp.erp_id+'/'+wc.wc_code;
                const isSaving = !!saving[key];
                const isFirst = i===0||wcs[i-1].dept_group!==wc.dept_group;
                return React.createElement('td',{
                  key:wc.wc_code,
                  onClick:()=>setLevel(emp.erp_id,wc.wc_code,lvl),
                  title:canEdit?lang==='EN'?`${emp.name} / ${wc.wc_code} → click to change`:`${emp.name} / ${wc.wc_code} → клик за промяна`:`Level ${lvl||'–'}`,
                  style:{
                    padding:0, textAlign:'center', width:30, minWidth:26,
                    background:isSaving?'#e0f2fe':cfg.bg,
                    color:cfg.color, fontWeight:600, fontSize:'0.72rem',
                    cursor:canEdit?'pointer':'default',
                    borderLeft:isFirst?'2px solid #d1d5db':'1px solid #e5e7eb',
                    transition:'background 0.15s'
                  }
                }, isSaving?'…':cfg.label);
              }),
              React.createElement('td',{style:{padding:'2px 5px',textAlign:'center',borderLeft:'2px solid #d1d5db',fontSize:'0.72rem'}},emp.assessed||0),
              React.createElement('td',{style:{padding:'2px 5px',textAlign:'center',color:'#15803d',fontWeight:600,fontSize:'0.72rem'}},emp.ind_plus||0),
              React.createElement('td',{style:{padding:'2px 5px',textAlign:'center',color:'#1d4ed8',fontWeight:600,fontSize:'0.72rem'}},emp.trainer||0),
              React.createElement('td',{style:{padding:'2px 5px',textAlign:'center',
                color:(emp.pct||0)>50?'#15803d':(emp.pct||0)>20?'#ca8a04':'#9ca3af',
                fontWeight:500,fontSize:'0.72rem'}},
                (emp.pct||0).toFixed(0),'%')
            )
          )
        )
      )
    )
  );
}


const NAV_DEF = [
  {id:'dashboard', key:'dashboard', icon:'fa-gauge',     roles:['admin','manager','hr','payroll','qs']},
  {id:'wageband',  key:'wageband',  icon:'fa-chart-bar', roles:['admin','hr','payroll','manager']},
  {id:'employees', key:'employees', icon:'fa-users',     roles:['admin','hr','payroll','manager']},
  {id:'payroll',   key:'payroll',   icon:'fa-euro-sign', roles:['admin','payroll','manager']},
  {id:'bands',     key:'bands',     icon:'fa-table',     roles:['admin','hr','payroll']},
  // users nav moved to footer
  {id:'transparency', key:'transparency', icon:'fa-scale-balanced', roles:['admin','hr']},
  {id:'review',   key:'review',   icon:'fa-clipboard-list',    roles:['admin','hr','payroll','manager']},
  {id:'qualmatrix',key:'qualmatrix',icon:'fa-table-cells',        roles:['admin','hr','qs']},
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
    transparency: /*#__PURE__*/React.createElement(TransparencyPage, null),
    review:      /*#__PURE__*/React.createElement(MonthlyReview, null),
    qualmatrix:  /*#__PURE__*/React.createElement(QualMatrix, null)
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
  }, user.role)), user.role==='admin'&&/*#__PURE__*/React.createElement("button", {
    className: "logout-btn",
    onClick: ()=>setPage('users'),
    title: lang==='EN'?'User Management':'\u0423\u043f\u0440\u0430\u0432\u043b\u0435\u043d\u0438\u0435 \u043f\u043e\u0442\u0440\u0435\u0431.',
    style: {marginRight:4}
  }, /*#__PURE__*/React.createElement("i", {
    className: "fa fa-user-gear"
  })),
  /*#__PURE__*/React.createElement("button", {
    className: "logout-btn",
    onClick: handleLogout,
    title: lang==='EN'?'Logout':'\u0418\u0437\u043b\u0435\u0437'
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
  }, new Date().toLocaleDateString('bg-BG')))), /*#__PURE__*/React.createElement("div", {
    className: "content-body"
  }, pages[page] || /*#__PURE__*/React.createElement(Dashboard, null)))))));
}
ReactDOM.createRoot(document.getElementById("root")).render(/*#__PURE__*/React.createElement(App, null));