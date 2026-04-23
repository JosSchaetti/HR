# COCKPIT.md — Glatec HR Platform
# Stand: April 2026 | Version 2.0

---

## Kontext & Ziel

Interne HR-Plattform für Glatec EOOD (Plovdiv, Bulgarien). Konsolidiert
Lohnbandmanagement, EU-Gehaltstransparenz, monatliche Lohnbeurteilung,
Mitarbeiterverwaltung und Qualifikationsmatrix in einer einzigen,
rollenbasierten Webanwendung.

**Stack:** FastAPI · SQLite · React 18 (Vanilla, kein Build-Step) · Python 3.10  
**Deployment:** Windows, lokal, Port 8000, Aufruf `start.bat`  
**Compliance:** EU Pay Transparency Directive 2023/970/EU Art. 7  
**Datenbasis:** 158 MA (151 aktiv) · 76 Lohnbänder · 152 Bandpositionen · 47 Arbeitszentren

---

## Modulübersicht

| # | Modul | Rolle(n) | Status |
|---|-------|----------|--------|
| 1 | Dashboard — KPIs, Verteilung, Kacheln | alle | ✅ vorhanden |
| 2 | Wage Band Monitor — 152 Positionen, Alerts | admin, hr, payroll, manager | ✅ vorhanden |
| 3 | Band Detail — Gehaltsdaten, Voucher, Total BGN | admin, hr, payroll | ✅ vorhanden |
| 4 | EU Pay Transparency — per-MA Disclosure | admin, hr | ✅ vorhanden |
| 5 | Employees — Stammdaten, Stats, Filter | alle | ✅ vorhanden |
| 6 | Payroll / Budget Control | admin, payroll, manager | ✅ vorhanden |
| 7 | Band Reference — alle Banddefinitionen | admin, hr, payroll | ✅ vorhanden |
| 8 | Monthly Review — Boni, Absenzen, Gehaltsanpassungen | alle ausser qs | ✅ vorhanden v2 |
| 9 | Qualifikationsmatrix — 83 MA × 47 Arbeitszentren | admin, hr, qs | ✅ vorhanden |
| 10 | User Management — RBAC, Audit-Log | admin | ✅ vorhanden |

---

## Projektstruktur

```
glatec-hr/
├── backend/
│   ├── main.py                     FastAPI App, CORS, SPA-Routing, Startup-Hook
│   ├── models.py                   SQLAlchemy ORM — 11 Tabellen
│   ├── database.py                 Engine + DB_OVERRIDE (CIFS-Workaround)
│   ├── auth.py                     JWT 8h · bcrypt · Rollen · Audit-Log
│   ├── glatec_hr.db                SQLite (nicht im Git-Repo)
│   └── routers/
│       ├── auth_router.py          POST /api/auth/login · GET /api/auth/me
│       ├── wageband_router.py      GET overview / detail / bands / transparency
│       ├── employees_router.py     GET / stats
│       ├── payroll_router.py       GET budget control
│       ├── review_router.py        CRUD + Workflow + /departments endpoint
│       ├── qual_router.py          Matrix · Entry · Coverage
│       └── users_router.py         User CRUD · Audit-Log
├── frontend/
│   ├── index.html                  SPA-Shell
│   ├── app.js                      ~2500 Zeilen React.createElement
│   └── lib/                        React 18 · ReactDOM · Font Awesome 6 (lokal/offline)
├── import_names.py                 MA + Lohndaten aus Excel → DB
├── import_absences.py              Absenzen → Monthly Review
├── import_qualifications.py        Qualifikationsmatrix aus Excel → DB
├── import_template.xlsx            Vorlage Sheet 1_Mitarbeiter + 2_Lohndaten
├── start.bat                       venv aktivieren + uvicorn starten
├── requirements.txt
├── CONCEPT.md                      Architekturdokumentation
├── COCKPIT.md                      dieses Dokument
└── .gitignore                      *.db, __pycache__, venv, .env
```

---

## Datenmodell

### Tabellen

