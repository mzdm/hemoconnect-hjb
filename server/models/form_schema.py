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
    uuid: UUID4 = Field()
    formTitle: str = Field()
    formFields: List[FormField]
    formCode: str = Field()