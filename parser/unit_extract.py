import json

from quantulum3 import parser
from const import TEST_INPUT
import json
from quantulum3 import parser
from typing import List, Dict

class KeyValue(BaseModel):
    original_tag: str
    key: str
    value: str

class Response(BaseModel):
    values: List[KeyValue]

def extract_units(data):
    new_values = []
    for item in data.values:
        quants = parser.parse(item.value)
        if quants:
            unit = quants[0].unit.name if quants[0].unit else ""
            value_without_unit = quants[0].surface
            item.value = value_without_unit
            new_key_value = KeyValue(
                original_tag=item.original_tag + "_unit",
                key=item.key + "_unit",
                value=unit
            )
            new_values.append(new_key_value)
        new_values.append(item)
    return new_values

with open("response.json", "r") as file:
    data = json.load(file)
    response = Response(**data)

updated_values = extract_units(response)
print(updated_values)