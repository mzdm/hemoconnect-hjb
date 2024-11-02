import csv
from os import getenv

from dotenv import load_dotenv

load_dotenv()
LAB_FILE_PATH = getenv('AMB_CLEANED_FILE_PATH')

OUT_FILE_PATH_ID_PACS = '../data/id_pacs.csv'
OUT_FILE_PATH_PATIENT_AMB = '../data/patient_amb.csv'

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
    with open(OUT_FILE_PATH_ID_PACS, mode='w', encoding='windows-1250', newline='') as outfile:
        writer = csv.writer(outfile, delimiter=';')
        writer.writerow(['ic_pac'])
        for ic_pac in set_of_ic_pacs:
            writer.writerow([ic_pac])

def extract_patient_amb():
    with open(LAB_FILE_PATH, mode='r', encoding='windows-1250') as file:
        reader = csv.DictReader(file, delimiter=';')
        headers = reader.fieldnames
        rows = list(reader)

    with open(OUT_FILE_PATH_PATIENT_AMB, mode='w', encoding='windows-1250', newline='') as outfile:
        writer = csv.writer(outfile, delimiter=';')
        writer.writerow(['ic_pac', 'ic_amb_zad', 'i_dg_kod', 'i_text_dg'])
        for row in rows:
            writer.writerow([row['ic_pac'], row['ic_amb_zad'], row['i_dg_kod'] , row['i_text_dg']])

extract_id_pacs_columns_values()
extract_patient_amb()