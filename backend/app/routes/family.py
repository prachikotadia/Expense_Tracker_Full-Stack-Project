from fastapi import APIRouter

router = APIRouter()

@router.get("/")
def get_family_info():
    return {"message": "This will be your family endpoint"}

