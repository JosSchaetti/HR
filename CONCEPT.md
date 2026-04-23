# Glatec HR Platform — Konzept & Architekturdokumentation

**Version:** 2.0 | **Stand:** April 2026 | **Projekt:** `glatec-hr`  
**Technologie:** FastAPI · SQLite · React (Vanilla) | **Deployment:** Windows, lokal

---

## 1. Übersicht

Die Glatec HR Platform ist eine interne Webanwendung für Glatec EOOD (Bulgarien). Sie konsolidiert Lohnbandmanagement, EU-Gehaltstransparenz, monatliche Lohnbeurteilung, Mitarbeiterverwaltung und Qualifikationsmatrix in einer einzigen, rollenbasierten Oberfläche.

**Zielgruppe:** Managing Director, HR-Team, Lohnbuchhaltung, QS  
**Datenbasis:** 158 Mitarbeiter (151 aktiv), 76 Lohnbänder, 152 Bandpositionen, 47 Arbeitszentren  
**Compliance:** EU Pay Transparency Directive 2023/970/EU (Art. 7)

---

## 2. Technologie-Stack

| Schicht | Technologie | Details |
|---------|-------------|---------|
| Backend | FastAPI 0.110 | Python 3.10, uvicorn, ASGI |
| Datenbank | SQLite | Lokale Datei `glatec_hr.db` |
| ORM | SQLAlchemy 2.0 | Deklarative Modelle |
| Auth | JWT (python-jose) + bcrypt | 8h Token-Gültigkeit |
| Frontend | React 18 (Vanilla) | Kein Build-Step, Babel in-browser |
| Styling | Custom CSS | CSS Variables, kein Framework |
| Icons | Font Awesome 6 | Lokal (offline-fähig) |

---

## 3. Architektur

```
glatec-hr/
├── backend/
│   ├── main.py                 # FastAPI App, CORS, Static Files, SPA-Routing
│   ├── models.py               # SQLAlchemy ORM Modelle
│   ├── database.py             # Engine, Session, DB_OVERRIDE support
│   ├── auth.py                 # JWT, Rollen, Audit-Log
│   ├── glatec_hr.db            # SQLite Datenbank
│   └── routers/
│       ├── auth_router.py      # Login, /me
│       ├── employees_router.py # Mitarbeiter CRUD + Stats
│       ├── wageband_router.py  # Lohnband Overview/Detail/Transparency
│       ├── payroll_router.py   # Budget Control
│       ├── review_router.py    # Monthly Review Workflow
│       ├── qual_router.py      # Qualifikationsmatrix
│       └── users_router.py     # User Management
├── frontend/
│   ├── index.html              # Single-Page App Shell
│   ├── app.js                  # React-Komponenten (~2500 Zeilen)
│   └── lib/                    # React, ReactDOM, FontAwesome (lokal)
├── import_names.py             # Mitarbeiter + Lohndaten aus Excel
├── import_absences.py          # Absenzen aus Excel → Monthly Review
├── import_qualifications.py    # Qualifikationsmatrix aus Excel
├── import_template.xlsx        # Excel-Vorlage für Datenimport
├── start.bat                   # Backend starten (Windows)
└── requirements.txt
```

---

## 4. Datenmodell

### Kernentitäten

| Tabelle | Felder (Auswahl) | Zweck |
|---------|-----------------|-------|
| `users` | username, full_name, role, hashed_password | Login & RBAC |
| `employees` | erp_id, department_en, position_en, entry_date, fte, status, employee_type | Stammdaten |
| `wage_bands` | code, en_title, surcharge, min_net, target_net, max_net | Lohnband-Definitionen |
| `employee_band_positions` | erp_id, band_code, surcharge, actual_net, band_position | MA ↔ Band-Zuordnung |
| `salary_records` | erp_id, base_salary_gross, salary_netto, annual_employer_cost | Historische Lohndaten |
| `budget_control` | month, department, approved_monthly_budget, actual_payroll, variance | Budgetkontrolle |
| `monthly_reviews` | period, status, created/submitted/approved metadata | Review-Header |
| `monthly_review_entries` | erp_id, absence_days, salary_increase, one_time_bonus, transport, presence_bonus, quality_score | Review-Zeilen |
| `work_centers` | code, machine, dept_group | Arbeitszentren (47) |
| `qualifications` | erp_id, wc_code, level (1–4) | Qualifikationsstand |
| `audit_logs` | username, action, resource, timestamp, ip_address | Vollständiges Audit-Log |

