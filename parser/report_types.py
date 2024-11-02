from pydantic import BaseModel

class KeyValue(BaseModel):
    original_tag: str
    key: str
    value: str

class Response(BaseModel):
    values: list[KeyValue]