| Tabelle | Inhalt | Zeilen |
|---------|--------|--------|
| `users` | Login, Rollen | 4 |
| `employees` | Stammdaten, employee_type, FTE | 158 |
| `wage_bands` | Banddefinitionen Min/Target/Max | 76 |
| `employee_band_positions` | MA ↔ Band ↔ actual_net | 152 |
| `salary_records` | Historische Lohndaten | 153 |
| `budget_control` | Abteilungsbudget vs. Ist | – |
| `monthly_reviews` | Review-Header (period, status) | – |
| `monthly_review_entries` | MA-Zeilen pro Review | – |
| `work_centers` | 47 Arbeitszentren (5 Gruppen) | 47 |
| `qualifications` | ERP × WC-Code → Level 1–4 | – |
| `audit_logs` | vollständiges Zugriffsprotokoll | – |

### Lohnband-Symbole

```
⚠  below_min     Gehalt < Minimum   (Trainees/Apprentices ausgenommen)
▲  below_target  Gehalt < Target
✓  on_target     Gehalt im Zielkorridor
★  above_target  Gehalt > Max
–  no_data       kein actual_net vorhanden
```

### Lohnbestandteile (alle MA)

| Bestandteil | BGN | EUR |
|-------------|-----|-----|
| Essensvoucher | 200 | ≈ 102 |
| Krankenversicherung | TBD | TBD |

Wechselkurs: 1.95583 BGN/EUR (fix seit 1999).

### employee_type

`Regular` | `Trainee` | `Apprentice`  
Trainees/Apprentices werden im ⚠-Alert der Dashboard-Kachel separat ausgewiesen (nicht im Hauptzähler).

---

## Rollen & Berechtigungen

| Modul | admin | hr | payroll | manager | qs |
|-------|:-----:|:--:|:-------:|:-------:|:--:|
| Dashboard | ✓ | ✓ | ✓ | ✓ | – |
| Wage Band Monitor | ✓ | ✓ | ✓ | ✓ | – |
| Band Detail | ✓ | ✓ | ✓ | – | – |
| EU Transparency | ✓ | ✓ | – | – | – |
| Employees | ✓ | ✓ | ✓ | ✓ | – |
| Payroll / Budget | ✓ | – | ✓ | ✓ | – |
| Band Reference | ✓ | ✓ | ✓ | – | – |
| Monthly Review | ✓ | ✓ | ✓ | ✓ | – |
| Qualifikationsmatrix | ✓ | ✓ | – | – | ✓ |
| User Management | ✓ | – | – | – | – |

### Monthly Review Workflow

```
draft   →  (Manager / HR / Payroll)  →  submitted
              ↓ bei Approve: salary_increase → actual_net
submitted  →  (HR / Admin)           →  approved
approved   →  (HR / Admin)           →  draft  [reopen]
```

---

## Monthly Review — Eingabespalten (analog Excel)

| Spalte | Typ | Beschreibung |
|--------|-----|--------------|
| Abs. Tage | Float | Absenz-Tage (K/U/OB/S) |
| Q% | Integer 0–100 | Qualitätsscore Attestation |
| **FIX+** | Float BGN | Permanente Gehaltserhöhung → `actual_net` bei Approval |
| **Einmal** | Float BGN | Einmalbonus |
| **Transpt.** | Float BGN | Transportzuschuss |
| **DPB** | Float BGN | Dept. Productivity / Anwesenheitsbonus |
| Gesamt | berechnet | actual_net + FIX+ + Einmal + Transpt. + DPB |
| Notiz | Text | Zabelezhka / Bemerkung |

DPB kann per Abteilung auf Klick massengesetzt werden (Button «DPB / Präsenz setzen»).

---

## Qualifikationsmatrix — Levels

| Level | Bedeutung | Farbe |
|-------|-----------|-------|
| blank | nicht bewertet | Grau |
| 1 | Keine Kenntnisse | Rot |
| 2 | Unter Aufsicht | Gelb |
| 3 | Selbstständig | Grün |
| 4 | Trainer / Expert | Blau |

5 Abteilungsgruppen: Injection Molding (6 WC) · Press (8 WC) · Assembly (13 WC) · Welding (3 WC) · Mechanical (17 WC)

---

## Import-Workflows

### Mitarbeiter + Lohndaten
```bash
python import_names.py import_template.xlsx
python import_names.py import_template.xlsx --dry-run
```
Sheet `1_Mitarbeiter`: erp_id · first_name · last_name · department_en · entry_date · fte · status · employee_type  
Sheet `2_Lohndaten`: erp_id · band_code · surcharge · actual_net

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
Erkennt Sheet `Qualification Matrix`, Row 3 (Gruppen), Row 4 (WC-Codes), Row 5 (Maschinen), ab Row 6 Mitarbeiter (Spalte D = ERP-ID).

