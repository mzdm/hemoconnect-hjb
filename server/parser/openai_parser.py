import json
from os import getenv

from dotenv import load_dotenv
from openai import OpenAI

from models.form_schema import FormSchema
from parser.report_types import KeyValueWithMeta, Response
from parser.unit_extract import extract_unit_via_regex

load_dotenv()

def format_schema_for_llm(form_schema: FormSchema) -> dict:
    fields = []
    for field in form_schema.formFields:
        field_info = {
            "title": field.title,
            "type": field.type,
            "keywords": [k.value for k in field.keywords],
        }
        if field.unit:
            field_info["unit"] = field.unit


    
    return {
        "formTitle": form_schema.formTitle,
        "fields": fields
    }

def initialize_client() -> OpenAI:
    _OPENAI_API_KEY = getenv('OPENAI_API_KEY')

    return OpenAI(api_key=_OPENAI_API_KEY)

def process_report(client: OpenAI, content: str, form_schema: FormSchema) -> list[KeyValueWithMeta]:
    llm_schema = format_schema_for_llm(form_schema)

    completion = client.beta.chat.completions.parse(
        model="gpt-4o",
        messages=[
            {"role": "system",
            "content":
              """You are a specialized medical data extraction system designed to process Czech medical records. Your role is to extract specific medical data in key value pairs.

                EXTRACTION RULES:
                1. For select fields:
                   - Only return values that match exactly with allowed_values
                   - Case sensitive matching
                2. For number fields:
                   - Extract plain numbers without units
                   - Preserve exact precision
                3. Look for keywords but also consider medical context
               """
              },
              {
                  "role": "user",
                  "content": f"Parse this text using the following schema: {json.dumps(llm_schema)}"
              },
              {
                  "role": "user",
                  "content": content
              }
        ],
        response_format=Response
    )

    parsed: Response = completion.choices[0].message.parsed
    if parsed is None:
        print("No key-value pairs found.")
        return []
    
    parsed_with_metadata = extract_unit_via_regex(parsed.values)
    return parsed_with_metadata