from clean import iterate_latest_column
from dotenv import load_dotenv
from os import getenv
from openai_parser import initialize_client, process_report

load_dotenv()

FILE_PATH=getenv('FILE_PATH')


print(FILE_PATH)

def process_reports():
    client = initialize_client()
    for row in iterate_latest_column(FILE_PATH):
        print(row)
        response_index = f'{row[0]}-{row[1]}-{row[3]}-{row[4]}'
        report_text = row[-1]

        if(input('Continue?') == 'n'):
            return
        
        process_report(client, report_text, response_index)
    pass    

process_reports()