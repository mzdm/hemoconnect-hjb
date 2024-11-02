import json
import re

from quantulum3 import parser
from const import TEST_INPUT
import json
from quantulum3 import parser
from typing import List, Dict
from report_types import KeyValue, Response

def extract_units(data):
    new_values = []
    for item in data.values:
        quants = parser.parse(item.value, lang="cs_CZ")
        if quants:
            unit = quants[0].value

            # value_without_unit = re.sub(r"\s*"+unit+r"\s*", "", item.value)
            # item.value = value_without_unit
            new_key_value = KeyValue(
                original_tag=item.original_tag + "_unit",
                key=item.key + "_unit",
                value=str(unit)
            )
            new_values.append(new_key_value)
        new_values.append(item)
    return new_values

with open("response.json", "r") as file:
    data = json.load(file)
    data_dict = data["parsed"]
    response = Response(**data_dict)

updated_values = extract_units(response)
print(updated_values)