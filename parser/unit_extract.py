import json
import re

from quantulum3 import parser

from report_types import KeyValue, Response

regex = re.compile(r"(?:\d+\.?\d*\s*)(\S+)", re.DOTALL)

def extract_unit_via_regex(data):
    global new_key_value
    new_values = []
    for item in data.values:
        # if key is "date_time", skip
        if item.key == "date_time":
            continue
        match = regex.search(item.value)
        if match:
            unit = match.group(1)
            value_without_unit = re.sub(r"\s*"+unit+r"\s*", "", item.value)
            item.value = value_without_unit
            new_key_value = KeyValue(
                original_tag=item.original_tag + "_unit",
                key=item.key + "_unit",
                value=str(unit)
            )
        new_values.append(item)
        new_values.append(new_key_value)
    return new_values

def extract_units_via_quant(data):
    new_values = []
    for item in data.values:
        quants = parser.parse(item.value, lang="en")
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

# updated_values = extract_units_via_quant(response)
updated_values = extract_unit_via_regex(response)
print(updated_values)