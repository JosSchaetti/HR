from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse, HTMLResponse
import os

from database import engine, SessionLocal
import models

models.Base.metadata.create_all(bind=engine)

from routers.auth_router import router as auth_router
from routers.wageband_router import router as wageband_router
from routers.employees_router import router as employees_router
from routers.payroll_router import router as payroll_router
from routers.users_router import router as users_router

app = FastAPI(title="Glatec HR Platform", version="1.0.0", docs_url="/api/docs", redoc_url=None)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth_router)
app.include_router(wageband_router)
app.include_router(employees_router)
app.include_router(payroll_router)
app.include_router(users_router)

frontend_dir = os.path.normpath(
    os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "frontend")
)
index_html = os.path.join(frontend_dir, "index.html")


@app.on_event("startup")
def ensure_users():
    import auth as auth_module
    db = SessionLocal()
    try:
        if db.query(models.User).count() == 0:
            print("[startup] Keine User gefunden - lege Standard-User an...")
            defaults = [
                ("jos",   "Jos Schaetti",    "admin",   "Admin2026"),
                ("maria", "Maria",           "manager", "Manager2026"),
                ("hr",    "HR Team",         "hr",      "HR2026"),
                ("lohn",  "Lohnbuchhaltung", "payroll", "Payroll2026"),
            ]
            for uname, fname, role, pw in defaults:
                u = models.User(
                    username=uname, full_name=fname, role=role,
                    hashed_password=auth_module.hash_password(pw), is_active=True
                )
                db.add(u)
            db.commit()
            print("[startup] User angelegt: jos/Admin2026, maria/Manager2026, hr/HR2026, lohn/Payroll2026")
        else:
            print(f"[startup] {db.query(models.User).count()} User vorhanden - OK")
    except Exception as e:
        print(f"[startup] Fehler: {e}")
    finally:
        db.close()


@app.get("/")
def serve_root():
    return FileResponse(index_html)


# Diagnostic route BEFORE catch-all
@app.get("/check", response_class=HTMLResponse)
def check():
    lib = os.path.join(frontend_dir, "lib")
    rows = ""
    for fname in ["react.min.js", "react-dom.min.js", "fontawesome.min.css"]:
        p = os.path.join(lib, fname)
        exists = os.path.exists(p)
        size = (os.path.getsize(p) // 1024) if exists else 0
        st = str(size) + " KB" if exists else "FEHLT"
        rows += "<tr><td>" + fname + "</td><td>" + st + "</td></tr>"
    app_p = os.path.join(frontend_dir, "app.js")
    app_ok = str(os.path.getsize(app_p) // 1024) + " KB" if os.path.exists(app_p) else "FEHLT"
    rows += "<tr><td>app.js</td><td>" + app_ok + "</td></tr>"
    idx = "vorhanden" if os.path.exists(index_html) else "FEHLT"
    db2 = SessionLocal()
    ucnt = db2.query(models.User).count()
    db2.close()
    return (
        "<html><head><title>HR Check</title>"
        "<style>body{font-family:Arial;padding:30px}"
        "table{border-collapse:collapse}"
        "td,th{padding:8px 16px;border:1px solid #ddd}th{background:#eee}"
        "</style></head><body>"
        "<h2>Glatec HR Diagnose</h2>"
        "<p>index.html: <b>" + idx + "</b></p>"
        "<p>User in DB: <b>" + str(ucnt) + "</b></p>"
        "<table><tr><th>Datei</th><th>Status</th></tr>" + rows + "</table>"
        "<br><div id=t>React wird geprueft...</div>"
        "<script src='/static/lib/react.min.js'></script>"
        "<script>document.getElementById('t').innerHTML="
        "typeof React\!=='undefined'?'React OK v'+React.version:'React FEHLT';"
        "</script></body></html>"
    )


# Static files
if os.path.exists(frontend_dir):
    app.mount("/static", StaticFiles(directory=frontend_dir), name="static")


# SPA catch-all LAST
@app.get("/{full_path:path}")
def serve_spa(full_path: str):
    if full_path.startswith("static/") or full_path.startswith("api/"):
        raise HTTPException(status_code=404)
    return FileResponse(index_html)


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
