from numpy import integer
from pydantic import BaseModel, Field, UUID4
from typing import List, Optional

class Keyword(BaseModel):
    value: str = Field()

class SelectValue(BaseModel):
    value: str = Field()

class FormField(BaseModel):
    title: str = Field()
    unit: Optional[str]
    type: str = Field()
    selectValues: Optional[List[SelectValue]]
    keywords: List[Keyword]

class FormSchema(BaseModel):
    uuid: str = Field()
    formTitle: str = Field()
    formFields: List[FormField]
    formCode: str = Field()

class PatientMetadata(BaseModel):
    ic_pac: str = Field()
    ic_amb_zad: str = Field()
    i_dg_kod: str = Field()

class FormSchemaWithPatientMetadata(BaseModel):
    formSchema: FormSchema = Field()
    patientMetadata: PatientMetadata = Field()