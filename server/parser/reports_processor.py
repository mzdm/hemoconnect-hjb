import json
from clean import iterate_latest_column
from dotenv import load_dotenv
from os import getenv
from openai_parser import initialize_client, process_report
from report_types import ReportWithMeta

load_dotenv()

FILE_PATH=getenv('AMB_CLEANED_FILE_PATH')

print(FILE_PATH)

def process_reports():
    client = initialize_client()

    exported_csv = iterate_latest_column(FILE_PATH)

    print(exported_csv._header)

    for row in exported_csv:
        # print(row)
        response_index = f'{row[0]}-{row[1]}-{row[3]}-{row[4]}'
        report_text = row[-1]

        if(input('Continue?') == 'n'):
            return
        
        values = process_report(client, report_text, response_index)

        report_with_meta = ReportWithMeta(values=values, patient_id=row[2], report_id=row[0], report_date=row[3])

        print(report_with_meta)

        with open(f'response-{response_index}.json', 'w') as json_file:
            json_file.write(json.dumps(report_with_meta.model_dump(), indent=4))
    pass    

process_reports()