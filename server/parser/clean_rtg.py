import csv

import pandas as pd
from dotenv import load_dotenv
from os import getenv
from clean import detect_encoding

load_dotenv()
RTG_FILE_PATH = getenv('RTG_UNCLEANED_FILE_PATH')

def clean_rtg_csv():
    # detect_encoding(RTG_FILE_PATH)

    try:
        with open(RTG_FILE_PATH, mode='r', encoding='windows-1250') as file:
            reader = csv.DictReader(file, delimiter=';')
            headers = reader.fieldnames + ['rtg_record_id']
            print(headers)

            merged_rows = []
            current_row = None

            for row in reader:
                if row['ic_pac'] == "41742":
                    continue
                if row['ic_pac']:
                    if current_row:
                        merged_rows.append(current_row)
                    rtg_record_id = row[headers[0]]
                    row[headers[0]] = ''
                    current_row = row
                    row['rtg_record_id'] = rtg_record_id
                else:
                    for key, value in row.items():
                        if value:
                            current_row[key] = f"{current_row.get(key, '')} {value}".strip()

            if current_row:
                merged_rows.append(current_row)

            for row in merged_rows[:3]:
                print(row)

            # save to csv appended 2 in file name before extension to RTG_FILE_PATH
            with open(RTG_FILE_PATH.replace('.csv', '2.csv'), mode='w', encoding='windows-1250', newline='') as outfile:
                writer = csv.DictWriter(outfile, fieldnames=headers, delimiter=';')
                writer.writeheader()
                writer.writerows(merged_rows)

    except Exception as e:
        print(f"An error occurred: {e}")

clean_rtg_csv()
