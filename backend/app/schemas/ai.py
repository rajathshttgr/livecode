from pydantic import BaseModel

class AutoCompleteRequest(BaseModel):
    context: str
    language: str

class AutoCompleteResponse(BaseModel):
    suggestion: str