import re
from const import TEST_INPUT

_KEY_VALUE_REGEX = re.compile(r"(\w+)(?:\s+)((?:\d|\.)+)", re.MULTILINE|re.DOTALL)

def read_key_values(input_string: str) -> dict:
  matches = re.finditer(_KEY_VALUE_REGEX, input_string)

  for match in matches:
    print(f'Tag: "{match.group(1)}" ~~ Value: {match.group(2)}')

  return {}

read_key_values(TEST_INPUT)
