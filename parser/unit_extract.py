import json
import re
from datetime import datetime

from report_types import KeyValue, Response, KeyValueWithMeta

regex = re.compile(r"^(?:\d+\.?\d*\s*)(\S+)$", re.DOTALL)

def extract_unit_via_regex(list: list[KeyValue]) -> list[KeyValueWithMeta]:
    def map_to_key_value_with_meta(item: KeyValue) -> KeyValueWithMeta:
        date_formats = ["%Y-%m-%d", "%Y-%m-%d %H:%M:%S", "%Y-%m-%d %H:%M", "%Y-%m-%d %H:%M:%S.%f"]
        is_unit_date_time = item.key in ["date_time", "date", "time", "datetime", "date-time", "datum"]

        if not is_unit_date_time:
            for date_format in date_formats:
                try:
                    datetime.strptime(item.value, date_format)
                    is_unit_date_time = True
                    break
                except ValueError:
                    continue

        match = regex.search(item.value)
        if match and not is_unit_date_time:
            unit = match.group(1)
            # value_without_unit = re.sub(r"\s*"+unit+r"\s*", "", item.value)
            value_without_unit = re.sub(r"\s*" + re.escape(unit) + r"\s*", "", item.value)
            new_key_value = KeyValueWithMeta(
                original_tag=item.original_tag,
                key=item.key,
                value=value_without_unit,
                type="number",
                has_unit=True,
                unit=unit
            )
        else:
            is_value_boolean = item.value.lower() in ["true", "false", "yes", "no", "ano", "ne"]
            type = "datetime" if is_unit_date_time else "boolean" if is_value_boolean else "string"

            new_key_value = KeyValueWithMeta(
                original_tag=item.original_tag,
                key=item.key,
                value=item.value,
                type=type,
                has_unit=False,
                unit=""
            )
        return new_key_value
    new_values: list[KeyValueWithMeta] = []
    for item in list:
        new_values.append(map_to_key_value_with_meta(item))
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

# with open("response.json", "r") as file:
#     data = json.load(file)
#     data_dict = data["parsed"]
#     response = Response(**data_dict)

# updated_values = extract_units_via_quant(response)
# updated_values = extract_unit_via_regex(response.values)
#
# updated_values_dicts = [item.dict() for item in updated_values]
# print(json.dumps(updated_values_dicts, indent=4))
# print(json.dumps(updated_values, indent=4))