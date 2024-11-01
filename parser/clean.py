import csv

def print_first_three_lines(file_path):
    try:
        with open(file_path, mode='r', encoding='latin-1') as file:
            for i, line in enumerate(file):
                if i < 3:
                    print(line.strip())

print_first_three_lines('/Users/mzidek/Documents/IdeaProjects/hemoconnectsources/B-IHOK-AH_HackJakBrno/B-IHOK-AH_AMB-FINAL.csv')