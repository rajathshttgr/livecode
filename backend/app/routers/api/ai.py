from fastapi import APIRouter
from app.schemas import AutoCompleteRequest

router = APIRouter() 

@router.post("/autocomplete")
def auto_complete(user_request: AutoCompleteRequest):
    return {
        "suggestion": "a + b",
        "context": user_request.context,
        "language": user_request.language
    }

