from clean import iterate_latest_column
from dotenv import load_dotenv
from os import getenv

load_dotenv()

FILE_PATH=getenv('FILE_PATH')

print(FILE_PATH)

def process_reports():
    for row in iterate_latest_column(FILE_PATH):
        print(row)
        if(input('Continue?') == 'n'):
            return
    pass    

process_reports()