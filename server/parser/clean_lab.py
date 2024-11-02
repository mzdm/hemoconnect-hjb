import csv
from os import getenv

from dotenv import load_dotenv

load_dotenv()
LAB_FILE_PATH = getenv('LAB_UNCLEANED_FILE_PATH')

def rename_duplicate_headers(headers):
    header_counts = {}
    new_headers = []

    for header in headers:
        if header in header_counts:
            header_counts[header] += 1
            new_header = f"{header}_dupe"
        else:
            header_counts[header] = 1
            new_header = header

        new_headers.append(new_header)

    return new_headers

def clean_lab_csv():
    # detect_encoding(LAB_FILE_PATH)

    try:
        with open(LAB_FILE_PATH, mode='r', encoding='windows-1250') as file:
            reader = csv.DictReader(file, delimiter=';')
            headers = rename_duplicate_headers(reader.fieldnames)
            rows = list(reader)

            # Duplicate every row
            duplicated_rows = []
            for row in rows:
                duplicated_rows.append(row)
                duplicated_rows.append(row.copy())

            # If some row has a value in dupe column, move the value with the same key to the original column
            for row in duplicated_rows:
                for header in headers:
                    # print(header)
                    if header.endswith('_dupe') and header in row and row[header]:
                        # tst = row[header]
                        # print('val is', tst)
                        original_header = header.replace('_dupe', '')
                        row[original_header] = row[header]
                        row[header] = ''

            # Drop columns with _dupe suffix
            cleaned_rows = []
            for row in duplicated_rows:
                cleaned_row = {key: value for key, value in row.items() if not key.endswith('_dupe')}
                # if ic_vys value is empty, do not append the row
                if cleaned_row['ic_vys'] != '':
                    cleaned_rows.append(cleaned_row)

            # Update headers to exclude _dupe columns
            cleaned_headers = [header for header in headers if not header.endswith('_dupe')]

            with open(LAB_FILE_PATH.replace('.csv', '_cleaned2.csv'), mode='w', encoding='windows-1250', newline='') as outfile:
                writer = csv.DictWriter(outfile, fieldnames=cleaned_headers, delimiter=';')
                writer.writeheader()
                writer.writerows(cleaned_rows)
    except Exception as e:
        print(f"An error occurred: {e}")


clean_lab_csv()