### Lohnband-Logik

```
band_position Symbole:
  ⚠  below_min   — Gehalt < Minimum (ohne Trainees/Lehrlinge)
  ▲  below_target — Gehalt zwischen Min und Target
  ✓  on_target    — Gehalt zwischen Target und Max
  ★  above_target — Gehalt > Max
  –  no_data      — kein actual_net vorhanden
```

### Lohnbestandteile (alle Mitarbeiter)

| Bestandteil | Betrag | Hinweis |
|-------------|--------|---------|
| Essensvoucher | 200 BGN / ≈102 EUR | Monatlich, alle MA |
| Zusatzkrankenversicherung | TBD | In Planung |

---

## 5. Rollen & Berechtigungen

| Modul | admin | hr | payroll | manager | qs |
|-------|:-----:|:--:|:-------:|:-------:|:--:|
| Dashboard | ✓ | ✓ | ✓ | ✓ | – |
| Wage Band Monitor | ✓ | ✓ | ✓ | ✓ | – |
| Band Detail (Gehälter) | ✓ | ✓ | ✓ | – | – |
| EU Transparency | ✓ | ✓ | – | – | – |
| Mitarbeiter | ✓ | ✓ | ✓ | ✓ | – |
| Payroll / Budget | ✓ | – | ✓ | ✓ | – |
| Band Reference | ✓ | ✓ | ✓ | – | – |
| Monthly Review | ✓ | ✓ | ✓ | ✓ | – |
| Qualifikationsmatrix | ✓ | ✓ | – | – | ✓ |
| User Management | ✓ | – | – | – | – |

**Workflow Monthly Review:** draft → (Manager/HR) → submitted → (HR/Admin) → approved  
*Bei Approval: `salary_increase` wird automatisch auf `actual_net` in `employee_band_positions` angewendet.*

---

## 6. Module im Detail

### 6.1 Dashboard
- Kacheln: Total, Active/Inactive, Below Min (exkl. Trainees), Above Target
- Abschnitt Below Min Trainees separat ausgewiesen
- Diagramme: Bandverteilung, Band-Status pro Abteilung, Headcount nach KST/Abteilung

### 6.2 Wage Band Monitor
- Filterbares Grid aller 152 Bandpositionen
- Columns: ERP, Position, Band, Surcharge, Min/Target/Max/Actual Net, Band-Position, Voucher, KV, Total BGN
- Employee_type Trainee: ⚠-Badge ohne Alarm-Wertung

### 6.3 EU Pay Transparency (Directive 2023/970/EU Art. 7)
- Pro Mitarbeiter: Bandbereich, Bandposition %, Peer-Vergleich (Avg/Min/Max)
- Compensation Components: Netto + Voucher + KV + Total
- Nur HR + Admin

### 6.4 Monthly Review
- Abteilungsweise Navigation (Sidebar Links)
- Eingabespalten pro MA (gelb, analog Excel):
  - **FIX+** — permanente Gehaltserhöhung (→ actual_net bei Approval)
  - **Einmalbonus** — einmalige Zahlung
  - **Transport** — Transportzuschuss
  - **DPB / Präsenz** — Abteilungsbonus, massensetzbarer Button
