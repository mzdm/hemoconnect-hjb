import json

from openai import OpenAI
from dotenv import load_dotenv
from os import getenv

from unit_extract import extract_unit_via_regex
from report_types import KeyValueWithMeta, Response

load_dotenv()

def initialize_client() -> OpenAI:
    _OPENAI_API_KEY = getenv('OPENAI_API_KEY')

    return OpenAI(api_key=_OPENAI_API_KEY)

def process_report(client: OpenAI, content: str, report_index: str) -> list[KeyValueWithMeta]:

    completion = client.beta.chat.completions.parse(
        model="gpt-4o-mini",
        messages=[
            {"role": "system", "content": "You are a medical nurse reading patient's reports in czech language."},
            {"role": "system", "content": "You are supposed to export key-value pairs from the given text and store their original tag."},
            {
                "role": "user",
                "content": content
            }
        ],
        response_format=Response
    )

    # response_dict = completion.choices[0].message.content
    # response_json = json.dumps(response_dict, indent=4)

    # with open(f'response-{report_index}.json', 'w') as json_file:
    #     json_file.write(completion.choices[0].message.content)

    # print("Response saved to response.json")

    parsed: Response = completion.choices[0].message.parsed

    if parsed is None:
        print("No key-value pairs found.")
        return
    
    # print(parsed)

    parsed_with_metadata = extract_unit_via_regex(parsed.values)
    return parsed_with_metadata
    # updated_values_dicts = [item.dict() for item in parsed_with_metadata]
    # with open(f'response-{report_index}.json', 'w') as json_file:
    #     json_file.write(json.dumps(updated_values_dicts, indent=4))
    # print(parsed_with_metadata)