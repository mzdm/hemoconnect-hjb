from openai import OpenAI
from dotenv import load_dotenv
from os import getenv
from pydantic import BaseModel
from const import TEST_INPUT

load_dotenv()

_OPENAI_API_KEY = getenv('OPENAI_API_KEY')

client = OpenAI(api_key=_OPENAI_API_KEY)

class KeyValue(BaseModel):
    original_tag: str
    key: str
    value: str

class Response(BaseModel):
    values: list[KeyValue]

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