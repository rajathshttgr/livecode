from pydantic import BaseModel

class AutoCompleteRequest(BaseModel):
    context: str
    language: str