import csv
import pandas as pd
import chardet

class ExportedCSV():
    _rows: list[str]

    def __init__(self, rows) -> None:
        self._rows = rows

    def __iter__(self):
        return self
    
    def __next__(self):
        if len(self._rows) == 0:
            raise StopIteration
        return self._rows.pop(0)

def convert_to_csv(input_file_path, output_file_path):
    try:
        with open(input_file_path, mode='r', encoding='windows-1250') as infile, \
                open(output_file_path, mode='w', encoding='windows-1250', newline='') as outfile:
            reader = csv.reader(infile, delimiter='|')
            writer = csv.writer(outfile, delimiter='|')
            headers = next(reader)
            writer.writerow(headers)
            print(headers)
            for row in reader:
                writer.writerow(row)
    except Exception as e:
        print(f"An error occurred: {e}")

def merge_last_two_columns(input_file, output_file):
    df = pd.read_csv(input_file, sep=';', encoding='utf-8-sig')
    df.iloc[:, -2] = df.iloc[:, -2].astype(str) + df.iloc[:, -1].astype(str)
    df.drop(df.columns[-1], axis=1, inplace=True)
    df.to_csv(output_file, index=False, sep=';', encoding='windows-1250')

def detect_encoding(file_path):
    with open(file_path, 'rb') as file:
        raw_data = file.read()
        result = chardet.detect(raw_data)
        encoding = result['encoding']
        confidence = result['confidence']
        print(f"Detected encoding: {encoding} with confidence {confidence}")
        return encoding

def iterate_latest_column(file_path) -> ExportedCSV:
    with open(file_path, mode='r', encoding='windows-1250') as file:
        reader = csv.reader(file, delimiter=';')
        headers = next(reader)

        rows = list(reader)

        print(rows)

        return ExportedCSV(rows)
        # for row in reader:
        #     latest_column_value = row[-1]
        #     print(latest_column_value)


input_file_path = '/Users/mzidek/Documents/IdeaProjects/hemoconnectsources/B-IHOK-AH_HackJakBrno/B-IHOK-AH_AMB-FINALcleaned.csv'
output_file_path = '/Users/mzidek/Documents/IdeaProjects/hemoconnectsources/B-IHOK-AH_HackJakBrno/B-IHOK-AH_AMB-FINALcleaned2.csv'

# detect_encoding(input_file_path)

# convert_to_csv(input_file_path, output_file_path)
# merge_last_two_columns(input_file_path, output_file_path)
# transformed_df = transform_csv(output_file_path, output_file_path3)

iterate_latest_column(output_file_path)

