import csv
import pandas as pd
import chardet

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


def transform_csv(input_file_path, output_file_path=None):
    # Load the CSV file
    df = pd.read_csv(input_file_path)

    # Assuming the last column needs to be split
    last_column = df.columns[-1]

    # Split the last column by double space and expand into new DataFrame
    expanded_df = df[last_column].str.split('  ', expand=True)

    # Rename the new columns appropriately (optional)
    expanded_df.columns = [f'new_col_{i}' for i in range(expanded_df.shape[1])]

    # Concatenate the original DataFrame with the new columns
    result_df = pd.concat([df.iloc[:, :-1], expanded_df], axis=1)

    # Save the resulting DataFrame back to a CSV file if needed
    if output_file_path:
        result_df.to_csv(output_file_path, index=False)

    return result_df

# Example usage:


input_file_path = '/Users/mzidek/Documents/IdeaProjects/hemoconnectsources/B-IHOK-AH_HackJakBrno/B-IHOK-AH_AMB-FINALcleaned.csv'
output_file_path = '/Users/mzidek/Documents/IdeaProjects/hemoconnectsources/B-IHOK-AH_HackJakBrno/B-IHOK-AH_AMB-FINALcleaned2.csv'
output_file_path3 = '/Users/mzidek/Documents/IdeaProjects/hemoconnectsources/B-IHOK-AH_HackJakBrno/B-IHOK-AH_AMB-FINALcleaned3.csv'

# detect_encoding(input_file_path)

# convert_to_csv(input_file_path, output_file_path)
# merge_last_two_columns(input_file_path, output_file_path)
transformed_df = transform_csv(output_file_path, output_file_path3)