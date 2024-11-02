import json
from os import getenv

from dotenv import load_dotenv
from openai import OpenAI

from server.models.form_schema import FormSchema
from server.parser.report_types import KeyValueWithMeta, Response
from server.parser.unit_extract import extract_unit_via_regex

load_dotenv()

def initialize_client() -> OpenAI:
    _OPENAI_API_KEY = getenv('OPENAI_API_KEY')

    return OpenAI(api_key=_OPENAI_API_KEY)

def process_report(client: OpenAI, content: str, form_schema: FormSchema) -> list[KeyValueWithMeta]:
    # exported_csv = iterate_latest_column(FILE_PATH)
    fields = form_schema.dict()

    completion = client.beta.chat.completions.parse(
        model="gpt-4o",
        messages=[
            {"role": "system",
            "content":
              """You are a specialized medical data extraction system designed to process Czech medical records. Your role is to extract specific medical data points defined in a search guidance JSON, but only when they are clearly and unambiguously present in the text.
                INPUT:
                1. You will receive:
                  - Unstructured medical text
                  - A JSON guidance document that specifies:
                    * formFields: Array of fields to search for, each containing:
                      - title: The field name to use in output
                      - keywords: Array of search terms that might indicate the presence of this data
                      - type: Expected data type (date, numeric, text)
                      - unit: Unit reference (for context only)

                CORE EXTRACTION RULES:
                1. Use the keywords as search hints, but also consider common medical notation and context
                2. Only extract values that are explicitly present and unambiguous
                3. When multiple values exist for the same field, use the most recent one
                4. Preserve exact numerical precision as written
                5. Convert all dates to DDMMYYYY format

                OUTPUT FORMAT:
                Return only a list of KeyValue objects for successfully found fields:
                ```json
                {
                  "values": [
                    {
                      "original_tag": "[exact title from form]",
                      "key": "[standardized key name]",
                      "value": "[extracted value]"
                    }
                  ]
                }
                ```

                CRITICAL CONSTRAINTS:
                1. It is NOT necessary to find values for all fields in the guidance JSON
                2. Never infer or hallucinate values - if there's any ambiguity, omit the field entirely
                3. Only include values that are found with 100% confidence
                4. Maintain original precision for numeric values
                5. Do not attempt to standardize or clean text encoding
                6. Do not perform unit conversions

                For numeric values:
                - Extract only explicit measurements
                - Preserve exact precision as written
                - Do not include units in the value

                For dates:
                - Only include complete, explicit dates
                - Convert to DDMMYYYY format
                - Exclude partial or ambiguous dates

                For text values:
                - Extract only exact matches or clear equivalents
                - Do not attempt to interpret or categorize unclear terms
                - Exclude ambiguous or partial matches
               """
              },
              {
                  "role": "user",
                  "content": f"Hello helpful AI system, I am the doctor and these are the fields I would like to look for in JSON format: {json.dumps(fields)}"
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
        return
    parsed_with_metadata = extract_unit_via_regex(parsed.values)
    return parsed_with_metadata

    # updated_values_dicts = [item.dict() for item in parsed_with_metadata]
    # with open(f'response-{report_index}.json', 'w') as json_file:
    #     json_file.write(json.dumps(updated_values_dicts, indent=4))
    # print(parsed_with_metadata)