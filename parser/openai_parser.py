import json

from openai import OpenAI
from dotenv import load_dotenv
from os import getenv
from report_types import Response

load_dotenv()

def initialize_client() -> OpenAI:
    _OPENAI_API_KEY = getenv('OPENAI_API_KEY')

    return OpenAI(api_key=_OPENAI_API_KEY)

def process_report(client: OpenAI, content: str, report_index: str):

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

    parsed = completion.choices[0].message.parsed

    if parsed is None:
        print("No key-value pairs found.")
        return
    
    print(parsed)

    # print(completion.choices[0].message)