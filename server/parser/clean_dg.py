import csv

import pandas as pd
from dotenv import load_dotenv
from os import getenv
from clean import detect_encoding

load_dotenv()
DG_FILE_PATH = getenv('DG_FILE_INPUT_PATH')


def clean_dg_csv():
    # detect_encoding(DG_FILE_PATH)
    # return
    try:
        with open(DG_FILE_PATH, mode='r', encoding='utf-8-sig') as file:
            reader = csv.DictReader(file, delimiter=';')
            headers = reader.fieldnames

            merged_rows = []

            for row in reader:
                if row['i_dg_kod'].strip() != "C911":
                    # print(row)
                    merged_rows.append(row)  # Only append rows that do not match "C911"

            with open(DG_FILE_PATH.replace('.csv', '2.csv'), mode='w', encoding='windows-1250', newline='') as outfile:
                writer = csv.DictWriter(outfile, fieldnames=headers, delimiter=';')
                writer.writeheader()
                writer.writerows(merged_rows)

    except Exception as e:
        print(f"An error occurred: {e}")


clean_dg_csv()
