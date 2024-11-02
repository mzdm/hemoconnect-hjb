from pydantic import BaseModel

class KeyValue(BaseModel):
    original_tag: str
    key: str
    value: str

class KeyValueWithMeta(BaseModel):
    original_tag: str
    key: str
    value: str
    type: str

    has_unit: bool
    unit: str

class ReportWithMeta(BaseModel):
    values: list[KeyValueWithMeta]

    patient_id: str
    report_id: str
    report_date: str

class Response(BaseModel):
    values: list[KeyValue]