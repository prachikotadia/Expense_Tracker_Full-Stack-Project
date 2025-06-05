from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routes import auth, transactions, budgets, reminders, notifications, export_api, family
from app.config import settings
from app.db import engine, Base
import uvicorn

# Create DB tables
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="Personal Finance Management API",
    description="FastAPI backend with JWT auth, PostgreSQL, SQLAlchemy ORM",
    version="1.0.0"
)

# CORS settings (allow frontend origins)
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.BACKEND_CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include API routers
app.include_router(auth.router, prefix="/auth", tags=["auth"])
app.include_router(transactions.router, prefix="/transactions", tags=["transactions"])
app.include_router(budgets.router, prefix="/budgets", tags=["budgets"])
app.include_router(reminders.router, prefix="/reminders", tags=["reminders"])
app.include_router(notifications.router, prefix="/notifications", tags=["notifications"])
app.include_router(export_api.router, prefix="/export", tags=["export"])
app.include_router(family.router, prefix="/family", tags=["family"])

if __name__ == "__main__":
    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True) 