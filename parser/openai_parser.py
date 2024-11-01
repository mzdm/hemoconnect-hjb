from openai import OpenAI
from dotenv import load_dotenv
from os import getenv
from const import TEST_INPUT
from report_types import Response

load_dotenv()

_OPENAI_API_KEY = getenv('OPENAI_API_KEY')

client = OpenAI(api_key=_OPENAI_API_KEY)

completion = client.beta.chat.completions.parse(
    model="gpt-4o-mini",
    messages=[
        {"role": "system", "content": "You are supposed to export key value pairs from the given text and store their original tag."},
        {
            "role": "user",
            "content": TEST_INPUT
        }
    ],
    response_format=Response
)

print(completion.choices[0].message)