import csv
from os import getenv

from dotenv import load_dotenv

load_dotenv()
LAB_FILE_PATH = getenv('AMB_CLEANED_FILE_PATH')

OUT_FILE_PATH = '../server/data/id_pacs.csv'

def extract_id_pacs_columns_values():
    with open(LAB_FILE_PATH, mode='r', encoding='windows-1250') as file:
        reader = csv.DictReader(file, delimiter=';')
        headers = reader.fieldnames
        rows = list(reader)

        set_of_ic_pacs = set()
        for row in rows:
            set_of_ic_pacs.add(row['ic_pac'])

        # print(set_of_ic_pacs)

    # save to csv file named id_pacs.csv
    with open(OUT_FILE_PATH, mode='w', encoding='windows-1250', newline='') as outfile:
        writer = csv.writer(outfile, delimiter=';')
        writer.writerow(['ic_pac'])
        for ic_pac in set_of_ic_pacs:
            writer.writerow([ic_pac])

extract_id_pacs_columns_values()