---

## Deployment

```bat
REM start.bat
cd /d %~dp0
call venv\Scripts\activate
cd backend
uvicorn main:app --host 0.0.0.0 --port 8000 --reload
```

→ http://localhost:8000  
→ http://localhost:8000/api/docs  (Swagger)  
→ http://localhost:8000/check    (Diagnose-Seite)

### CIFS/Netzlaufwerk
SQLite-Journaling ist mit SMB-Locks inkompatibel.  
Dev-/Test-Workaround: `DB_OVERRIDE=/tmp/copy.db` (Environment-Variable in `database.py`).  
Produktivbetrieb: läuft lokal auf Windows — kein Problem.

---

## Git

**Remote:** https://github.com/JosSchaetti/HR.git  
**Branch:** main

```
.gitignore (wichtig):
  *.db          — keine Echtdaten im Repo
  __pycache__/
  *.pyc
  .env
  venv/
```

**Commit-Stand:**  
- Initiales Commit: April 2026 (30 Dateien, 4040 Insertions)  
- ⚠ Noch nicht gepusht: Monthly Review v2 · Qualifikationsmatrix · COCKPIT.md

---

## Offene Punkte

### 🔴 Hoch — sofort

- [ ] **Qualifikationsmatrix befüllen**  
  Excel `Qualification_Matrix_v02.xlsx` mit Levels 1–4 pro MA ausfüllen,  
  dann `python import_qualifications.py Qualification_Matrix_v02.xlsx`

- [ ] **KV-Betrag definieren**  
  Monatlicher BGN-Betrag der Zusatzkrankenversicherung festlegen.  
  Danach in `backend/routers/wageband_router.py` Zeile 12 anpassen:  
  `HEALTH_INS_BGN = <Betrag>`  
  → erscheint automatisch in EU Transparency + Band Detail + Monthly Review

### 🟡 Mittel

- [ ] **Monthly Review Export**  
  PDF oder Excel-Auszahlungsliste (Auszahlungsbetrag pro MA, pro Abteilung).  
  Analog dem Excel-Format: Name · Position · Grundgehalt · Boni · Gesamt.

- [ ] **QS-User anlegen**  
  User Management → Neuer User → Rolle `qs`  
  Bekommt Zugriff auf: Qualifikationsmatrix (lesen + schreiben)

- [ ] **Attestationsscores auswerten**  
  `quality_score`, `productivity_score`, `attitude_score` werden im Monthly Review
  erfasst aber noch nicht ausgewertet. Logik definieren: beeinflussen sie den
  Bonus-Anspruch? Aktuell nur zur Dokumentation.

- [ ] **Git push**  
  Aktuelle Änderungen committen und auf GitHub pushen:
  ```powershell
  git add -A
  git commit -m "feat: Monthly Review v2 + Qualifikationsmatrix + COCKPIT.md"
  git push origin main
  ```

### 🟢 Niedrig / Langfristig

- [ ] Backup-Routine für `glatec_hr.db` (täglich, Windows Task Scheduler)
- [ ] HTTPS + Passwort-Rotation für Produktiv-User
- [ ] Import-Template `import_template.xlsx` — employee_type Dropdown-Werte dokumentieren

---

## Standard-Zugangsdaten (Erststart — sofort ändern!)

| User | Rolle | Passwort |
|------|-------|----------|
| jos | admin | Admin2026 |
| maria | manager | Manager2026 |
| hr | hr | HR2026 |
| lohn | payroll | Payroll2026 |

---

## Versionshistorie

| Version | Datum | Änderungen |
|---------|-------|------------|
| 1.0 | Mrz 2026 | Grundstruktur: Dashboard, Wage Band, Employees, Payroll, Bands, Users, Transparency |
| 2.0 | Apr 2026 | Monthly Review v2 (Abt.-Navigation, 4 gelbe Spalten, DPB-Setter, Approval→actual_net), Qualifikationsmatrix (47 WC, 5 Gruppen, Level 1–4), Rolle `qs`, COCKPIT.md |

---

*Glatec EOOD · HR Platform · Jos Schätti · April 2026*