- Attestationsscores: Qualität, Produktivität, Verhalten (0–100%)
- Absenztypen: K (Krankheit), U (Urlaub), OB (Ohne Bezahlung), S (Sonstiges)
- Computed: Gesamt-Auszahlungsbetrag
- Excel-Absenz-Import via `import_absences.py`

### 6.5 Qualifikationsmatrix
- Farbkodiertes Grid: 83 Mitarbeiter × 47 Arbeitszentren
  - 🔴 1 = Keine Kenntnisse | 🟡 2 = Beaufsichtigt | 🟢 3 = Selbstständig | 🔵 4 = Trainer
- Klick-Zyklus: leer → 1 → 2 → 3 → 4 → leer
- Filter nach Abteilungsgruppe: Injection Molding, Press, Assembly, Welding, Mechanical
- Coverage-Ansicht: Trainer-Warnung pro Arbeitsstation
- Sticky Header + Name-Spalte für Navigation
- Import via `import_qualifications.py`

---

## 7. Import-Workflows

### Mitarbeiter + Lohndaten
```bash
python import_names.py import_template.xlsx
python import_names.py import_template.xlsx --dry-run
```
Sheets: `1_Mitarbeiter` (ERP, Name, Dept, employee_type, ...) · `2_Lohndaten` (ERP, band_code, actual_net)

### Absenzen (Monthly Review)
```bash
python import_absences.py absenzen.xlsx --period 2026-05
python import_absences.py absenzen.xlsx --period 2026-05 --dry-run
```

### Qualifikationsmatrix
```bash
python import_qualifications.py Qualification_Matrix_v02.xlsx
python import_qualifications.py Qualification_Matrix_v02.xlsx --dry-run
```

---

## 8. Deployment

### Windows (Produktion)
```bat
start.bat   # Aktiviert venv, startet uvicorn auf Port 8000
```
→ Aufruf: `http://localhost:8000`

### Diagnose
→ `http://localhost:8000/check` — Datei-Status, React-Check, User-Count  
→ `http://localhost:8000/api/docs` — Swagger UI

### CIFS/Netzlaufwerk Besonderheit
SQLite-Journaling inkompatibel mit SMB-Locks.  
Workaround: `DB_OVERRIDE=/tmp/copy.db` Environment-Variable (nur für Tests/Dev).

---

## 9. Git-Repository

**Remote:** https://github.com/JosSchaetti/HR.git  
**Branch:** main  
**Initiales Commit:** April 2026 (30 Dateien, 4040 Insertions)

### .gitignore (wichtigste Einträge)
```
*.db        # Keine Echtdaten im Repo
__pycache__/
*.pyc
.env
venv/
```

---

## 10. Offene Punkte / Roadmap

| Priorität | Feature | Status |
|-----------|---------|--------|
| 🔴 Hoch | Qualifikationsmatrix mit Echtwerten befüllen (Excel → Import) | Offen |
| 🔴 Hoch | KV-Betrag (Krankenversicherung) definieren und eintragen | Offen |
| 🟡 Mittel | Monthly Review Export (PDF / Excel Auszahlungsliste) | Offen |
| 🟡 Mittel | QS-User anlegen (Rolle `qs`) | Offen |
| 🟡 Mittel | Attestationsscores im Review aktivieren (aktuell editierbar, nicht ausgewertet) | Offen |
| 🟢 Niedrig | Git push aktuelle Änderungen (Review-Redesign + QualMatrix) | Offen |
| 🟢 Niedrig | HTTPS / Passwort-Rotation für Produktiv-User | Langfristig |
| 🟢 Niedrig | Backup-Routine für glatec_hr.db | Langfristig |

---

## 11. Standard-Zugangsdaten (Erststart)

> ⚠️ Sofort nach Erststart ändern!

| User | Rolle | Passwort |
|------|-------|----------|
| jos | admin | Admin2026 |
| maria | manager | Manager2026 |
| hr | hr | HR2026 |
| lohn | payroll | Payroll2026 |
