from pydantic import BaseModel

class KeyValue(BaseModel):
    original_tag: str
    key: str
    value: str

class KeyValueWithMeta():
    original_tag: str
    key: str
    value: str
    type: str

    has_unit: bool
    unit: str

class ReportWithMeta():
    values: list[KeyValueWithMeta]

    patient_id: str
    doctor_id: str
    report_date: str

class Response(BaseModel):
    values: list[KeyValue]