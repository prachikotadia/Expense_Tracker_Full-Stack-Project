# app/routes/export_api.py

from fastapi import APIRouter

router = APIRouter()

@router.get("/")
def export_data():
    return {"message": "Exported data"}
